const express = require("express");
const router = express.Router();
const controller = require("../controllers/stockMovementController");
const authMiddleware = require("../middleware/authMiddleware");

console.log("Stock routes loaded");

router.post("/", authMiddleware, controller.createMovement);
router.post("/transfer", authMiddleware, controller.transferStock);

router.get("/history", authMiddleware, controller.getFilteredHistory);
router.get("/summary", authMiddleware, controller.getStockSummary);

router.get("/:product_id", authMiddleware, controller.getHistory);

module.exports = router;