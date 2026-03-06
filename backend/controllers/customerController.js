const Customer = require('../models/customerModel');

const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
  console.error("Customer Create Error:", error);
  res.status(500).json({ error: error.message });
}
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.getAllCustomers();
    res.json(customers);
  } catch (error) {
  console.error("Customer Create Error:", error);
  res.status(500).json({ error: error.message });
}
};

module.exports = {
  createCustomer,
  getAllCustomers
};