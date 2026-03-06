const Warehouse = require("../models/warehouseModel");

exports.createWarehouse = async (req, res) => {
  try {

    const { name, location } = req.body;

    const warehouse = await Warehouse.create(name, location);

    res.status(201).json({
      success: true,
      data: warehouse
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.getAllWarehouses = async (req, res) => {
  try {

    const warehouses = await Warehouse.getAll();

    res.status(200).json({
      success: true,
      data: warehouses
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};

exports.getWarehouseById = async (req, res) => {
  try {

    const warehouse = await Warehouse.getById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found"
      });
    }

    res.json({
      success: true,
      data: warehouse
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};

exports.updateWarehouse = async (req, res) => {
  try {

    const { name, location } = req.body;

    const warehouse = await Warehouse.update(
      req.params.id,
      name,
      location
    );

    res.json({
      success: true,
      data: warehouse
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};

exports.deleteWarehouse = async (req, res) => {
  try {

    await Warehouse.delete(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};