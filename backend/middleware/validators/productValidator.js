const { body } = require("express-validator");

const validateProduct = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required"),

  body("sku")
    .notEmpty()
    .withMessage("SKU is required"),

  body("quantity")
    .isFloat({ gt: 0 })
    .withMessage("Quantity must be a positive number"),

  body("warehouse_id")
    .isInt()
    .withMessage("Warehouse ID must be valid"),
];

module.exports = validateProduct;