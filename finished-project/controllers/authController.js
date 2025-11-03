const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId, email, role) => {
  return jwt.sign({ userId, email, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  });
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by pre-save hook
      role: role || "user",
    });

    // Generate token
    const token = generateToken(user._id, user.email, user.role);

    // Log token info in development for debugging
    if (process.env.NODE_ENV === "development") {
      const tokenParts = token.split(".");
      console.log("✅ Token generated successfully:", {
        tokenLength: token.length,
        tokenParts: tokenParts.length,
        tokenPrefix: token.substring(0, 50) + "...",
        hasThreeParts: tokenParts.length === 3,
      });
    }

    res.status(201).json({
      success: true,
      message: "User berhasil didaftarkan",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Registrasi gagal",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
    }

    // Find user (include password for comparison)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    // Generate token
    const token = generateToken(user._id, user.email, user.role);

    // Log token info in development for debugging
    if (process.env.NODE_ENV === "development") {
      const tokenParts = token.split(".");
      console.log("✅ Token generated successfully:", {
        tokenLength: token.length,
        tokenParts: tokenParts.length,
        tokenPrefix: token.substring(0, 50) + "...",
        hasThreeParts: tokenParts.length === 3,
      });
    }

    res.json({
      success: true,
      message: "Login berhasil",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login gagal",
    });
  }
};

// Get Profile (Protected)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil profil",
    });
  }
};
