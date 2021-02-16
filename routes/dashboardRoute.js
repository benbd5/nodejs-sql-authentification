const router = require("express").Router();
const dashboardController = require("../controllers/dashboardController");

// Dashboard
router.get("/", dashboardController.get_dashboard_page);

module.exports = router;
