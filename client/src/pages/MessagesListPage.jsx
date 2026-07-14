import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { chatApi } from "../api/misc";
import { useAuth } from "../context/AuthContext";
import { formatRelativeTime } from "../utils/format";
import { PageSpinner } from "../components/ui/Badges";

export default function MessagesListPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    chatApi
      .listConversations()
      .then(({ data }) => setConversations(data.conversations))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <PageSpinner />;

  return (
    <div className="bg-bone py-10 sm:py-12">
      <div className="mx-auto max-w-[760px] px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-[1.7rem] font-semibold tracking-tight text-indigo-800">Messages</h1>

        {conversations.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-card border border-dashed border-ink-200 bg-white px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-50">
              <MessageCircle className="h-6 w-6 text-ink-300" strokeWidth={1.75} />
            </span>
            <h3 className="mt-4 font-display text-[1.05rem] font-semibold text-ink-800">No conversations yet</h3>
            <p className="mt-1.5 max-w-sm text-[0.875rem] text-ink-400">
              Message a worker from their profile to start a conversation.
            </p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-2">
            {conversations.map((conv) => {
              const other = conv.participants.find((p) => p._id !== user._id);
              const unread = conv.unreadCounts?.[user._id] || 0;
              return (
                <Link
                  key={conv._id}
                  to={`/messages/${conv._id}`}
                  className="flex items-center gap-3.5 rounded-card border border-ink-100 bg-white p-4 transition-colors hover:border-indigo-300"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-indigo-100">
                    {other?.avatarUrl ? (
                      <img src={other.avatarUrl} alt={other.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[0.9rem] font-semibold text-indigo-600">
                        {other?.name?.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[0.95rem] font-semibold text-ink-800">{other?.name}</p>
                      <span className="shrink-0 text-[0.75rem] text-ink-300">
                        {formatRelativeTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p className="truncate text-[0.85rem] text-ink-400">{conv.lastMessage || "No messages yet"}</p>
                  </div>
                  {unread > 0 && (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brass-400 px-1.5 text-[0.7rem] font-bold text-indigo-900">
                      {unread}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
