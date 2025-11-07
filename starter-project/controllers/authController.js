/**
 * Authentication Controller
 * 
 * TODO untuk peserta:
 * 1. Import User model dan jwt
 * 2. Buat generateToken function
 * 3. Implement register function:
 *    - Check if user exists
 *    - Hash password (User model akan handle)
 *    - Create user
 *    - Generate JWT token
 *    - Return token & user data
 * 
 * 4. Implement login function:
 *    - Find user by email
 *    - Check password dengan bcrypt
 *    - Generate JWT token
 *    - Return token & user data
 * 
 * 5. Implement getProfile function:
 *    - Get user dari req.user (dari middleware)
 *    - Return user data (tanpa password)
 * 
 * 6. Implement updateProfile function:
 *    - Get user dari req.user
 *    - Update user fields
 *    - Save user
 *    - Return updated user
 * 
 * Reference: ../finished-project/controllers/authController.js
 */

// TODO: Import dependencies
// const User = require('../models/User');
// const jwt = require('jsonwebtoken');

// TODO: Generate JWT Token function
// const generateToken = (userId, email, role) => {
//   return jwt.sign({ userId, email, role }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN || '24h',
//   });
// };

// TODO: Register
// exports.register = async (req, res) => {
//   try {
//     // Check if user exists
//     // Create user
//     // Generate token
//     // Return response
//   } catch (error) {
//     // Error handling
//   }
// };

// TODO: Login
// exports.login = async (req, res) => {
//   try {
//     // Find user
//     // Check password
//     // Generate token
//     // Return response
//   } catch (error) {
//     // Error handling
//   }
// };

// TODO: Get Profile
// exports.getProfile = async (req, res) => {
//   try {
//     // Get user dari req.user
//     // Return user data
//   } catch (error) {
//     // Error handling
//   }
// };

// TODO: Update Profile
// exports.updateProfile = async (req, res) => {
//   try {
//     // Get user dari req.user
//     // Update fields
//     // Save user
//     // Return updated user
//   } catch (error) {
//     // Error handling
//   }
// };

