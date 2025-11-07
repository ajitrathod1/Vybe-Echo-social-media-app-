// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Signup Route (register + signup alias)
async function handleSignup(req, res) {
  try {
    const { name, email, password } = req.body;

    // Field validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "❌ All fields are required" });
    }

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "⚠️ User already exists, please login" });
    }

    // Encrypt password
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    // Success response
    res.status(201).json({
      message: "✅ Account created successfully!",
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

router.post("/signup", handleSignup);
router.post("/register", handleSignup); // alias for compatibility

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "❌ Please enter both email and password" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "⚠️ User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "❌ Invalid password" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "devsecret", {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "✅ Login successful!",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
