const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  // Validate JWT format: should have 3 parts separated by dots
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    console.error("Invalid JWT format - Token should have 3 parts (header.payload.signature)");
    console.error("Token received:", token.substring(0, 50) + "...");
    return res.status(403).json({
      success: false,
      message: "Invalid token format. Token must be a valid JWT with 3 parts separated by dots (header.payload.signature). Please login again to get a new token.",
      ...(process.env.NODE_ENV === "development" && {
        hint: "Make sure you're using the token from login/register response, not just the payload.",
        tokenParts: tokenParts.length,
      }),
    });
  }

  try {
    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({
        success: false,
        message: "Server configuration error. JWT_SECRET not found.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Provide more specific error messages based on error type
    let errorMessage = "Invalid token";
    
    if (error.name === "TokenExpiredError") {
      errorMessage = "Token expired. Please login again.";
    } else if (error.name === "JsonWebTokenError") {
      if (error.message === "jwt malformed") {
        errorMessage = "Token format is invalid. Please login again to get a new token.";
      } else {
        errorMessage = `Invalid token: ${error.message}`;
      }
    } else if (error.name === "NotBeforeError") {
      errorMessage = "Token not active yet.";
    }

    // Log error in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.error("JWT Verification Error:", {
        error: error.name,
        message: error.message,
        tokenLength: token.length,
        tokenPrefix: token.substring(0, 30) + "...",
        tokenParts: token.split(".").length,
      });
    }

    return res.status(403).json({
      success: false,
      message: errorMessage,
      ...(process.env.NODE_ENV === "development" && {
        error: error.name,
        details: error.message,
      }),
    });
  }
}

module.exports = { authenticateToken };
