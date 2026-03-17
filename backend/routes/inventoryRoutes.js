const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const inventoryController = require("../controllers/inventoryController");


router.get("/", inventoryController.getInventory);


router.get("/report", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
  i.product_id,
  p.name AS product,
  i.warehouse_id,
  w.name AS warehouse,
  i.quantity
FROM inventory i
JOIN products p ON p.id = i.product_id
JOIN warehouses w ON w.id = i.warehouse_id;
    `);

    res.json(result.rows);

  } catch (error) {
    console.error("Inventory report error:", error);
    res.status(500).json({ message: "Inventory report error" });
  }
});

module.exports = router;