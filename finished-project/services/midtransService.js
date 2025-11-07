/**
 * Midtrans Payment Service
 * Payment gateway integration untuk Health E-Commerce
 */

const axios = require("axios");
const crypto = require("crypto");

class MidtransService {
  constructor() {
    this.serverKey = process.env.MIDTRANS_SERVER_KEY;
    this.clientKey = process.env.MIDTRANS_CLIENT_KEY;
    this.isProduction = process.env.NODE_ENV === "production";
    this.snapURL = this.isProduction
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    if (!this.serverKey) {
      console.warn("⚠️  MIDTRANS_SERVER_KEY not set. Payment features will not work.");
    } else {
      console.log(`✅ Midtrans initialized (${this.isProduction ? 'Production' : 'Sandbox'})`);
    }
  }

  async createTransaction(orderData) {
    try {
      if (!this.serverKey) {
        throw new Error("MIDTRANS_SERVER_KEY is not configured.");
      }

      if (!orderData.orderId || !orderData.items || orderData.items.length === 0) {
        throw new Error("Missing required fields: orderId or items");
      }

      // Map and validate items
      const itemDetails = orderData.items.map((item, index) => {
        const itemPrice = typeof item.price === 'number' ? item.price : parseInt(item.price) || 0;
        const itemQuantity = item.quantity || 1;
        
        if (!item.name) {
          throw new Error(`Item at index ${index} is missing name`);
        }
        
        if (itemPrice <= 0) {
          throw new Error(`Item "${item.name}" has invalid price: ${item.price}`);
        }

        return {
          id: String(item.id || item._id || `item-${index}`),
          price: itemPrice,
          quantity: itemQuantity,
          name: item.name,
        };
      });

      // Calculate exact gross_amount from items (MUST match for Midtrans)
      const grossAmount = itemDetails.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      console.log(`💰 Calculated gross_amount: ${grossAmount} from ${itemDetails.length} items`);

      if (grossAmount <= 0 || isNaN(grossAmount)) {
        throw new Error(`Invalid gross_amount: ${grossAmount}`);
      }

      // Determine callback URLs based on environment
      const baseURL = this.isProduction 
        ? process.env.FRONTEND_URL || 'https://yourdomain.com'
        : 'http://localhost:3000';

      const parameter = {
        transaction_details: {
          order_id: String(orderData.orderId),
          gross_amount: grossAmount, // Must be exact number
        },
        customer_details: {
          first_name: orderData.customerName || "Customer",
          email: orderData.customerEmail || "customer@example.com",
          phone: orderData.customerPhone || "",
        },
        item_details: itemDetails,
        callbacks: {
          finish: `${baseURL}/order-success?order_id=${orderData.orderId}`,
          error: `${baseURL}/checkout?error=payment_failed`,
          pending: `${baseURL}/order-success?order_id=${orderData.orderId}&status=pending`,
        },
      };

      const authString = Buffer.from(`${this.serverKey}:`).toString("base64");

      console.log('📤 Sending to Midtrans:', {
        orderId: parameter.transaction_details.order_id,
        grossAmount: parameter.transaction_details.gross_amount,
        grossAmountType: typeof parameter.transaction_details.gross_amount,
        itemsCount: parameter.item_details.length,
      });

      const response = await axios.post(this.snapURL, parameter, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Basic ${authString}`,
        },
        timeout: 30000,
      });

      if (!response.data || !response.data.token) {
        throw new Error("Invalid response from Midtrans: missing token");
      }

      console.log('✅ Payment created successfully');

      return {
        success: true,
        token: response.data.token,
        redirectUrl: response.data.redirect_url,
        paymentUrl: response.data.redirect_url,
      };
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        console.error("❌ Midtrans API Error:", {
          status: error.response.status,
          errors: errorData.error_messages || errorData,
        });

        if (error.response.status === 401) {
          return {
            success: false,
            message: "Midtrans authentication failed. Check SERVER_KEY in .env",
          };
        }

        return {
          success: false,
          message: errorData.error_messages?.[0] || "Payment creation failed",
          error: errorData.error_messages || errorData,
        };
      }

      console.error("❌ Midtrans Error:", error.message);
      return {
        success: false,
        message: error.message || "Payment creation failed",
      };
    }
  }

  verifySignatureKey(orderId, statusCode, grossAmount, serverKey) {
    if (!serverKey) return null;
    const signatureString = `${orderId}${statusCode}${grossAmount}${serverKey}`;
    return crypto.createHash("sha512").update(signatureString).digest("hex");
  }

  handleNotification(notification) {
    console.log("📥 Webhook Notification:", {
      orderId: notification.order_id,
      status: notification.transaction_status,
      hasSignature: !!notification.signature_key,
    });

    // Verify signature if provided
    if (notification.signature_key) {
      const hash = this.verifySignatureKey(
        notification.order_id,
        notification.status_code,
        notification.gross_amount,
        this.serverKey
      );

      if (hash !== notification.signature_key) {
        console.warn("❌ Invalid signature");
        return {
          success: false,
          message: "Invalid signature",
        };
      }
      console.log("✅ Signature verified");
    } else {
      console.warn("⚠️  No signature - skipping verification (normal for sandbox)");
    }

    // Map status
    let orderStatus;
    switch (notification.transaction_status) {
      case 'settlement':
      case 'capture':
        orderStatus = 'paid';
        break;
      case 'pending':
        orderStatus = 'pending';
        break;
      default:
        orderStatus = 'failed';
    }

    return {
      success: true,
      status: orderStatus,
      orderId: notification.order_id,
      transactionStatus: notification.transaction_status,
      grossAmount: notification.gross_amount,
    };
  }
}

module.exports = new MidtransService();
