const jwt = require('jsonwebtoken');

// ✅ Generates short-lived access token
exports.generateAccessToken = (user) => {
  console.log(user, "oooo");

  return jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET,
    { expiresIn: '5m' } 
  );
};


exports.generateRefreshToken = (user) => {
  console.log(user, "oooo");

  return jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' } 
  );
};
