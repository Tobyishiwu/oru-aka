const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  signup,
  sendOtp,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
  login,
  refresh,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Tighter limiter for auth-sensitive endpoints to deter brute-force/OTP abuse
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Try again later." },
});

router.post("/signup", authLimiter, signup);
router.post("/send-otp", authLimiter, sendOtp);
router.post("/verify-otp", authLimiter, verifyOtp);
router.post("/forgot-password", authLimiter, requestPasswordReset);
router.post("/reset-password", authLimiter, resetPassword);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.get("/me", protect, getMe);

module.exports = router;
