const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/admin/login", (req, res) => {
  const { password } = req.body;
  
  // Default to 'admin123' if not configured in .env
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (password === adminPassword) {
    // Generate a token valid for 24 hours
    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "24h" }
    );
    res.json({ token, message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

module.exports = router;
