const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");
const locationRoutes = require("./routes/locationRoutes");
const productRoutes = require("./routes/productRoutes");
const stockMovementRoutes = require("./routes/stockMovementRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const purchaseOrderRoutes = require("./routes/purchaseOrderRoutes");
const customerRoutes = require("./routes/customerRoutes");
const salesOrderRoutes = require("./routes/salesOrderRoutes");
const reportRoutes = require("./routes/reportRoutes");
const transferRoutes = require("./routes/transferRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

/* ROUTES */

app.use("/api/auth", authRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stock", stockMovementRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales-orders", salesOrderRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/stock-transfer", transferRoutes);
app.use("/api/inventory", inventoryRoutes);


/* BASIC TEST ROUTES */

app.get("/", (req, res) => {
  res.send("WMS API running");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Database error");
  }
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "You accessed protected data", user: req.user });
});

app.get("/api/admin", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});


/* 404 ROUTE */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


/* GLOBAL ERROR HANDLER */

app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});


/* START SERVER */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});