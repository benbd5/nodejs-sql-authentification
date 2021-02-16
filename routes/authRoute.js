const router = require("express").Router();
const authController = require("../controllers/authController");

// Login
router.get("/login", authController.get_login_page);

// Register
router.get("/register", authController.get_register_page);

module.exports = router;
