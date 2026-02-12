const { getSecret } = require("./awsUtil")
const { initPool, createTestTable, insertTestData, getAllTestData } = require("./sqlUtil")

const testChanges = async () => {
    await initPool()
    const msg = []
    msg.push("DB pool initialized")
    try {
        await createTestTable()
        msg.push("Test table created")
        await insertTestData("TestName")
        msg.push("Test data inserted")
        const data = await getAllTestData()
        msg.push(`Test data retrieved: ${JSON.stringify(data)}`)
    } catch (error) {
        msg.push(`Error: ${error.message}`)
    }
    return msg.join(" | ")
}
const get = async (event) => {
    switch (getPath(event)) {
        case "/hello":
            return { message: "Hello, world!" }
        case "/secret":
            return { secret: await getSecret() }
        case "/loaddb":
            return { message: "DB pool initialized", pool: await testChanges() }
        default: throw new Error(`Unsupported path: ${getPath(event)}`)
    }
}

const post = async (event) => {
    switch (getPath(event)) {
        case "/hello":
            return { message: "Hello, world!" }
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