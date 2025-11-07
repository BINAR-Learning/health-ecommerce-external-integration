/**
 * Authentication Routes
 * 
 * TODO untuk peserta:
 * 1. Import express router
 * 2. Import authController
 * 3. Import middleware (authenticateToken)
 * 4. Create routes:
 *    - POST /register - Register new user
 *    - POST /login - Login user
 *    - GET /profile - Get user profile (Protected)
 *    - PUT /profile - Update user profile (Protected)
 * 
 * Reference: ../finished-project/routes/authRoutes.js
 */

const express = require('express');
const router = express.Router();

// TODO: Import controller
// const authController = require('../controllers/authController');

// TODO: Import middleware
// const { authenticateToken } = require('../middleware/auth');

// TODO: POST /register
// router.post('/register', authController.register);

// TODO: POST /login
// router.post('/login', authController.login);

// TODO: GET /profile (Protected)
// router.get('/profile', authenticateToken, authController.getProfile);

// TODO: PUT /profile (Protected)
// router.put('/profile', authenticateToken, authController.updateProfile);

module.exports = router;

