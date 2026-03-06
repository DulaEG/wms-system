const Location = require("../models/locationModel");

exports.createLocation = async (req, res) => {
  try {
    const { warehouse_id, zone, rack, shelf } = req.body;

    const location = await Location.create(
      warehouse_id,
      zone,
      rack,
      shelf
    );

    res.status(201).json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getLocationsByWarehouse = async (req, res) => {
  try {
    const locations = await Location.getByWarehouse(req.params.warehouse_id);
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    await Location.delete(req.params.id);
    res.json({ message: "Location deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};