const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ✅ Allowed Origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://minizillowmodel-16ml.vercel.app",
  "https://minizillowmodel-16ml-dsgfrcco1-mashidas-projects-621f1c73.vercel.app"
];

// ✅ CORS Config
const corsOptions = {
  origin: function (origin, callback) {
    console.log("🔍 CORS Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ CORS blocked for:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// ✅ Middleware
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Routes
app.use("/api/admin", require("./routes/admin"));
app.use("/api/user", require("./routes/user"));

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("🌍 Backend is running!");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
