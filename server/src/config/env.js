require("dotenv").config();

const requiredEnv = [
    "DB_HOST",
    "DB_USER",
    "DB_NAME",
    "JWT_SECRET"
];

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
}

module.exports = {
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET
};