import { BadgeCheck, Loader2, Star } from "lucide-react";

export function VerifiedBadge({ status }) {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-verified-50 px-2.5 py-0.5 text-[0.7rem] font-semibold text-verified-600">
        <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2} />
        Verified
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brass-50 px-2.5 py-0.5 text-[0.7rem] font-semibold text-brass-600">
        Verification pending
      </span>
    );
  }
  return null;
}

export function RatingStars({ rating, reviewCount, size = "sm" }) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-1">
      <Star className={`${starSize} fill-brass-400 text-brass-400`} strokeWidth={0} />
      <span className="text-[0.875rem] font-semibold text-ink-700">{Number(rating).toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-[0.825rem] text-ink-300">({reviewCount})</span>
      )}
    </div>
  );
}

export function Spinner({ className = "h-5 w-5" }) {
  return <Loader2 className={`${className} animate-spin text-indigo-600`} strokeWidth={2.5} />;
}

export function PageSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
