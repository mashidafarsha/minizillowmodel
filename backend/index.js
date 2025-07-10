const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ✅ Allowed Origins


// Allowlist of trusted origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://minizillowmodel-16ml.vercel.app",
  "https://minizillowmodel-16ml-dsgfrcco1-mashidas-projects-621f1c73.vercel.app",
];

// Dynamic CORS config
const corsOptionsDelegate = function (req, callback) {
  const origin = req.header("Origin");
  console.log("🔍 Incoming Origin:", origin);

  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, {
      origin: origin || true, // allow server-side tools like Postman (no origin)
      credentials: true,
    });
  } else {
    console.warn("❌ CORS blocked for:", origin);
    callback(new Error("Not allowed by CORS"));
  }
};

// Apply CORS middleware
app.use(cors(corsOptionsDelegate));


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
