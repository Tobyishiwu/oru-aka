const express = require("express");
const { createReview, listReviewsForWorker } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.get("/", listReviewsForWorker);
router.post("/", protect, createReview);

module.exports = router;
