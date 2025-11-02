require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");
const connectDB = require("../config/database");

const products = [
  // Vitamins
  {
    name: "Vitamin C 1000mg",
    description: "Suplemen vitamin C untuk meningkatkan daya tahan tubuh dan antioksidan",
    category: "Vitamin",
    price: 85000,
    stock: 50,
    manufacturer: "PT Sehat Sejahtera",
    imageUrl: "https://via.placeholder.com/400x300?text=Vitamin+C",
  },
  {
    name: "Vitamin D3 2000 IU",
    description: "Suplemen vitamin D untuk kesehatan tulang dan sistem imun",
    category: "Vitamin",
    price: 120000,
    stock: 30,
    manufacturer: "PT Sehat Alami",
    imageUrl: "https://via.placeholder.com/400x300?text=Vitamin+D3",
  },
  {
    name: "Vitamin B Complex",
    description: "Kompleks vitamin B untuk energi dan metabolisme",
    category: "Vitamin",
    price: 95000,
    stock: 45,
    manufacturer: "PT Aila Farma",
    imageUrl: "https://via.placeholder.com/400x300?text=B+Complex",
  },
  {
    name: "Multivitamin Complete",
    description: "Multivitamin lengkap untuk kebutuhan harian",
    category: "Vitamin",
    price: 150000,
    stock: 40,
    manufacturer: "PT Aiman Health",
    imageUrl: "https://via.placeholder.com/400x300?text=Multivitamin",
  },
  {
    name: "Vitamin E 400 IU Natural",
    description: "Vitamin E alami sebagai antioksidan untuk kesehatan kulit dan sel",
    category: "Vitamin",
    price: 69000,
    stock: 80,
    manufacturer: "PT PureNature",
    imageUrl: "https://via.placeholder.com/400x300?text=Vitamin+E",
  },
  {
    name: "Vitamin A 5000 IU",
    description: "Mendukung kesehatan mata, kulit, dan sistem imun",
    category: "Vitamin",
    price: 45000,
    stock: 110,
    manufacturer: "PT WellnessCo",
    imageUrl: "https://via.placeholder.com/400x300?text=Vitamin+A",
  },
  {
    name: "Vitamin K2 MK-7 100mcg",
    description: "Bekerja sinergis dengan D3 untuk mineralisasi tulang dan kesehatan kardiovaskular",
    category: "Vitamin",
    price: 99000,
    stock: 60,
    manufacturer: "PT CardioBone",
    imageUrl: "https://via.placeholder.com/400x300?text=Vitamin+K2",
  },
  {
    name: "Vitamin B12 Methylcobalamin 1000mcg",
    description: "Dukung pembentukan sel darah merah dan fungsi saraf, bentuk aktif",
    category: "Vitamin",
    price: 85000,
    stock: 75,
    manufacturer: "PT NeuroVital",
    imageUrl: "https://via.placeholder.com/400x300?text=B12",
  },
  {
    name: "Vitamin C + Zinc Immune Guard",
    description: "Kombinasi vitamin C dan zinc untuk perlindungan imun harian",
    category: "Vitamin",
    price: 78000,
    stock: 130,
    manufacturer: "PT ShieldLabs",
    imageUrl: "https://via.placeholder.com/400x300?text=C+Zinc",
  },
  // Supplements
  {
    name: "Omega-3 Fish Oil 1000mg",
    description: "Minyak ikan untuk kesehatan jantung dan fungsi otak",
    category: "Supplement",
    price: 200000,
    stock: 25,
    manufacturer: "PT Nutri Health",
    imageUrl: "https://via.placeholder.com/400x300?text=Omega+3",
  },
  {
    name: "Probiotik Capsules",
    description: "Probiotik untuk kesehatan pencernaan dan sistem imun",
    category: "Supplement",
    price: 180000,
    stock: 20,
    manufacturer: "PT Bio Health",
    imageUrl: "https://via.placeholder.com/400x300?text=Probiotik",
  },
  {
    name: "Glucosamine Chondroitin",
    description: "Suplemen untuk kesehatan sendi dan tulang rawan",
    category: "Supplement",
    price: 250000,
    stock: 18,
    manufacturer: "PT Joint Health",
    imageUrl: "https://via.placeholder.com/400x300?text=Glucosamine",
  },
  {
    name: "Collagen Peptides 5000mg",
    description: "Kolagen untuk kesehatan kulit, rambut, dan sendi",
    category: "Supplement",
    price: 320000,
    stock: 30,
    manufacturer: "PT Beauty Health",
    imageUrl: "https://via.placeholder.com/400x300?text=Collagen",
  },
  {
    name: "Magnesium Glycinate 400mg",
    description: "Magnesium untuk relaksasi otot dan kualitas tidur",
    category: "Supplement",
    price: 145000,
    stock: 55,
    manufacturer: "PT RelaxPlus",
    imageUrl: "https://via.placeholder.com/400x300?text=Magnesium",
  },
  {
    name: "Coenzyme Q10 100mg",
    description: "CoQ10 untuk kesehatan jantung dan energi sel",
    category: "Supplement",
    price: 275000,
    stock: 28,
    manufacturer: "PT HeartCare",
    imageUrl: "https://via.placeholder.com/400x300?text=CoQ10",
  },
  {
    name: "Turmeric Curcumin 500mg",
    description: "Kurkumin untuk anti-inflamasi dan kesehatan sendi",
    category: "Supplement",
    price: 165000,
    stock: 42,
    manufacturer: "PT Natural Remedies",
    imageUrl: "https://via.placeholder.com/400x300?text=Turmeric",
  },
  {
    name: "Ashwagandha 600mg",
    description: "Herbal adaptogen untuk mengurangi stres dan meningkatkan energi",
    category: "Supplement",
    price: 195000,
    stock: 35,
    manufacturer: "PT Herbal Wellness",
    imageUrl: "https://via.placeholder.com/400x300?text=Ashwagandha",
  },
  // Medicines
  {
    name: "Paracetamol 500mg",
    description: "Obat pereda nyeri dan penurun demam",
    category: "Medicine",
    price: 15000,
    stock: 100,
    manufacturer: "PT Kimia Farma",
    imageUrl: "https://via.placeholder.com/400x300?text=Paracetamol",
  },
  {
    name: "Amoxicillin 500mg",
    description: "Antibiotik untuk infeksi bakterial",
    category: "Medicine",
    price: 35000,
    stock: 60,
    manufacturer: "PT Pharma Indo",
    imageUrl: "https://via.placeholder.com/400x300?text=Amoxicillin",
  },
  {
    name: "Ibuprofen 400mg",
    description: "Obat anti-inflamasi non-steroid untuk nyeri dan demam",
    category: "Medicine",
    price: 28000,
    stock: 75,
    manufacturer: "PT Medika Pharma",
    imageUrl: "https://via.placeholder.com/400x300?text=Ibuprofen",
  },
  {
    name: "Cetirizine 10mg",
    description: "Antihistamin untuk alergi dan gatal-gatal",
    category: "Medicine",
    price: 22000,
    stock: 90,
    manufacturer: "PT AllerCare",
    imageUrl: "https://via.placeholder.com/400x300?text=Cetirizine",
  },
  {
    name: "Loratadine 10mg",
    description: "Antihistamin generasi kedua untuk alergi tanpa kantuk",
    category: "Medicine",
    price: 25000,
    stock: 85,
    manufacturer: "PT Allergy Free",
    imageUrl: "https://via.placeholder.com/400x300?text=Loratadine",
  },
  {
    name: "Omeprazole 20mg",
    description: "Obat untuk mengurangi asam lambung dan tukak lambung",
    category: "Medicine",
    price: 45000,
    stock: 65,
    manufacturer: "PT Digestive Care",
    imageUrl: "https://via.placeholder.com/400x300?text=Omeprazole",
  },
  {
    name: "Antasida Suspension",
    description: "Obat penetral asam lambung untuk meredakan maag",
    category: "Medicine",
    price: 18000,
    stock: 95,
    manufacturer: "PT Stomach Care",
    imageUrl: "https://via.placeholder.com/400x300?text=Antasida",
  },
  {
    name: "Salbutamol Inhaler",
    description: "Bronkodilator untuk mengatasi asma dan sesak napas",
    category: "Medicine",
    price: 125000,
    stock: 40,
    manufacturer: "PT Respiratory Health",
    imageUrl: "https://via.placeholder.com/400x300?text=Inhaler",
  },
  // Medical Equipment
  {
    name: "Thermometer Digital",
    description: "Termometer digital untuk pengukuran suhu tubuh akurat",
    category: "Medical Equipment",
    price: 75000,
    stock: 35,
    manufacturer: "PT Medical Tools",
    imageUrl: "https://via.placeholder.com/400x300?text=Thermometer",
  },
  {
    name: "Blood Pressure Monitor",
    description: "Alat ukur tekanan darah digital untuk home monitoring",
    category: "Medical Equipment",
    price: 450000,
    stock: 15,
    manufacturer: "PT Medical Devices",
    imageUrl: "https://via.placeholder.com/400x300?text=BP+Monitor",
  },
  {
    name: "Hand Sanitizer 500ml",
    description: "Pembersih tangan antiseptik dengan alkohol 70%",
    category: "Medical Equipment",
    price: 35000,
    stock: 80,
    manufacturer: "PT Hygiene Plus",
    imageUrl: "https://via.placeholder.com/400x300?text=Hand+Sanitizer",
  },
  {
    name: "Face Mask Surgical 50 pcs",
    description: "Masker bedah sekali pakai untuk perlindungan kesehatan",
    category: "Medical Equipment",
    price: 55000,
    stock: 120,
    manufacturer: "PT Safety First",
    imageUrl: "https://via.placeholder.com/400x300?text=Face+Mask",
  },
  {
    name: "Pulse Oximeter Digital",
    description: "Alat pengukur saturasi oksigen dan detak jantung",
    category: "Medical Equipment",
    price: 185000,
    stock: 25,
    manufacturer: "PT VitalSigns",
    imageUrl: "https://via.placeholder.com/400x300?text=Oximeter",
  },
  {
    name: "Glucometer Kit",
    description: "Alat ukur gula darah lengkap dengan strip test",
    category: "Medical Equipment",
    price: 325000,
    stock: 20,
    manufacturer: "PT Diabetes Care",
    imageUrl: "https://via.placeholder.com/400x300?text=Glucometer",
  },
  {
    name: "First Aid Kit Complete",
    description: "Kotak P3K lengkap dengan berbagai alat medis dasar",
    category: "Medical Equipment",
    price: 175000,
    stock: 30,
    manufacturer: "PT Emergency Care",
    imageUrl: "https://via.placeholder.com/400x300?text=First+Aid",
  },
  {
    name: "Nebulizer Portable",
    description: "Alat terapi uap untuk mengatasi masalah pernapasan",
    category: "Medical Equipment",
    price: 525000,
    stock: 12,
    manufacturer: "PT BreathEasy",
    imageUrl: "https://via.placeholder.com/400x300?text=Nebulizer",
  },
  {
    name: "Digital Stethoscope",
    description: "Stetoskop digital untuk mendengarkan bunyi jantung dan paru",
    category: "Medical Equipment",
    price: 650000,
    stock: 8,
    manufacturer: "PT MedTech Pro",
    imageUrl: "https://via.placeholder.com/400x300?text=Stethoscope",
  },
  {
    name: "Reusable Face Shield",
    description: "Pelindung wajah yang dapat digunakan ulang",
    category: "Medical Equipment",
    price: 85000,
    stock: 50,
    manufacturer: "PT Protective Gear",
    imageUrl: "https://via.placeholder.com/400x300?text=Face+Shield",
  },
];

