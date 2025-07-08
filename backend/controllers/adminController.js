const Admin = require('../models/Admin');
const Property = require('../models/Property');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require("../utils/cloudinary");

const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');



// ✅ Login Admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    // ✅ Pass full admin object
    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    admin.refreshToken = refreshToken;
    await admin.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Refresh Admin Token with rotation
exports.refreshAdminToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ msg: "No refresh token provided" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin || admin.refreshToken !== token) {
      return res.status(403).json({ msg: "Invalid or expired refresh token" });
    }

    // ✅ Rotate tokens
    const newAccessToken = generateAccessToken(admin);
    const newRefreshToken = generateRefreshToken(admin);

    admin.refreshToken = newRefreshToken;
    await admin.save();

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error("Admin token refresh error:", err);
    res.status(403).json({ msg: "Token verification failed" });
  }
};





exports.addProperty = async (req, res) => {
  

  try {
    const { title, location, price, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    // Convert file buffer to base64 for Cloudinary
    const base64 = Buffer.from(file.buffer).toString("base64");
    const dataUri = `data:${file.mimetype};base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "properties",
    });

    // Save to MongoDB
    const newProperty = await Property.create({
      title,
      location,
      price,
      description,
      images: [result.secure_url],
    });

    res.status(200).json({ success: true, property: newProperty });
  } catch (error) {
    console.error("Error uploading property:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({ success: true, properties });
  } catch (error) {
    console.error("Get All Properties Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get a single property by ID
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    console.error("Get Property Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a property by ID
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Delete Property Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update property by ID
exports.updateProperty = async (req, res) => {
  try {
    const { title, location, price, description } = req.body;
    const file = req.file;
    let updatedFields = { title, location, price, description };

    if (file) {
      // Convert file to base64 and upload to Cloudinary
      const base64 = Buffer.from(file.buffer).toString("base64");
      const dataUri = `data:${file.mimetype};base64,${base64}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "properties",
      });
      updatedFields.images = [result.secure_url];
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updatedProperty) return res.status(404).json({ message: "Property not found" });

    res.status(200).json({ success: true, property: updatedProperty });
  } catch (error) {
    console.error("Update Property Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};







// exports.updateProperty = async (req, res) => {
//   const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   res.json(updated);
// };

// exports.deleteProperty = async (req, res) => {
//   await Property.findByIdAndDelete(req.params.id);
//   res.json({ msg: 'Deleted' });
// };

// exports.getAllPropertiesForAdmin = async (req, res) => {
//   const properties = await Property.find();
//   res.json(properties);
// };