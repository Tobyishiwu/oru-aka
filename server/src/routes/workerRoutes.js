const express = require("express");
const {
  createWorkerProfile,
  updateMyWorkerProfile,
  getMyWorkerProfile,
  listWorkers,
  getWorkerById,
  uploadWorkerPhotos,
  deleteWorkerPhoto,
  updateWorkerPhotoCaption,
  submitVerification,
} = require("../controllers/workerController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Public
router.get("/", listWorkers);
router.get("/:id", getWorkerById);

// Authenticated (worker-owned)
router.post("/", protect, createWorkerProfile);
router.get("/me/profile", protect, getMyWorkerProfile);
router.patch("/me/profile", protect, updateMyWorkerProfile);
router.post("/me/photos", protect, upload.array("photos", 8), uploadWorkerPhotos);
router.patch("/me/photos/:photoId", protect, updateWorkerPhotoCaption);
router.delete("/me/photos/:photoId", protect, deleteWorkerPhoto);
router.post("/me/verification", protect, upload.single("idDocument"), submitVerification);

module.exports = router;
