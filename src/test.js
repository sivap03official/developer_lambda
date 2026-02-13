const { getSecret } = require("./util/awsUtil")
const { DDB } = require("./util/ddb")
const { decodeToken } = require("./util/jwt")

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


module.exports = {
    testSecret,
    testData,
    decode
}