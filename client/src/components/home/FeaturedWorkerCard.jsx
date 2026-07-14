import { Link } from "react-router-dom";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { formatNaira } from "../../utils/format";
import { getTradePhoto } from "../../utils/tradePhotos";

export default function FeaturedWorkerCard({ worker, className = "" }) {
  const photo = worker.photos?.[0]?.url || getTradePhoto(worker.trade);

  return (
    <Link
      to={`/workers/${worker._id}`}
      className={`group relative block h-[22rem] shrink-0 overflow-hidden rounded-card shadow-card transition-shadow hover:shadow-card-lg ${className}`}
    >
      {photo ? (
        <img
          src={photo}
          alt={worker.trade}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-indigo-100">
          <span className="text-[2rem] font-semibold text-indigo-300">
            {worker.user?.name?.slice(0, 2).toUpperCase()}
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/20 to-transparent" />

      {worker.isBoosted && (
        <span className="absolute left-4 top-4 rounded-full bg-brass-400 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-indigo-900">
          Featured
        </span>
      )}

      <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-bone/90 px-2.5 py-1 backdrop-blur">
        <Star className="h-3.5 w-3.5 fill-brass-400 text-brass-400" strokeWidth={0} />
        <span className="text-[0.825rem] font-semibold text-ink-800">
          {Number(worker.ratingAverage || 0).toFixed(1)}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex items-center gap-1.5">
          <p className="truncate font-display text-[1.15rem] font-semibold text-bone">
            {worker.user?.name}
          </p>
          {worker.verificationStatus === "verified" && (
            <BadgeCheck className="h-4 w-4 shrink-0 fill-verified-500 text-bone" strokeWidth={2} />
          )}
        </div>
        <p className="text-[0.875rem] font-medium text-brass-300">{worker.trade}</p>
        <div className="mt-1 flex items-center gap-1 text-[0.8rem] text-bone/70">
          <MapPin className="h-3 w-3" strokeWidth={2} />
          {worker.city}, {worker.state}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-bone/15 pt-3">
          <p className="font-mono text-[0.95rem] font-semibold text-bone">
            From {formatNaira(worker.startingPrice)}
          </p>
          <span className="rounded-full bg-bone/90 px-3 py-1.5 text-[0.8rem] font-semibold text-indigo-800 transition-colors group-hover:bg-bone">
            View profile
          </span>
        </div>
      </div>
    </Link>
  );
}
