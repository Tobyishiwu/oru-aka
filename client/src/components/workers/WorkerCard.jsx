import { Link } from "react-router-dom";
import { Briefcase, Clock, MapPin } from "lucide-react";
import { getTradeIcon } from "../../utils/tradeIcons";
import { formatNaira } from "../../utils/format";
import { RatingStars, VerifiedBadge } from "../ui/Badges";

const AVAILABILITY_STYLE = {
  "Available now": "bg-verified-50 text-verified-600",
  "Available this week": "bg-brass-50 text-brass-600",
  Booked: "bg-ink-100 text-ink-400",
};

export default function WorkerCard({ worker, className = "" }) {
  const TradeIcon = getTradeIcon(worker.trade);
  const photo = worker.photos?.[0]?.url || worker.user?.avatarUrl;

  return (
    <Link
      to={`/workers/${worker._id}`}
      className={`group relative flex flex-col overflow-hidden rounded-card border border-ink-100 bg-white shadow-card transition-shadow hover:shadow-card-lg ${className}`}
    >
      {worker.isBoosted && (
        <div className="absolute left-4 top-4 z-10 rounded-full bg-brass-400 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-indigo-900">
          Featured
        </div>
      )}

      <div className="absolute right-4 top-0 z-10 flex h-9 w-8 flex-col items-center justify-start rounded-b-md bg-indigo-800 pt-1.5">
        <TradeIcon className="h-4 w-4 text-bone" strokeWidth={2} />
      </div>

      <div className="flex items-start gap-3.5 p-5 pb-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ink-100">
          {photo ? (
            <img src={photo} alt={worker.user?.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[1.1rem] font-semibold text-ink-400">
              {worker.user?.name?.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-display text-[1.05rem] font-semibold text-ink-800">
              {worker.user?.name}
            </h3>
          </div>
          <p className="truncate text-[0.875rem] font-medium text-brass-600">{worker.trade}</p>
          <div className="mt-1 flex items-center gap-1 text-[0.8rem] text-ink-300">
            <MapPin className="h-3 w-3" strokeWidth={2} />
            <span className="truncate">
              {worker.city}, {worker.state}
            </span>
          </div>
        </div>
      </div>

      {worker.tagline && (
        <p className="px-5 text-[0.875rem] leading-snug text-ink-500 line-clamp-2">
          {worker.tagline}
        </p>
      )}

      <div className="mt-3 flex items-center gap-2 px-5">
        <RatingStars rating={worker.ratingAverage || 0} reviewCount={worker.ratingCount || 0} />
        <VerifiedBadge status={worker.verificationStatus} />
      </div>

      {worker.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 px-5">
          {worker.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="rounded-full bg-ink-50 px-2.5 py-1 text-[0.75rem] font-medium text-ink-500">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-ink-100 px-5 py-3.5 text-center font-mono">
        <div>
          <p className="flex items-center justify-center gap-1 text-[0.9rem] font-semibold text-ink-800">
            <Briefcase className="h-3 w-3 text-ink-300" strokeWidth={2} />
            {worker.jobsCompletedCount || 0}
          </p>
          <p className="mt-0.5 font-body text-[0.7rem] text-ink-300">jobs done</p>
        </div>
        <div className="border-x border-ink-100">
          <p className="text-[0.9rem] font-semibold text-ink-800">{worker.yearsExperience}y</p>
          <p className="mt-0.5 font-body text-[0.7rem] text-ink-300">experience</p>
        </div>
        <div>
          <p className="flex items-center justify-center gap-1 text-[0.9rem] font-semibold text-ink-800">
            <Clock className="h-3 w-3 text-ink-300" strokeWidth={2} />
          </p>
          <p className="mt-0.5 font-body text-[0.7rem] text-ink-300">{worker.responseTimeLabel}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-ink-100 bg-ink-50/40 px-5 py-4">
        <div>
          <p className="font-mono text-[1rem] font-semibold text-ink-800">
            From {formatNaira(worker.startingPrice)}
          </p>
          <span className={`mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-[0.7rem] font-medium ${AVAILABILITY_STYLE[worker.availability] || ""}`}>
            {worker.availability}
          </span>
        </div>
        <span className="rounded-full border border-ink-200 px-3.5 py-2 text-[0.8rem] font-semibold text-ink-700 transition-colors group-hover:border-indigo-400 group-hover:text-indigo-700">
          View profile
        </span>
      </div>
    </Link>
  );
}
