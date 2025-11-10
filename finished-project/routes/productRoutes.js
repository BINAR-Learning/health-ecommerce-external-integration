const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const productController = require("../controllers/productController");
const { authenticateToken } = require("../middleware/auth");
const { authorizeRole } = require("../middleware/authorize");

// Cloudinary Storage untuk Product Images
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "health-ecommerce/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
  },
});

// Multer middleware untuk product images
const uploadProduct = multer({
  storage: productStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with optional filtering
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Vitamin, Supplement, Medical Equipment, Medicine, Other]
 *         description: Filter by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name or description
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 12
 *         description: Items per page (default 12)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price-asc, price-desc, name-asc, name-desc, newest]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 12
 *                 total:
 *                   type: number
 *                   example: 37
 *                 page:
 *                   type: number
 *                   example: 1
 *                 totalPages:
 *                   type: number
 *                   example: 4
 *                 limit:
 *                   type: number
 *                   example: 12
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */
router.get("/", productController.getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get("/:id", productController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Vitamin C 1000mg"
 *               category:
 *                 type: string
 *                 enum: [Vitamin, Supplement, Medical Equipment, Medicine, Other]
 *                 example: "Vitamin"
 *               price:
 *                 type: number
 *                 example: 85000
 *               stock:
 *                 type: number
 *                 example: 50
 *               description:
 *                 type: string
 *                 example: "Suplemen vitamin C untuk meningkatkan daya tahan tubuh"
 *               manufacturer:
 *                 type: string
 *                 example: "PT Sehat Sejahtera"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product image (JPG, PNG, WEBP). Max 5MB. Optional.
 *     responses:
 *       201:
 *         description: Product created successfully
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
 *                   example: "Produk berhasil dibuat"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized (no token)
 *       403:
 *         description: Forbidden (not admin or invalid token)
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  uploadProduct.single("image"),
  productController.createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product by ID (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Vitamin C 1000mg Updated"
 *               category:
 *                 type: string
 *                 enum: [Vitamin, Supplement, Medical Equipment, Medicine, Other]
 *               price:
 *                 type: number
 *                 example: 90000
 *               stock:
 *                 type: number
 *                 example: 60
 *               description:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product image (JPG, PNG, WEBP). Max 5MB. Optional. Old image will be deleted if new one is uploaded.
 *     responses:
 *       200:
 *         description: Product updated successfully
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
 *                   example: "Produk berhasil diupdate"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  uploadProduct.single("image"),
  productController.updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product by ID (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
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
 *                   example: "Produk berhasil dihapus"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  productController.deleteProduct
);

module.exports = router;

