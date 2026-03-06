const StockMovement = require("../models/stockMovementModel");

exports.createMovement = async (req, res) => {
  try {
    const movement = await StockMovement.createMovement(req.body);
    res.status(201).json(movement);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await StockMovement.getHistoryByProduct(req.params.product_id);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFilteredHistory = async (req, res) => {

  try {

    const product_id = req.query.product_id;
    const start = req.query.start;
    const end = req.query.end;

    const data = await StockMovement.getFilteredHistory(product_id, start, end);

    res.json(data);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }

};

exports.getStockSummary = async (req, res) => {

  try {

    const product_id = req.query.product_id;
    const start = req.query.start;
    const end = req.query.end;

    if (!product_id || !start || !end) {
      return res.status(400).json({
        message: "product_id, start and end are required"
      });
    }

    const data = await StockMovement.getStockSummary(
      product_id,
      start,
      end
    );

    res.json(data);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }

};

exports.transferStock = async (req, res) => {

  try {

    const {
      product_id,
      from_warehouse_id,
      from_location_id,
      to_warehouse_id,
      to_location_id,
      quantity,
      reference
    } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({
        message: "product_id and quantity are required"
      });
    }

    // OUT from source
    await StockMovement.createMovement({
      product_id,
      warehouse_id: from_warehouse_id,
      location_id: from_location_id,
      movement_type: "OUT",
      quantity,
      reference: reference || "TRANSFER-OUT"
    });

    // IN to destination
    await StockMovement.createMovement({
      product_id,
      warehouse_id: to_warehouse_id,
      location_id: to_location_id,
      movement_type: "IN",
      quantity,
      reference: reference || "TRANSFER-IN"
    });

    res.json({ message: "Stock transferred successfully" });

  } catch (error) {

    console.error(error);
    res.status(400).json({ message: error.message });

  }

};