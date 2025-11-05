/**
 * Health E-Commerce Server dengan External Integrations
 * Modul 5: Melanjutkan dari Modul 4 (Auth) dengan AI & External APIs
 */

require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("mongo-sanitize");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const connectDB = require("./config/database");

// Import ALL routes (from Modul 3, 4, 5, 6)
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const externalRoutes = require("./routes/externalRoutes");

const app = express();

// Connect to database
connectDB();

// Security
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"]
        : true, // Allow all origins in development (for frontend testing)
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Sanitize
app.use((req, res, next) => {
  req.body = mongoSanitize(req.body);
  req.params = mongoSanitize(req.params);
  req.query = mongoSanitize(req.query);
  next();
});

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api/", apiLimiter);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Health E-Commerce API Documentation",
}));

// Mount Routes (Complete API from Modul 1-6)
app.use("/api/products", productRoutes);     // From Modul 3 (CRUD)
app.use("/api/auth", authRoutes);            // From Modul 4 (Authentication)
app.use("/api/cart", cartRoutes);            // From Modul 6 (User Cart)
app.use("/api/upload", uploadRoutes);        // From Modul 6 (Cloudinary Upload)
app.use("/api/external", externalRoutes);    // From Modul 5 (Integrations)

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API server is running and healthy
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Health E-Commerce API with External Integrations"
 *                 features:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["AI Chatbot 🤖", "Kemenkes API 🏥", "Midtrans Payment 💳"]
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Health E-Commerce API with External Integrations",
    features: ["AI Chatbot 🤖", "Kemenkes API 🏥", "Midtrans Payment 💳"],
    timestamp: new Date().toISOString(),
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development" ? err.message : "Server error",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;  // Port 5000 for Frontend integration!
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════════════════╗
  ║  🏥 HEALTH E-COMMERCE API - ULTIMATE BACKEND                  ║
  ║  📍 Port: ${PORT}                                                  ║
  ║                                                               ║
  ║  📖 API Documentation (Swagger):                              ║
  ║     📄 http://localhost:${PORT}/api-docs                          ║
  ║                                                               ║
  ║  📦 Products API (Modul 3):                                   ║
  ║     GET    /api/products                                      ║
  ║     POST   /api/products (Admin)                              ║
  ║                                                               ║
  ║  🔐 Authentication (Modul 4):                                 ║
  ║     POST   /api/auth/register                                 ║
  ║     POST   /api/auth/login                                    ║
  ║     GET    /api/auth/profile                                  ║
  ║                                                               ║
  ║  🤖 AI & Integrations (Modul 5):                              ║
  ║     POST   /api/external/ai/ask                               ║
  ║     GET    /api/external/kemenkes/medications                 ║
  ║     POST   /api/external/payment/create                       ║
  ║                                                               ║
  ║  ✅ READY FOR FRONTEND INTEGRATION!                           ║
  ╚═══════════════════════════════════════════════════════════════╝
  `);
  console.log(`\n🔗 Frontend should connect to: http://localhost:${PORT}`);
  console.log(`📖 Swagger UI available at: http://localhost:${PORT}/api-docs\n`);
});
