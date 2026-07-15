import { Hammer, Globe, Mail, MessageCircle } from "lucide-react";
import AdireDivider from "../ui/AdireDivider";

const COLUMNS = [
  { title: "Company", links: ["About", "Careers", "Contact"] },
  { title: "For clients", links: ["Find workers", "How it works", "Safety"] },
  { title: "For workers", links: ["Create a profile", "Get verified", "Boost your listing"] },
  { title: "Legal", links: ["Privacy", "Terms"] },
];

export default function Footer() {
  return (
    <footer className="bg-indigo-900">
      <AdireDivider />
      <div className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brass-400 text-indigo-900">
                <Hammer className="h-4.5 w-4.5" strokeWidth={2.25} />
              </span>
              <span className="font-display text-[1.1rem] font-semibold tracking-tight text-bone">
                Oru Aka
              </span>
            </div>
            <p className="mt-3 max-w-[220px] text-[0.85rem] leading-relaxed text-indigo-200">
              The go-to marketplace for skilled trades across Nigeria.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[0.8rem] font-semibold uppercase tracking-wide text-indigo-300">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[0.875rem] text-indigo-100 transition-colors hover:text-brass-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-indigo-700 pt-6 sm:flex-row">
          <p className="text-[0.8rem] text-indigo-300">
            &copy; {new Date().getFullYear()} Oru Aka. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[Globe, Mail, MessageCircle].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-700 text-indigo-200 transition-colors hover:border-brass-400 hover:text-brass-300"
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

