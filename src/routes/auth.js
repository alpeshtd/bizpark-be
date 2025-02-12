const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.approved) return res.status(400).json({ message: "Not approved yet!" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, user : {
        name: user.name,
        email: user.email,
        role: user.role,
        _id: user._id
    } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Protected Route
// router.get("/protected", authMiddleware, (req, res) => {
//   res.status(200).json({ message: "Access granted", user: req.user });
// });

module.exports = router;