const users = [
  // Admin Users
  {
    name: "Aiman",
    email: "aiman@example.com",
    password: "Aiman123!",
    role: "admin",
    phone: "081234567890",
    address: "Jl. Merdeka No. 123, Jakarta",
  },
  {
    name: "Admin Health",
    email: "admin@healthstore.com",
    password: "Admin123!",
    role: "admin",
    phone: "081234567801",
    address: "Jl. Kesehatan No. 45, Bandung",
  },
  // Regular Users for Login Testing
  {
    name: "Aila",
    email: "aila@example.com",
    password: "Aila123!",
    role: "user",
    phone: "081234567891",
    address: "Jl. Sejahtera No. 67, Surabaya",
  },
  {
    name: "User Test",
    email: "user@example.com",
    password: "User123!",
    role: "user",
    phone: "081234567892",
    address: "Jl. Test No. 89, Yogyakarta",
  },
  {
    name: "Budi Santoso",
    email: "budi@example.com",
    password: "Budi123!",
    role: "user",
    phone: "081234567893",
    address: "Jl. Jendral Sudirman No. 12, Medan",
  },
  {
    name: "Siti Nurhaliza",
    email: "siti@example.com",
    password: "Siti123!",
    role: "user",
    phone: "081234567894",
    address: "Jl. Gatot Subroto No. 34, Semarang",
  },
  {
    name: "Andi Wijaya",
    email: "andi@example.com",
    password: "Andi123!",
    role: "user",
    phone: "081234567895",
    address: "Jl. Hayam Wuruk No. 56, Makassar",
  },
  {
    name: "Rina Melati",
    email: "rina@example.com",
    password: "Rina123!",
    role: "user",
    phone: "081234567896",
    address: "Jl. Ahmad Yani No. 78, Palembang",
  },
  {
    name: "Dedi Kurniawan",
    email: "dedi@example.com",
    password: "Dedi123!",
    role: "user",
    phone: "081234567897",
    address: "Jl. Diponegoro No. 90, Malang",
  },
  {
    name: "Lisa Permata",
    email: "lisa@example.com",
    password: "Lisa123!",
    role: "user",
    phone: "081234567898",
    address: "Jl. Raya Bogor No. 23, Bogor",
  },
  {
    name: "Fajar Pratama",
    email: "fajar@example.com",
    password: "Fajar123!",
    role: "user",
    phone: "081234567899",
    address: "Jl. Soekarno Hatta No. 45, Bandung",
  },
  {
    name: "Maya Sari",
    email: "maya@example.com",
    password: "Maya123!",
    role: "user",
    phone: "081234567900",
    address: "Jl. Thamrin No. 67, Jakarta",
  },
  {
    name: "Eko Saputra",
    email: "eko@example.com",
    password: "Eko123!",
    role: "user",
    phone: "081234567901",
    address: "Jl. Kartini No. 89, Solo",
  },
  {
    name: "Indah Rahayu",
    email: "indah@example.com",
    password: "Indah123!",
    role: "user",
    phone: "081234567902",
    address: "Jl. Veteran No. 12, Pontianak",
  },
  {
    name: "Hadi Nugroho",
    email: "hadi@example.com",
    password: "Hadi123!",
    role: "user",
    phone: "081234567903",
    address: "Jl. Pattimura No. 34, Ambon",
  },
  {
    name: "Citra Dewi",
    email: "citra@example.com",
    password: "Citra123!",
    role: "user",
    phone: "081234567904",
    address: "Jl. Gajah Mada No. 56, Denpasar",
  },
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log("\n🗑️  Clearing old data...");
    await Product.deleteMany();
    await User.deleteMany();
    console.log("✅ Old data cleared\n");

    // Insert products
    console.log("📦 Creating products...");
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} products created\n`);

    // Insert users
    console.log("👥 Creating users...");
    const createdUsers = await User.insertMany(users);
    console.log(`✅ ${createdUsers.length} users created\n`);

    // Display sample IDs
    console.log("📋 Sample Product IDs (for testing):");
    createdProducts.slice(0, 5).forEach((product) => {
      console.log(`   - ${product.name}: ${product._id}`);
    });

    console.log("\n📋 Test Users for Login:");
    console.log("\n   🔐 ADMIN USERS:");
    createdUsers
      .filter((u) => u.role === "admin")
      .forEach((user) => {
        const userData = users.find((u) => u.email === user.email);
        console.log(`   - ${user.name} (${user.email}) / ${userData.password}`);
      });

    console.log("\n   👤 REGULAR USERS:");
    createdUsers
      .filter((u) => u.role === "user")
      .slice(0, 10)
      .forEach((user) => {
        const userData = users.find((u) => u.email === user.email);
        console.log(`   - ${user.name} (${user.email}) / ${userData.password}`);
      });
    if (createdUsers.filter((u) => u.role === "user").length > 10) {
      console.log(`   ... and ${createdUsers.filter((u) => u.role === "user").length - 10} more users`);
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ ${createdProducts.length} products created`);
    console.log(`   ✅ ${createdUsers.length} users created`);
    console.log(`      - ${createdUsers.filter((u) => u.role === "admin").length} admin users`);
    console.log(`      - ${createdUsers.filter((u) => u.role === "user").length} regular users`);

    console.log("\n🎉 Database seeding complete!");
    console.log("🚀 You can now run: npm run dev\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();

