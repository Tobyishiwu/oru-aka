import { useState } from "react";
import { ChevronDown, MapPin, RotateCcw, ShieldCheck, SlidersHorizontal, X } from "lucide-react";

const TRADES = [
  "Electrician",
  "Plumber",
  "Tiler",
  "Tailor",
  "Carpenter",
  "AC Technician",
  "Painter",
  "Welder",
  "Solar Installer",
  "POP Ceiling Installer",
  "Mechanic",
  "Mason",
  "Generator Technician",
  "Handyman",
];

const STATES = ["Enugu", "Lagos", "Abuja"];
const AVAILABILITY_OPTIONS = ["Available now", "Available this week", "Booked"];

function Section({ title, children, defaultOpen = true, forceOpen = false }) {
  const [open, setOpen] = useState(defaultOpen || forceOpen);
  return (
    <div className="border-b border-ink-100 py-5">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between text-left">
        <span className="text-[0.9rem] font-semibold text-ink-800">{title}</span>
        <ChevronDown className={`h-4 w-4 text-ink-400 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2} />
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

function activeFilterCount(filters) {
  let count = 0;
  if (filters.city) count += 1;
  if (filters.state) count += 1;
  count += filters.trades.length;
  if (filters.minExperience > 0) count += 1;
  count += filters.availability.length;
  if (filters.verifiedOnly) count += 1;
  return count;
}

export default function FiltersSidebar({ filters, onChange, onReset, maxRateCeiling = 150000 }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleTrade = (trade) => {
    const has = filters.trades.includes(trade);
    onChange({ ...filters, trades: has ? filters.trades.filter((t) => t !== trade) : [...filters.trades, trade] });
  };

  const toggleAvailability = (a) => {
    const has = filters.availability.includes(a);
    onChange({
      ...filters,
      availability: has ? filters.availability.filter((x) => x !== a) : [...filters.availability, a],
    });
  };

  const filterPanel = (
    <>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-[1.05rem] font-semibold text-ink-800">Filters</h3>
        <button type="button" onClick={onReset} className="flex items-center gap-1 text-[0.8rem] font-medium text-ink-400 transition-colors hover:text-brass-600">
          <RotateCcw className="h-3 w-3" strokeWidth={2} />
          Reset
        </button>
      </div>

      <Section title="Location">
        <div className="flex items-center gap-2 rounded-lg border border-ink-100 px-3 py-2.5">
          <MapPin className="h-4 w-4 shrink-0 text-ink-300" strokeWidth={2} />
          <input
            value={filters.city}
            onChange={(e) => onChange({ ...filters, city: e.target.value })}
            placeholder="City or neighborhood"
            className="w-full bg-transparent text-[0.875rem] text-ink-700 placeholder:text-ink-300 focus:outline-none"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {STATES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange({ ...filters, state: filters.state === s ? "" : s })}
              className={`rounded-full border px-3 py-1 text-[0.8rem] font-medium transition-colors ${
                filters.state === s ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-ink-200 text-ink-500 hover:border-ink-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Profession">
        <div className="flex flex-col gap-2.5">
          {TRADES.map((trade) => (
            <label key={trade} className="flex items-center gap-2.5 text-[0.875rem] text-ink-600">
              <input
                type="checkbox"
                checked={filters.trades.includes(trade)}
                onChange={() => toggleTrade(trade)}
                className="h-4 w-4 rounded border-ink-200 text-indigo-600 focus:ring-brass-300"
              />
              {trade}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Experience" defaultOpen={false} forceOpen={filters.minExperience > 0}>
        <input
          type="range"
          min={0}
          max={15}
          step={1}
          value={filters.minExperience}
          onChange={(e) => onChange({ ...filters, minExperience: Number(e.target.value) })}
          className="w-full accent-indigo-700"
        />
        <p className="mt-1 text-[0.8rem] text-ink-400">
          {filters.minExperience === 0 ? "Any experience" : `${filters.minExperience}+ years`}
        </p>
      </Section>

      <Section title="Starting price" defaultOpen={false} forceOpen={filters.maxRate < maxRateCeiling}>
        <input
          type="range"
          min={2000}
          max={maxRateCeiling}
          step={1000}
          value={filters.maxRate}
          onChange={(e) => onChange({ ...filters, maxRate: Number(e.target.value) })}
          className="w-full accent-indigo-700"
        />
        <p className="mt-1 font-mono text-[0.8rem] text-ink-400">
          {filters.maxRate >= maxRateCeiling ? "Any price" : `Up to ₦${filters.maxRate.toLocaleString()}`}
        </p>
      </Section>

      <Section title="Availability" defaultOpen={false} forceOpen={filters.availability.length > 0}>
        <div className="flex flex-col gap-2.5">
          {AVAILABILITY_OPTIONS.map((a) => (
            <label key={a} className="flex items-center gap-2.5 text-[0.875rem] text-ink-600">
              <input
                type="checkbox"
                checked={filters.availability.includes(a)}
                onChange={() => toggleAvailability(a)}
                className="h-4 w-4 rounded border-ink-200 text-indigo-600 focus:ring-brass-300"
              />
              {a}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Trust" defaultOpen={false} forceOpen={filters.verifiedOnly}>
        <label className="flex items-center justify-between text-[0.875rem] text-ink-600">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-verified-500" strokeWidth={2} />
            Verified only
          </span>
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => onChange({ ...filters, verifiedOnly: e.target.checked })}
            className="h-4 w-4 rounded border-ink-200 text-indigo-600 focus:ring-brass-300"
          />
        </label>
      </Section>
    </>
  );

  const activeCount = activeFilterCount(filters);

  return (
    <>
      {/* Mobile: collapsed toggle button, shown above results */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="flex w-full items-center justify-between rounded-card border border-ink-100 bg-white px-4 py-3 lg:hidden"
      >
        <span className="flex items-center gap-2 text-[0.9rem] font-semibold text-ink-800">
          <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-700 px-1.5 text-[0.7rem] font-bold text-bone">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown className="h-4 w-4 -rotate-90 text-ink-400" strokeWidth={2} />
      </button>

      {/* Mobile: full-screen drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-bone lg:hidden">
          <div className="flex items-center justify-between border-b border-ink-100 px-4 py-4">
            <h3 className="font-display text-[1.1rem] font-semibold text-ink-800">Filters</h3>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close filters"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:bg-ink-50"
            >
              <X className="h-5 w-5" strokeWidth={2.25} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4">{filterPanel}</div>
          <div className="border-t border-ink-100 p-4">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="w-full rounded-full bg-indigo-700 px-5 py-3 text-[0.9rem] font-semibold text-bone"
            >
              Show results
            </button>
          </div>
        </div>
      )}

      {/* Desktop: always-visible sticky sidebar, unchanged from before */}
      <aside className="hidden w-full lg:block lg:w-[280px] lg:shrink-0">
        <div className="rounded-card border border-ink-100 bg-white p-5 lg:sticky lg:top-24">{filterPanel}</div>
      </aside>
    </>
  );
}
