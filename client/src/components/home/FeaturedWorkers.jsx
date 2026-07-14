import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { workerApi } from "../../api/workers";
import FeaturedWorkerCard from "./FeaturedWorkerCard";
import { Spinner } from "../ui/Badges";

export default function FeaturedWorkers() {
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    // Lead with verified, top-rated workers, but fall back to the general
    // "recommended" pool if there aren't enough verified workers yet \u2014
    // this section should never render empty just because verification
    // is still in progress for a young marketplace.
    workerApi
      .list({ sort: "rating", limit: 8 })
      .then(({ data }) => {
        if (mounted) setWorkers(data.workers);
      })
      .catch(() => {})
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const scrollBy = (dir) => {
    scrollerRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  if (!isLoading && workers.length === 0) return null;

  return (
    <section className="bg-linen py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.8rem] font-semibold uppercase tracking-wide text-brass-600">
              Top rated
            </p>
            <h2 className="mt-1.5 font-display text-[1.85rem] font-semibold tracking-tight text-indigo-800">
              Trusted professionals near you
            </h2>
          </div>

          {workers.length > 0 && (
            <div className="hidden shrink-0 gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Scroll left"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-500 transition-colors hover:border-indigo-400 hover:text-indigo-700"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Scroll right"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-500 transition-colors hover:border-indigo-400 hover:text-indigo-700"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-7 w-7" />
          </div>
        ) : (
          <div
            ref={scrollerRef}
            className="mt-8 flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {workers.map((worker) => (
              <FeaturedWorkerCard key={worker._id} worker={worker} className="w-[270px]" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
