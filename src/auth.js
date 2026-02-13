const Ajv = require("ajv");
const { schemas } = require("./schemaGen");
const ajv = new Ajv()
const { DDB } = require("./ddb");
const { hashPassword, comparePassword, generateToken } = require("./jwt");
const ddbInstance = new DDB()
const USER_TABLE = process.env.USER_TABLE || "user"

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
        const token = generateToken({ email })
        return { statusCode: 200, body: JSON.stringify({ message: "Login successful", token }) }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error?.message }) }
    }
}


module.exports = {
    signUp,
    logIn
}