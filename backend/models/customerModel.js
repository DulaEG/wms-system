const pool = require('../config/db');

const createCustomer = async (data) => {
  const { name, email, phone, address } = data;

  const result = await pool.query(
    `INSERT INTO customers (name, email, phone, address)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, email, phone, address]
  );

  return result.rows[0];
};

const getAllCustomers = async () => {
  const result = await pool.query(
    'SELECT * FROM customers ORDER BY id DESC'
  );
  return result.rows;
};

module.exports = {
  createCustomer,
  getAllCustomers
};