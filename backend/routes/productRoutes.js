const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

const validateProduct = require("../middleware/validators/productValidator");
const validateRequest = require("../middleware/validateRequest");

router.get("/search", productController.searchProducts);
router.get("/low-stock", productController.getLowStock);
router.get("/report/warehouse", productController.getStockByWarehouse);
router.get("/report/location", productController.getStockByLocation);

router.get("/", productController.getProducts);

router.post(
  "/",
  validateProduct,
  validateRequest,
  productController.createProduct
);

router.put("/:id", productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

module.exports = router;