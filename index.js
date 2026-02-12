const extract = (event) => {
    try {
        return JSON.stringify(event)
    } catch (e) {
        return JSON.stringify({ error: e?.message })
    }
}

const handler = async (event) => {
    const response = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: extract(cors(event)),
    };
    return response;
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
    if (!(method && ["OPTIONS", "GET", "POST", "PUT", "DELETE"].includes(method.toUpperCase()))) {
        throw new Error(`Invalid HTTP method: ${method}`)
    }
    event = filterHeaders(event)
    return event
}

module.exports = { handler };
