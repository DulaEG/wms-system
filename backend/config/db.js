const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "wms_project",
  password: "Dul234#",
  port: 5432,
});

module.exports = pool;