/**
 * Cart Routes
 * 
 * TODO untuk peserta:
 * 1. Import express router
 * 2. Import cartController
 * 3. Import middleware (authenticateToken)
 * 4. Create routes:
 *    - GET / - Get user's cart (Protected)
 *    - POST / - Add item to cart (Protected)
 *    - PUT /:productId - Update cart item quantity (Protected)
 *    - DELETE /:productId - Remove item from cart (Protected)
 * 
 * Reference: ../finished-project/routes/cartRoutes.js
 */

const express = require('express');
const router = express.Router();

// TODO: Import controller
// const cartController = require('../controllers/cartController');

// TODO: Import middleware
// const { authenticateToken } = require('../middleware/auth');

// TODO: GET / - Get cart
// router.get('/', authenticateToken, cartController.getCart);

// TODO: POST / - Add to cart
// router.post('/', authenticateToken, cartController.addToCart);

// TODO: PUT /:productId - Update quantity
// router.put('/:productId', authenticateToken, cartController.updateCartItem);

// TODO: DELETE /:productId - Remove from cart
// router.delete('/:productId', authenticateToken, cartController.removeFromCart);

module.exports = router;

