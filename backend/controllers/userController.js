const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');


console.log("✅ userController loaded");

exports.signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });

  await user.save();

  // ✅ Pass the full user object
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



exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  const accessToken = generateAccessToken(user); // ✅ full user passed
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

    // Generate new tokens
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Save the new refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save();

    // Send both new tokens to client
    res.json({ accessToken, refreshToken: newRefreshToken });

  } catch (err) {
    res.sendStatus(403);
  }
};



exports.toggleBookmark = async (req, res) => {

  console.log("➡️ ToggleBookmark route hit");

  try {
    const { propertyId } = req.params;
    const userId = req.user.id;

    console.log(`Toggle bookmark hit for user ${userId}, property ${propertyId}`);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const index = user.favorites.indexOf(propertyId);

    if (index > -1) {
      user.favorites.splice(index, 1); // remove
    } else {
      user.favorites.push(propertyId); // add
    }

    await user.save();
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    console.error("Toggle bookmark error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.toggleBookmark = (req, res) => {
//   console.log("✅ toggleBookmark hit");
//   res.json({ message: "It works!" });
// };
