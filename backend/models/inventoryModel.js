const pool = require("../config/db");

exports.getInventory = async () => {

  const result = await pool.query(`
    SELECT 
  i.id,
  i.product_id,
  p.name AS product,
  i.warehouse_id,
  w.name AS warehouse,
  i.quantity
FROM inventory i
JOIN products p ON i.product_id = p.id
JOIN warehouses w ON i.warehouse_id = w.id
ORDER BY p.name;
  `);

  return result.rows;

};