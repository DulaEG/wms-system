const express = require("express");
const router = express.Router();

const {
  getInventoryReport,
  getMovementHistory,
  getLowStockProducts
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/inventory", authMiddleware, getInventoryReport);

router.get("/movements", authMiddleware, getMovementHistory);

router.get("/low-stock", authMiddleware, getLowStockProducts);

module.exports = router;