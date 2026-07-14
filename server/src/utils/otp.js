const crypto = require("crypto");

function generateOtpCode() {
  // 6-digit numeric code, zero-padded
  return crypto.randomInt(0, 1000000).toString().padStart(6, "0");
}

function otpExpiryDate(minutes = 10) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

module.exports = { generateOtpCode, otpExpiryDate };
