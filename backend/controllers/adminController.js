const Admin = require('../models/Admin');
const Property = require('../models/Property');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require("../utils/cloudinary");

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





// exports.createProperty = async (req, res) => {
//   const property = new Property(req.body);
//   await property.save();
//   res.status(201).json(property);
// };

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