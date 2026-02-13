const { signUp, logIn } = require("./auth/authServiceImpl")
const { generateToken } = require("./util/jwt")
const { testSecret, testData, decode } = require("./test")
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
        case "/auth/login":
            return logIn(event)
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