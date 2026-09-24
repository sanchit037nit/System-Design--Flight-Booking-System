const bcrypt = require("bcrypt");
const userRepository = require("../repositories/user.repository");
const { generateAccessToken } = require("../utils/jwt");

async function registerUser({ name, email, password }) {
    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
        const error = new Error("Email already registered");
        error.statusCode = 409;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    return userRepository.createUser({
        name,
        email,
        passwordHash
    });
}

async function loginUser({ email, password }) {
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const passwordValid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const accessToken = generateAccessToken(user);

    return {
        accessToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}

module.exports = {
    registerUser,
    loginUser
};