const express = require("express");
const {
  getVerificationQueue,
  approveVerification,
  rejectVerification,
  getPlatformStats,
  listUsers,
  deactivateUser,
} = require("../controllers/adminController");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();

router.use(protect, restrictTo("admin"));

router.get("/stats", getPlatformStats);
router.get("/verification-queue", getVerificationQueue);
router.patch("/verification/:workerId/approve", approveVerification);
router.patch("/verification/:workerId/reject", rejectVerification);
router.get("/users", listUsers);
router.patch("/users/:userId/deactivate", deactivateUser);

module.exports = router;
