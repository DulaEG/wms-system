const express = require("express");
const router = express.Router();
const controller = require("../controllers/purchaseOrderController");
const authMiddleware = require("../middleware/authMiddleware");

console.log("receiveOrder:", controller.receiveOrder);

router.post("/", authMiddleware, controller.createOrder);
router.get("/", authMiddleware, controller.getOrders);
router.put("/receive/:id", authMiddleware, controller.receiveOrder);

module.exports = router;