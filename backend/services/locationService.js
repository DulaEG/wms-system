const pool = require("../config/db");

const getAvailableLocation = async (warehouse_id) => {
  const result = await pool.query(`
    SELECT id
    FROM locations
    WHERE warehouse_id = $1
    ORDER BY zone, rack, shelf
    LIMIT 1
  `, [warehouse_id]);

  if (result.rows.length === 0) {
    throw new Error("No available location in warehouse");
  }

  return result.rows[0].id;
};

module.exports = { getAvailableLocation };