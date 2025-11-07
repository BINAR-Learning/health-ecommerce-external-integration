# Health E-Commerce: ULTIMATE Backend (Complete)

> **THE COMPLETE BACKEND - Production-Ready dengan ALL Features dari Modul 1-6**  
> **Use this for ALL Frontend & Common Modules!**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-brightgreen)](https://www.mongodb.com/)
[![AI](https://img.shields.io/badge/Google-Gemini_AI-orange)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

**Complete implementation** Health E-Commerce backend dengan integrasi Google Gemini AI, Kemenkes API, Midtrans Payment Gateway, Cloudinary Image Upload, Shopping Cart, Order Management, dan Email Service.

---

## Complete Features

### From Modul 1-2: Database Layer
- **Product Model** - Complete dengan validations
- **User Model** - Dengan bcrypt hashing, cart, profilePhoto
- **Order Model** - Order tracking dengan status
- **MongoDB Integration** - Ready to use

### From Modul 3: REST API
- **CRUD Products** - GET, POST, PUT, DELETE dengan filtering & search
- **Middleware System** - CORS, logging, error handling
- **Query Support** - Filter by category, price range, search, pagination

### From Modul 4: Security & Authentication
- **JWT Authentication** - Register, login, protected routes
- **RBAC** - Admin vs User role-based access
- **Password Hashing** - Bcrypt dengan salt rounds 10
- **Security Headers** - Helmet, rate limiting, sanitization

### From Modul 5: External Integrations
- **AI Chatbot** - Google Gemini untuk health recommendations (with caching!)
- **Kemenkes API** - Official government health data
- **Midtrans Payment** - Payment gateway dengan webhook handling
- **Email Service** - Auto-send payment confirmations

### From Modul 6: Advanced Features
- **Shopping Cart API** - User-specific cart dengan database sync
- **Order Management** - Order history, order detail, status tracking
- **Cloudinary Integration** - Product images & profile photos
- **Image Upload** - Multer + Cloudinary dengan optimization

---

## Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Setup Environment Variables

```bash
# Copy .env.example (jika ada) atau buat .env baru
# Windows PowerShell:
Copy-Item .env.example .env

# Mac/Linux:
cp .env.example .env
```

**Edit file `.env`:**

```env
# === Server Configuration ===
NODE_ENV=development
PORT=5000

# === Database ===
MONGODB_URI=mongodb://localhost:27017/health-ecommerce

# === JWT ===
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# === Google Gemini AI ===
GOOGLE_AI_API_KEY=AIza...your-key-here

# === Kemenkes API (Optional) ===
KEMENKES_API_URL=https://api-satusehat-dev.dto.kemkes.go.id/fhir-r4/v1
KEMENKES_API_KEY=your-kemenkes-key

# === Midtrans Payment ===
MIDTRANS_SERVER_KEY=SB-Mid-server-...
MIDTRANS_CLIENT_KEY=SB-Mid-client-...
MIDTRANS_IS_PRODUCTION=false

# === Cloudinary (Image Upload) ===
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# === Email Service (Optional) ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Step 3: Start MongoDB

```bash
# Check apakah MongoDB running
mongosh

# Jika belum, start MongoDB:
# Windows: Services → Start "MongoDB Server"
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Step 4: Seed Database

```bash
npm run seed
```

**Seeder akan membuat:**
- **37 Products** (Vitamins, Supplements, Medicines, Medical Equipment)
- **17 Users** (2 Admin, 15 Regular Users)

**Test Users:**
- **Admin:** `aiman@example.com` / `Aiman123!`
- **User:** `aila@example.com` / `Aila123!`

### Step 5: Start Server

```bash
npm run dev
```

**Server akan running di:** `http://localhost:5000`

**API Documentation (Swagger):** `http://localhost:5000/api-docs`

---

## Project Structure

```
finished-project/
├── README.md                    # Dokumentasi lengkap
├── package.json                 # Dependencies & scripts
├── .env.example                 # Template environment variables
├── server.js                    # Complete server setup
│
├── config/
│   ├── database.js             # MongoDB connection
│   ├── cloudinary.js           # Cloudinary configuration
│   └── swagger.js              # API documentation
│
├── controllers/
│   ├── aiController.js         # AI chatbot controller
│   ├── authController.js      # Authentication controller
│   ├── cartController.js       # Cart management controller
│   ├── orderController.js      # Order management controller
│   ├── productController.js   # Product CRUD controller
│   └── uploadController.js     # Image upload controller
│
├── middleware/
│   ├── auth.js                 # JWT authentication
│   └── authorize.js           # RBAC authorization
│
├── models/
│   ├── Product.js              # Product schema
│   ├── User.js                 # User schema (dengan cart & profilePhoto)
│   └── Order.js                # Order schema
│
├── routes/
│   ├── authRoutes.js          # Authentication routes
│   ├── cartRoutes.js           # Cart routes
│   ├── externalRoutes.js       # External integrations routes
│   ├── orderRoutes.js          # Order routes
│   ├── productRoutes.js        # Product routes
│   └── uploadRoutes.js         # Upload routes
│
├── services/
│   ├── aiService.js           # Google Gemini (with caching!)
│   ├── emailService.js         # Email notifications
│   ├── kemenkesService.js      # Kemenkes API (with FHIR transform)
│   └── midtransService.js     # Payment gateway (with webhook)
│
├── scripts/
│   ├── seed.js                # Database seeder
│   ├── seedVitamins.js        # Vitamins seeder
│   └── listModels.js         # Model lister
│
└── test-*.js                  # Test scripts (webhook, email)
```

---

## Complete API Endpoints

### Authentication

```
POST   /api/auth/register      # Register user
POST   /api/auth/login         # Login & get JWT
GET    /api/auth/profile       # Get user profile (Protected)
PUT    /api/auth/profile       # Update user profile (Protected)
```

### Products

```
GET    /api/products           # Get all products (with filters, pagination)
GET    /api/products/:id      # Get product by ID
POST   /api/products           # Create product (Admin only)
PUT    /api/products/:id       # Update product (Admin only)
DELETE /api/products/:id       # Delete product (Admin only)
```

### Cart

```
GET    /api/cart               # Get user's cart (Protected)
POST   /api/cart               # Add item to cart (Protected)
PUT    /api/cart/:productId    # Update cart item quantity (Protected)
DELETE /api/cart/:productId    # Remove item from cart (Protected)
```

### Orders

```
GET    /api/orders             # Get order history (Protected, with pagination)
GET    /api/orders/:orderId    # Get order detail (Protected)
```

### Upload

```
POST   /api/upload/product     # Upload product image (Admin only)
POST   /api/upload/profile     # Upload profile photo (Protected)
DELETE /api/upload/:publicId   # Delete image (Protected)
```

### External Integrations

```
POST   /api/external/ai/chat              # AI chatbot (Protected)
GET    /api/external/kemenkes/medications # Kemenkes data (Protected)
POST   /api/external/kemenkes/sync        # Sync to DB (Admin only)
POST   /api/external/payment/create       # Create payment (Protected)
POST   /api/external/payment/webhook      # Payment callback (Public)
```

**Total: 25+ endpoints** - Complete Health E-Commerce API!

**Full API Documentation:** `http://localhost:5000/api-docs`

---

## Key Features Implementation

### 1. Authentication System

**File:** `controllers/authController.js`, `routes/authRoutes.js`

**Features:**
- JWT token generation & verification
- Password hashing dengan bcrypt
- Protected routes dengan middleware
- Role-based access control (Admin/User)
- Profile management

**Example Usage:**

```javascript
// Register
POST /api/auth/register
Body: { name, email, password, phone, address }

// Login
POST /api/auth/login
Body: { email, password }
Response: { success: true, token: "..." }

// Get Profile (Protected)
GET /api/auth/profile
Headers: { Authorization: "Bearer <token>" }
```

### 2. Shopping Cart API

**File:** `controllers/cartController.js`, `routes/cartRoutes.js`

**Features:**
- User-specific cart (stored in database)
- Add/Remove/Update cart items
- Cart sync dengan frontend
- Backward compatibility (handles users without cart field)

**Example Usage:**

```javascript
// Get Cart
GET /api/cart
Headers: { Authorization: "Bearer <token>" }

// Add to Cart
POST /api/cart
Body: { productId: "...", quantity: 2 }
Headers: { Authorization: "Bearer <token>" }

// Update Quantity
PUT /api/cart/:productId
Body: { quantity: 3 }
Headers: { Authorization: "Bearer <token>" }

// Remove from Cart
DELETE /api/cart/:productId
Headers: { Authorization: "Bearer <token>" }
```

### 3. Order Management

**File:** `controllers/orderController.js`, `routes/orderRoutes.js`, `models/Order.js`

**Features:**
- Order creation saat payment
- Order history dengan pagination
- Order detail dengan product info
- Status tracking (pending, paid, failed, cancelled)
- Midtrans transaction data storage

**Example Usage:**

```javascript
// Get Order History
GET /api/orders?page=1&limit=10&status=paid
Headers: { Authorization: "Bearer <token>" }

// Get Order Detail
GET /api/orders/ORDER-1234567890
Headers: { Authorization: "Bearer <token>" }
```

### 4. Cloudinary Image Upload

**File:** `controllers/uploadController.js`, `routes/uploadRoutes.js`, `config/cloudinary.js`

**Features:**
- Product image upload (Admin only)
- Profile photo upload (User)
- Image optimization (auto resize, quality)
- Image deletion
- Multer + Cloudinary integration

**Example Usage:**

```javascript
// Upload Product Image
POST /api/upload/product
Headers: { Authorization: "Bearer <admin-token>" }
Body: FormData { image: <file> }

// Upload Profile Photo
POST /api/upload/profile
Headers: { Authorization: "Bearer <token>" }
Body: FormData { image: <file> }

// Delete Image
DELETE /api/upload/:publicId
Headers: { Authorization: "Bearer <token>" }
```

### 5. AI Chatbot (Google Gemini)

**File:** `services/aiService.js`, `controllers/aiController.js`

**Features:**
- Context-aware prompts dengan product database
- Response parsing & product extraction
- Caching (reduce costs!)
- Error handling & fallbacks
- Rate limiting (10 requests/15min)

**Example Usage:**

```javascript
POST /api/external/ai/chat
Headers: { Authorization: "Bearer <token>" }
Body: { message: "Vitamin apa yang bagus untuk imun tubuh?" }

Response: {
  success: true,
  message: "Untuk meningkatkan daya tahan tubuh...",
  products: [
    { _id: "...", name: "Vitamin C 1000mg", price: 85000 }
  ]
}
```

### 6. Midtrans Payment Gateway

**File:** `services/midtransService.js`, `routes/externalRoutes.js`

**Features:**
- Snap API integration
- Webhook handling
- Signature verification (SHA512)
- Transaction status parsing
- Order status updates
- Email notifications

**Payment Flow:**

1. Frontend calls `POST /api/external/payment/create`
2. Backend creates order in database (status: "pending")
3. Backend creates Midtrans transaction
4. Returns `paymentUrl` to frontend
5. User completes payment at Midtrans
6. Midtrans sends webhook to `POST /api/external/payment/webhook`
7. Backend updates order status (pending → paid)
8. Backend sends confirmation email

**Webhook Debugging:**

```bash
# Test webhook manually
node test-webhook-manual.js ORDER-xxx
```

**See:** `WEBHOOK_DEBUG_GUIDE.md` untuk detail lengkap.

### 7. Email Service (Nodemailer)

**File:** `services/emailService.js`

**Features:**
- Payment confirmation emails
- SMTP configuration (Gmail, SendGrid, dll)
- HTML email templates
- Error handling & logging

**Example Usage:**

```javascript
// Automatically called when payment successful
await emailService.sendPaymentConfirmation({
  orderId: "ORDER-123",
  customerEmail: "user@example.com",
  amount: 170000,
  items: [...]
});
```

**See:** `EMAIL_SERVICE_SETUP.md` untuk setup lengkap.

---

## Testing

### Health Check

```bash
curl http://localhost:5000/health
```

### Test Authentication

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123!","phone":"08123456789"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aila@example.com","password":"Aila123!"}'

# Save the token!
```

### Test AI Chatbot

```bash
curl -X POST http://localhost:5000/api/external/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"message":"Vitamin apa yang bagus untuk imun tubuh?"}'
```

### Test Webhook

```bash
# Manual webhook test
node test-webhook-manual.js ORDER-xxx
```

### Test Email

```bash
# Direct email test
node test-email-direct.js
```

---

## Troubleshooting

###  "MongoDB connection failed"

**Solution:**
```bash
# Check MongoDB running
mongosh

# Start MongoDB:
# Windows: Services → MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

###  "GOOGLE_AI_API_KEY not set"

**Solution:**
1. Get API key: https://ai.google.dev/
2. Add to `.env`: `GOOGLE_AI_API_KEY=AIza...`
3. Restart server

###  "Webhook tidak update status"

**Problem:** Midtrans Sandbox tidak bisa reach `localhost`

**Solution:**
1. Use ngrok: `ngrok http 5000`
2. Set webhook URL di Midtrans dashboard ke ngrok URL
3. Or test manual: `node test-webhook-manual.js ORDER-xxx`

**See:** `WEBHOOK_DEBUG_GUIDE.md` untuk detail lengkap.

###  "Email tidak terkirim"

**Solution:**
1. Check SMTP credentials di `.env`
2. For Gmail: Use App Password (not regular password)
3. Test email: `node test-email-direct.js`

**See:** `EMAIL_SERVICE_SETUP.md` untuk detail lengkap.

###  "User not found" di cart operations

**Solution:**
- Middleware sudah handle `req.user.id` dari JWT
- Pastikan token valid dan user exists
- Check `middleware/auth.js`

---

## Documentation Files

- **WEBHOOK_DEBUG_GUIDE.md** - Complete webhook debugging guide
- **EMAIL_SERVICE_SETUP.md** - Email service setup & troubleshooting
- **QUICK_EMAIL_FIX.md** - Quick fixes untuk email issues
- **RESTART_SERVER_GUIDE.md** - Server restart instructions

---

## Deployment

### Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Heroku

```bash
heroku create health-ecommerce-api
git push heroku main
heroku config:set MONGODB_URI=...
heroku config:set JWT_SECRET=...
```

---

## Best Practices Implemented

1. **Environment Variables** - All secrets in `.env`
2. **Error Handling** - Try-catch di semua async functions
3. **Rate Limiting** - Prevent API abuse
4. **Caching** - Reduce external API costs
5. **Retry Logic** - Exponential backoff untuk failures
6. **Logging** - Comprehensive logs untuk debugging
7. **Security** - Signature verification, JWT, RBAC
8. **Validation** - Input validation di semua endpoints
9. **Database Indexing** - Optimized queries
10. **Image Optimization** - Auto resize & quality

---

## Support

**Questions?** Open issue di GitHub

**Bugs?** Create bug report dengan error logs

**Improvements?** Submit pull request!

---

**Congratulations!**

Kamu sekarang punya **complete production-ready backend** dengan:

- Full authentication system
- Shopping cart management
- Real payment processing
- AI-powered recommendations
- Image upload & management
- Order tracking
- Email notifications

**Next:** Build React frontend untuk consume API ini!

---

**Repository Info:**

- **Name:** `health-ecommerce-external-integration/finished-project`
- **Type:** Finished/Reference Implementation
- **Starter Version:** `health-ecommerce-external-integration/starter-project`

**Happy Coding!**

_Modul 1-6 - Complete Backend Implementation_  
_Health E-Commerce Backend Series_
