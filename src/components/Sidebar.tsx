import {
  LayoutDashboard,
  Film,
  MessageCircle,
  Users,
  BarChart2,
  DollarSign,
  Settings,
  ChevronDown,
} from "lucide-react";
import { navSections } from "../data/mockData";

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
  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-dt-border bg-dt-panel">
      <div className="border-b border-dt-border px-5 py-5">
        <div className="text-xl font-extrabold tracking-tight">
          <span className="text-white">DAME</span>
          <span className="text-dt-red">.TIME</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navSections.map((section) => {
          const Icon = iconMap[section.icon] ?? LayoutDashboard;
          const isDashboard = section.label === "DASHBOARD";

          return (
            <div key={section.label} className="mb-4">
              {isDashboard ? (
                <button
                  type="button"
                  className="mb-2 flex w-full items-center gap-2 rounded-md bg-dt-red px-3 py-2 text-xs font-bold tracking-wider text-white"
                >
                  <Icon size={16} />
                  {section.label}
                </button>
              ) : (
                <button
                  type="button"
                  className="mb-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-[10px] font-bold tracking-widest text-dt-muted hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Icon size={14} />
                    {section.label}
                  </span>
                  <ChevronDown size={12} />
                </button>
              )}

              <ul className="space-y-0.5 pl-2">
                {section.items.map((item) => {
                  const label = typeof item === "string" ? item : item.label;
                  const active = typeof item === "object" && item.active;

                  return (
                    <li key={label}>
                      <button
                        type="button"
                        className={`w-full rounded-md px-3 py-1.5 text-left text-[13px] transition-colors ${
                          active
                            ? "font-medium text-white"
                            : "text-[#a3a3a3] hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-dt-border px-5 py-4">
        <p className="text-[10px] font-bold tracking-widest text-dt-muted">
          <span className="text-white">DAME.TIME</span>
        </p>
        <p className="mt-0.5 text-[9px] tracking-wider text-dt-muted">
          POWERED BY <span className="text-dt-red">AMX</span>
        </p>
      </div>
    </aside>
  );
}
