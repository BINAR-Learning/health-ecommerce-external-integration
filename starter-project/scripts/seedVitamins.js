require("dotenv").config();
const connectDB = require("../config/database");
const Product = require("../models/Product");

async function seedVitamins() {
  await connectDB();

  const vitamins = [
    {
      name: "Vitamin C 1000mg Time-Release",
      description:
        "Suplemen vitamin C rilis bertahap untuk daya tahan tubuh dan antioksidan.",
      category: "Vitamin",
      price: 65000,
      stock: 120,
      manufacturer: "HealthLabs",
    },
    {
      name: "Vitamin D3 1000 IU Softgels",
      description:
        "Mendukung kesehatan tulang dan imunitas, penyerapan kalsium optimal.",
      category: "Vitamin",
      price: 58000,
      stock: 150,
      manufacturer: "NutriCore",
    },
    {
      name: "Vitamin B-Complex Energy Support",
      description:
        "Kombinasi B1, B2, B3, B5, B6, B7, B9, B12 untuk metabolisme energi.",
      category: "Vitamin",
      price: 72000,
      stock: 90,
      manufacturer: "VitaPlus",
    },
    {
      name: "Vitamin E 400 IU Natural",
      description:
        "Vitamin E alami sebagai antioksidan untuk kesehatan kulit dan sel.",
      category: "Vitamin",
      price: 69000,
      stock: 80,
      manufacturer: "PureNature",
    },
    {
      name: "Vitamin A 5000 IU",
      description:
        "Mendukung kesehatan mata, kulit, dan sistem imun.",
      category: "Vitamin",
      price: 45000,
      stock: 110,
      manufacturer: "WellnessCo",
    },
    {
      name: "Vitamin K2 MK-7 100mcg",
      description:
        "Bekerja sinergis dengan D3 untuk mineralisasi tulang dan kesehatan kardiovaskular.",
      category: "Vitamin",
      price: 99000,
      stock: 60,
      manufacturer: "CardioBone",
    },
    {
      name: "Vitamin C + Zinc Immune Guard",
      description:
        "Kombinasi vitamin C dan zinc untuk perlindungan imun harian.",
      category: "Vitamin",
      price: 78000,
      stock: 130,
      manufacturer: "ShieldLabs",
    },
    {
      name: "Vitamin B12 Methylcobalamin 1000mcg",
      description:
        "Dukung pembentukan sel darah merah dan fungsi saraf, bentuk aktif.",
      category: "Vitamin",
      price: 85000,
      stock: 75,
      manufacturer: "NeuroVital",
    },
    {
      name: "Vitamin D3 + K2 Bone Support",
      description:
        "Formula D3 & K2 untuk penyerapan kalsium dan distribusi ke tulang.",
      category: "Vitamin",
      price: 115000,
      stock: 55,
      manufacturer: "OsteoCare",
    },
    {
      name: "Multivitamin Harian 26 Nutrisi",
      description:
        "Multivitamin lengkap untuk dukung energi, imun, dan kesehatan umum.",
      category: "Vitamin",
      price: 99000,
      stock: 140,
      manufacturer: "DailyMax",
    },
  ];

  let inserted = 0;

  for (const v of vitamins) {
    // Upsert by unique name to avoid duplicates on re-run
    const exists = await Product.findOne({ name: v.name });
    if (exists) continue;
    await Product.create(v);
    inserted += 1;
  }

  console.log(`✅ Vitamin seeding completed. Inserted: ${inserted}`);
  process.exit(0);
}

seedVitamins().catch((err) => {
  console.error("❌ Seeding error:", err.message);
  process.exit(1);
});

