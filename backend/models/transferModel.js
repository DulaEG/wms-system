const pool = require("../config/db");

exports.transfer = async (data) => {
  const {
    product_id,
    source_warehouse_id,
    source_location_id,
    destination_warehouse_id,
    destination_location_id,
    quantity
  } = data;

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  if (
    source_warehouse_id === destination_warehouse_id &&
    source_location_id === destination_location_id
  ) {
    throw new Error("Source and destination cannot be the same");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock product row
    const productResult = await client.query(
      "SELECT quantity, reserved_quantity FROM products WHERE id = $1 FOR UPDATE",
      [product_id]
    );

    if (productResult.rows.length === 0) {
      throw new Error("Product not found");
    }

    const product = productResult.rows[0];

    const availableStock =
      product.quantity - product.reserved_quantity;

    if (availableStock < quantity) {
      throw new Error("Insufficient available stock");
    }

    // Deduct from source
    await client.query(
      "UPDATE products SET quantity = quantity - $1 WHERE id = $2",
      [quantity, product_id]
    );

    // Add to destination
    await client.query(
      "UPDATE products SET quantity = quantity + $1 WHERE id = $2",
      [quantity, product_id]
    );

    // OUT movement
    await client.query(
      `INSERT INTO stock_movements
       (product_id, warehouse_id, location_id, movement_type, quantity, reference)
       VALUES ($1,$2,$3,'OUT',$4,'TRANSFER-OUT')`,
      [product_id, source_warehouse_id, source_location_id, quantity]
    );

    // IN movement
    await client.query(
      `INSERT INTO stock_movements
       (product_id, warehouse_id, location_id, movement_type, quantity, reference)
       VALUES ($1,$2,$3,'IN',$4,'TRANSFER-IN')`,
      [product_id, destination_warehouse_id, destination_location_id, quantity]
    );

    await client.query("COMMIT");

    return { message: "Stock transferred successfully" };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};