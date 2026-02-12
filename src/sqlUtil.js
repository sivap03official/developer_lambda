const mysql = require("mysql2")

let pool = null

const initPool = async (config) => {
    if (pool) {
        return pool
    }
    pool = mysql.createPool({
        host: config?.host || process.env.SQL_HOST,
        port: config?.port || process.env.SQL_PORT,
        user: config?.user || process.env.SQL_USER,
        password: config?.password || process.env.SQL_PASSWORD,
        database: config?.database || process.env.SQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    }).promise()
    return pool
}

module.exports = { initPool }