const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { ApiError } = require("../middleware/errorHandler");
const { uploadBuffer, destroyImage } = require("../config/cloudinary");

// PATCH /api/users/me
const updateMe = asyncHandler(async (req, res) => {
  const editableFields = ["name", "email", "state", "city"];
  const user = await User.findById(req.user._id);

  for (const field of editableFields) {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  }

  await user.save();
  res.json({ success: true, user: user.toSafeObject() });
});

// POST /api/users/me/avatar
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "An image file is required");

  const user = await User.findById(req.user._id).select("+avatarPublicId");

  if (user.avatarPublicId) {
    await destroyImage(user.avatarPublicId);
  }

  const { url, publicId } = await uploadBuffer(req.file.buffer, "oru-aka/avatars");
  user.avatarUrl = url;
  user.avatarPublicId = publicId;
  await user.save();

  res.json({ success: true, avatarUrl: user.avatarUrl });
});

module.exports = { updateMe, uploadAvatar };
