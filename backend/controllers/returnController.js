const returnModel = require("../models/returnModel");

exports.createReturn = async (req, res) => {

  try {

    const data = await returnModel.createReturn(req.body);

    res.json({
      message: "Return recorded",
      data
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};


exports.getReturns = async (req, res) => {

  try {

    const data = await returnModel.getReturns();

    res.json(data);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};
