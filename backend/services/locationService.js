const pool = require("../config/db");

async function getAvailableLocation(warehouseId) {

  const result = await pool.query(
    `SELECT id 
     FROM locations 
     WHERE warehouse_id = $1 AND is_occupied = false
     LIMIT 1`,
    [warehouseId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0].id;
}

module.exports = { getAvailableLocation };
