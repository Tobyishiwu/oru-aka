const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");
const WorkerProfile = require("../models/WorkerProfile");
const { ApiError } = require("../middleware/errorHandler");

async function recomputeRating(workerId) {
  const stats = await Review.aggregate([
    { $match: { worker: workerId } },
    { $group: { _id: "$worker", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  const { avg = 0, count = 0 } = stats[0] || {};
  await WorkerProfile.findByIdAndUpdate(workerId, {
    ratingAverage: Math.round(avg * 10) / 10,
    ratingCount: count,
  });
}

// POST /api/workers/:workerId/reviews
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { workerId } = req.params;

  if (!rating || rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  const worker = await WorkerProfile.findById(workerId);
  if (!worker) throw new ApiError(404, "Worker profile not found");

  if (String(worker.user) === String(req.user._id)) {
    throw new ApiError(400, "You cannot review your own profile");
  }

  let review;
  try {
    review = await Review.create({
      worker: workerId,
      client: req.user._id,
      rating,
      comment,
    });
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(409, "You have already reviewed this worker");
    }
    throw err;
  }

  await recomputeRating(workerId);
  await WorkerProfile.findByIdAndUpdate(workerId, { $inc: { jobsCompletedCount: 1 } });

  res.status(201).json({ success: true, review });
});

// GET /api/workers/:workerId/reviews
const listReviewsForWorker = asyncHandler(async (req, res) => {
  const { workerId } = req.params;
  const reviews = await Review.find({ worker: workerId })
    .populate("client", "name avatarUrl")
    .sort({ createdAt: -1 });

  res.json({ success: true, reviews });
});

module.exports = { createReview, listReviewsForWorker };

