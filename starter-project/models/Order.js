/**
 * Order Model
 * 
 * TODO untuk peserta:
 * 1. Buat schema untuk Order dengan fields:
 *    - orderId (String, required, unique)
 *    - user (ObjectId, ref: 'User', required)
 *    - items (Array of { product, name, price, quantity })
 *    - totalAmount (Number, required)
 *    - status (String, enum: ['pending', 'paid', 'failed', 'cancelled'])
 *    - customerDetails (Object dengan name, email, phone, address)
 *    - midtransData (Object untuk menyimpan data dari Midtrans)
 *    - timestamps (createdAt, updatedAt)
 * 
 * 2. Tambahkan indexes untuk:
 *    - user + createdAt (untuk query order history)
 *    - orderId (untuk query by orderId)
 *    - status (untuk filter by status)
 * 
 * 3. Export model: module.exports = mongoose.model('Order', orderSchema)
 * 
 * Reference: ../finished-project/models/Order.js
 */

const mongoose = require('mongoose');

// TODO: Buat orderSchema di sini
// const orderSchema = new mongoose.Schema({...}, { timestamps: true });

// TODO: Tambahkan indexes
// orderSchema.index({ user: 1, createdAt: -1 });

// TODO: Export model
// module.exports = mongoose.model('Order', orderSchema);

