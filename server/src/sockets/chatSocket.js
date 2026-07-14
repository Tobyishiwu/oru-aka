const { verifyAccessToken } = require("../utils/tokens");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

/**
 * Wires up Socket.io for real-time chat.
 *
 * Client flow:
 *  1. Connect with `auth: { token: accessToken }`
 *  2. Emit "join-conversation" with { conversationId }
 *  3. Emit "send-message" with { conversationId, text }
 *  4. Listen for "new-message" to receive messages in real time
 *  5. Listen for "typing" / "stop-typing" for the typing indicator
 */
function registerChatSocket(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));

      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) return next(new Error("Invalid user"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const userId = String(socket.user._id);

    // Personal room for direct notifications (e.g. unread badge updates)
    socket.join(`user:${userId}`);

    socket.on("join-conversation", async ({ conversationId }) => {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;

      const isParticipant = conversation.participants.some((p) => String(p) === userId);
      if (!isParticipant) return;

      socket.join(`conversation:${conversationId}`);
    });

    socket.on("leave-conversation", ({ conversationId }) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on("send-message", async ({ conversationId, text }) => {
      if (!text || !text.trim()) return;

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;

      const isParticipant = conversation.participants.some((p) => String(p) === userId);
      if (!isParticipant) return;

      const message = await Message.create({
        conversation: conversationId,
        sender: socket.user._id,
        text: text.trim(),
      });

      conversation.lastMessage = text.trim();
      conversation.lastMessageAt = new Date();
      const otherParticipant = conversation.participants.find((p) => String(p) !== userId);
      const currentUnread = conversation.unreadCounts.get(String(otherParticipant)) || 0;
      conversation.unreadCounts.set(String(otherParticipant), currentUnread + 1);
      await conversation.save();

      const payload = {
        _id: message._id,
        conversation: conversationId,
        sender: { _id: socket.user._id, name: socket.user.name, avatarUrl: socket.user.avatarUrl },
        text: message.text,
        createdAt: message.createdAt,
      };

      io.to(`conversation:${conversationId}`).emit("new-message", payload);
      // Notify the recipient even if they haven't joined the conversation room yet
      io.to(`user:${otherParticipant}`).emit("message-notification", payload);
    });

    socket.on("typing", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("typing", { userId });
    });

    socket.on("stop-typing", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("stop-typing", { userId });
    });
  });
}

module.exports = registerChatSocket;
