const pool = require("../config/db");

exports.transfer = async (data) => {

  const {
    product_id,
    source_warehouse_id,
    destination_warehouse_id,
    quantity
  } = data;

  if (!product_id || !source_warehouse_id || !destination_warehouse_id || !quantity) {
    throw new Error("Missing required fields");
  }

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  if (source_warehouse_id === destination_warehouse_id) {
    throw new Error("Source and destination warehouse cannot be the same");
  }

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    
    const stock = await client.query(
      `SELECT quantity 
       FROM inventory 
       WHERE product_id=$1 
       AND warehouse_id=$2
       LIMIT 1
       FOR UPDATE`,
      [product_id, source_warehouse_id]
    );

  
    if (stock.rows.length === 0 || stock.rows[0].quantity <= 0) {
      throw new Error("No stock available in selected source warehouse");
    }

    if (stock.rows[0].quantity < quantity) {
      throw new Error("Insufficient stock");
    }

    await client.query(
      `UPDATE inventory
       SET quantity = quantity - $1
       WHERE product_id=$2
       AND warehouse_id=$3`,
      [quantity, product_id, source_warehouse_id]
    );

    await client.query(
      `INSERT INTO inventory (product_id, warehouse_id, quantity)
       VALUES ($1,$2,$3)
       ON CONFLICT (product_id, warehouse_id)
       DO UPDATE SET quantity = inventory.quantity + EXCLUDED.quantity`,
      [product_id, destination_warehouse_id, quantity]
    );

    await client.query(
      `INSERT INTO stock_movements
       (product_id, warehouse_id, movement_type, quantity, reference)
       VALUES ($1,$2,'OUT',$3,'TRANSFER')`,
      [product_id, source_warehouse_id, quantity]
    );

    await client.query(
      `INSERT INTO stock_movements
       (product_id, warehouse_id, movement_type, quantity, reference)
       VALUES ($1,$2,'IN',$3,'TRANSFER')`,
      [product_id, destination_warehouse_id, quantity]
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