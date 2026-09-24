const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const adminController = require("../controllers/admin.controller");

const router = express.Router();

router.get(
    "/users",
    authenticate,
    authorize("ADMIN"),
    adminController.getUsers
);

module.exports = router;