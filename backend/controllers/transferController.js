const transferModel = require("../models/transferModel");

exports.transferStock = async (req, res, next) => {
  try {
    const result = await transferModel.transfer(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};