const express = require("express");
const { getBoostPricing, requestBoost, getMyBoosts } = require("../controllers/boostController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/pricing", getBoostPricing);
router.post("/", protect, requestBoost);
router.get("/me", protect, getMyBoosts);

module.exports = router;
