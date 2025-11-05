# 📧 Email Service Setup Guide

## ✅ **Email Service Sudah Diimplementasi!**

Email Service menggunakan **Nodemailer** untuk mengirim:
- ✅ Payment confirmation emails
- ✅ Order status updates
- ✅ Important notifications

---

## 🔧 **Setup SMTP Credentials:**

### **Option 1: Gmail (Recommended untuk Development)**

**Steps:**

1. **Enable 2-Factor Authentication:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Enter: "Health E-Commerce"
   - Click "Generate"
   - **Copy the 16-character password**

3. **Add to .env:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # App password dari step 2
SMTP_FROM="Health E-Commerce" <noreply@healthshop.com>
```

---

### **Option 2: SendGrid (Recommended untuk Production)**

1. **Sign up:**
   - Go to [SendGrid](https://sendgrid.com/)
   - Create free account (100 emails/day)

2. **Get API Key:**
   - Dashboard → Settings → API Keys
   - Create API Key with "Mail Send" permission

3. **Add to .env:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # API key
SMTP_FROM="Health E-Commerce" <noreply@healthshop.com>
```

---

### **Option 3: Mailgun**

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@yourdomain.mailgun.org
SMTP_PASS=your-mailgun-password
SMTP_FROM="Health E-Commerce" <noreply@yourdomain.com>
```

---

## 📋 **Environment Variables:**

Add to your `health-ecommerce-external-integration/finished-project/.env`:

```env
# Email Service (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Health E-Commerce" <noreply@healthshop.com>
```

---

## 🧪 **Testing Email Service:**

### **1. Test Connection:**

```javascript
// Run in node console atau create test script
const emailService = require('./services/emailService');

emailService.testConnection().then(result => {
  console.log(result);
  // Should show: { success: true, message: "Email service is ready" }
});
```

### **2. Send Test Email:**

```javascript
const emailService = require('./services/emailService');

emailService.sendPaymentConfirmation({
  orderId: 'ORDER-TEST-123',
  customerEmail: 'your-email@gmail.com',
  amount: 170000,
  items: [
    { name: 'Vitamin C', price: 85000, quantity: 2 }
  ]
}).then(result => {
  console.log(result);
});
```

### **3. Live Test (via Payment):**

1. Complete a test payment
2. Check console logs:
   ```
   💳 Payment successful, sending confirmation email...
   ✅ Email sent successfully
   ```
3. Check your inbox!

---

## 📧 **Email Templates:**

### **Payment Confirmation Email:**

**Features:**
- 🎨 Gradient header (blue)
- 📋 Order details (Order ID, Date, Status)
- 📦 Product table (name, qty, price, subtotal)
- 💰 Total amount (formatted IDR)
- ℹ️ Next steps information
- 📝 Footer dengan copyright

**Preview:**
```
┌─────────────────────────────────┐
│   🏥 Health E-Commerce          │
│   Terima kasih atas pembayaran! │
├─────────────────────────────────┤
│ Pembayaran Berhasil Dikonfirmasi│
│                                  │
│ Order ID: ORDER-1234567890      │
│ Status: PAID ✅                 │
│ Tanggal: Rabu, 5 November 2025  │
│                                  │
│ Detail Produk:                  │
│ ┌──────────┬────┬─────┬────────┐│
│ │ Produk   │Qty │Harga│Subtotal││
│ ├──────────┼────┼─────┼────────┤│
│ │Vitamin C │ 2  │85000│ 170000 ││
│ └──────────┴────┴─────┴────────┘│
│                                  │
│ Total: Rp 170.000               │
│                                  │
│ 📦 Selanjutnya:                 │
│ ✅ Pesanan diproses             │
│ 📦 Dikirim 1-2 hari kerja       │
│ 📬 Resi via email               │
└─────────────────────────────────┘
```

---

## 🛠️ **Troubleshooting:**

### **Error: "Email not sent: transporter not configured"**

**Solution:**
- Check .env file exists
- Verify SMTP_USER and SMTP_PASS are set
- Restart backend server

### **Error: "Invalid login: 535 Authentication failed"**

**Solution (Gmail):**
- Ensure 2FA is enabled
- Use App Password (NOT regular password)
- Check username is full email

### **Error: "Connection timeout"**

**Solution:**
- Check SMTP_HOST and SMTP_PORT correct
- Check firewall not blocking port 587
- Try different port (465 for secure)

### **Email Goes to Spam:**

**Solution:**
- Use real domain email (not Gmail personal)
- Set up SPF/DKIM records
- Use proper "From" header
- Avoid spam trigger words

---

## 📊 **Email Service Features:**

✅ **Automatic Sending:**
- Triggered by payment webhook
- Sent when transaction_status = 'settlement'

✅ **Professional Templates:**
- HTML emails (not plain text)
- Responsive design
- Branded headers
- Clear call-to-actions

✅ **Error Handling:**
- Graceful failures (payment still processes)
- Error logging
- Retry logic (future enhancement)

✅ **Development Mode:**
- Warnings if not configured
- Won't break app if SMTP not set
- Detailed error messages

---

## 🎯 **Next Enhancements (Optional):**

- [ ] Add email templates untuk registration
- [ ] Welcome email untuk new users
- [ ] Password reset email
- [ ] Order shipped notification
- [ ] Promotional emails
- [ ] Email preview in development
- [ ] Email queue system (Bull/Redis)

---

## ✅ **Status:**

✅ **Email Service Implemented**  
✅ **Nodemailer Configured**  
✅ **Payment Confirmation Template**  
✅ **Order Status Template**  
✅ **Webhook Integration**  
✅ **Error Handling**  

**Setup SMTP credentials di .env file untuk activate email features!**

---

**Last Updated:** November 5, 2025

