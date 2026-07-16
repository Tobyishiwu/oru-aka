const asyncHandler = require("express-async-handler");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const { ApiError } = require("../middleware/errorHandler");

// GET /api/chat/conversations
const listConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate("participants", "name avatarUrl role phone")
    .sort({ lastMessageAt: -1 });

  res.json({ success: true, conversations });
});

// POST /api/chat/conversations
// Finds an existing conversation with the given user, or creates a new one.
const getOrCreateConversation = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) throw new ApiError(400, "userId is required");
  if (userId === String(req.user._id)) {
    throw new ApiError(400, "You cannot start a conversation with yourself");
  }

  const otherUser = await User.findById(userId);
  if (!otherUser) throw new ApiError(404, "User not found");

  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, userId], $size: 2 },
  }).populate("participants", "name avatarUrl role phone");

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, userId],
    });
    conversation = await conversation.populate("participants", "name avatarUrl role phone");
  }

  res.status(200).json({ success: true, conversation });
});

// GET /api/chat/conversations/:conversationId/messages
const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new ApiError(404, "Conversation not found");

  const isParticipant = conversation.participants.some(
    (p) => String(p) === String(req.user._id)
  );
  if (!isParticipant) throw new ApiError(403, "You are not part of this conversation");

  const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 });

  // Mark unread messages as read and reset this user's unread counter
  await Message.updateMany(
    { conversation: conversationId, sender: { $ne: req.user._id }, readAt: null },
    { readAt: new Date() }
  );
  conversation.unreadCounts.set(String(req.user._id), 0);
  await conversation.save();

  res.json({ success: true, messages });
});

// POST /api/chat/conversations/:conversationId/messages
// REST fallback for sending a message (Socket.io is the primary real-time path \u2014
// see src/sockets/chatSocket.js \u2014 but this keeps the API usable without a socket
// connection, e.g. for testing or a future mobile client).
const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) throw new ApiError(400, "Message text is required");

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new ApiError(404, "Conversation not found");

  const isParticipant = conversation.participants.some(
    (p) => String(p) === String(req.user._id)
  );
  if (!isParticipant) throw new ApiError(403, "You are not part of this conversation");

  const message = await Message.create({
    conversation: conversationId,
    sender: req.user._id,
    text: text.trim(),
  });

  conversation.lastMessage = text.trim();
  conversation.lastMessageAt = new Date();
  const otherParticipant = conversation.participants.find(
    (p) => String(p) !== String(req.user._id)
  );
  const currentUnread = conversation.unreadCounts.get(String(otherParticipant)) || 0;
  conversation.unreadCounts.set(String(otherParticipant), currentUnread + 1);
  await conversation.save();

  res.status(201).json({ success: true, message });
});

module.exports = { listConversations, getOrCreateConversation, getMessages, sendMessage };

