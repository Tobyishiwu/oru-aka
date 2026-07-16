const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Otp = require("../models/Otp");
const WorkerProfile = require("../models/WorkerProfile");
const { ApiError } = require("../middleware/errorHandler");
const { generateOtpCode, otpExpiryDate } = require("../utils/otp");
const { sendOtpSms } = require("../config/sms");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokens");

function normalizePhone(phone) {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.startsWith("234")) return `+${digits}`;
  if (digits.startsWith("0")) return `+234${digits.slice(1)}`;
  if (digits.startsWith("+234")) return digits;
  return `+234${digits}`;
}

// POST /api/auth/signup
// Creates the account and logs the user in immediately. Phone verification
// via OTP was removed from signup (kept only for password reset, where it
// protects a security-sensitive action) so new users aren't blocked behind
// an SMS dependency just to start using the app.
const signup = asyncHandler(async (req, res) => {
  const { name, phone, password, role, state, city, email } = req.body;

  if (!name || !phone || !password) {
    throw new ApiError(400, "Name, phone, and password are required");
  }
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }
  if (!["client", "worker"].includes(role)) {
    throw new ApiError(400, "Role must be either 'client' or 'worker'");
  }

  const normalizedPhone = normalizePhone(phone);

  const existing = await User.findOne({ phone: normalizedPhone });
  if (existing) {
    throw new ApiError(409, "An account with this phone number already exists");
  }

  const user = await User.create({
    name,
    phone: normalizedPhone,
    email,
    password,
    role,
    state: state || "Lagos",
    city: city || "",
    phoneVerified: true,
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.status(201).json({
    success: true,
    message: "Account created successfully.",
    user: user.toSafeObject(),
    accessToken,
    refreshToken,
  });
});

// POST /api/auth/send-otp
// Resends an OTP for an existing, unverified phone number. Currently only
// reachable via the password-reset flow.
const sendOtp = asyncHandler(async (req, res) => {
  const { phone, purpose } = req.body;
  if (!phone) throw new ApiError(400, "Phone number is required");

  const normalizedPhone = normalizePhone(phone);
  const user = await User.findOne({ phone: normalizedPhone });
  if (!user) throw new ApiError(404, "No account found with this phone number");

  const code = generateOtpCode();
  await Otp.create({
    phone: normalizedPhone,
    code,
    purpose: purpose || "login",
    expiresAt: otpExpiryDate(10),
  });

  try {
    await sendOtpSms(normalizedPhone, code);
  } catch (smsErr) {
    console.error(`[send-otp] Failed to send OTP SMS to ${normalizedPhone}:`, smsErr.message);
    throw new ApiError(
      502,
      "We couldn't send the verification code right now. Please check your connection and try again in a moment."
    );
  }

  res.json({ success: true, message: "Verification code sent" });
});

// POST /api/auth/verify-otp
// Kept for completeness / potential future use, no longer part of the
// signup flow.
const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) throw new ApiError(400, "Phone and code are required");

  const normalizedPhone = normalizePhone(phone);

  const otpDoc = await Otp.findOne({
    phone: normalizedPhone,
    consumedAt: null,
  }).sort({ createdAt: -1 });

  if (!otpDoc) {
    throw new ApiError(400, "No pending verification code for this number. Request a new one.");
  }

  if (otpDoc.expiresAt < new Date()) {
    throw new ApiError(400, "This code has expired. Request a new one.");
  }

  if (otpDoc.attempts >= 5) {
    throw new ApiError(429, "Too many incorrect attempts. Request a new code.");
  }

  if (otpDoc.code !== String(code)) {
    otpDoc.attempts += 1;
    await otpDoc.save();
    throw new ApiError(400, "Incorrect verification code");
  }

  otpDoc.consumedAt = new Date();
  await otpDoc.save();

  const user = await User.findOneAndUpdate(
    { phone: normalizedPhone },
    { phoneVerified: true },
    { new: true }
  );

  if (!user) throw new ApiError(404, "No account found with this phone number");

  res.json({
    success: true,
    message: "Phone number verified",
    user: user.toSafeObject(),
  });
});

// POST /api/auth/forgot-password
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone) throw new ApiError(400, "Phone number is required");

  const normalizedPhone = normalizePhone(phone);
  const user = await User.findOne({ phone: normalizedPhone });

  if (user) {
    const code = generateOtpCode();
    await Otp.create({
      phone: normalizedPhone,
      code,
      purpose: "password-reset",
      expiresAt: otpExpiryDate(10),
    });

    try {
      await sendOtpSms(normalizedPhone, code);
    } catch (smsErr) {
      console.error(`[forgot-password] Failed to send OTP SMS to ${normalizedPhone}:`, smsErr.message);
      throw new ApiError(
        502,
        "We couldn't send the reset code right now. Please check your connection and try again in a moment."
      );
    }
  }

  res.json({
    success: true,
    message: "If an account exists for this phone number, a reset code has been sent.",
  });
});

// POST /api/auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const { phone, code, newPassword } = req.body;
  if (!phone || !code || !newPassword) {
    throw new ApiError(400, "Phone, code, and new password are required");
  }
  if (newPassword.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const normalizedPhone = normalizePhone(phone);

  const otpDoc = await Otp.findOne({
    phone: normalizedPhone,
    purpose: "password-reset",
    consumedAt: null,
  }).sort({ createdAt: -1 });

  if (!otpDoc) {
    throw new ApiError(400, "No pending reset code for this number. Request a new one.");
  }
  if (otpDoc.expiresAt < new Date()) {
    throw new ApiError(400, "This code has expired. Request a new one.");
  }
  if (otpDoc.attempts >= 5) {
    throw new ApiError(429, "Too many incorrect attempts. Request a new code.");
  }
  if (otpDoc.code !== String(code)) {
    otpDoc.attempts += 1;
    await otpDoc.save();
    throw new ApiError(400, "Incorrect reset code");
  }

  const user = await User.findOne({ phone: normalizedPhone });
  if (!user) throw new ApiError(404, "No account found with this phone number");

  user.password = newPassword;
  await user.save();

  otpDoc.consumedAt = new Date();
  await otpDoc.save();

  res.json({
    success: true,
    message: "Password reset successfully. You can now log in with your new password.",
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    throw new ApiError(400, "Phone and password are required");
  }

  const normalizedPhone = normalizePhone(phone);
  const user = await User.findOne({ phone: normalizedPhone }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Incorrect phone number or password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "This account has been deactivated. Contact support.");
  }

  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.json({
    success: true,
    user: user.toSafeObject(),
    accessToken,
    refreshToken,
  });
});

// POST /api/auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(400, "Refresh token is required");

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    throw new ApiError(401, "Account not found or deactivated");
  }

  const accessToken = generateAccessToken(user._id);
  res.json({ success: true, accessToken });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  let profile = null;
  if (req.user.role === "worker") {
    profile = await WorkerProfile.findOne({ user: req.user._id });
  }
  res.json({ success: true, user: req.user.toSafeObject(), workerProfile: profile });
});

module.exports = {
  signup,
  sendOtp,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
  login,
  refresh,
  getMe,
  normalizePhone,
};
