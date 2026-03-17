const express = require("express");
const router = express.Router();

const warehouseController = require("../controllers/warehouseController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  warehouseController.createWarehouse
);

router.get(
  "/",
  authMiddleware,
  warehouseController.getAllWarehouses
);

router.get(
  "/:id",
  authMiddleware,
  warehouseController.getWarehouseById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  warehouseController.updateWarehouse
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  warehouseController.deleteWarehouse
);

module.exports = router;