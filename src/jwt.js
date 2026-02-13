const jsonwebtoken = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET_KEY || '';
const TOKEN_EXPIRATION = '1h';

const generateToken = (payload, options = {}) => {
    return jsonwebtoken.sign(payload, SECRET_KEY, { ...options, expiresIn: TOKEN_EXPIRATION });
};

const verifyToken = (token) => {
    try {
        return jsonwebtoken.verify(token, SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

const decodeToken = (token) => {
    try {
        return jsonwebtoken.decode(token);
    } catch (error) {
        throw new Error('Invalid token');
    }
}

module.exports = {
    generateToken,
    verifyToken,
    decodeToken
};