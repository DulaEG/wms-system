const SalesOrder = require("../models/salesOrderModel");


// CREATE
exports.createSalesOrder = async (req, res) => {
  try {
    const { customer_id, items } = req.body;

    const order = await SalesOrder.createSalesOrder(customer_id, items);

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// DISPATCH
exports.dispatchSalesOrder = async (req, res) => {
  try {
    const result = await SalesOrder.dispatchSalesOrder(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// GET ALL
exports.getSalesOrders = async (req, res) => {
  try {
    const status = req.query.status;
    const orders = await SalesOrder.getAll(status);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET BY ID
exports.getSalesOrderById = async (req, res) => {
  try {
    const order = await SalesOrder.getById(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


// DASHBOARD
exports.getSalesDashboard = async (req, res) => {
  try {
    const data = await SalesOrder.getDashboardSummary();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelSalesOrder = async (req, res) => {
  try {
    const result = await SalesOrder.cancelSalesOrder(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};