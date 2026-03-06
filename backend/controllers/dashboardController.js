const Dashboard = require("../models/dashboardModel");

exports.getDashboard = async (req, res) => {
  try {
    const data = await Dashboard.getSummary();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};