/**
 * External API Routes
 * Routes untuk AI, Kemenkes, Payment integrations
 */

const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const kemenkesService = require("../services/kemenkesService");
const midtransService = require("../services/midtransService");
const emailService = require("../services/emailService");
const Order = require("../models/Order");
const { authenticateToken } = require("../middleware/auth");
const { authorizeRole } = require("../middleware/authorize");
const rateLimit = require("express-rate-limit");

// AI Rate Limiter (expensive calls!)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many AI requests. Please wait.",
  },
});

/**
 * @swagger
 * /api/external/ai/ask:
 *   post:
 *     summary: Ask AI chatbot for health recommendations
 *     description: Get AI-powered health recommendations with product suggestions. Rate limited to 10 requests per 15 minutes.
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AIRequest'
 *           example:
 *             question: "Vitamin apa yang bagus untuk imun tubuh?"
 *     responses:
 *       200:
 *         description: AI response with recommendations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AIResponse'
 *       400:
 *         description: Bad request (missing or invalid question)
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Server error
 */
router.post("/ai/ask", aiLimiter, aiController.askAI);

/**
 * @swagger
 * /api/external/ai/chat:
 *   post:
 *     summary: Chat with AI assistant (alternative endpoint)
 *     description: Chat endpoint compatible with frontend. Uses message and context parameters.
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               context:
 *                 type: string
 *           example:
 *             message: "Saya butuh vitamin untuk daya tahan tubuh"
 *             context: "health_product_recommendation"
 *     responses:
 *       200:
 *         description: AI response with recommendations
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/ai/chat", aiLimiter, aiController.chatAI);

/**
 * @swagger
 * /api/external/kemenkes/medications:
 *   get:
 *     summary: Search medications from Kemenkes API
 *     description: Search official medication data from Kemenkes (Ministry of Health) API
 *     tags: [Kemenkes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for medication name
 *         example: "paracetamol"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of results
 *     responses:
 *       200:
 *         description: List of medications from Kemenkes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/KemenkesMedication'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/kemenkes/medications", authenticateToken, async (req, res) => {
  const result = await kemenkesService.getMedications(
    req.query.search,
    req.query.limit
  );
  res.json(result);
});

/**
 * @swagger
 * /api/external/kemenkes/sync:
 *   post:
 *     summary: Sync Kemenkes medications to database (Admin only)
 *     description: Sync official medication data from Kemenkes API to local database
 *     tags: [Kemenkes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sync operation completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 newProducts:
 *                   type: number
 *                   description: Number of new products added
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       500:
 *         description: Server error
 */
router.post(
  "/kemenkes/sync",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    const result = await kemenkesService.syncToDatabase();
    res.json(result);
  }
);

