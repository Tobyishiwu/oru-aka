import { SearchX } from "lucide-react";
import Button from "../ui/Button";

export default function EmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-ink-200 bg-white px-6 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-50">
        <SearchX className="h-6 w-6 text-ink-300" strokeWidth={1.75} />
      </span>
      <h3 className="mt-5 font-display text-[1.15rem] font-semibold text-ink-800">
        No workers match these filters
      </h3>
      <p className="mt-2 max-w-sm text-[0.9rem] text-ink-400">
        Try widening your price range, clearing a profession filter, or removing the location
        constraint to see more professionals.
      </p>
      <Button variant="primary" size="sm" className="mt-6" onClick={onReset}>
        Clear all filters
      </Button>
    </div>
  );
}
