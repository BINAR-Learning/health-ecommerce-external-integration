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
  const result = await midtransService.createTransaction(req.body);
  res.json(result);
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
    console.log("🔔 Webhook received from Midtrans");

    const result = midtransService.handleNotification(req.body);
    
    // Send email if payment successful
    if (result.success && result.status === 'paid') {
      console.log("💳 Payment successful, sending confirmation email...");
      
      const emailResult = await emailService.sendPaymentConfirmation({
        orderId: result.orderId,
        customerEmail: req.body.customer_details?.email || 'customer@example.com',
        amount: result.grossAmount || req.body.gross_amount,
        items: [],
      });

      if (emailResult.success) {
        console.log("✅ Email sent successfully");
      }
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(200).json({ success: false, message: error.message });
  }
});

module.exports = router;
