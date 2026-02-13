const { signUp } = require("./auth")
const { getSecret } = require("./awsUtil")
const { DDB } = require("./ddb")
const { generateToken, decodeToken } = require("./jwt")

const testSecret = async () => {
    try {
        const secret = await getSecret()
        return {
            host: secret?.host,
            port: secret?.port,
            user: secret?.username,
            password: secret?.password,
            database: secret?.dbInstanceIdentifier,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        }
    } catch (error) {
        return { error: error.message }
    }
}

const testData = async () => {
    try {
        const ddb = new DDB()
        await ddb.putItem("user", { email: "john@example.com", name: "John Doe" })
        const data = await ddb.getItem("user", { email: "john@example.com" })
        return { message: "Data loaded successfully", data }
    } catch (error) {
        return { error: error.message }
    }
}

const decode = (event) => {
    const params = event?.queryStringParameters || {}
    if (!params?.token) {
        throw new Error("Missing token query parameter")
    }
    try {
        return { decoded: decodeToken(params.token) }
    } catch (error) {
        throw new Error("Invalid token")
    }
}

const get = async (event) => {
    switch (getPath(event)) {
        case "/hello":
            return { message: "Hello, world!" }
        case "/secret":
            return await testSecret()
        case "/loaddb":
            return { message: "DB pool initialized", pool: await testData() }
        case "/generate":
            return { token: generateToken({ username: "john@example.com" }) }
        case "/decode":
            return { decoded: decode(event) }
        default: throw new Error(`Unsupported path: ${getPath(event)}`)
    }
}

const post = async (event) => {
    switch (getPath(event)) {
        case "/auth/signup":
            return signUp(event)
        default: throw new Error(`Unsupported path: ${getPath(event)}`)
    }
}

const deleteHandler = async (event) => {
    switch (getPath(event)) {
        case "/hello":
            return { message: "Hello, world!" }
        default: throw new Error(`Unsupported path: ${getPath(event)}`)
    }
}

const patch = async (event) => {
    switch (getPath(event)) {
        case "/hello":
            return { message: "Hello, world!" }
        default: throw new Error(`Unsupported path: ${getPath(event)}`)
    }
}

const put = async (event) => {
    switch (getPath(event)) {
        case "/hello":
            return { message: "Hello, world!" }
        default: throw new Error(`Unsupported path: ${getPath(event)}`)
    }
}

const getPath = (event) => {
    const path = event?.requestContext?.http?.path
    if (!path) {
        throw new Error("Invalid request: missing path")
    }
    return decodeURIComponent(path)
}
module.exports = { get, post, deleteHandler, patch, put };