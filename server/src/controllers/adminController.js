const asyncHandler = require("express-async-handler");
const WorkerProfile = require("../models/WorkerProfile");
const User = require("../models/User");
const { ApiError } = require("../middleware/errorHandler");

// GET /api/admin/verification-queue
const getVerificationQueue = asyncHandler(async (req, res) => {
  const pending = await WorkerProfile.find({ verificationStatus: "pending" })
    .select("+verificationIdUrl")
    .populate("user", "name phone phoneVerified createdAt")
    .sort({ updatedAt: 1 });

  res.json({ success: true, queue: pending });
});

// PATCH /api/admin/verification/:workerId/approve
const approveVerification = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findById(req.params.workerId);
  if (!profile) throw new ApiError(404, "Worker profile not found");

  profile.verificationStatus = "verified";
  profile.verifiedAt = new Date();
  profile.verificationNotes = req.body.notes || "";
  await profile.save();

  res.json({ success: true, message: "Worker verified", profile });
});

// PATCH /api/admin/verification/:workerId/reject
const rejectVerification = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findById(req.params.workerId).select(
    "+verificationIdUrl +verificationIdPublicId"
  );
  if (!profile) throw new ApiError(404, "Worker profile not found");

  profile.verificationStatus = "rejected";
  profile.verificationNotes = req.body.notes || "ID document unclear or invalid";
  await profile.save();

  res.json({ success: true, message: "Verification rejected", profile });
});

// GET /api/admin/stats
const getPlatformStats = asyncHandler(async (req, res) => {
  const [totalWorkers, verifiedWorkers, totalClients, pendingVerifications] = await Promise.all([
    WorkerProfile.countDocuments({}),
    WorkerProfile.countDocuments({ verificationStatus: "verified" }),
    User.countDocuments({ role: "client" }),
    WorkerProfile.countDocuments({ verificationStatus: "pending" }),
  ]);

  res.json({
    success: true,
    stats: { totalWorkers, verifiedWorkers, totalClients, pendingVerifications },
  });
});

// GET /api/admin/users
const listUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.role = role;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    User.countDocuments(filter),
  ]);

  res.json({ success: true, users, pagination: { total, page: pageNum, limit: limitNum } });
});

// PATCH /api/admin/users/:userId/deactivate
const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) throw new ApiError(404, "User not found");

  user.isActive = false;
  await user.save();

  // Deactivating a worker's account should also remove their listing from
  // public search results, not just block their login.
  if (user.role === "worker") {
    await WorkerProfile.findOneAndUpdate({ user: user._id }, { isPublished: false });
  }

  res.json({ success: true, message: "User deactivated" });
});

// PATCH /api/admin/users/:userId/activate
const activateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) throw new ApiError(404, "User not found");

  user.isActive = true;
  await user.save();

  // Reactivating a worker's account should also restore their public listing.
  if (user.role === "worker") {
    await WorkerProfile.findOneAndUpdate({ user: user._id }, { isPublished: true });
  }

  res.json({ success: true, message: "User reactivated" });
});

module.exports = {
  getVerificationQueue,
  approveVerification,
  rejectVerification,
  getPlatformStats,
  listUsers,
  deactivateUser,
  activateUser,
};



