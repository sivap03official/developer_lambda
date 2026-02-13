const { get, post } = require('./src/app')

const handler = async (event) => {
    let fn = null
    if (event?.requestContext?.http?.path?.toLowerCase().includes("favicon.ico")) {
        return { statusCode: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS", "Access-Control-Allow-Headers": "authorization, content-type, host", }, }
    }
    switch (event?.requestContext?.http?.method?.toUpperCase()) {
        case "GET":
            fn = get
            break
        case "POST":
            fn = post
            break
        case "DELETE":
            fn = deleteHandler
            break
        case "PATCH":
            fn = patch
            break
        case "PUT":
            fn = put
            break
        case "GET":
            fn = get
            break
        case "OPTIONS":
            return { statusCode: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS", "Access-Control-Allow-Headers": "authorization, content-type, host", }, }
        default:
            throw new Error(`Unsupported HTTP method: ${event?.requestContext?.http?.method}`)
    }
    if (!fn) {
        throw new Error(`Internal error: No handler found for method ${event?.requestContext?.http?.method}`)
    }
    return await fn(cors(event))
};

const filterHeaders = (event) => {
    const allowHeaders = ["authorization", "content-type", "host"]

    if (!event?.headers) {
        return event
    }

    const filteredHeaders = {}
    for (const [key, value] of Object.entries(event.headers)) {
        if (allowHeaders.includes(key.toLowerCase())) {
            filteredHeaders[key] = value
        }
    }
    filteredHeaders['x-allowed-headers'] = Object.keys(filteredHeaders).join(',')
    event.headers = filteredHeaders
    return event
}

const cors = (event) => {
    if (!event) {
        return event
    }
    const context = event?.requestContext || {}
    if (context?.http?.path) {
        context.http.path = decodeURIComponent(context.http.path)
    }
    const method = context?.http?.method
    console.log(`current request id ${context?.requestId}, path: ${context?.http?.path}, method: ${method}`)
    if (!(method && ["OPTIONS", "GET", "POST", "PATCH", "PUT", "DELETE"].includes(method.toUpperCase()))) {
        throw new Error(`Invalid HTTP method: ${method}`)
    }
    event = filterHeaders(event)
    return event
}

module.exports = { handler };
