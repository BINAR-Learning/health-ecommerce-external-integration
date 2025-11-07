/**
 * Email Service - Nodemailer Integration
 * Health E-Commerce Email Notifications
 * 
 * Purpose:
 * - Send payment confirmation emails
 * - Send order status updates
 * - Send important notifications
 */

const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = null;
    this.from = process.env.SMTP_FROM || '"Health E-Commerce" <noreply@healthshop.com>';

    // Initialize transporter
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("⚠️  SMTP credentials not set. Email features will not work.");
      console.warn("   Set SMTP_USER and SMTP_PASS in your .env file");
      return;
    }

    try {
      // Create transporter
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true' || false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false // For development
        }
      });

      console.log("✅ Email Service initialized");
    } catch (error) {
      console.error("❌ Email Service initialization failed:", error.message);
    }
  }

  /**
   * Send Payment Confirmation Email
   * @param {Object} order - Order data
   * @returns {Promise}
   */
  async sendPaymentConfirmation(order) {
    console.log("📧 Attempting to send payment confirmation email:", {
      orderId: order.orderId,
      customerEmail: order.customerEmail,
      amount: order.amount,
      hasTransporter: !!this.transporter,
    });

    if (!this.transporter) {
      console.warn("⚠️  Email not sent: transporter not configured");
      console.warn("   Set SMTP_USER and SMTP_PASS in .env file");
      console.warn("   See EMAIL_SERVICE_SETUP.md for instructions");
      return { success: false, message: "Email service not configured" };
    }

    try {
      console.log("✉️  Composing email...");

      const mailOptions = {
        from: this.from,
        to: order.customerEmail,
        subject: `✅ Payment Confirmed - Order #${order.orderId}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .info-box {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #3b82f6;
              }
              .items-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              .items-table th,
              .items-table td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
              }
              .items-table th {
                background: #f3f4f6;
                font-weight: 600;
              }
              .total {
                font-size: 24px;
                font-weight: bold;
                color: #3b82f6;
                text-align: right;
                padding: 20px 0;
              }
              .footer {
                text-align: center;
                padding: 20px;
                color: #6b7280;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0;">🏥 Health E-Commerce</h1>
              <p style="margin: 10px 0 0 0;">Terima kasih atas pembayaran Anda!</p>
            </div>
            
            <div class="content">
              <h2>Pembayaran Berhasil Dikonfirmasi</h2>
              
              <div class="info-box">
                <p><strong>Order ID:</strong> ${order.orderId}</p>
                <p><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">PAID ✅</span></p>
                <p><strong>Tanggal:</strong> ${new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>

              ${order.items && order.items.length > 0 ? `
                <h3>Detail Produk:</h3>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Produk</th>
                      <th>Qty</th>
                      <th>Harga</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${order.items.map(item => `
                      <tr>
                        <td>${item.name || 'Produk'}</td>
                        <td>${item.quantity || 1}</td>
                        <td>Rp ${(item.price || 0).toLocaleString('id-ID')}</td>
                        <td>Rp ${((item.price || 0) * (item.quantity || 1)).toLocaleString('id-ID')}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : ''}

              <div class="total">
                Total: Rp ${(order.amount || 0).toLocaleString('id-ID')}
              </div>

              <div class="info-box">
                <h3 style="margin-top: 0;">📦 Selanjutnya:</h3>
                <p>✅ Pesanan Anda sedang diproses</p>
                <p>📦 Akan dikirim dalam 1-2 hari kerja</p>
                <p>📬 Nomor resi akan dikirimkan via email</p>
              </div>

              <p style="margin-top: 30px;">
                Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami.
              </p>
            </div>

            <div class="footer">
              <p>© 2025 Health E-Commerce. All rights reserved.</p>
              <p>Email ini dikirim otomatis, mohon tidak membalas.</p>
            </div>
          </body>
          </html>
        `,
      };

      console.log("📤 Sending email via SMTP...");
      const info = await this.transporter.sendMail(mailOptions);
      
      console.log("✅ Payment confirmation email sent successfully!");
      console.log("   To:", order.customerEmail);
      console.log("   Message ID:", info.messageId);
      console.log("   Response:", info.response);
      
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Email Error:", {
        message: error.message,
        code: error.code,
        response: error.response,
        command: error.command,
      });
      
      // Provide specific error messages
      if (error.code === 'EAUTH') {
        console.error("   → Authentication failed. Check SMTP_USER and SMTP_PASS");
        console.error("   → For Gmail, use App Password (not regular password)");
      } else if (error.code === 'ECONNECTION') {
        console.error("   → Cannot connect to SMTP server");
        console.error("   → Check SMTP_HOST and SMTP_PORT");
      }
      
      return { success: false, error: error.message, code: error.code };
    }
  }

  /**
   * Send Order Status Update Email
   * @param {Object} order - Order data dengan status update
   * @returns {Promise}
   */
  async sendOrderStatusUpdate(order) {
    if (!this.transporter) {
      return { success: false, message: "Email service not configured" };
    }

    try {
      const statusMap = {
        'pending': { emoji: '⏳', text: 'Menunggu Pembayaran', color: '#f59e0b' },
        'paid': { emoji: '✅', text: 'Dibayar', color: '#10b981' },
        'processing': { emoji: '📦', text: 'Diproses', color: '#3b82f6' },
        'shipped': { emoji: '🚚', text: 'Dikirim', color: '#8b5cf6' },
        'delivered': { emoji: '🎉', text: 'Diterima', color: '#10b981' },
        'failed': { emoji: '❌', text: 'Gagal', color: '#ef4444' },
      };

      const statusInfo = statusMap[order.status] || statusMap['pending'];

      const mailOptions = {
        from: this.from,
        to: order.customerEmail,
        subject: `${statusInfo.emoji} Update Status Order #${order.orderId}`,
        html: `
          <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background: ${statusInfo.color}; color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0;">🏥 Health E-Commerce</h1>
              <p style="margin: 10px 0;">Status Update</p>
            </div>
            
            <div style="padding: 30px; background: #f9fafb;">
              <h2>Status Pesanan Diperbarui</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid ${statusInfo.color};">
                <p><strong>Order ID:</strong> ${order.orderId}</p>
                <p><strong>Status Baru:</strong> <span style="color: ${statusInfo.color}; font-weight: bold;">${statusInfo.emoji} ${statusInfo.text}</span></p>
                <p><strong>Waktu Update:</strong> ${new Date().toLocaleString('id-ID')}</p>
              </div>

              ${order.trackingNumber ? `
                <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 20px;">
                  <p style="margin: 0;"><strong>📦 Nomor Resi:</strong> ${order.trackingNumber}</p>
                </div>
              ` : ''}

              <p style="margin-top: 30px;">Terima kasih telah berbelanja di Health E-Commerce!</p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
              <p>© 2025 Health E-Commerce. All rights reserved.</p>
            </div>
          </body>
          </html>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log("✅ Order status email sent to:", order.customerEmail);
      
      return { success: true };
    } catch (error) {
      console.error("❌ Email Error:", error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Test email configuration
   * @returns {Promise}
   */
  async testConnection() {
    if (!this.transporter) {
      return { success: false, message: "Email service not configured" };
    }

    try {
      await this.transporter.verify();
      console.log("✅ Email service is ready");
      return { success: true, message: "Email service is ready" };
    } catch (error) {
      console.error("❌ Email service test failed:", error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();

