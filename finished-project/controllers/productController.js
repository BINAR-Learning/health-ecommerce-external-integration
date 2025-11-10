const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// Get All Products with Pagination
exports.getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, page, limit, sort } = req.query;

    // Build query
    let query = { isActive: true };

    // Filter by category
    if (category && category !== "All") {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 12;
    const skip = (pageNumber - 1) * limitNumber;

    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'name-asc') sortOption = { name: 1 };
    if (sort === 'name-desc') sortOption = { name: -1 };

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query);

    // Fetch products dengan pagination
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    res.json({
      success: true,
      count: products.length,
      total: totalProducts,
      page: pageNumber,
      totalPages: Math.ceil(totalProducts / limitNumber),
      limit: limitNumber,
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil produk",
    });
  }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil produk",
    });
  }
};

// Create Product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    // Extract product data from req.body
    const productData = { ...req.body };
    
    // Handle image upload if file exists
    if (req.file) {
      productData.image = req.file.path; // Cloudinary URL
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Produk berhasil dibuat",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal membuat produk",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update Product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    // Extract update data
    const updateData = { ...req.body };
    
    // Handle image upload if file exists
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (product.image && product.image.includes('cloudinary')) {
        try {
          const urlParts = product.image.split('/');
          const publicIdWithExt = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExt.split('.')[0];
          const folderPath = `health-ecommerce/products/${publicId}`;
          await cloudinary.uploader.destroy(folderPath);
        } catch (err) {
          console.warn("Failed to delete old product image:", err.message);
        }
      }
      updateData.image = req.file.path; // New Cloudinary URL
    }

    // Update product
    Object.assign(product, updateData);
    await product.save();

    res.json({
      success: true,
      message: "Produk berhasil diupdate",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengupdate produk",
    });
  }
};

// Delete Product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Produk berhasil dihapus",
      data: {},
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus produk",
    });
  }
};

