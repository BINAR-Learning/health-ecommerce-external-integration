# 🤖 Health E-Commerce: AI Integration (Starter)
> **Backend API dengan Google Gemini AI, Kemenkes API & Midtrans Payment**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-brightgreen)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

Starter template untuk integrasikan AI chatbot, government API, dan payment gateway ke Health E-Commerce backend.

---

## 📦 Apa yang Ada di Repo Ini?

Repository ini adalah **starter project** dengan struktur siap pakai dan TODO comments untuk kamu lengkapi.

**Apa yang akan kamu bangun:**
- 🤖 **AI Chatbot** dengan Google Gemini untuk rekomendasi produk kesehatan
- 🏥 **Kemenkes API** - Sync data produk kesehatan resmi pemerintah
- 💳 **Midtrans Payment** - Payment gateway dengan 20+ metode pembayaran
- 🔔 **Webhooks** - Handle real-time payment notifications
- 📧 **Email Notifications** - Auto-send payment confirmations
- ⚡ **Rate Limiting & Retry** - Production-grade resilience

---

## 🚀 Quick Start (Untuk Newbie)

### Step 1: Clone Repository

```bash
# Clone repository ini
git clone https://github.com/your-username/health-ecommerce-ai-integration.git

# Masuk ke folder project
cd health-ecommerce-ai-integration
```

### Step 2: Install Dependencies

```bash
# Install semua package yang dibutuhkan
npm install

# Tunggu sampai selesai (biasanya 1-2 menit)
```

### Step 3: Setup Database

**Pastikan MongoDB sudah running:**

```bash
# Check apakah MongoDB running
mongosh

# Jika belum running, start MongoDB:
# Windows: Buka "Services" → Start "MongoDB Server"
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Create database:**

```bash
# Di mongosh terminal:
use health-ecommerce
db.products.insertOne({
  name: "Sample Product",
  price: 50000,
  category: "Vitamin"
})
exit
```

**Atau gunakan seeder (lebih mudah):**

```bash
# Jalankan seeder untuk membuat products dan users lengkap
npm run seed
```

**Seeder akan membuat:**

- ✅ **37 Products** - Lengkap dengan berbagai kategori:
  - 9 Vitamins (Vitamin C, D3, B Complex, Multivitamin, dll)
  - 8 Supplements (Omega-3, Probiotik, Collagen, Magnesium, dll)
  - 8 Medicines (Paracetamol, Amoxicillin, Ibuprofen, dll)
  - 10 Medical Equipment (Thermometer, BP Monitor, Nebulizer, dll)

- ✅ **17 Users** - Siap untuk login testing:
  - **2 Admin Users**:
    - `aiman@example.com` / `Aiman123!`
    - `admin@healthstore.com` / `Admin123!`
  - **15 Regular Users**:
    - `aila@example.com` / `Aila123!`
    - `user@example.com` / `User123!`
    - `budi@example.com` / `Budi123!`
    - ... dan lainnya

**💡 Tips:**
- Seeder akan **clear existing data** terlebih dahulu
- Password sudah di-hash dengan bcrypt (aman)
- Semua users memiliki phone dan address lengkap
- Gunakan kredensial ini untuk testing login/authentication

**Alternatif Seeder:**

```bash
# Seed hanya vitamins saja (tanpa clear data)
npm run seed:vitamins
```

### Step 4: Setup Environment Variables

```bash
# Copy file .env.example jadi .env
cp .env.example .env

# Windows (PowerShell):
Copy-Item .env.example .env
```

**Edit file `.env` dengan text editor:**

```env
# Database (dari module sebelumnya)
MONGODB_URI=mongodb://localhost:27017/health-ecommerce
JWT_SECRET=your-super-secret-key-change-this

# Google Gemini AI (GRATIS!)
# Dapatkan di: https://ai.google.dev/
GOOGLE_AI_API_KEY=your-api-key-here

# Kemenkes API (Optional untuk testing)
KEMENKES_API_URL=https://api-satusehat-dev.dto.kemkes.go.id/fhir-r4/v1
KEMENKES_API_KEY=your-kemenkes-key

