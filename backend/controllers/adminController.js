const Admin = require("../models/Admin");
const Property = require("../models/Property");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");

//  Login Admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

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
    res.status(500).json({ msg: "Server error" });
  }
};

//  Refresh Admin Token with rotation
exports.refreshAdminToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ msg: "No refresh token provided" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin || admin.refreshToken !== token) {
      return res.status(403).json({ msg: "Invalid or expired refresh token" });
    }

    //  Rotate tokens
    const newAccessToken = generateAccessToken(admin);
    const newRefreshToken = generateRefreshToken(admin);

    admin.refreshToken = newRefreshToken;
    await admin.save();

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    res.status(403).json({ msg: "Token verification failed" });
  }
};

exports.addProperty = async (req, res) => {
  try {
    const { title, location, price, description, category } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "At least one image is required" });
    }

    const uploadedImageUrls = [];

    for (const file of files) {
      const base64 = Buffer.from(file.buffer).toString("base64");
      const dataUri = `data:${file.mimetype};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "properties",
      });

      uploadedImageUrls.push(result.secure_url);
    }

    const newProperty = await Property.create({
      title,
      location,
      price,
      description,
      category,
      images: uploadedImageUrls,
    });

    res.status(200).json({ success: true, property: newProperty });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get a single property by ID
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a property by ID
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update property by ID
exports.updateProperty = async (req, res) => {
  try {
    const { title, location, price, description, category, existingImages } =
      req.body;
    const files = req.files;

    let updatedFields = { title, location, price, description, category };

    let existing = [];

    if (existingImages) {
      if (Array.isArray(existingImages)) {
        existing = existingImages;
      } else {
        existing = [existingImages];
      }
    }

    let newImageUrls = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const base64 = Buffer.from(file.buffer).toString("base64");
        const dataUri = `data:${file.mimetype};base64,${base64}`;
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "properties",
        });
        newImageUrls.push(result.secure_url);
      }
    }

    updatedFields.images = [...existing, ...newImageUrls];

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updatedProperty)
      return res.status(404).json({ message: "Property not found" });

    res.status(200).json({ success: true, property: updatedProperty });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
