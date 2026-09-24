const pool = require("../config/db");

async function findUserByEmail(email) {
    const [rows] = await pool.execute(
        "SELECT id, name, email, password_hash, role FROM users WHERE email = ?",
        [email]
    );

    return rows[0];
}

async function createUser({ name, email, passwordHash }) {
    const [result] = await pool.execute(
        `
        INSERT INTO users (name, email, password_hash)
        VALUES (?, ?, ?)
        `,
        [name, email, passwordHash]
    );

    return {
        id: result.insertId,
        name,
        email,
        role: "USER"
    };
}

module.exports = {
    findUserByEmail,
    createUser
};