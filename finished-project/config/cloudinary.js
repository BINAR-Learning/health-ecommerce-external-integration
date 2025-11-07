/**
 * Cloudinary Configuration
 * For image upload and storage
 */

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn("Cloudinary credentials not set. Image upload will not work.");
  console.warn("   Get free account at: https://cloudinary.com/");
} else {
  console.log("Cloudinary configured:", process.env.CLOUDINARY_CLOUD_NAME);
}

module.exports = cloudinary;

