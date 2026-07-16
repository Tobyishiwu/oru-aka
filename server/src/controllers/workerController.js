const asyncHandler = require("express-async-handler");
const WorkerProfile = require("../models/WorkerProfile");
const User = require("../models/User");
const { ApiError } = require("../middleware/errorHandler");
const { uploadBuffer, destroyImage } = require("../config/cloudinary");

// POST /api/workers
// Creates the worker profile for the currently authenticated worker user.
const createWorkerProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== "worker") {
    throw new ApiError(403, "Only accounts registered as 'worker' can create a worker profile");
  }

  const existing = await WorkerProfile.findOne({ user: req.user._id });
  if (existing) {
    throw new ApiError(409, "You already have a worker profile. Use update instead.");
  }

  const {
    trade,
    tagline,
    bio,
    skills,
    state,
    city,
    yearsExperience,
    startingPrice,
    priceUnit,
    availability,
  } = req.body;

  if (!trade || !state || !city || startingPrice === undefined) {
    throw new ApiError(400, "Trade, state, city, and starting price are required");
  }

  const profile = await WorkerProfile.create({
    user: req.user._id,
    trade,
    tagline,
    bio,
    skills: Array.isArray(skills) ? skills : skills ? String(skills).split(",").map((s) => s.trim()) : [],
    state,
    city,
    yearsExperience: Number(yearsExperience) || 0,
    startingPrice: Number(startingPrice),
    priceUnit,
    availability,
  });

  res.status(201).json({ success: true, profile });
});

// PATCH /api/workers/me
const updateMyWorkerProfile = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, "Worker profile not found");

  const editableFields = [
    "trade",
    "tagline",
    "bio",
    "skills",
    "state",
    "city",
    "yearsExperience",
    "startingPrice",
    "priceUnit",
    "availability",
    "isPublished",
  ];

  for (const field of editableFields) {
    if (req.body[field] !== undefined) {
      if (field === "skills" && !Array.isArray(req.body.skills)) {
        profile.skills = String(req.body.skills)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else {
        profile[field] = req.body[field];
      }
    }
  }

  await profile.save();
  res.json({ success: true, profile });
});

// GET /api/workers/me
const getMyWorkerProfile = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOne({ user: req.user._id }).populate(
    "user",
    "name avatarUrl phone phoneVerified"
  );
  if (!profile) throw new ApiError(404, "Worker profile not found");
  res.json({ success: true, profile });
});

// GET /api/workers
// Public search/browse endpoint with filtering, sorting, and pagination.
// Boosted workers are surfaced first within whatever sort order is requested.
const listWorkers = asyncHandler(async (req, res) => {
  const {
    trade,
    state,
    city,
    minExperience,
    maxRate,
    minRate,
    availability,
    verifiedOnly,
    skills,
    q,
    sort = "recommended",
    page = 1,
    limit = 12,
  } = req.query;

  const filter = { isPublished: true };

  if (trade) filter.trade = Array.isArray(trade) ? { $in: trade } : trade;
  if (state) filter.state = state;
  if (city) filter.city = new RegExp(city, "i");
  if (minExperience) filter.yearsExperience = { $gte: Number(minExperience) };
  if (minRate || maxRate) {
    filter.startingPrice = {};
    if (minRate) filter.startingPrice.$gte = Number(minRate);
    if (maxRate) filter.startingPrice.$lte = Number(maxRate);
  }
  if (availability) {
    filter.availability = Array.isArray(availability) ? { $in: availability } : availability;
  }
  if (verifiedOnly === "true") filter.verificationStatus = "verified";
  if (skills) {
    const skillsArr = Array.isArray(skills) ? skills : [skills];
    filter.skills = { $in: skillsArr };
  }
  if (q) {
    filter.$or = [
      { trade: new RegExp(q, "i") },
      { tagline: new RegExp(q, "i") },
      { skills: new RegExp(q, "i") },
    ];
  }

  const sortMap = {
    recommended: { isBoosted: -1, ratingAverage: -1, jobsCompletedCount: -1 },
    rating: { isBoosted: -1, ratingAverage: -1 },
    "price-low": { isBoosted: -1, startingPrice: 1 },
    "price-high": { isBoosted: -1, startingPrice: -1 },
    newest: { isBoosted: -1, createdAt: -1 },
  };
  const sortQuery = sortMap[sort] || sortMap.recommended;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [workers, total] = await Promise.all([
    WorkerProfile.find(filter)
      .populate("user", "name avatarUrl phone phoneVerified")
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum),
    WorkerProfile.countDocuments(filter),
  ]);

  res.json({
    success: true,
    workers,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// GET /api/workers/:id
const getWorkerById = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findById(req.params.id).populate(
    "user",
    "name avatarUrl phone phoneVerified createdAt"
  );
  if (!profile || !profile.isPublished) {
    throw new ApiError(404, "Worker profile not found");
  }
  res.json({ success: true, profile });
});

// POST /api/workers/me/photos
const uploadWorkerPhotos = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, "Worker profile not found");

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one image file is required");
  }
  if (profile.photos.length + req.files.length > 8) {
    throw new ApiError(400, "A worker profile can have a maximum of 8 photos");
  }

  const uploads = await Promise.all(
    req.files.map((file) => uploadBuffer(file.buffer, "oru-aka/worker-photos"))
  );

  profile.photos.push(...uploads.map((u) => ({ url: u.url, publicId: u.publicId })));
  await profile.save();

  res.status(201).json({ success: true, photos: profile.photos });
});

