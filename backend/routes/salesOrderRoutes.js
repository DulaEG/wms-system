const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
  createSalesOrder,
  dispatchSalesOrder,
  cancelSalesOrder,   
  getSalesOrders,
  getSalesOrderById,
  getSalesDashboard
} = require('../controllers/salesOrderController');


// Create
router.post('/', authMiddleware, createSalesOrder);

// Dispatch
router.put('/dispatch/:id', authMiddleware, dispatchSalesOrder);

// Dashboard summary (IMPORTANT: keep before :id)
router.get('/dashboard/summary', authMiddleware, getSalesDashboard);

// Get all (with optional ?status=)
router.get('/', authMiddleware, getSalesOrders);

// Get single by ID
router.get('/:id', authMiddleware, getSalesOrderById);

router.put('/cancel/:id', authMiddleware, cancelSalesOrder);

module.exports = router;