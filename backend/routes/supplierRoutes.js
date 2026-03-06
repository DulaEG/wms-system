const express = require("express");
const router = express.Router();
const controller = require("../controllers/supplierController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, controller.createSupplier);
router.get("/", authMiddleware, controller.getSuppliers);
router.delete("/:id", authMiddleware, controller.deleteSupplier);

module.exports = router;