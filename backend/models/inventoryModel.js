const pool = require("../config/db");

exports.getInventory = async () => {

  const result = await pool.query(`
    SELECT 
      p.id,
      p.name AS product,
      w.name AS warehouse,
      p.quantity,
      'N/A' AS location
    FROM products p
    JOIN warehouses w ON p.warehouse_id = w.id
  `);

  return result.rows;

};