const get = async (event) => {
    switch (getPath(event)) {
        case "/hello":
            return { message: "Hello, world!" }
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