async function getUsers(req, res) {
    res.status(200).json({
        success: true,
        message: "Admin users endpoint"
    });
}

module.exports = {
    getUsers
};