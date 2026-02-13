const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const v4 = require('uuid');
const crypto = require('crypto');

const SECRET_KEY = process.env.JWT_SECRET_KEY || '';
const TOKEN_EXPIRATION = process.env.TOKEN_EXP || '1h';
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

const generateToken = (payload, options = {}) => {
    return jsonwebtoken.sign(payload, SECRET_KEY, { ...options, expiresIn: TOKEN_EXPIRATION, });
};

const verifyToken = (token) => {
    try {
        return jsonwebtoken.verify(token, SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

const decodeToken = (token) => {
    try {
        return jsonwebtoken.decode(token);
    } catch (error) {
        throw new Error('Invalid token');
    }
}

const getUserNameFromToken = (token) => {
    const decoded = verifyToken(token);
    return decoded?.username || null;
}

const isTokenExpired = (token) => {
    try {
        const decoded = verifyToken(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
}

const createSessionId = () => {
    return v4();
}

const generateRefreshToken = () => {
    return crypto.randomBytes(40).toString('hex');
}

module.exports = {
    generateToken,
    verifyToken,
    decodeToken,
    getUserNameFromToken,
    isTokenExpired,
    hashPassword,
    comparePassword,
    generateRefreshToken,
    createSessionId
};