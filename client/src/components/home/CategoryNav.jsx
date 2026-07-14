import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getTradeIcon } from "../../utils/tradeIcons";

const CATEGORIES = [
  { trade: "Electrician", count: "4,200+" },
  { trade: "Plumber", count: "3,100+" },
  { trade: "Tailor", count: "2,900+" },
  { trade: "Carpenter", count: "2,940+" },
  { trade: "AC Technician", count: "2,180+" },
  { trade: "Painter", count: "3,320+" },
  { trade: "Welder", count: "1,650+" },
  { trade: "Tiler", count: "1,930+" },
];

function CategoryCard({ cat, index }) {
  const navigate = useNavigate();
  const Icon = getTradeIcon(cat.trade);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/workers?trade=${encodeURIComponent(cat.trade)}`)}
      className="group flex flex-col items-start gap-3 rounded-card border border-ink-100 bg-white p-5 text-left transition-colors hover:border-brass-300 hover:bg-brass-50/30"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-800 text-bone transition-colors group-hover:bg-brass-400 group-hover:text-indigo-900">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <div>
        <p className="font-display text-[1rem] font-semibold text-ink-800">{cat.trade}</p>
        <p className="mt-0.5 text-[0.8rem] text-ink-300">{cat.count} workers</p>
      </div>
    </motion.button>
  );
}

export default function CategoryNav() {
  return (
    <section className="bg-bone py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <p className="text-[0.8rem] font-semibold uppercase tracking-wide text-brass-600">
          Browse by trade
        </p>
        <h2 className="mt-1.5 font-display text-[1.85rem] font-semibold tracking-tight text-indigo-800">
          What do you need done?
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.trade} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