# Midtrans Payment (Sandbox - GRATIS!)
# Dapatkan di: https://dashboard.sandbox.midtrans.com/
MIDTRANS_SERVER_KEY=your-server-key-here
MIDTRANS_CLIENT_KEY=your-client-key-here
MIDTRANS_IS_PRODUCTION=false
```

**💡 Cara Mendapatkan API Keys (5-10 menit):**

**Google Gemini API (GRATIS):**
1. Buka https://ai.google.dev/
2. Klik "Get API Key"
3. Sign in dengan akun Google
4. Create API Key
5. Copy key dan paste ke `.env`

**Midtrans Sandbox (GRATIS):**
1. Buka https://dashboard.sandbox.midtrans.com/
2. Register dengan email
3. Verify email
4. Login → Settings → Access Keys
5. Copy "Server Key" dan "Client Key"
6. Paste ke `.env`

### Step 6: Start Server

```bash
# Jalankan server dalam development mode
npm run dev

# Server akan running di http://localhost:3000
```

**Expected Output:**
```
🚀 Server running on port 3000
📍 Health check: http://localhost:3000/health
💻 Environment: development
```

### Step 7: Test API

**Test health check:**
```bash
# Di terminal baru (atau browser):
curl http://localhost:3000/health

# Atau buka di browser:
# http://localhost:3000/health
```

**Test Login (setelah seeding):**

```bash
# Login dengan user dari seeder
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aila@example.com","password":"Aila123!"}'

# Response akan memberikan JWT token untuk digunakan di request berikutnya
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-..."
}
```

---

## 📁 Struktur Project

```
health-ecommerce-ai-integration/
├── README.md                    # 📖 Ini file yang sedang kamu baca
├── package.json                 # Dependencies & scripts
├── .env.example                 # Template environment variables
├── .gitignore                   # Files to ignore di Git
├── server.js                    # ⚠️ TODO: Entry point - need completion
│
├── config/
│   └── database.js             # ⚠️ TODO: MongoDB connection
│
├── controllers/
│   └── aiController.js         # ⚠️ TODO: AI chatbot controller
│
├── middleware/
│   ├── auth.js                 # JWT authentication (from Modul 4)
│   └── authorize.js            # RBAC authorization (from Modul 4)
│
├── models/
│   └── Product.js              # ⚠️ TODO: Product schema (extend dengan kemenkesId)
│
├── routes/
│   └── externalRoutes.js       # ⚠️ TODO: AI, Kemenkes, Payment routes
│
└── services/                    # 🆕 NEW - External service integrations
    ├── aiService.js            # ⚠️ TODO: Google Gemini integration
    ├── kemenkesService.js      # ⚠️ TODO: Kemenkes API integration
    └── midtransService.js      # ⚠️ TODO: Payment gateway integration
