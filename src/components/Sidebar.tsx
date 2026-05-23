import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  MessageCircle,
  Users,
  BarChart2,
  DollarSign,
  Settings,
  ChevronDown,
  ExternalLink,
  Zap,
} from "lucide-react";
import { navSections } from "../config/navigation";
import { BrandLogo } from "./BrandLogo";

const iconMap: Record<string, typeof LayoutDashboard> = {
  "layout-dashboard": LayoutDashboard,
  film: Film,
  "message-circle": MessageCircle,
  users: Users,
  "bar-chart-2": BarChart2,
  "dollar-sign": DollarSign,
  settings: Settings,
};

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col border-r border-dt-border bg-dt-panel">
      <div className="border-b border-dt-border px-4 py-4">
        <NavLink to="/">
          <BrandLogo />
        </NavLink>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-3">
        {navSections.map((section) => {
          const Icon = iconMap[section.icon] ?? LayoutDashboard;
          const activeSection = section.items.some(
            (item) =>
              !item.external &&
              (item.path === "/"
                ? pathname === "/"
                : pathname.startsWith(item.path)),
          );

          return (
            <div key={section.label} className="mb-3">
              <div
                className={`mb-1 flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[10px] font-semibold tracking-[0.12em] ${
                  activeSection
                    ? "bg-dt-red/15 text-white"
                    : "text-dt-muted"
                }`}
              >
                <Icon size={14} className={activeSection ? "text-dt-red" : ""} />
                {section.label}
                {section.label !== "DASHBOARD" && (
                  <ChevronDown size={11} className="ml-auto opacity-50" />
                )}
              </div>

              <ul className="space-y-0.5 pl-1">
                {section.items.map((item) => {
                  if (item.external) {
                    return (
                      <li key={item.label}>
                        <a
                          href={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-[13px] text-[#b0b0b0] transition-colors hover:bg-white/[0.04] hover:text-white"
                        >
                          {item.label === "Flash Updates" ? (
                            <Zap size={13} className="text-dt-red" />
                          ) : null}
                          {item.label}
                          <ExternalLink size={11} className="ml-auto opacity-40" />
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={item.label}>
                      <NavLink
                        to={item.path}
                        end={item.path === "/"}
                        className={({ isActive }) =>
                          `block w-full rounded-md px-3 py-1.5 text-left text-[13px] transition-colors ${
                            isActive
                              ? "bg-white/[0.06] font-medium text-white"
                              : "text-[#b0b0b0] hover:bg-white/[0.03] hover:text-white"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-dt-border px-4 py-4">
        <BrandLogo compact />
      </div>
    </aside>
  );
}
