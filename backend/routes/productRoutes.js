const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

const validateProduct = require("../middleware/validators/productValidator");
const validateRequest = require("../middleware/validateRequest");

// Protect routes if needed
// router.use(authMiddleware);

/*
|--------------------------------------------------------------------------
| REPORT ROUTES (PUT THESE FIRST)
|--------------------------------------------------------------------------
*/

router.get("/search", productController.searchProducts);
router.get("/low-stock", productController.getLowStock);
router.get("/report/warehouse", productController.getStockByWarehouse);
router.get("/report/location", productController.getStockByLocation);

/*
|--------------------------------------------------------------------------
| PRODUCT CRUD
|--------------------------------------------------------------------------
*/

// Get all products
router.get("/", productController.getProducts);

// Create product
router.post(
  "/",
  validateProduct,
  validateRequest,
  productController.createProduct
);

// Update product
router.put("/:id", productController.updateProduct);

// Delete product
router.delete("/:id", productController.deleteProduct);

module.exports = router;