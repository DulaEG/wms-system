const inventoryModel = require("../models/inventoryModel");

exports.getInventory = async (req, res) => {
  try {
    const data = await inventoryModel.getInventory();
    res.json(data);
  } catch (err) {
    console.error("Inventory controller error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
