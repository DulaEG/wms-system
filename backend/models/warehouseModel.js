const pool = require("../config/db");

const Warehouse = {
  create: async (name, location) => {
    const result = await pool.query(
      "INSERT INTO warehouses (name, location) VALUES ($1, $2) RETURNING *",
      [name, location]
    );
    return result.rows[0];
  },

  getAll: async () => {
    const result = await pool.query("SELECT * FROM warehouses ORDER BY id DESC");
    return result.rows;
  },

  getById: async (id) => {
    const result = await pool.query("SELECT * FROM warehouses WHERE id = $1", [id]);
    return result.rows[0];
  },

  update: async (id, name, location) => {
    const result = await pool.query(
      "UPDATE warehouses SET name = $1, location = $2 WHERE id = $3 RETURNING *",
      [name, location, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query("DELETE FROM warehouses WHERE id = $1", [id]);
  }
};

module.exports = Warehouse;