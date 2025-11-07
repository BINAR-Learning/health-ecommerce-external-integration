/**
 * Order Model
 * Stores order information from Midtrans payments
 */

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "processing", "shipped", "delivered"],
      default: "pending",
      index: true,
    },
    transactionStatus: {
      type: String, // Midtrans status: settlement, pending, cancel, etc.
    },
    paymentMethod: {
      type: String, // credit_card, bank_transfer, e-wallet, etc.
    },
    customerDetails: {
      name: String,
      email: String,
      phone: String,
      address: String,
    },
    midtransData: {
      transactionId: String,
      statusCode: String,
      grossAmount: Number,
      paymentType: String,
      transactionTime: Date,
      settlementTime: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model("Order", orderSchema);

