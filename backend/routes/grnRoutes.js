const express = require("express");
const router = express.Router();

const controller = require("../controllers/grnController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, controller.createGRN);

module.exports = router;