const pool = require("../config/db");

exports.create = async (data) => {
  const { name, contact_person, phone, email } = data;

  const result = await pool.query(
    `INSERT INTO suppliers 
     (name, contact_person, phone, email)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, contact_person, phone, email]
  );

  return result.rows[0];
};

exports.getAll = async () => {
  const result = await pool.query(
    "SELECT * FROM suppliers ORDER BY id DESC"
  );
  return result.rows;
};

exports.delete = async (id) => {
  await pool.query("DELETE FROM suppliers WHERE id = $1", [id]);
};