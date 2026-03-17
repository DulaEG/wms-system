const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/returns", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT p.name as product,
      COUNT(*) as total_returns
      FROM returns r
      LEFT JOIN products p ON r.product_id = p.id
      GROUP BY p.name
      ORDER BY total_returns DESC
    `);

    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Server error" });

  }

});

module.exports = router;