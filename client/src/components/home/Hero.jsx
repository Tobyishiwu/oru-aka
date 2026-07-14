import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, MapPin, Search, Star, Wrench } from "lucide-react";
import AdireDivider from "../ui/AdireDivider";

const POPULAR_TRADES = ["Electrician", "Plumber", "Tailor", "Carpenter"];

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80";
const HERO_IMAGE_AVATAR =
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=facearea&facepad=2.5&w=200&h=200&q=80";

export default function Hero() {
  const navigate = useNavigate();
  const [trade, setTrade] = useState("");
  const [location, setLocation] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (trade) params.set("q", trade);
    if (location) params.set("city", location);
    navigate(`/workers?${params.toString()}`);
  }

  return (
    <section className="relative overflow-hidden bg-indigo-800">
      {/* One quiet background glow instead of two competing ones */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-brass-400/10 blur-[110px]" />

      <div className="relative mx-auto max-w-[1320px] px-4 pb-0 pt-14 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* Left: copy + search */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-brass-300/40 bg-brass-400/10 px-3.5 py-1.5 text-[0.8rem] font-semibold text-brass-200"
            >
              <Wrench className="h-3.5 w-3.5 text-brass-300" strokeWidth={2.25} />
              Enugu &middot; Lagos &middot; Abuja
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mt-5 font-display text-[2.5rem] font-semibold leading-[1.08] tracking-tight text-bone sm:text-[3.1rem]"
            >
              The hands you need,
              <br />
              right where you are
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-4 max-w-lg text-[1.05rem] leading-relaxed text-indigo-200"
            >
              Find skilled, reviewed tradespeople near you — electricians, plumbers, tailors,
              carpenters, and more.
            </motion.p>

            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8"
            >
              <div className="overflow-hidden rounded-2xl bg-bone shadow-card-lg">
                <AdireDivider />
                <div className="flex flex-col divide-y divide-ink-100 sm:flex-row sm:divide-x sm:divide-y-0">
                  <div className="flex flex-1 items-center gap-3 px-5 py-4">
                    <Wrench className="h-4.5 w-4.5 shrink-0 text-brass-500" strokeWidth={2} />
                    <div className="flex-1 text-left">
                      <label className="block text-[0.7rem] font-semibold uppercase tracking-wide text-ink-300">
                        What do you need?
                      </label>
                      <input
                        value={trade}
                        onChange={(e) => setTrade(e.target.value)}
                        placeholder="e.g. Electrician"
                        className="w-full bg-transparent text-[0.95rem] text-ink-800 placeholder:text-ink-300 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-1 items-center gap-3 px-5 py-4">
                    <MapPin className="h-4.5 w-4.5 shrink-0 text-brass-500" strokeWidth={2} />
                    <div className="flex-1 text-left">
                      <label className="block text-[0.7rem] font-semibold uppercase tracking-wide text-ink-300">
                        Where
                      </label>
                      <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City or neighborhood"
                        className="w-full bg-transparent text-[0.95rem] text-ink-800 placeholder:text-ink-300 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center p-3">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-6 py-3.5 text-[0.95rem] font-semibold text-bone transition-colors hover:bg-indigo-800 sm:w-auto"
                    >
                      <Search className="h-4 w-4" strokeWidth={2.5} />
                      Search
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.825rem] text-indigo-300">
                <span>Popular:</span>
                {POPULAR_TRADES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTrade(t)}
                    className="rounded-full border border-bone/15 px-3 py-1 text-bone/70 transition-colors hover:border-bone/30 hover:text-bone"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-7"
            >
              <button
                type="button"
                onClick={() => navigate("/signup?role=worker")}
                className="text-[0.875rem] font-semibold text-brass-200 underline-offset-4 hover:underline"
              >
                Are you a tradesperson? List your skill for free →
              </button>
            </motion.div>
          </div>

          {/* Right: photography, single focal trust card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative hidden lg:block"
          >
            <div className="relative overflow-hidden rounded-[1.5rem] shadow-card-lg">
              <img
                src={HERO_IMAGE}
                alt="An electrician at work installing wiring"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl bg-bone/95 p-3.5 shadow-card backdrop-blur">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <img src={HERO_IMAGE_AVATAR} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="truncate text-[0.875rem] font-semibold text-ink-800">Chidi O.</p>
                    <BadgeCheck className="h-3.5 w-3.5 shrink-0 fill-verified-500 text-bone" strokeWidth={2} />
                  </div>
                  <p className="truncate text-[0.8rem] text-ink-400">Electrician &middot; Enugu</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-brass-400 text-brass-400" strokeWidth={0} />
                  <span className="text-[0.825rem] font-semibold text-ink-700">4.9</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AdireDivider onDark className="mt-12" />
    </section>
  );
}
