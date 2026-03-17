const pool = require("../config/db");

exports.createReturn = async (data) => {
  const {
    return_type,
    reference_id,
    product_id,
    warehouse_id,
    location_id,
    quantity,
    reason
  } = data;

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    
    const product = await client.query(
      "SELECT quantity FROM products WHERE id = $1 FOR UPDATE",
      [product_id]
    );

    if (product.rows.length === 0) {
      throw new Error("Product not found");
    }

    let newQty = product.rows[0].quantity;

    if (return_type === "CUSTOMER") {
      newQty += quantity;
    }

    if (return_type === "SUPPLIER" || return_type === "DAMAGE") {
      newQty -= quantity;
    }

    await client.query(
      "UPDATE products SET quantity = $1 WHERE id = $2",
      [newQty, product_id]
    );

    const result = await client.query(
      `INSERT INTO returns
      (return_type, reference_id, product_id, warehouse_id, location_id, quantity, reason)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        return_type,
        reference_id,
        product_id,
        warehouse_id,
        location_id,
        quantity,
        reason
      ]
    );

    let movementType = "IN";

    if (return_type === "SUPPLIER" || return_type === "DAMAGE") {
      movementType = "OUT";
    }

    await client.query(
      `INSERT INTO stock_movements
      (product_id, warehouse_id, location_id, movement_type, quantity, reference)
      VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        product_id,
        warehouse_id,
        location_id,
        movementType,
        quantity,
        "RETURN"
      ]
    );

    await client.query("COMMIT");

    return result.rows[0];

  } catch (err) {

    await client.query("ROLLBACK");
    throw err;

  } finally {

    client.release();

  }
};


exports.getReturns = async () => {

  const result = await pool.query(`
    SELECT r.*, p.name as product
    FROM returns r
    JOIN products p ON r.product_id = p.id
    ORDER BY r.created_at DESC
  `);

  return result.rows;

};
