const Supplier = require("../models/supplierModel");

exports.createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.getAll();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    await Supplier.delete(req.params.id);
    res.json({ message: "Supplier deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};