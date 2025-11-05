/**
 * Upload Controller
 * Handle image uploads to Cloudinary
 */

const cloudinary = require('../config/cloudinary');
const User = require('../models/User');

/**
 * Upload Product Image
 * POST /api/upload/product
 */
exports.uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // File already uploaded to Cloudinary by multer middleware
    const imageUrl = req.file.path; // Cloudinary URL

    res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl,
      filename: req.file.filename,
      publicId: req.file.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
};

/**
 * Upload Profile Photo
 * POST /api/upload/profile
 */
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Update user's profile photo
    const user = await User.findById(req.user.id);
    
    // Delete old photo from Cloudinary if exists
    if (user.profilePhoto && user.profilePhoto.includes('cloudinary')) {
      try {
        // Extract public_id from URL
        const urlParts = user.profilePhoto.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExt.split('.')[0];
        const folderPath = `health-ecommerce/profiles/${publicId}`;
        
        await cloudinary.uploader.destroy(folderPath);
      } catch (err) {
        console.warn("Failed to delete old photo:", err.message);
      }
    }

    // Update with new photo
    user.profilePhoto = req.file.path;
    await user.save();

    res.json({
      success: true,
      message: "Profile photo updated successfully",
      imageUrl: req.file.path,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    console.error("Upload profile photo error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload profile photo",
      error: error.message,
    });
  }
};

/**
 * Delete Image from Cloudinary
 * DELETE /api/upload/:publicId
 */
exports.deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    await cloudinary.uploader.destroy(publicId);

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
      error: error.message,
    });
  }
};

