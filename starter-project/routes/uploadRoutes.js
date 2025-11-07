/**
 * Upload Routes
 * 
 * TODO untuk peserta:
 * 1. Import express router
 * 2. Import multer dan CloudinaryStorage
 * 3. Import cloudinary config
 * 4. Import uploadController
 * 5. Import middleware (authenticateToken, authorizeRole)
 * 6. Setup multer storage untuk product images dan profile photos
 * 7. Create routes:
 *    - POST /product - Upload product image (Admin only)
 *    - POST /profile - Upload profile photo (Protected)
 *    - DELETE /:publicId - Delete image (Protected)
 * 
 * Reference: ../finished-project/routes/uploadRoutes.js
 */

const express = require('express');
const router = express.Router();

// TODO: Import dependencies
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('../config/cloudinary');
// const uploadController = require('../controllers/uploadController');
// const { authenticateToken } = require('../middleware/auth');
// const { authorizeRole } = require('../middleware/authorize');

// TODO: Setup Cloudinary Storage untuk Product Images
// const productStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'health-ecommerce/products',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
//   },
// });

// TODO: Setup Cloudinary Storage untuk Profile Photos
// const profileStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'health-ecommerce/profiles',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
//   },
// });

// TODO: Setup Multer middleware
// const uploadProduct = multer({ storage: productStorage });
// const uploadProfile = multer({ storage: profileStorage });

// TODO: POST /product - Upload product image (Admin only)
// router.post('/product', authenticateToken, authorizeRole('admin'), uploadProduct.single('image'), uploadController.uploadProductImage);

// TODO: POST /profile - Upload profile photo (Protected)
// router.post('/profile', authenticateToken, uploadProfile.single('image'), uploadController.uploadProfilePhoto);

// TODO: DELETE /:publicId - Delete image (Protected)
// router.delete('/:publicId', authenticateToken, uploadController.deleteImage);

module.exports = router;

