const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, 
  refreshToken: String,
 
favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }]

});

module.exports = mongoose.model('User', userSchema);