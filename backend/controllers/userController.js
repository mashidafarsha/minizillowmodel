const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Property = require("../models/Property");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");

// user signup

exports.signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });

  await user.save();

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// user login

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) return res.sendStatus(403);

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.sendStatus(403);
  }
};

exports.toggleBookmark = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const index = user.favorites.indexOf(propertyId);

    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(propertyId);
    }

    await user.save();
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get current logged-in user

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.rateProperty = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  const userId = req.user.id;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  try {
    const property = await Property.findById(id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const existing = property.ratings.find((r) => r.user.toString() === userId);

    if (existing) {
      existing.rating = rating;
    } else {
      property.ratings.push({ user: userId, rating });
    }

    const total = property.ratings.reduce((acc, r) => acc + r.rating, 0);
    property.averageRating = total / property.ratings.length;

    await property.save();
    res.status(200).json({
      success: true,
      message: "Rating submitted",
      averageRating: property.averageRating,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
