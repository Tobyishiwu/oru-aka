const express = require("express");
const { TRADES } = require("../models/WorkerProfile");

const router = express.Router();

router.get("/trades", (req, res) => {
  res.json({ success: true, trades: TRADES });
});

router.get("/states", (req, res) => {
  res.json({ success: true, states: ["Enugu", "Lagos", "Abuja"] });
});

module.exports = router;