/**
 * @swagger
 * /api/external/payment/create:
 *   post:
 *     summary: Create payment transaction via Midtrans
 *     description: Create a new payment transaction and get payment redirect URL
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentRequest'
 *           example:
 *             orderId: "ORDER-1234567890"
 *             customerEmail: "customer@example.com"
 *             customerName: "John Doe"
 *             items:
 *               - id: "69058b83cc8332efdabe01e2"
 *                 name: "Vitamin C 1000mg"
 *                 price: 85000
 *                 quantity: 2
 *     responses:
 *       200:
 *         description: Payment transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/payment/create", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, items, amount, customerName, customerEmail, customerPhone } = req.body;

    // Create order in database with status "pending"
    const orderData = {
      orderId: orderId,
      user: userId,
      items: items.map(item => ({
        product: item.id || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: amount,
      status: "pending",
      customerDetails: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone || "",
      },
    };

    // Save order to database
    let order = await Order.findOne({ orderId });
    if (!order) {
      try {
        order = await Order.create(orderData);
        console.log("Order created in database:", orderId);
        console.log("   Order ID:", order.orderId);
        console.log("   User ID:", order.user);
        console.log("   Status:", order.status);
        console.log("   Total Amount:", order.totalAmount);
        console.log("   Items count:", order.items.length);
        
        // Verify order was saved
        const verifyOrder = await Order.findOne({ orderId });
        if (verifyOrder) {
          console.log("Order verified in database");
        } else {
          console.error("Order NOT found after creation!");
        }
      } catch (createError) {
        console.error("Error creating order:", createError);
        console.error("   Order data:", JSON.stringify(orderData, null, 2));
        throw createError;
      }
    } else {
      // Update existing order
      Object.assign(order, orderData);
      await order.save();
      console.log("Order updated in database:", orderId);
    }

    // Create Midtrans transaction
    const result = await midtransService.createTransaction(req.body);
    
    // If payment creation successful, return result
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Payment create error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/external/payment/webhook:
 *   post:
 *     summary: Midtrans payment webhook callback
 *     description: Webhook endpoint for Midtrans payment notifications. Called automatically by Midtrans when payment status changes.
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transaction_status:
 *                 type: string
 *                 example: "settlement"
 *               order_id:
 *                 type: string
 *                 example: "ORDER-1234567890"
 *               gross_amount:
 *                 type: string
 *                 example: "170000"
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post("/payment/webhook", async (req, res) => {
  try {
    console.log("Webhook received from Midtrans");
    console.log("Full webhook body:", JSON.stringify(req.body, null, 2));
    
    const orderId = req.body.order_id;
    const transactionStatus = req.body.transaction_status;
    const statusCode = req.body.status_code;
    
    console.log("Webhook details:", {
      orderId,
      transactionStatus,
      statusCode,
      grossAmount: req.body.gross_amount,
      customerEmail: req.body.customer_details?.email,
      paymentType: req.body.payment_type,
    });

    // Process notification
    const result = midtransService.handleNotification(req.body);
    console.log("📥 Midtrans service result:", result);
    
    // Find order in database - try multiple ways
    let order = await Order.findOne({ orderId });
    
    // If not found, try searching by orderId without case sensitivity
    if (!order) {
      order = await Order.findOne({ 
        orderId: { $regex: new RegExp(`^${orderId}$`, 'i') } 
      });
    }
    
    // If still not found, log all orders for debugging
    if (!order) {
      console.warn("Order not found in database:", orderId);
      console.warn("   Searching for similar orderIds...");
      
      // Find all recent orders for debugging
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('orderId status createdAt');
      
      console.warn("   Recent orders in database:", recentOrders.map(o => ({
        orderId: o.orderId,
        status: o.status,
        createdAt: o.createdAt
      })));
      
      console.warn("   This might happen if:");
      console.warn("   1. Order was not created during payment");
      console.warn("   2. OrderId mismatch between payment and webhook");
      console.warn("   3. Database connection issue");
      
      // Still return success to Midtrans even if order not found
      // (to prevent Midtrans from retrying)
      return res.status(200).json({
        success: true,
        message: "Webhook received but order not found",
        orderId,
        debug: {
          searchedOrderId: orderId,
          recentOrders: recentOrders.map(o => o.orderId)
        }
      });
    }

    console.log("Order found in database:", orderId);
    console.log("   Current status:", order.status);
    console.log("   New transaction status:", transactionStatus);

    // Map Midtrans transaction_status to order status
    let orderStatus = order.status; // Keep current status as default
    
    switch (transactionStatus) {
      case 'settlement':
      case 'capture':
        orderStatus = 'paid';
        break;
      case 'pending':
        orderStatus = 'pending';
        break;
      case 'deny':
      case 'expire':
      case 'cancel':
        orderStatus = 'failed';
        break;
      case 'refund':
      case 'partial_refund':
        orderStatus = 'cancelled';
        break;
      default:
        // Keep current status if unknown status
        console.warn("Unknown transaction status:", transactionStatus);
        orderStatus = order.status;
    }

    // Update order
    const previousStatus = order.status;
    order.status = orderStatus;
    order.transactionStatus = transactionStatus;
    
    // Update midtransData
    order.midtransData = {
      transactionId: req.body.transaction_id || order.midtransData?.transactionId,
      statusCode: statusCode || order.midtransData?.statusCode,
      grossAmount: parseInt(req.body.gross_amount || order.midtransData?.grossAmount || order.totalAmount),
      paymentType: req.body.payment_type || order.midtransData?.paymentType,
      transactionTime: req.body.transaction_time 
        ? new Date(req.body.transaction_time) 
        : (order.midtransData?.transactionTime || new Date()),
      settlementTime: req.body.settlement_time 
        ? new Date(req.body.settlement_time) 
        : order.midtransData?.settlementTime,
    };
    
    // Save order with error handling
    try {
      await order.save();
      console.log("Order updated successfully!");
      console.log("   Order ID:", orderId);
      console.log("   Previous status:", previousStatus);
      console.log("   New status:", orderStatus);
      console.log("   Transaction status:", transactionStatus);
      
      // Verify the save worked
      const verifyOrder = await Order.findOne({ orderId });
      if (verifyOrder && verifyOrder.status === orderStatus) {
        console.log("Order status verified in database:", verifyOrder.status);
        } else {
        console.error("Order status NOT updated! Expected:", orderStatus, "Got:", verifyOrder?.status);
      }
    } catch (saveError) {
      console.error("Error saving order:", saveError);
      console.error("   Order ID:", orderId);
      console.error("   Error message:", saveError.message);
      console.error("   Error stack:", saveError.stack);
      throw saveError; // Re-throw to be caught by outer catch
    }
    
    // Send email if payment successful
    if (result.success && result.status === 'paid' && orderStatus === 'paid') {
      console.log("Payment successful, sending confirmation email...");
      
      const customerEmail = req.body.customer_details?.email || 
                           req.body.email || 
                           order.customerDetails?.email ||
                           'customer@example.com';
      
      // Get order items for email
      const orderItems = order.items || [];
      
      const emailResult = await emailService.sendPaymentConfirmation({
        orderId: result.orderId,
        customerEmail: customerEmail,
        amount: parseInt(result.grossAmount || req.body.gross_amount || order.totalAmount),
        items: orderItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      if (emailResult.success) {
        console.log("Email sent successfully to:", customerEmail);
      } else {
        console.warn("Email sending failed:", emailResult.error);
      }
    } else {
      console.log("Payment status:", result.status, "Order status:", orderStatus, "- No email sent");
    }
    
    // Always return success to Midtrans (to prevent retries)
    res.status(200).json({
      success: true,
      status: orderStatus,
      orderId: result.orderId,
      transactionStatus: transactionStatus,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Webhook error:", error);
    console.error("   Error stack:", error.stack);
    
    // Still return 200 to Midtrans to prevent retries
    // But log the error for debugging
    res.status(200).json({ 
      success: false, 
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

module.exports = router;
