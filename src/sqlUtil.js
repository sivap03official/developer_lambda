const mysql = require("mysql2")
const { getSecret } = require("./awsUtil")

let pool = null

const initPool = async () => {
    if (pool) {
        return pool
    }
    const secret = await getSecret()?.secret || {}
    pool = mysql.createPool({
        host: secret?.host,
        port: secret?.port,
        user: secret?.username,
        password: secret?.password,
        database: secret?.dbInstanceIdentifier,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    }).promise()
    return pool
}

const createTestTable = async () => {
    if (!pool) {
        pool = await initPool()
    }
    await pool.query(`CREATE TABLE IF NOT EXISTS test (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    )`)
}

const insertTestData = async (name) => {
    if (!pool) {
        pool = await initPool()
    }
    const [result] = await pool.query(`INSERT INTO test (name) VALUES (?)`, [name])
    return result.insertId
}

const getAllTestData = async () => {
    if (!pool) {
        pool = await initPool()
    }
    const [rows] = await pool.query(`SELECT * FROM test`)
    return rows
}

module.exports = { initPool, createTestTable, insertTestData, getAllTestData }