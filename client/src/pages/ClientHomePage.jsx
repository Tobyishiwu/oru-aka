import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MessageCircle } from "lucide-react";
import { chatApi } from "../api/misc";
import { useAuth } from "../context/AuthContext";
import { formatRelativeTime } from "../utils/format";
import { PageSpinner } from "../components/ui/Badges";

export default function ClientHomePage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    chatApi
      .listConversations()
      .then(({ data }) => setConversations(data.conversations.slice(0, 5)))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-bone py-10 sm:py-12">
      <div className="mx-auto max-w-[760px] px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-[1.7rem] font-semibold tracking-tight text-indigo-800">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="mt-1 text-[0.9rem] text-ink-400">What do you need done today?</p>

        <Link
          to="/workers"
          className="mt-6 flex items-center justify-between gap-4 rounded-card bg-indigo-800 px-6 py-5 text-bone transition-colors hover:bg-indigo-900"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brass-400 text-indigo-900">
              <Search className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <div>
              <p className="font-display text-[1.05rem] font-semibold">Find a worker</p>
              <p className="text-[0.85rem] text-indigo-200">Browse verified tradespeople near you</p>
            </div>
          </div>
        </Link>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[1.1rem] font-semibold text-ink-800">Recent conversations</h2>
            {conversations.length > 0 && (
              <Link to="/messages" className="text-[0.85rem] font-semibold text-indigo-700 hover:underline">
                View all
              </Link>
            )}
          </div>

          {isLoading ? (
            <PageSpinner />
          ) : conversations.length === 0 ? (
            <div className="mt-4 flex flex-col items-center justify-center rounded-card border border-dashed border-ink-200 bg-white px-6 py-12 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-50">
                <MessageCircle className="h-5 w-5 text-ink-300" strokeWidth={1.75} />
              </span>
              <p className="mt-3 text-[0.875rem] text-ink-400">
                No conversations yet. Find a worker to get started.
              </p>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-2">
              {conversations.map((conv) => {
                const other = conv.participants.find((p) => p._id !== user._id);
                return (
                  <Link
                    key={conv._id}
                    to={`/messages/${conv._id}`}
                    className="flex items-center gap-3.5 rounded-card border border-ink-100 bg-white p-4 transition-colors hover:border-indigo-300"
                  >
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-indigo-100">
                      {other?.avatarUrl ? (
                        <img src={other.avatarUrl} alt={other.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[0.85rem] font-semibold text-indigo-600">
                          {other?.name?.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.9rem] font-semibold text-ink-800">{other?.name}</p>
                      <p className="truncate text-[0.8rem] text-ink-400">{conv.lastMessage || "No messages yet"}</p>
                    </div>
                    <span className="shrink-0 text-[0.75rem] text-ink-300">
                      {formatRelativeTime(conv.lastMessageAt)}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
