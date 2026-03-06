const express = require("express");
const router = express.Router();

const warehouseController = require("../controllers/warehouseController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// CREATE warehouse
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  warehouseController.createWarehouse
);

// GET ALL warehouses
router.get(
  "/",
  authMiddleware,
  warehouseController.getAllWarehouses
);

// GET warehouse by ID
router.get(
  "/:id",
  authMiddleware,
  warehouseController.getWarehouseById
);

// UPDATE warehouse
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  warehouseController.updateWarehouse
);

// DELETE warehouse
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  warehouseController.deleteWarehouse
);

module.exports = router;