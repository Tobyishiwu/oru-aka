const mongoose = require("mongoose");

const TRADES = [
  "Electrician",
  "Plumber",
  "Tiler",
  "Tailor",
  "Carpenter",
  "AC Technician",
  "Painter",
  "Welder",
  "Solar Installer",
  "POP Ceiling Installer",
  "Mechanic",
  "Mason",
  "Generator Technician",
  "Handyman",
];

const workerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    trade: {
      type: String,
      enum: TRADES,
      required: [true, "Trade/profession is required"],
    },
    tagline: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    state: {
      type: String,
      enum: ["Enugu", "Lagos", "Abuja"],
      required: true,
    },
    city: {
      type: String,
      trim: true,
      required: [true, "City or neighborhood is required"],
    },
    yearsExperience: {
      type: Number,
      min: 0,
      max: 60,
      default: 0,
    },
    startingPrice: {
      type: Number,
      min: 0,
      required: [true, "Starting price is required"],
    },
    priceUnit: {
      type: String,
      enum: ["per hour", "per job", "per day"],
      default: "per job",
    },
    photos: {
      type: [
        {
          url: String,
          publicId: String,
          caption: { type: String, trim: true, maxlength: 140, default: "" },
        },
      ],
      default: [],
    },
    availability: {
      type: String,
      enum: ["Available now", "Available this week", "Booked"],
      default: "Available now",
    },

    // ---- Verification (tiered, async \u2014 see project plan) ----
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified", "rejected"],
      default: "unverified",
    },
    verificationIdUrl: {
      type: String,
      select: false,
    },
    verificationIdPublicId: {
      type: String,
      select: false,
    },
    verificationNotes: {
      type: String,
      select: false,
    },
    verifiedAt: {
      type: Date,
    },

    // ---- Trust signals ----
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    jobsCompletedCount: {
      type: Number,
      default: 0,
    },
    responseTimeLabel: {
      type: String,
      enum: ["Under 30 mins", "Under 1 hour", "Under 2 hours", "Under 3 hours", "Under 4 hours", "Under 24 hours"],
      default: "Under 24 hours",
    },

    // ---- Boost (schema ready, payment wired in v1.1) ----
    isBoosted: {
      type: Boolean,
      default: false,
    },
    boostExpiresAt: {
      type: Date,
      default: null,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

workerProfileSchema.index({ trade: 1, state: 1, city: 1 });
workerProfileSchema.index({ isBoosted: -1, ratingAverage: -1 });
workerProfileSchema.index({ skills: 1 });

workerProfileSchema.statics.TRADES = TRADES;

module.exports = mongoose.model("WorkerProfile", workerProfileSchema);
module.exports.TRADES = TRADES;
