const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/report", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
        p.name AS product,
        w.name AS warehouse,
        l.name AS location,
        p.quantity
      FROM products p
      LEFT JOIN warehouses w ON p.warehouse_id = w.id
      LEFT JOIN locations l ON p.location_id = l.id
      ORDER BY p.name
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Inventory report error" });
  }
});

module.exports = router;