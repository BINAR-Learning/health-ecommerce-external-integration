/**
 * Health E-Commerce API - Server (Modul 5: External API Integration)
 * 
 * File ini adalah entry point utama aplikasi.
 * 
 * TODO untuk Peserta:
 * 1. Setup environment variables dengan dotenv
 * 2. Koneksi ke MongoDB
 * 3. Setup middleware (helmet, cors, rate limiting)
 * 4. Mount routes untuk external integrations
 * 5. Implement error handling
 */

require('dotenv').config();
const express = require('express');

// TODO: Import middleware yang diperlukan
// const helmet = require('helmet');
// const cors = require('cors');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');

// TODO: Import database connection
// const connectDB = require('./config/database');

// TODO: Import routes
// const productRoutes = require('./routes/productRoutes');
// const authRoutes = require('./routes/authRoutes');
// const cartRoutes = require('./routes/cartRoutes');
// const uploadRoutes = require('./routes/uploadRoutes');
// const externalRoutes = require('./routes/externalRoutes');
// const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// TODO: Connect to Database
// ==========================================
// connectDB();

// ==========================================
// TODO: Security Middleware
// ==========================================
// app.use(helmet());
// app.use(cors());

// ==========================================
// TODO: Body Parser Middleware
// ==========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// TODO: Logging Middleware
// ==========================================
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// ==========================================
// TODO: Rate Limiting
// ==========================================
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message: 'Too many requests from this IP'
// });
// app.use('/api/', apiLimiter);

// ==========================================
// Health Check Endpoint
// ==========================================
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// TODO: Mount Routes
// ==========================================
// app.use('/api/products', productRoutes);     // Product CRUD
// app.use('/api/auth', authRoutes);            // Authentication
// app.use('/api/cart', cartRoutes);            // Shopping Cart
// app.use('/api/upload', uploadRoutes);        // Image Upload
// app.use('/api/external', externalRoutes);    // External Integrations (AI, Payment)
// app.use('/api/orders', orderRoutes);         // Order History

// ==========================================
// TODO: Error Handler
// ==========================================
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: 'Something went wrong!',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// ==========================================
// 404 Handler
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// ==========================================
// Start Server
// ==========================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`💻 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

