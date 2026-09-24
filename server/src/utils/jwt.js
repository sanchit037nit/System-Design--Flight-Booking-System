const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

function generateAccessToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            role: user.role,
            email: user.email
        },
        jwtSecret,
        {
            expiresIn: "15m"
        }
    );
}

function verifyAccessToken(token) {
    return jwt.verify(token, jwtSecret);
}

module.exports = {
    generateAccessToken,
    verifyAccessToken
};