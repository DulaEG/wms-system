const Product = require("../models/productModel");
const pool = require("../config/db");


exports.createProduct = async (req, res) => {
  try {

    const product = await Product.create(req.body);

    
    await pool.query(
      `INSERT INTO stock_movements
      (product_id, warehouse_id, location_id, movement_type, quantity, reference)
      VALUES ($1,$2,$3,'IN',$4,$5)`,
      [
        product.id,
        product.warehouse_id,
        product.location_id,
        product.quantity,
        "Product Created"
      ]
    );

    res.status(201).json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


exports.getProducts = async (req, res) => {
  try {

    const products = await Product.getAll();

    res.json(products);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};


exports.updateProduct = async (req, res) => {

  try {

    const id = req.params.id;

    const oldProduct = await Product.getById(id);

    if (!oldProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Product.update(id, req.body);

    const qtyDiff = updatedProduct.quantity - oldProduct.quantity;

    if (qtyDiff !== 0) {

      await pool.query(
        `INSERT INTO stock_movements
        (product_id, warehouse_id, location_id, movement_type, quantity, reference)
        VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          id,
          updatedProduct.warehouse_id,
          updatedProduct.location_id,
          qtyDiff > 0 ? "IN" : "OUT",
          Math.abs(qtyDiff),
          "Stock Adjustment"
        ]
      );

    }

    res.json(updatedProduct);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: error.message });

  }
};

exports.deleteProduct = async (req, res) => {

  try {

    const id = req.params.id;

    await Product.delete(id);

    res.json({ message: "Product deleted successfully" });

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: error.message });

  }

};

exports.getLowStock = async (req, res) => {

  try {

    const limit = req.query.limit || 5;

    const products = await Product.getLowStock(limit);

    res.json(products);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

exports.getStockByWarehouse = async (req, res) => {

  try {

    const data = await Product.getStockByWarehouse();

    res.json(data);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


exports.getStockByLocation = async (req, res) => {

  try {

    const data = await Product.getStockByLocation();

    res.json(data);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


exports.searchProducts = async (req, res) => {

  try {

    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;

    const limit = 10;
    const offset = (page - 1) * limit;

    const products = await Product.searchProducts(search, limit, offset);

    res.json(products);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Server error" });

  }

};