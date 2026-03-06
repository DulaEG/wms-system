const PurchaseOrder = require("../models/purchaseOrderModel");

exports.createOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.getAll();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.receiveOrder = async (req, res) => {
  try {
    const result = await PurchaseOrder.receiveOrder(req.params.id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};