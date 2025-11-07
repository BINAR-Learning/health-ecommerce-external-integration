/**
 * Product Routes
 * 
 * TODO untuk peserta:
 * 1. Import express router
 * 2. Import productController
 * 3. Import middleware (authenticateToken, authorizeRole)
 * 4. Create routes:
 *    - GET / - Get all products (with filters, pagination)
 *    - GET /:id - Get product by ID
 *    - POST / - Create product (Admin only)
 *    - PUT /:id - Update product (Admin only)
 *    - DELETE /:id - Delete product (Admin only)
 * 
 * Reference: ../finished-project/routes/productRoutes.js
 */

const express = require('express');
const router = express.Router();

// TODO: Import controller
// const productController = require('../controllers/productController');

// TODO: Import middleware
// const { authenticateToken } = require('../middleware/auth');
// const { authorizeRole } = require('../middleware/authorize');

// TODO: GET / - Get products
// router.get('/', productController.getProducts);

// TODO: GET /:id - Get product by ID
// router.get('/:id', productController.getProductById);

// TODO: POST / - Create product (Admin only)
// router.post('/', authenticateToken, authorizeRole('admin'), productController.createProduct);

// TODO: PUT /:id - Update product (Admin only)
// router.put('/:id', authenticateToken, authorizeRole('admin'), productController.updateProduct);

// TODO: DELETE /:id - Delete product (Admin only)
// router.delete('/:id', authenticateToken, authorizeRole('admin'), productController.deleteProduct);

module.exports = router;

