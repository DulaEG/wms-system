const pool = require("../config/db");

exports.getSummary = async () => {

  const totalProducts = await pool.query(
    "SELECT COUNT(*) FROM products"
  );

  const totalWarehouses = await pool.query(
    "SELECT COUNT(*) FROM warehouses"
  );

  const totalLocations = await pool.query(
    "SELECT COUNT(*) FROM locations"
  );

  const totalStock = await pool.query(
    "SELECT COALESCE(SUM(quantity), 0) AS total_stock FROM products"
  );

  const lowStock = await pool.query(
    "SELECT COUNT(*) FROM products WHERE quantity <= 5"
  );

  const recentMovements = await pool.query(`
    SELECT sm.*, p.name AS product_name
    FROM stock_movements sm
    JOIN products p ON sm.product_id = p.id
    ORDER BY sm.created_at DESC
    LIMIT 5
  `);

  return {
    total_products: parseInt(totalProducts.rows[0].count),
    total_warehouses: parseInt(totalWarehouses.rows[0].count),
    total_locations: parseInt(totalLocations.rows[0].count),
    total_stock_quantity: parseInt(totalStock.rows[0].total_stock),
    low_stock_products: parseInt(lowStock.rows[0].count),
    recent_movements: recentMovements.rows
  };
};