const express = require("express");
const router = express.Router();

const {
  getInventoryReport,
  getMovementHistory,
  getLowStockProducts
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");

// Inventory report
router.get("/inventory", authMiddleware, getInventoryReport);

// Stock movement history (with pagination handled in controller)
router.get("/movements", authMiddleware, getMovementHistory);

// Low stock report
router.get("/low-stock", authMiddleware, getLowStockProducts);

module.exports = router;