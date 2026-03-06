const pool = require("../config/db");

const Location = {
  create: async (warehouse_id, zone, rack, shelf) => {
    const result = await pool.query(
      "INSERT INTO locations (warehouse_id, zone, rack, shelf) VALUES ($1, $2, $3, $4) RETURNING *",
      [warehouse_id, zone, rack, shelf]
    );
    return result.rows[0];
  },

  getByWarehouse: async (warehouse_id) => {
    const result = await pool.query(
      "SELECT * FROM locations WHERE warehouse_id = $1 ORDER BY id DESC",
      [warehouse_id]
    );
    return result.rows;
  },

  delete: async (id) => {
    await pool.query("DELETE FROM locations WHERE id = $1", [id]);
  }
};

module.exports = Location;