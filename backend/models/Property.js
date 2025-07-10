const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

const propertySchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  category: {
    type: String,
    enum: ["Villa", "Flat", "Townhouse", "Penthouse", "Studio", "Land"],
    required: true,
  },
  images: [String],
  createdAt: { type: Date, default: Date.now },

  ratings: [ratingSchema],
  averageRating: { type: Number, default: 0 },
});

module.exports = mongoose.model("Property", propertySchema);
