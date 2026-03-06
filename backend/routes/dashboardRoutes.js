const express = require("express");
const router = express.Router();
const controller = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, controller.getDashboard);

module.exports = router;