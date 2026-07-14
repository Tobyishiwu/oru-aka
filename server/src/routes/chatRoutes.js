const express = require("express");
const {
  listConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
} = require("../controllers/chatController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/conversations", listConversations);
router.post("/conversations", getOrCreateConversation);
router.get("/conversations/:conversationId/messages", getMessages);
router.post("/conversations/:conversationId/messages", sendMessage);

module.exports = router;
