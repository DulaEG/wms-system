const pool = require("../config/db");

const createSalesOrder = async (customer_id, items) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderRes = await client.query(
      `INSERT INTO sales_orders (customer_id, status)
       VALUES ($1, 'PENDING')
       RETURNING *`,
      [customer_id]
    );

    const order = orderRes.rows[0];

    for (let item of items) {

      const stockRes = await client.query(
        `SELECT quantity, reserved_quantity
         FROM products
         WHERE id = $1`,
        [item.product_id]
      );

      const product = stockRes.rows[0];

      if (!product) {
        throw new Error(`Product ${item.product_id} not found`);
      }

      const available = product.quantity - product.reserved_quantity;

      if (available < item.quantity) {
        throw new Error(`Insufficient available stock for product ${item.product_id}`);
      }

      await client.query(
        `UPDATE products
         SET reserved_quantity = reserved_quantity + $1
         WHERE id = $2`,
        [item.quantity, item.product_id]
      );

 
      await client.query(
        `INSERT INTO sales_order_items
         (sales_order_id, product_id, warehouse_id, location_id, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          order.id,
          item.product_id,
          item.warehouse_id,
          item.location_id,
          item.quantity
        ]
      );
    }

    await client.query("COMMIT");
    return order;

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};


const dispatchSalesOrder = async (orderId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderResult = await client.query(
      `SELECT * FROM sales_orders WHERE id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      throw new Error("Sales order not found");
    }

    const order = orderResult.rows[0];

    if (order.status !== "PENDING") {
      throw new Error("Order already dispatched");
    }

    const itemsResult = await client.query(
      `SELECT * FROM sales_order_items WHERE sales_order_id = $1`,
      [orderId]
    );

    for (let item of itemsResult.rows) {

      const productRes = await client.query(
        `SELECT quantity, reserved_quantity
         FROM products
         WHERE id = $1`,
        [item.product_id]
      );

      const product = productRes.rows[0];

      if (!product) {
        throw new Error(`Product ${item.product_id} not found`);
      }

      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.product_id}`);
      }

  
      await client.query(
  `
  UPDATE products
SET 
  quantity = quantity - $1,
  reserved_quantity = GREATEST(reserved_quantity - $1, 0)
WHERE id = $2
  `,
  [item.quantity, item.product_id]
);

    
      await client.query(
        `INSERT INTO stock_movements
         (product_id, warehouse_id, location_id, movement_type, quantity, reference)
         VALUES ($1, $2, $3, 'OUT', $4, $5)`,
        [
          item.product_id,
          item.warehouse_id,
          item.location_id,
          item.quantity,
          `SO-${orderId}`
        ]
      );
    }

    await client.query(
      `UPDATE sales_orders
       SET status = 'DISPATCHED'
       WHERE id = $1`,
      [orderId]
    );

    await client.query("COMMIT");

    return { message: "Sales order dispatched successfully" };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};


const getAll = async (status) => {

  let query = `
    SELECT 
      so.*,
      c.name AS customer_name,
      COUNT(soi.id) AS items
    FROM sales_orders so
    JOIN customers c ON so.customer_id = c.id
    LEFT JOIN sales_order_items soi 
      ON so.id = soi.sales_order_id
  `;

  const values = [];

  if (status) {
    query += ` WHERE so.status = $1`;
    values.push(status);
  }

  query += `
    GROUP BY so.id, c.name
    ORDER BY so.created_at DESC
  `;

  const result = await pool.query(query, values);
  return result.rows;
};


const getById = async (id) => {
  const orderResult = await pool.query(
    `
    SELECT so.*, c.name AS customer_name
    FROM sales_orders so
    JOIN customers c ON so.customer_id = c.id
    WHERE so.id = $1
    `,
    [id]
  );

  if (orderResult.rows.length === 0) {
    throw new Error("Sales order not found");
  }

  const itemsResult = await pool.query(
    `
    SELECT soi.*, p.name AS product_name
    FROM sales_order_items soi
    JOIN products p ON soi.product_id = p.id
    WHERE soi.sales_order_id = $1
    `,
    [id]
  );

  return {
    ...orderResult.rows[0],
    items: itemsResult.rows,
  };
};


const getDashboardSummary = async () => {
  const result = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE status = 'PENDING') AS pending_orders,
      COUNT(*) FILTER (WHERE status = 'DISPATCHED') AS dispatched_orders,
      COUNT(*) AS total_orders
    FROM sales_orders
  `);

  return result.rows[0];
};

const cancelSalesOrder = async (orderId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderRes = await client.query(
      `SELECT * FROM sales_orders WHERE id = $1`,
      [orderId]
    );

    if (orderRes.rows.length === 0) {
      throw new Error("Sales order not found");
    }

    const order = orderRes.rows[0];

    if (order.status !== "PENDING") {
      throw new Error("Only pending orders can be cancelled");
    }

    const itemsRes = await client.query(
      `SELECT * FROM sales_order_items WHERE sales_order_id = $1`,
      [orderId]
    );

    for (let item of itemsRes.rows) {
      await client.query(
        `UPDATE products
         SET reserved_quantity = reserved_quantity - $1
         WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    await client.query(
      `UPDATE sales_orders
       SET status = 'CANCELLED'
       WHERE id = $1`,
      [orderId]
    );

    await client.query("COMMIT");

    return { message: "Sales order cancelled successfully" };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  createSalesOrder,
  dispatchSalesOrder,
  cancelSalesOrder,
  getAll,
  getById,
  getDashboardSummary
};