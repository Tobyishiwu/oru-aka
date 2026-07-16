import { useEffect, useState } from "react";
import { UserX, UserCheck } from "lucide-react";
import { adminApi } from "../../api/misc";
import { formatRelativeTime } from "../../utils/format";
import Button from "../ui/Button";
import { PageSpinner } from "../ui/Badges";

const ROLE_FILTERS = [
  { value: "", label: "All" },
  { value: "client", label: "Clients" },
  { value: "worker", label: "Workers" },
  { value: "admin", label: "Admins" },
];

const ROLE_STYLES = {
  admin: "bg-indigo-50 text-indigo-600",
  worker: "bg-brass-50 text-brass-600",
  client: "bg-ink-100 text-ink-600",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20 });
  const [roleFilter, setRoleFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadUsers(1);
  }, [roleFilter]);

  function loadUsers(page) {
    setIsLoading(true);
    adminApi
      .listUsers({ role: roleFilter || undefined, page, limit: 20 })
      .then(({ data }) => {
        setUsers(data.users);
        setPagination(data.pagination);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }

  async function handleToggleActive(u) {
    const isActivating = !u.isActive;
    const confirmMessage = isActivating
      ? "Reactivate this user? They will regain access to their account."
      : "Deactivate this user? They will lose access to their account.";
    if (!window.confirm(confirmMessage)) return;

    setProcessingId(u._id);
    try {
      if (isActivating) {
        await adminApi.activateUser(u._id);
      } else {
        await adminApi.deactivateUser(u._id);
      }
      setUsers((prev) =>
        prev.map((user) => (user._id === u._id ? { ...user, isActive: isActivating } : user))
      );
    } catch (err) {
      // no-op
    } finally {
      setProcessingId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.limit));

  return (
    <div className="rounded-card border border-ink-100 bg-white p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-[1.2rem] font-semibold text-ink-800">
          Users {pagination.total > 0 && `(${pagination.total})`}
        </h2>

        <div className="flex gap-2 overflow-x-auto">
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setRoleFilter(f.value)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[0.8rem] font-semibold transition-colors ${
                roleFilter === f.value
                  ? "bg-indigo-700 text-bone"
                  : "bg-ink-50 text-ink-500 hover:bg-ink-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : users.length === 0 ? (
        <p className="mt-6 text-[0.875rem] text-ink-400">No users match this filter.</p>
      ) : (
        <>
          <div className="mt-5 flex flex-col gap-3">
            {users.map((u) => (
              <div
                key={u._id}
                className="flex flex-col gap-3 rounded-xl border border-ink-100 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[0.9rem] font-semibold text-ink-800 truncate">{u.name}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold capitalize ${
                        ROLE_STYLES[u.role] || "bg-ink-100 text-ink-600"
                      }`}
                    >
                      {u.role}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold ${
                        u.isActive ? "bg-verified-50 text-verified-600" : "bg-rust-50 text-rust-500"
                      }`}
                    >
                      {u.isActive ? "Active" : "Deactivated"}
                    </span>
                  </div>
                  <p className="mt-1 text-[0.825rem] text-ink-400 truncate">
                    {u.phone} &middot; joined {formatRelativeTime(u.createdAt)}
                  </p>
                </div>

                <Button
                  variant={u.isActive ? "danger" : "outline"}
                  size="sm"
                  onClick={() => handleToggleActive(u)}
                  disabled={processingId === u._id}
                  className="shrink-0"
                >
                  {u.isActive ? (
                    <UserX className="h-4 w-4" strokeWidth={2.25} />
                  ) : (
                    <UserCheck className="h-4 w-4" strokeWidth={2.25} />
                  )}
                  {processingId === u._id ? "Saving\u2026" : u.isActive ? "Deactivate" : "Reactivate"}
                </Button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => loadUsers(pagination.page - 1)}
              >
                Previous
              </Button>
              <span className="text-[0.825rem] text-ink-400">
                Page {pagination.page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= totalPages}
                onClick={() => loadUsers(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
