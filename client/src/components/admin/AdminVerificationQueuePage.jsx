import { useEffect, useState } from "react";
import { Check, ExternalLink, X } from "lucide-react";
import { adminApi } from "../../api/misc";
import { formatRelativeTime } from "../../utils/format";
import Button from "../ui/Button";
import { PageSpinner } from "../ui/Badges";

export default function AdminVerificationQueuePage() {
  const [queue, setQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadQueue();
  }, []);

  function loadQueue() {
    setIsLoading(true);
    adminApi
      .getVerificationQueue()
      .then(({ data }) => setQueue(data.queue))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }

  async function handleApprove(workerId) {
    setProcessingId(workerId);
    try {
      await adminApi.approveVerification(workerId);
      setQueue((prev) => prev.filter((w) => w._id !== workerId));
    } catch (err) {
      // no-op \u2014 row stays in queue for retry
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(workerId) {
    setProcessingId(workerId);
    try {
      await adminApi.rejectVerification(workerId, "ID document unclear or invalid");
      setQueue((prev) => prev.filter((w) => w._id !== workerId));
    } catch (err) {
      // no-op
    } finally {
      setProcessingId(null);
    }
  }

  if (isLoading) return <PageSpinner />;

  return (
    <div className="rounded-card border border-ink-100 bg-white p-6">
      <h2 className="font-display text-[1.2rem] font-semibold text-ink-800">
        Verification queue {queue.length > 0 && `(${queue.length})`}
      </h2>

      {queue.length === 0 ? (
        <p className="mt-4 text-[0.875rem] text-ink-400">No pending verifications. All caught up.</p>
      ) : (
        <div className="mt-5 flex flex-col gap-4">
          {queue.map((item) => (
            <div key={item._id} className="flex flex-col gap-4 rounded-xl border border-ink-100 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-100">
                  {item.verificationIdUrl && (
                    <img src={item.verificationIdUrl} alt="ID document" className="h-full w-full object-cover" />
                  )}
                </div>
                <div>
                  <p className="text-[0.9rem] font-semibold text-ink-800">{item.user?.name}</p>
                  <p className="text-[0.825rem] text-ink-400">
                    {item.trade} &middot; {item.user?.phone} &middot; submitted {formatRelativeTime(item.updatedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item.verificationIdUrl && (
                  <a
                    href={item.verificationIdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400 hover:bg-ink-50"
                    aria-label="View full ID"
                  >
                    <ExternalLink className="h-4 w-4" strokeWidth={2} />
                  </a>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleReject(item._id)}
                  disabled={processingId === item._id}
                >
                  <X className="h-4 w-4" strokeWidth={2.25} />
                  Reject
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApprove(item._id)}
                  disabled={processingId === item._id}
                >
                  <Check className="h-4 w-4" strokeWidth={2.25} />
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


