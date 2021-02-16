const router = require("express").Router();
const authController = require("../controllers/authController");

// Login
router.get("/login", authController.get_login_page);
router.post("/login", authController.post_login);

// Register
router.get("/register", authController.get_register_page);
router.post("/register", authController.post_register);

module.exports = router;
