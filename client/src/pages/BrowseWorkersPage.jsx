import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, Search } from "lucide-react";
import { workerApi } from "../api/workers";
import FiltersSidebar from "../components/workers/FiltersSidebar";
import WorkerCard from "../components/workers/WorkerCard";
import EmptyState from "../components/workers/EmptyState";
import { Spinner } from "../components/ui/Badges";

const MAX_RATE_CEILING = 150000;

const DEFAULT_FILTERS = {
  city: "",
  state: "",
  trades: [],
  minExperience: 0,
  maxRate: MAX_RATE_CEILING,
  availability: [],
  verifiedOnly: false,
};

const SORT_LABELS = {
  recommended: "Recommended",
  rating: "Highest rated",
  "price-low": "Price: low to high",
  "price-high": "Price: high to low",
  newest: "Newest",
};

export default function BrowseWorkersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    city: searchParams.get("city") || "",
    state: searchParams.get("state") || "",
    trades: searchParams.get("trade") ? [searchParams.get("trade")] : [],
  }));
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [sort, setSort] = useState("recommended");
  const [page, setPage] = useState(1);

  const [workers, setWorkers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkers = useCallback(() => {
    setIsLoading(true);
    const params = {
      page,
      limit: 12,
      sort,
      q: query || undefined,
      city: filters.city || undefined,
      state: filters.state || undefined,
      trade: filters.trades.length ? filters.trades : undefined,
      minExperience: filters.minExperience || undefined,
      maxRate: filters.maxRate < MAX_RATE_CEILING ? filters.maxRate : undefined,
      availability: filters.availability.length ? filters.availability : undefined,
      verifiedOnly: filters.verifiedOnly || undefined,
    };

    workerApi
      .list(params)
      .then(({ data }) => {
        setWorkers(data.workers);
        setPagination(data.pagination);
      })
      .catch(() => {
        setWorkers([]);
      })
      .finally(() => setIsLoading(false));
  }, [filters, query, sort, page]);

  useEffect(() => {
    const debounce = setTimeout(fetchWorkers, 300);
    return () => clearTimeout(debounce);
  }, [fetchWorkers]);

  useEffect(() => {
    setPage(1);
  }, [filters, query, sort]);

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
    setQuery("");
    setSearchParams({});
  }

  const resultCountLabel = useMemo(() => {
    if (!pagination) return null;
    return pagination.total;
  }, [pagination]);

  return (
    <div className="bg-bone py-10 sm:py-12">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-[1.8rem] font-semibold tracking-tight text-indigo-800 sm:text-[2.1rem]">
            Find a skilled worker
          </h1>
          <div className="relative mt-4 max-w-lg">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" strokeWidth={2} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by trade, skill, or specialty..."
              className="w-full rounded-full border border-ink-100 bg-white py-2.5 pl-11 pr-4 text-[0.9rem] text-ink-700 placeholder:text-ink-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-brass-200"
            />
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <FiltersSidebar
            filters={filters}
            onChange={setFilters}
            onReset={handleReset}
            maxRateCeiling={MAX_RATE_CEILING}
          />

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6">
              <p className="text-[0.9rem] text-ink-500">
                {isLoading ? (
                  "Searching\u2026"
                ) : (
                  <>
                    <span className="font-mono font-semibold text-ink-800">{resultCountLabel}</span> workers found
                  </>
                )}
              </p>

              <div className="relative flex items-center gap-2 rounded-full border border-ink-100 px-3 py-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-transparent pr-5 text-[0.85rem] font-medium text-ink-700 focus:outline-none"
                >
                  {Object.entries(SORT_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-ink-300" strokeWidth={2} />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-24">
                <Spinner className="h-8 w-8" />
              </div>
            ) : workers.length === 0 ? (
              <EmptyState onReset={handleReset} />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {workers.map((worker) => (
                    <WorkerCard key={worker._id} worker={worker} />
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        className={`h-9 w-9 rounded-full text-[0.85rem] font-semibold transition-colors ${
                          p === page ? "bg-indigo-700 text-bone" : "text-ink-500 hover:bg-ink-100"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
