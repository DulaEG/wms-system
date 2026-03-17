const pool = require("../config/db");
const { getAvailableLocation } = require("../services/locationService");


exports.create = async (product) => {

  const locationId = await getAvailableLocation(product.warehouse_id);

  const result = await pool.query(
    `INSERT INTO products (name, quantity, warehouse_id, location_id)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [product.name, product.quantity, product.warehouse_id, locationId]
  );

  return result.rows[0];
};


exports.getAll = async () => {
  const result = await pool.query(`
    SELECT p.*, w.name as warehouse_name
    FROM products p
    LEFT JOIN warehouses w ON p.warehouse_id = w.id
    ORDER BY p.id DESC
  `);

  return result.rows;
};


exports.update = async (id, data) => {
  const { name, sku, category, description, quantity, warehouse_id } = data;

  const result = await pool.query(
    `UPDATE products
     SET name=$1, sku=$2, category=$3, description=$4,
         quantity=$5, warehouse_id=$6
     WHERE id=$7
     RETURNING *`,
    [name, sku, category, description, quantity, warehouse_id, id]
  );

  return result.rows[0];
};


exports.delete = async (id) => {
  await pool.query("DELETE FROM products WHERE id = $1", [id]);
};


exports.getLowStock = async (limit) => {
  const result = await pool.query(
    "SELECT * FROM products WHERE quantity <= $1 ORDER BY quantity ASC",
    [limit]
  );

  return result.rows;
};


exports.getStockByWarehouse = async () => {
  const result = await pool.query(`
    SELECT w.name AS warehouse_name,
           SUM(p.quantity) AS total_stock
    FROM products p
    JOIN warehouses w ON p.warehouse_id = w.id
    GROUP BY w.name
  `);

  return result.rows;
};


exports.getStockByLocation = async () => {
  const result = await pool.query(`
    SELECT 
      l.id AS location_id,
      l.zone,
      l.rack,
      l.shelf,
      SUM(p.quantity) AS total_stock
    FROM products p
    JOIN locations l ON p.location_id = l.id
    GROUP BY l.id, l.zone, l.rack, l.shelf
    ORDER BY l.zone, l.rack
  `);

  return result.rows;
};


exports.searchProducts = async (search, limit, offset) => {
  const result = await pool.query(
    `
    SELECT p.*, w.name AS warehouse_name
    FROM products p
    LEFT JOIN warehouses w ON p.warehouse_id = w.id
    WHERE
      p.name ILIKE $1
      OR p.sku ILIKE $1
      OR p.category ILIKE $1
    ORDER BY p.id DESC
    LIMIT $2 OFFSET $3
  `,
    [`%${search}%`, limit, offset]
  );

  return result.rows;
};

exports.getById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM products WHERE id = $1",
    [id]
  );

  return result.rows[0];
};