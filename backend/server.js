// Import required packages
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ Enable CORS (Netlify + Local)
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://roaring-cajeta-c15d6f.netlify.app", // your live frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed from this origin"), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Import routes
const authRoutes = require("./routes/auth");

// Use routes with prefix
app.use("/api/auth", authRoutes);
app.use("/api/posts", require("./routes/posts"));
app.use("/api/users", require("./routes/users"));

// ✅ Default test route
app.get("/", (req, res) => {
  res.send("✅ LinkedIn Clone Backend is running successfully on Render!");
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");

    // ✅ Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ DB Connection Failed:", err));
