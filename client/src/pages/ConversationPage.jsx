import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Send, Phone, X, ExternalLink } from "lucide-react";
import { chatApi } from "../api/misc";
import { workerApi } from "../api/workers";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { formatRelativeTime } from "../utils/format";
import { PageSpinner } from "../components/ui/Badges";
import Button from "../components/ui/Button";

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
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [workerProfileId, setWorkerProfileId] = useState(null);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([chatApi.listConversations(), chatApi.getMessages(conversationId)])
      .then(([convRes, msgRes]) => {
        const conv = convRes.data.conversations.find((c) => c._id === conversationId);
        setConversation(conv || null);
        setMessages(msgRes.data.messages);

        const other = conv?.participants.find((p) => p._id !== user._id);
        if (other?.role === "worker") {
          workerApi
            .getByUserId(other._id)
            .then(({ data }) => setWorkerProfileId(data.profileId))
            .catch(() => setWorkerProfileId(null));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [conversationId]);

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
      try {
        const { data } = await chatApi.sendMessage(conversationId, trimmed);
        setMessages((prev) => [...prev, { ...data.message, sender: { _id: user._id, name: user.name } }]);
      } catch (err) {
        // swallow \u2014 the input already cleared; a production app would show a retry toast
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
        <button
          type="button"
          onClick={() => setShowProfilePanel(true)}
          className="flex items-center gap-3 rounded-lg px-1 py-1 transition-colors hover:bg-ink-50"
        >
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-indigo-100">
            {other?.avatarUrl ? (
              <img src={other.avatarUrl} alt={other.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[0.8rem] font-semibold text-indigo-600">
                {other?.name?.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="text-left">
            <p className="text-[0.95rem] font-semibold text-ink-800">{other?.name}</p>
            {otherTyping && <p className="text-[0.75rem] text-indigo-500">typing\u2026</p>}
          </div>
        </button>
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

      {showProfilePanel && other && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 sm:items-center"
          onClick={() => setShowProfilePanel(false)}
        >
          <div
            className="w-full max-w-sm rounded-t-3xl bg-white p-6 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowProfilePanel(false)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-400 hover:bg-ink-50"
              >
                <X className="h-4 w-4" strokeWidth={2.25} />
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 overflow-hidden rounded-full bg-indigo-100">
                {other.avatarUrl ? (
                  <img src={other.avatarUrl} alt={other.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[1.4rem] font-semibold text-indigo-600">
                    {other.name?.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <p className="mt-3 font-display text-[1.15rem] font-semibold text-ink-800">{other.name}</p>
              <p className="text-[0.85rem] capitalize text-ink-400">{other.role}</p>
              {other.phone && <p className="mt-1 text-[0.9rem] text-ink-600">{other.phone}</p>}
            </div>

            <div className="mt-5 flex flex-col gap-2.5">
              {other.phone && (
                <a href={`tel:${other.phone}`} className="w-full">
                  <Button variant="outline" size="md" className="w-full">
                    <Phone className="h-4 w-4" strokeWidth={2} />
                    Call {other.name?.split(" ")[0]}
                  </Button>
                </a>
              )}
              {workerProfileId && (
                <Link to={`/workers/${workerProfileId}`} className="w-full">
                  <Button variant="primary" size="md" className="w-full">
                    <ExternalLink className="h-4 w-4" strokeWidth={2} />
                    View full profile
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
