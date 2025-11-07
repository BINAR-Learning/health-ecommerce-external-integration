const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticateToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user's order history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, paid, failed, cancelled, processing, shipped, delivered]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Order history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticateToken, orderController.getOrderHistory);

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get single order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       404:
 *         description: Order not found
 */
router.get("/:orderId", authenticateToken, orderController.getOrderById);

module.exports = router;

