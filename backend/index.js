const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();
const app = express();

// ✅ Allow Vercel frontend to access backend
app.use(cors({
  origin: "https://minizillowmodel-16ml.vercel.app/", // ✅ Replace this
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/admin", require("./routes/admin"));
app.use("/api/user", require("./routes/user"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
