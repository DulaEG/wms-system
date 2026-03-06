const express = require("express");
const router = express.Router();

const locationController = require("../controllers/locationController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  locationController.createLocation
);

router.get(
  "/warehouse/:warehouse_id",
  authMiddleware,
  locationController.getLocationsByWarehouse
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  locationController.deleteLocation
);

module.exports = router;