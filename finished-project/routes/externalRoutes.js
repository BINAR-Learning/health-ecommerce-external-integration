/**
 * External API Routes
 * Routes untuk AI, Kemenkes, Payment integrations
 */

const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const kemenkesService = require("../services/kemenkesService");
const midtransService = require("../services/midtransService");
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

// AI Chatbot
router.post("/ai/ask", aiLimiter, aiController.askAI);

// Kemenkes API
router.get("/kemenkes/medications", authenticateToken, async (req, res) => {
  const result = await kemenkesService.getMedications(
    req.query.search,
    req.query.limit
  );
  res.json(result);
});

router.post(
  "/kemenkes/sync",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    const result = await kemenkesService.syncToDatabase();
    res.json(result);
  }
);

// Payment
router.post("/payment/create", authenticateToken, async (req, res) => {
  const result = await midtransService.createTransaction(req.body);
  res.json(result);
});

router.post("/payment/webhook", async (req, res) => {
  const result = midtransService.handleNotification(req.body);
  res.json(result);
});

module.exports = router;
