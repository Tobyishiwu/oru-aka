import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, ShieldCheck, Wallet } from "lucide-react";
import AdireDivider from "../ui/AdireDivider";

const VALUE_POINTS = [
  { icon: Wallet, label: "Free to list your skill" },
  { icon: ShieldCheck, label: "Get a verified badge" },
  { icon: MessageCircle, label: "Clients message you directly" },
];

export default function JoinCTA() {
  const navigate = useNavigate();

  return (
    <section className="bg-bone px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-[1320px]">
        <div className="relative overflow-hidden rounded-card bg-indigo-800">
          <AdireDivider className="h-1.5" />
          <div className="relative px-6 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brass-400/15 blur-[90px]" />
            <div className="relative mx-auto max-w-xl">
              <h2 className="font-display text-[2rem] font-semibold tracking-tight text-bone sm:text-[2.3rem]">
                Are you a skilled tradesperson?
              </h2>
              <p className="mt-3 text-[1.05rem] text-indigo-200">
                List your skill on Oru Aka for free and start getting found by clients near you.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                {VALUE_POINTS.map((point) => (
                  <span key={point.label} className="flex items-center gap-1.5 text-[0.85rem] font-medium text-indigo-200">
                    <point.icon className="h-4 w-4 text-brass-300" strokeWidth={2} />
                    {point.label}
                  </span>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => navigate("/signup?role=worker")}
                className="group mx-auto mt-7 flex items-center gap-2 rounded-full bg-brass-400 px-7 py-3.5 text-[0.95rem] font-semibold text-indigo-900 transition-colors hover:bg-brass-300"
              >
                Create your free profile
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
