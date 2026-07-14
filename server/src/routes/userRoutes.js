const express = require("express");
const { updateMe, uploadAvatar } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(protect);

router.patch("/me", updateMe);
router.post("/me/avatar", upload.single("avatar"), uploadAvatar);

module.exports = router;
