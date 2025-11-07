/**
 * Manual Webhook Test Script
 * Test webhook endpoint dengan data simulasi Midtrans
 * 
 * Usage: node test-webhook-manual.js [orderId]
 */

require('dotenv').config();
const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const ORDER_ID = process.argv[2] || `ORDER-${Date.now()}`;

async function testWebhook() {
  console.log('\n🧪 Testing Webhook Endpoint Manually\n');
  console.log('Backend URL:', BACKEND_URL);
  console.log('Order ID:', ORDER_ID);
  console.log('');

  // Simulate Midtrans webhook payload for successful payment
  const webhookPayload = {
    transaction_time: new Date().toISOString(),
    transaction_status: 'settlement',
    transaction_id: `TEST-TXN-${Date.now()}`,
    status_message: 'midtrans payment notification',
    status_code: '200',
    signature_key: '', // Optional in sandbox
    payment_type: 'credit_card',
    order_id: ORDER_ID,
    merchant_id: 'G123456789',
    gross_amount: '170000',
    fraud_status: 'accept',
    currency: 'IDR',
    settlement_time: new Date().toISOString(),
    customer_details: {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '08123456789',
      billing_address: {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        phone: '08123456789',
        address: 'Test Address',
        city: 'Jakarta',
        postal_code: '12345',
        country_code: 'IDN'
      },
      shipping_address: {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        phone: '08123456789',
        address: 'Test Address',
        city: 'Jakarta',
        postal_code: '12345',
        country_code: 'IDN'
      }
    }
  };

  console.log('📤 Sending webhook payload:');
  console.log(JSON.stringify(webhookPayload, null, 2));
  console.log('');

  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/external/payment/webhook`,
      webhookPayload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    console.log('✅ Webhook Response:');
    console.log('   Status:', response.status);
    console.log('   Data:', JSON.stringify(response.data, null, 2));
    console.log('');

    if (response.data.success) {
      console.log('✅ Webhook processed successfully!');
      console.log('   Check backend console for detailed logs.');
      console.log('   Check database to verify order status updated.');
    } else {
      console.log('⚠️  Webhook processed but with warnings:');
      console.log('   Message:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Webhook test failed!');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('   No response received. Is backend running?');
      console.error('   URL:', `${BACKEND_URL}/api/external/payment/webhook`);
    } else {
      console.error('   Error:', error.message);
    }
  }

  console.log('\n📋 Next Steps:');
  console.log('1. Check backend console for webhook logs');
  console.log('2. Check database for order status update');
  console.log('3. If order not found, check if order was created during payment');
  console.log('4. Verify orderId matches between payment and webhook');
  console.log('');
}

// Run test
testWebhook();

