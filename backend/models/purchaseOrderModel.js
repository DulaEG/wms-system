exports.receiveOrder = async (order_id) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    const orderResult = await client.query(
      "SELECT * FROM purchase_orders WHERE id = $1 FOR UPDATE",
      [order_id]
    );

    if (orderResult.rows.length === 0) {
      throw new Error("Order not found");
    }

    const order = orderResult.rows[0];

    if (order.status === "RECEIVED") {
      throw new Error("Order already received");
    }

    const itemsResult = await client.query(
      "SELECT * FROM purchase_order_items WHERE purchase_order_id = $1",
      [order_id]
    );

    const items = itemsResult.rows;

    for (let item of items) {

      // UPDATE PRODUCT STOCK
      await client.query(
        `UPDATE products
        SET quantity = quantity + $1
        WHERE id = $2`,
        [item.quantity, item.product_id]
      );

      // INSERT STOCK MOVEMENT
      await client.query(
        `INSERT INTO stock_movements
        (product_id, warehouse_id, location_id, movement_type, quantity, reference)
        VALUES ($1,$2,$3,'IN',$4,$5)`,
        [
          item.product_id,
          item.warehouse_id,
          item.location_id,
          item.quantity,
          `PO-${order_id}`
        ]
      );

    }

    await client.query(
      "UPDATE purchase_orders SET status='RECEIVED' WHERE id=$1",
      [order_id]
    );

    await client.query("COMMIT");

    return { message: "Purchase Order Received" };

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};