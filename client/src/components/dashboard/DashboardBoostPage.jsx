import { useEffect, useState } from "react";
import { TrendingUp, Check } from "lucide-react";
import { boostApi } from "../../api/misc";
import { formatNaira } from "../../utils/format";
import Button from "../ui/Button";
import { PageSpinner } from "../ui/Badges";

const DURATION_LABELS = { 7: "1 week", 14: "2 weeks", 30: "1 month" };

export default function DashboardBoostPage() {
  const [pricing, setPricing] = useState(null);
  const [myBoosts, setMyBoosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requesting, setRequesting] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([boostApi.getPricing(), boostApi.getMine()])
      .then(([pricingRes, boostsRes]) => {
        setPricing(pricingRes.data);
        setMyBoosts(boostsRes.data.boosts);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  async function handleRequest(durationDays) {
    setRequesting(durationDays);
    setMessage("");
    try {
      const { data } = await boostApi.request(durationDays);
      setMyBoosts((prev) => [data.boost, ...prev]);
      setMessage(data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not save your boost request");
    } finally {
      setRequesting(null);
    }
  }

  if (isLoading) return <PageSpinner />;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-card border border-ink-100 bg-white p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brass-50">
            <TrendingUp className="h-5 w-5 text-brass-500" strokeWidth={2} />
          </span>
          <div>
            <h2 className="font-display text-[1.2rem] font-semibold text-ink-800">Boost your listing</h2>
            <p className="text-[0.875rem] text-ink-400">Appear at the top of search results for your trade and location.</p>
          </div>
        </div>

        {!pricing?.paymentsEnabled && (
          <div className="mt-4 rounded-xl bg-indigo-50 p-3.5 text-[0.85rem] text-indigo-700">
            Boost payments are launching soon. You can reserve a boost now &mdash; we&apos;ll notify
            you the moment checkout is available, with no charge until then.
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {pricing &&
            Object.entries(pricing.pricing).map(([days, price]) => (
              <div key={days} className="flex flex-col rounded-xl border border-ink-100 p-5">
                <p className="font-display text-[1.1rem] font-semibold text-ink-800">{DURATION_LABELS[days]}</p>
                <p className="mt-1 font-mono text-[1.4rem] font-semibold text-indigo-700">{formatNaira(price)}</p>
                <Button
                  variant="brass"
                  size="sm"
                  className="mt-4"
                  onClick={() => handleRequest(Number(days))}
                  disabled={requesting === Number(days)}
                >
                  {requesting === Number(days) ? "Saving\u2026" : "Reserve this boost"}
                </Button>
              </div>
            ))}
        </div>

        {message && <p className="mt-4 text-[0.85rem] text-ink-600">{message}</p>}
      </div>

      {myBoosts.length > 0 && (
        <div className="rounded-card border border-ink-100 bg-white p-6">
          <h3 className="font-display text-[1.05rem] font-semibold text-ink-800">Your boost requests</h3>
          <div className="mt-4 flex flex-col gap-3">
            {myBoosts.map((boost) => (
              <div key={boost._id} className="flex items-center justify-between rounded-xl bg-ink-50/60 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-verified-500" strokeWidth={2} />
                  <span className="text-[0.875rem] font-medium text-ink-700">
                    {DURATION_LABELS[boost.durationDays]} boost &mdash; {formatNaira(boost.amount)}
                  </span>
                </div>
                <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-[0.75rem] font-medium text-ink-500">
                  {boost.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

