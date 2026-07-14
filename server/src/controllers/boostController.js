const asyncHandler = require("express-async-handler");
const Boost = require("../models/Boost");
const WorkerProfile = require("../models/WorkerProfile");
const { ApiError } = require("../middleware/errorHandler");

const BOOST_PRICING = {
  7: 2500,
  14: 4000,
  30: 7000,
};

// GET /api/boosts/pricing
const getBoostPricing = asyncHandler(async (req, res) => {
  res.json({ success: true, pricing: BOOST_PRICING, paymentsEnabled: false });
});

// POST /api/boosts
// Payments are not yet wired (v1.1 per project scope). This records the
// intent as "pending_payment" so the schema, UI, and admin tooling are all
// ready the moment Paystack/Flutterwave is plugged in \u2014 nothing here
// activates a boost or charges a card today.
const requestBoost = asyncHandler(async (req, res) => {
  const { durationDays } = req.body;

  if (!BOOST_PRICING[durationDays]) {
    throw new ApiError(400, "durationDays must be one of 7, 14, or 30");
  }

  const profile = await WorkerProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, "Worker profile not found");

  const boost = await Boost.create({
    worker: profile._id,
    durationDays,
    amount: BOOST_PRICING[durationDays],
    status: "pending_payment",
  });

  res.status(201).json({
    success: true,
    message:
      "Boost payments are launching soon. Your request has been saved \u2014 we'll notify you when checkout is available.",
    boost,
  });
});

// GET /api/boosts/me
const getMyBoosts = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, "Worker profile not found");

  const boosts = await Boost.find({ worker: profile._id }).sort({ createdAt: -1 });
  res.json({ success: true, boosts });
});

module.exports = { getBoostPricing, requestBoost, getMyBoosts };
