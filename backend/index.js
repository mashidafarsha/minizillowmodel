const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ✅ Allowed Origins
const allowedOrigins = [
  "https://minizillowmodel-16ml.vercel.app",
  "https://minizillowmodel-16ml-dsgfrcco1-mashidas-projects-621f1c73.vercel.app", // 👈 Add this
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];


// ✅ CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    console.log("🔍 Incoming origin:", origin);

    // Allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const msg = `❌ CORS blocked for origin: ${origin}`;
      console.warn(msg);
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
}));

// ✅ Body Parser Middleware
app.use(express.json());

// ✅ Routes
app.use("/api/admin", require("./routes/admin"));
app.use("/api/user", require("./routes/user"));

// ✅ Health Check Route (Optional)
app.get("/", (req, res) => {
  res.send("🌍 Backend running!");
});

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
