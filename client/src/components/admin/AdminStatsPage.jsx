import { useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck, Users, Clock } from "lucide-react";
import { adminApi } from "../../api/misc";
import { PageSpinner } from "../ui/Badges";

export default function AdminStatsPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getStats()
      .then(({ data }) => setStats(data.stats))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <PageSpinner />;

  const CARDS = [
    { label: "Total workers", value: stats?.totalWorkers ?? 0, icon: Users, color: "text-indigo-600 bg-indigo-50" },
    { label: "Verified workers", value: stats?.verifiedWorkers ?? 0, icon: ShieldCheck, color: "text-verified-600 bg-verified-50" },
    { label: "Total clients", value: stats?.totalClients ?? 0, icon: CheckCircle2, color: "text-brass-600 bg-brass-50" },
    { label: "Pending verifications", value: stats?.pendingVerifications ?? 0, icon: Clock, color: "text-rust-500 bg-rust-50" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map((card) => (
        <div key={card.label} className="rounded-card border border-ink-100 bg-white p-5">
          <span className={`flex h-10 w-10 items-center justify-center rounded-full ${card.color}`}>
            <card.icon className="h-5 w-5" strokeWidth={2} />
          </span>
          <p className="mt-4 font-mono text-[1.5rem] font-semibold text-ink-800">{card.value}</p>
          <p className="mt-0.5 text-[0.825rem] text-ink-400">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