// DELETE /api/workers/me/photos/:photoId
const deleteWorkerPhoto = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, "Worker profile not found");

  const photo = profile.photos.find((p) => String(p._id) === req.params.photoId);
  if (!photo) throw new ApiError(404, "Photo not found");

  await destroyImage(photo.publicId);
  profile.photos = profile.photos.filter((p) => String(p._id) !== req.params.photoId);
  await profile.save();

  res.json({ success: true, photos: profile.photos });
});

// PATCH /api/workers/me/photos/:photoId
// Updates a portfolio photo's caption, e.g. "Rewired a 4-bedroom duplex in Enugu".
const updateWorkerPhotoCaption = asyncHandler(async (req, res) => {
  const { caption } = req.body;
  const profile = await WorkerProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, "Worker profile not found");

  const photo = profile.photos.find((p) => String(p._id) === req.params.photoId);
  if (!photo) throw new ApiError(404, "Photo not found");

  photo.caption = (caption || "").slice(0, 140);
  await profile.save();

  res.json({ success: true, photos: profile.photos });
});

// POST /api/workers/me/verification
// Submits a government ID for async review. Status moves to "pending" until
// an admin approves or rejects it via the admin queue.
const submitVerification = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOne({ user: req.user._id }).select(
    "+verificationIdUrl +verificationIdPublicId"
  );
  if (!profile) throw new ApiError(404, "Worker profile not found");

  if (!req.file) throw new ApiError(400, "An ID document image is required");

  if (profile.verificationStatus === "verified") {
    throw new ApiError(409, "This profile is already verified");
  }

  const { url, publicId } = await uploadBuffer(req.file.buffer, "oru-aka/verification-ids");

  profile.verificationIdUrl = url;
  profile.verificationIdPublicId = publicId;
  profile.verificationStatus = "pending";
  await profile.save();

  res.status(201).json({
    success: true,
    message: "ID submitted. Verification is typically reviewed within 24\u201348 hours.",
    verificationStatus: profile.verificationStatus,
  });
});

const getWorkerByUserId = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOne({ user: req.params.userId, isPublished: true });
  if (!profile) throw new ApiError(404, "Worker profile not found");
  res.json({ success: true, profileId: profile._id });
});

module.exports = {
  createWorkerProfile,
  getWorkerByUserId,
  updateMyWorkerProfile,
  getMyWorkerProfile,
  listWorkers,
  getWorkerById,
  uploadWorkerPhotos,
  deleteWorkerPhoto,
  updateWorkerPhotoCaption,
  submitVerification,
};

