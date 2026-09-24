const userRepository = require("../repositories/user.repository");

async function registerUser({ name, email, password }) {
    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
        const error = new Error("Email already registered");
        error.statusCode = 409;
        throw error;
    }


    const passwordHash = await bcrypt.hash(password, 12);

    const user = await userRepository.createUser({
        name,
        email,
        passwordHash
    });

    return user;
}

module.exports = {
    registerUser
};