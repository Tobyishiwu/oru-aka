const asyncHandler = require("express-async-handler");
const { verifyAccessToken } = require("../utils/tokens");
const { ApiError } = require("./errorHandler");
const User = require("../models/User");

/**
 * Verifies the Bearer access token and attaches req.user (full, safe document).
 */
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    throw new ApiError(401, "Not authorized \u2014 no token provided");
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    throw new ApiError(401, "Not authorized \u2014 invalid or expired token");
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    throw new ApiError(401, "Not authorized \u2014 account not found or deactivated");
  }

  req.user = user;
  next();
});

/**
 * Restricts a route to specific roles. Use after `protect`.
 * Example: router.post('/admin/x', protect, restrictTo('admin'), handler)
 */
function restrictTo(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission to perform this action");
    }
    next();
  };
}

module.exports = { protect, restrictTo };
