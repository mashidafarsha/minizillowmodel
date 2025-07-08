const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require ('./config/db')
// const listEndpoints = require('express-list-endpoints');





dotenv.config();

connectDB();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));

// console.log("Registered routes:", listEndpoints(app));

// MongoDB Connection
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});