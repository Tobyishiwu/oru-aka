const mongoose = require("mongoose");

// Boost is modeled now so the UI and data flow are ready; actual payment
// capture via Paystack/Flutterwave is wired in v1.1 (see project README).
const boostSchema = new mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkerProfile",
      required: true,
    },
    durationDays: {
      type: Number,
      enum: [7, 14, 30],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending_payment", "active", "expired", "cancelled"],
      default: "pending_payment",
    },
    startedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    paymentReference: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Boost", boostSchema);
