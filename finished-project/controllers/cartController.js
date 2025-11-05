/**
 * Cart Controller
 * Handle user cart operations
 */

const User = require("../models/User");
const Product = require("../models/Product");

/**
 * Get user's cart
 * GET /api/cart
 */
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'cart.product',
      select: 'name price category stock imageUrl manufacturer isActive'
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Filter out products that no longer exist or are inactive
    const validCart = user.cart.filter(item => 
      item.product && item.product.isActive
    );

    // Calculate total
    const cartTotal = validCart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    res.json({
      success: true,
      count: validCart.length,
      cartTotal,
      data: validCart.map(item => ({
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        category: item.product.category,
        stock: item.product.stock,
        imageUrl: item.product.imageUrl,
        manufacturer: item.product.manufacturer,
        quantity: item.quantity,
        addedAt: item.addedAt,
      })),
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil keranjang",
    });
  }
};

/**
 * Add item to cart
 * POST /api/cart
 */
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID required",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: "Product is not active",
      });
    }

    // Check stock
    const qty = quantity || 1;
    if (product.stock < qty) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    const user = await User.findById(req.user.id);
    
    // Check if product already in cart
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      user.cart[existingItemIndex].quantity += qty;
    } else {
      // Add new item
      user.cart.push({
        product: productId,
        quantity: qty,
        addedAt: new Date(),
      });
    }

    await user.save();

    // Populate and return cart
    await user.populate({
      path: 'cart.product',
      select: 'name price category stock imageUrl manufacturer'
    });

    res.json({
      success: true,
      message: "Product added to cart",
      data: user.cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};

/**
 * Update cart item quantity
 * PUT /api/cart/:productId
 */
exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const user = await User.findById(req.user.id);
    const cartItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Check product stock
    const product = await Product.findById(productId);
    if (product && product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${product.stock}`,
      });
    }

    user.cart[cartItemIndex].quantity = quantity;
    await user.save();

    res.json({
      success: true,
      message: "Cart updated",
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

/**
 * Remove item from cart
 * DELETE /api/cart/:productId
 */
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(
      item => item.product.toString() !== productId
    );

    await user.save();

    res.json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove product from cart",
    });
  }
};

/**
 * Clear entire cart
 * DELETE /api/cart
 */
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};

