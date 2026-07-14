const express = require("express");
const { TRADES } = require("../models/WorkerProfile");
const WorkerProfile = require("../models/WorkerProfile");
const router = express.Router();

router.get("/trades", (req, res) => {
  res.json({ success: true, trades: TRADES });
});

router.get("/states", (req, res) => {
  res.json({ success: true, states: ["Enugu", "Lagos", "Abuja"] });
});

// GET /api/meta/trade-counts
// Real aggregation of published worker profiles grouped by trade, used to
// show honest counts on the homepage category cards instead of static numbers.
router.get("/trade-counts", async (req, res) => {
  const counts = await WorkerProfile.aggregate([
    { $match: { isPublished: true } },
    { $group: { _id: "$trade", count: { $sum: 1 } } },
  ]);

  const countsMap = {};
  counts.forEach((c) => {
    countsMap[c._id] = c.count;
  });

  res.json({ success: true, counts: countsMap });
});

module.exports = router;