```

**Legend:**
- ⚠️ = File dengan TODO yang perlu kamu complete
- ✅ = File sudah ready (dari modul sebelumnya)
- 🆕 = File baru di modul ini

---

## ✅ Development Tasks

### Phase 1: Database Setup (30 menit)

- [ ] `config/database.js` - Implement MongoDB connection
- [ ] `models/Product.js` - Extend schema dengan `kemenkesId` field
- [ ] Test connection dengan `npm run dev`

### Phase 2: AI Chatbot (2 jam) 🌟

- [ ] `services/aiService.js` - Implement Google Gemini integration
  - [ ] Setup Axios configuration
  - [ ] Implement `getHealthRecommendation(question)`
  - [ ] Build context-aware prompt dengan product data
  - [ ] Parse AI response
  - [ ] Extract recommended products
  - [ ] Add caching mechanism
- [ ] `controllers/aiController.js` - Create AI controller
- [ ] Test `/api/external/ai/ask` endpoint

### Phase 3: Kemenkes Integration (1.5 jam)

- [ ] `services/kemenkesService.js` - Implement Kemenkes API
  - [ ] `getMedications(search, limit)` method
  - [ ] Transform FHIR data ke Product schema
  - [ ] `syncToDatabase()` method
- [ ] Test `/api/external/kemenkes/medications` endpoint

### Phase 4: Midtrans Payment (1.5 jam)

- [ ] `services/midtransService.js` - Implement payment gateway
  - [ ] `createTransaction(orderData)` method
  - [ ] `verifySignatureKey()` untuk security
  - [ ] `handleNotification()` untuk webhook
- [ ] Test payment creation endpoint

### Phase 5: Integration & Routes (1 jam)

- [ ] `routes/externalRoutes.js` - Mount all routes
- [ ] `server.js` - Complete server setup
- [ ] Setup rate limiting untuk AI endpoint
- [ ] Test complete flow

---

## 🧪 Testing Endpoints

### 1. Health Check

```bash
GET http://localhost:3000/health
```

### 2. AI Chatbot (setelah implement)

```bash
POST http://localhost:3000/api/external/ai/ask
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "question": "Vitamin apa yang bagus untuk daya tahan tubuh?"
}
```

### 3. Kemenkes Medications

```bash
GET http://localhost:3000/api/external/kemenkes/medications?search=paracetamol
Authorization: Bearer YOUR_JWT_TOKEN
```

### 4. Create Payment

```bash
POST http://localhost:3000/api/external/payment/create
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "items": [
    {"id": "1", "name": "Vitamin C", "price": 85000, "quantity": 2}
  ]
}
```

---

## 🐛 Troubleshooting

### ❌ Error: "Cannot find module 'express'"

**Penyebab:** Dependencies belum terinstall

**Solusi:**
```bash
npm install
```

### ❌ Error: "GOOGLE_AI_API_KEY not set"

**Penyebab:** Environment variable belum di-set

**Solusi:**
1. Pastikan file `.env` ada
2. Check `GOOGLE_AI_API_KEY=...` ada di `.env`
3. Restart server: `Ctrl+C` → `npm run dev`

### ❌ Error: "MongoDB connection failed"

**Penyebab:** MongoDB tidak running

**Solusi:**
```bash
# Check MongoDB running
mongosh

# Jika error, start MongoDB:
# Windows: Services → Start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### ❌ Error: "Port 3000 already in use"

**Penyebab:** Ada server lain di port 3000

**Solusi:**
```bash
# Option 1: Stop server yang lain
# Option 2: Ganti port di .env
PORT=3001
```

### ⚠️ AI Response Lambat

**Penyebab:** Banyak products di context

**Solusi:**
- Limit products max 20-30
- Increase timeout di axios
- Implement caching

---

## 📚 Resources untuk Belajar

**API Documentation:**
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Midtrans Documentation](https://docs.midtrans.com/)
- [Kemenkes API](https://satusehat.kemkes.go.id/platform/docs/)
- [Axios Documentation](https://axios-http.com/)

**Tools:**
- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [ngrok](https://ngrok.com/) - Webhook testing

---

## 💡 Tips Sukses

1. **Kerjakan step-by-step** - Jangan langsung semua
2. **Test setiap service** terpisah sebelum integrate
3. **Baca error messages** - Usually kasih hint jelas
4. **Log everything** - `console.log` adalah teman kamu!
5. **Check .env** - 90% error dari environment variables
6. **Compare dengan finished** - Lihat reference implementation

---

## 🚀 Next Steps

Setelah complete starter project:

1. ✅ **Test semua endpoints** dengan Postman
2. 🔍 **Compare dengan finished-project** untuk validasi
3. 📝 **Deploy ke production** (Railway, Heroku, Vercel)
4. 🎨 **Lanjut ke Frontend** untuk build UI yang consume API ini

---

## 📖 Completed Features Reference

Untuk melihat implementasi lengkap, check repository finished version:

🔗 **Finished Project:** `health-ecommerce-ai-complete`

**Perbedaan dengan finished:**
- Starter: Boilerplate + TODO comments
- Finished: Complete implementation + working code

---

## 🆘 Butuh Bantuan?

- **Stuck?** Check finished-project untuk reference
- **Error?** Read error message carefully & Google it
- **Concept unclear?** Review previous modules (Modul 1-4)

---

**Happy Coding! 🚀**

_Modul 5 - External API Integration & AI Chatbot_  
_Part of Health E-Commerce Backend Series_

---

**📁 Repository Naming:**
- Current (Starter): `health-ecommerce-ai-integration`
- Finished Version: `health-ecommerce-ai-complete`
