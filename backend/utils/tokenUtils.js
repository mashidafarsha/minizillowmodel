const jwt = require('jsonwebtoken');

// ✅ Generates short-lived access token
exports.generateAccessToken = (user) => {
  console.log(user, "oooo");

  return jwt.sign(
    { id: user._id, role: user.role }, // ✅ includes id and role
    process.env.JWT_SECRET,
    { expiresIn: '5m' } // ⏱️ 5 minutes
  );
};

// ✅ Generates longer-lived refresh token
exports.generateRefreshToken = (user) => {
  console.log(user, "oooo");

  return jwt.sign(
    { id: user._id, role: user.role }, // ✅ includes id and role
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' } // ⏱️ 7 days
  );
};
