const { body } = require("express-validator");

exports.createProductValidation = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("sku").notEmpty().withMessage("SKU is required"),
  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a positive number")
];