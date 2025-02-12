const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.approved) return res.status(400).json({ message: "Not approved yet!" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is invalid or expired" });
  }
};

module.exports = authMiddleware;
