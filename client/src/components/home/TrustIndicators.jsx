import { BadgeCheck, MessageCircle, ShieldCheck, ThumbsUp } from "lucide-react";

const INDICATORS = [
  { icon: BadgeCheck, label: "ID-verified professionals" },
  { icon: MessageCircle, label: "Chat before you hire" },
  { icon: ShieldCheck, label: "Built for Nigerian trades" },
  { icon: ThumbsUp, label: "Real client reviews" },
];

export default function TrustIndicators() {
  return (
    <section className="border-b border-ink-100 bg-white">
      <div className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:gap-y-0">
          {INDICATORS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center justify-center gap-2.5 sm:justify-start">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-verified-50">
                <Icon className="h-4.5 w-4.5 text-verified-500" strokeWidth={2} />
              </span>
              <span className="text-[0.875rem] font-medium text-ink-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
