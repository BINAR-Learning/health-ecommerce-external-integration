/**
 * Manual Webhook Test Script
 * Simulate Midtrans webhook notification untuk test email service
 * 
 * Usage: node test-webhook.js
 */

require('dotenv').config();
const axios = require('axios');

async function testWebhook() {
  const webhookData = {
    transaction_status: "settlement",
    order_id: "ORDER-TEST-" + Date.now(),
    gross_amount: "170000",
    status_code: "200",
    payment_type: "credit_card",
    transaction_time: new Date().toISOString(),
    transaction_id: "test-" + Date.now(),
    customer_details: {
      email: process.env.TEST_EMAIL || "customer@example.com",
      first_name: "Test Customer",
    },
    // signature_key not included (sandbox testing)
  };

  console.log('\n🧪 Testing Webhook Endpoint\n');
  console.log('📤 Sending webhook notification:', {
    orderId: webhookData.order_id,
    status: webhookData.transaction_status,
    email: webhookData.customer_details.email,
  });

  try {
    const response = await axios.post(
      'http://localhost:5000/api/external/payment/webhook',
      webhookData,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    console.log('\n✅ Webhook Response:', {
      status: response.status,
      data: response.data,
    });

    if (response.data.success) {
      console.log('\n✅ Success! Check backend console for email logs.');
      console.log('📧 Email should be sent to:', webhookData.customer_details.email);
      console.log('\nBackend Console should show:');
      console.log('  - 🔔 Webhook received from Midtrans');
      console.log('  - 💳 Payment successful, sending confirmation email...');
      console.log('  - ✅ Email sent successfully to: xxx@email.com');
      console.log('\nIf no email logs, check:');
      console.log('  - SMTP credentials in .env');
      console.log('  - Email Service initialization');
    } else {
      console.log('\n❌ Webhook processing failed:', response.data.message);
    }

  } catch (error) {
    console.error('\n❌ Error testing webhook:', {
      message: error.message,
      response: error.response?.data,
    });
  }

  console.log('\n' + '='.repeat(60));
}

// Run test
testWebhook();

