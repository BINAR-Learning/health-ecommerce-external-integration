/**
 * Order Controller
 * Handle order operations
 */

const Order = require("../models/Order");
const Product = require("../models/Product");

/**
 * Get user's order history
 * GET /api/orders
 */
exports.getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    // Build query
    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get orders with pagination
    const orders = await Order.find(query)
      .populate({
        path: 'items.product',
        select: 'name price category imageUrl manufacturer'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: orders,
    });
  } catch (error) {
    console.error("❌ Get order history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order history",
      error: error.message,
    });
  }
};

/**
 * Get single order by ID
 * GET /api/orders/:orderId
 */
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findOne({
      orderId: orderId,
      user: userId,
    }).populate({
      path: 'items.product',
      select: 'name price category imageUrl manufacturer description'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("❌ Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

