const Ajv = require("ajv");
const { schemas } = require("../util/schemaGen");
const ajv = new Ajv()
const { DDB } = require("../util/ddb");
const { hashPassword, comparePassword, generateToken, createSessionId, generateRefreshToken } = require("../util/jwt");
const ddbInstance = new DDB()
const USER_TABLE = process.env.USER_TABLE || "user"
const SESSION_TABLE = process.env.SESSION_TABLE || "session"

const signUp = async (event) => {
    try {
        const { email, password, name, mobile } = JSON.parse(event?.body || '{}');
        const valid = ajv.validate(schemas.signUp, { email, password, name, mobile })
        if (!valid) {
            return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body", details: ajv.errors }) }
        }
        const hashedPassword = await hashPassword(password)
        await ddbInstance.putItem(USER_TABLE, { email, password: hashedPassword, name, mobile })
        return { statusCode: 201, body: JSON.stringify({ message: "User signed up successfully" }) }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error?.message }) }
    }
}

const logIn = async (event) => {
    try {
        const { email, password } = JSON.parse(event?.body || '{}');
        const valid = ajv.validate(schemas.logIn, { email, password })
        if (!valid) {
            return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body", details: ajv.errors }) }
        }
        const data = await ddbInstance.getItem(USER_TABLE, { email })
        if (!data) {
            return { statusCode: 404, body: JSON.stringify({ error: "User not found" }) }
        }
        const passwordMatch = await comparePassword(password, data.password)
        if (!passwordMatch) {
            return { statusCode: 401, body: JSON.stringify({ error: "Invalid credentials" }) }
        }
        //check session id present in cookies
        const cookies = event.headers?.cookie || ''
        const sessionIdCookie = cookies.split(';').find(cookie => cookie.trim().startsWith('x-auth-session-id='))
        if (sessionIdCookie && sessionIdCookie.split('=')[1]) {
            const sessionIdFromCookie = sessionIdCookie.split('=')[1]
            await ddbInstance.deleteItem(SESSION_TABLE, { sessionId: sessionIdFromCookie })
        }
        const token = generateToken({ email })
        const sessionId = createSessionId()
        const refreshToken = generateRefreshToken()
        await ddbInstance.putItem(SESSION_TABLE, { sessionId, token, refreshToken, expiresAt: (Date.now() + (2 * 60 * 60 * 1000)) })
        //set cookie header for refresh token
        const cookiesToSet = []
        cookiesToSet.push(`refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`)
        //set cookie header for session id
        cookiesToSet.push(`x-auth-session-id=${sessionId}; HttpOnly; Path=/; Max-Age=${2 * 60 * 60}; SameSite=Strict`)
        return { statusCode: 200, cookies: cookiesToSet, body: JSON.stringify({ message: "Login successful", sessionId, refreshToken }) }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error?.message }) }
    }
}

const getSession = async (sessionId) => {
    if (!sessionId) {
        throw new Error("Missing sessionId")
    }
    const session = await ddbInstance.getItem(SESSION_TABLE, { sessionId });
    if (!session) {
        throw new Error("Session not found");
    }
    return session;
}

const getTokenBySessionId = async (sessionId) => {
    try {
        const session = await getSession(sessionId);
        return session?.token || null;
    } catch (error) {
        throw error
    }
}

const refreshSession = async (sessionId, refreshTokenFromRequest) => {
    try {
        if (!sessionId || !refreshTokenFromRequest) {
            throw new Error("Missing sessionId or refreshToken")
        }
        const session = await getSession(sessionId);
        if (session?.refreshToken !== refreshTokenFromRequest) {
            throw new Error("Invalid refresh token");
        }
        const refreshToken = generateRefreshToken();
        const expiresAt = Date.now() + (2 * 60 * 60 * 1000); // 2 hours
        const newToken = generateToken({ email: session.email });
        const newSessionId = createSessionId();
        await ddbInstance.deleteItem(SESSION_TABLE, { sessionId });
        await ddbInstance.putItem(SESSION_TABLE, { sessionId: newSessionId, token: newToken, refreshToken, expiresAt });
        return { sessionId: newSessionId, refreshToken };
    } catch (error) {
        throw error;
    }
}

module.exports = {
    signUp,
    logIn,
    getTokenBySessionId,
    refreshSession
}