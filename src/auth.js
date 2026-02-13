const Ajv = require("ajv");
const { schemas } = require("./schemaGen");
const ajv = new Ajv()
const DDB = require("./ddb");
const ddbInstance = new DDB()
const USER_TABLE = process.env.USER_TABLE || "user"

const signUp = async (event) => {
    try {
        const { email, password, name, mobile } = JSON.parse(event?.body || '{}');
        const valid = ajv.validate(schemas.signUp, { email, password, name, mobile })
        if (!valid) {
            return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body", details: ajv.errors }) }
        }
        await ddbInstance.putItem(USER_TABLE, { email, password, name, mobile })
        return { statusCode: 201, body: JSON.stringify({ message: "User signed up successfully" }) }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error?.message }) }
    }
}

module.exports = {
    signUp
}