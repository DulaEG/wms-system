const pool = require("../config/db");

const getInventoryReport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.sku,
        p.quantity,
        w.name AS warehouse
      FROM products p
      JOIN warehouses w ON p.warehouse_id = w.id
      ORDER BY p.id
    `);

    res.json(result.rows);

  } catch (error) {
    console.error("Inventory Report Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getMovementHistory = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        sm.id,
        p.name,
        sm.movement_type,
        sm.quantity,
        sm.reference,
        sm.created_at
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
      ORDER BY sm.created_at DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error("Movement Report Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM products
      WHERE quantity < 10
    `);

    res.json(result.rows);

  } catch (error) {
    console.error("Low Stock Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getInventoryReport,
  getMovementHistory,
  getLowStockProducts
};