/**
 * Order Routes
 * 
 * TODO untuk peserta:
 * 1. Import express router
 * 2. Import orderController
 * 3. Import middleware (authenticateToken)
 * 4. Create routes:
 *    - GET / - Get order history (Protected, with pagination)
 *    - GET /:orderId - Get order detail (Protected)
 * 
 * Reference: ../finished-project/routes/orderRoutes.js
 */

const express = require('express');
const router = express.Router();

// TODO: Import controller
// const orderController = require('../controllers/orderController');

// TODO: Import middleware
// const { authenticateToken } = require('../middleware/auth');

// TODO: GET / - Get order history
// router.get('/', authenticateToken, orderController.getOrderHistory);

// TODO: GET /:orderId - Get order detail
// router.get('/:orderId', authenticateToken, orderController.getOrderById);

module.exports = router;

