const pool = require("../config/db");

exports.createMovement = async (data) => {
  const {
    product_id,
    warehouse_id,
    location_id,
    movement_type,
    quantity,
    reference,
  } = data;

  // Start transaction
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Get current product quantity
    const productResult = await client.query(
      "SELECT quantity FROM products WHERE id = $1 FOR UPDATE",
      [product_id]
    );

    if (productResult.rows.length === 0) {
      throw new Error("Product not found");
    }

    let currentQty = productResult.rows[0].quantity;
    let newQty;

    if (movement_type === "IN") {
      newQty = currentQty + quantity;
    } else if (movement_type === "OUT") {
      if (currentQty < quantity) {
        throw new Error("Insufficient stock");
      }
      newQty = currentQty - quantity;
    } else {
      throw new Error("Invalid movement type");
    }

    // Insert movement record
    const movementResult = await client.query(
      `INSERT INTO stock_movements
       (product_id, warehouse_id, location_id, movement_type, quantity, reference)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [product_id, warehouse_id, location_id, movement_type, quantity, reference]
    );

    // Update product quantity
    await client.query(
      "UPDATE products SET quantity = $1 WHERE id = $2",
      [newQty, product_id]
    );

    await client.query("COMMIT");

    return movementResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

exports.getHistoryByProduct = async (product_id) => {
  const result = await pool.query(
    "SELECT * FROM stock_movements WHERE product_id = $1 ORDER BY created_at DESC",
    [product_id]
  );

  return result.rows;
};

exports.getFilteredHistory = async (product_id, start, end) => {

  const result = await pool.query(`
  SELECT 
    sm.*,
    p.name AS product_name,
    w.name AS warehouse_name
  FROM stock_movements sm
  JOIN products p ON sm.product_id = p.id
  JOIN warehouses w ON sm.warehouse_id = w.id
  WHERE
    ($1::int IS NULL OR sm.product_id = $1)
    AND ($2::timestamp IS NULL OR sm.created_at >= $2)
    AND ($3::timestamp IS NULL OR sm.created_at <= $3)
  ORDER BY sm.created_at DESC
`, [product_id || null, start || null, end || null]);

  return result.rows;
};

exports.getStockSummary = async (product_id, start, end) => {

  const result = await pool.query(`
    SELECT
      $1::int AS product_id,

      -- Opening stock (before start date)
      COALESCE(SUM(
        CASE 
          WHEN movement_type = 'IN' THEN quantity
          WHEN movement_type = 'OUT' THEN -quantity
        END
      ) FILTER (WHERE created_at < $2), 0) AS opening_stock,

      -- Total IN during period
      COALESCE(SUM(quantity) FILTER (
        WHERE movement_type = 'IN'
        AND created_at BETWEEN $2 AND $3
      ), 0) AS total_in,

      -- Total OUT during period
      COALESCE(SUM(quantity) FILTER (
        WHERE movement_type = 'OUT'
        AND created_at BETWEEN $2 AND $3
      ), 0) AS total_out

    FROM stock_movements
    WHERE product_id = $1
  `, [product_id, start, end]);

  const row = result.rows[0];

  return {
    product_id,
    opening_stock: parseInt(row.opening_stock),
    total_in: parseInt(row.total_in),
    total_out: parseInt(row.total_out),
    closing_stock:
      parseInt(row.opening_stock) +
      parseInt(row.total_in) -
      parseInt(row.total_out)
  };
};