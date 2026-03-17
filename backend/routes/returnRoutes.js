const express = require("express");
const router = express.Router();
const pool = require("../config/db");


router.get("/", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
        r.id,
        r.return_type,
        p.name AS product,
        r.quantity,
        r.reason,
        r.created_at
      FROM returns r
      JOIN products p ON r.product_id = p.id
      ORDER BY r.id DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {

  try {

    const {
      return_type,
      product_id,
      warehouse_id,
      quantity,
      reason
    } = req.body;

    const result = await pool.query(
      `INSERT INTO returns
      (return_type, product_id, warehouse_id, quantity, reason)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [return_type, product_id, warehouse_id, quantity, reason]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Server error" });

  }

});


module.exports = router;