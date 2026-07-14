import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Briefcase, ShieldCheck, TrendingUp } from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Profile", icon: LayoutDashboard, end: true },
  { to: "/dashboard/portfolio", label: "Portfolio", icon: Briefcase },
  { to: "/dashboard/verification", label: "Verification", icon: ShieldCheck },
  { to: "/dashboard/boost", label: "Boost listing", icon: TrendingUp },
];

export default function DashboardLayout() {
  return (
    <div className="bg-bone py-10 sm:py-12">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-[1.7rem] font-semibold tracking-tight text-indigo-800">
          Your dashboard
        </h1>

        <div className="mt-7 flex flex-col gap-8 lg:flex-row">
          <nav className="flex shrink-0 gap-2 overflow-x-auto lg:w-[220px] lg:flex-col lg:overflow-visible">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-[0.875rem] font-medium transition-colors ${
                    isActive ? "bg-indigo-700 text-bone" : "text-ink-600 hover:bg-white"
                  }`
                }
              >
                <item.icon className="h-4 w-4" strokeWidth={2} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
