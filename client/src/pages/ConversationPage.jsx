import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { chatApi } from "../api/misc";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { formatRelativeTime } from "../utils/format";
import { PageSpinner } from "../components/ui/Badges";

export default function ConversationPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState("");
  const [otherTyping, setOtherTyping] = useState(false);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load conversation history via REST
  useEffect(() => {
    setIsLoading(true);
    Promise.all([chatApi.listConversations(), chatApi.getMessages(conversationId)])
      .then(([convRes, msgRes]) => {
        const conv = convRes.data.conversations.find((c) => c._id === conversationId);
        setConversation(conv || null);
        setMessages(msgRes.data.messages);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [conversationId]);

  // Join the socket room and listen for real-time messages
  useEffect(() => {
    if (!socket) return;

    socket.emit("join-conversation", { conversationId });

    function handleNewMessage(payload) {
      if (payload.conversation !== conversationId) return;
      setMessages((prev) => [...prev, payload]);
    }

    function handleTyping({ userId }) {
      if (userId !== user._id) setOtherTyping(true);
    }
    function handleStopTyping({ userId }) {
      if (userId !== user._id) setOtherTyping(false);
    }

    socket.on("new-message", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.emit("leave-conversation", { conversationId });
      socket.off("new-message", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, [socket, conversationId, user._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleTextChange(value) {
    setText(value);
    if (!socket) return;
    socket.emit("typing", { conversationId });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { conversationId });
    }, 1500);
  }

  async function handleSend(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setText("");
    clearTimeout(typingTimeoutRef.current);
    socket?.emit("stop-typing", { conversationId });

    if (socket && isConnected) {
      socket.emit("send-message", { conversationId, text: trimmed });
    } else {
      // REST fallback if the socket connection isn't available
      try {
        const { data } = await chatApi.sendMessage(conversationId, trimmed);
        setMessages((prev) => [...prev, { ...data.message, sender: { _id: user._id, name: user.name } }]);
      } catch (err) {
        // swallow — the input already cleared; a production app would show a retry toast
      }
    }
  }

  if (isLoading) return <PageSpinner />;

  const other = conversation?.participants.find((p) => p._id !== user._id);

  return (
    <div className="conversation-viewport flex flex-col bg-bone">
      <div className="flex items-center gap-3 border-b border-ink-100 bg-white px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => navigate("/messages")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:bg-ink-50"
        >
          <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2} />
        </button>
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-indigo-100">
          {other?.avatarUrl ? (
            <img src={other.avatarUrl} alt={other.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[0.8rem] font-semibold text-indigo-600">
              {other?.name?.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="text-[0.95rem] font-semibold text-ink-800">{other?.name}</p>
          {otherTyping && <p className="text-[0.75rem] text-indigo-500">typing…</p>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {messages.map((msg) => {
            const isMine = msg.sender._id === user._id || msg.sender === user._id;
            return (
              <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-[0.9rem] ${
                    isMine ? "bg-indigo-700 text-bone" : "bg-white text-ink-700 shadow-card"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`mt-1 text-[0.7rem] ${isMine ? "text-indigo-200" : "text-ink-300"}`}>
                    {formatRelativeTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      <form onSubmit={handleSend} className="border-t border-ink-100 bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center gap-2.5">
          <input
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Type a message\u2026"
            className="flex-1 rounded-full border border-ink-100 px-4 py-2.5 text-[0.9rem] text-ink-700 placeholder:text-ink-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-brass-200"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-700 text-bone transition-colors hover:bg-indigo-800 disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" strokeWidth={2.25} />
          </button>
        </div>
      </form>
    </div>
  );
}
