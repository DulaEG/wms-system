const pool = require("../config/db");

exports.createGRN = async (req, res) => {

  const { supplier_id, warehouse_id, items } = req.body;

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    const grnResult = await client.query(
      `INSERT INTO grn (supplier_id, warehouse_id)
       VALUES ($1, $2)
       RETURNING *`,
      [supplier_id, warehouse_id]
    );

    const grn = grnResult.rows[0];

    for (const item of items) {

      const { product_id, location_id, quantity } = item;


      if (!product_id || !location_id || !quantity) {
        throw new Error("Invalid GRN item data");
      }

      await client.query(
        `INSERT INTO grn_items
         (grn_id, product_id, location_id, quantity)
         VALUES ($1,$2,$3,$4)`,
        [grn.id, product_id, location_id, quantity]
      );

      await client.query(
        `UPDATE products
         SET quantity = quantity + $1
         WHERE id = $2`,
        [quantity, product_id]
      );

      await client.query(
        `INSERT INTO inventory
         (product_id, warehouse_id, location_id, quantity)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (product_id, warehouse_id, location_id)
         DO UPDATE SET quantity = inventory.quantity + EXCLUDED.quantity`,
        [product_id, warehouse_id, location_id, quantity]
      );

      await client.query(
        `INSERT INTO stock_movements
        (product_id, warehouse_id, location_id, movement_type, quantity, reference)
        VALUES ($1,$2,$3,'IN',$4,$5)`,
        [product_id, warehouse_id, location_id, quantity, `GRN-${grn.id}`]
      );

    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "GRN created successfully",
      grn
    });

  } catch (err) {

    await client.query("ROLLBACK");

    console.error("DB ERROR:", err.message);

    res.status(500).json({
      message: err.message || "Error creating GRN"
    });

  } finally {

    client.release();

  }

};