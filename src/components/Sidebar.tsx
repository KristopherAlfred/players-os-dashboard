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
  X,
} from "lucide-react";
import { navSections } from "../config/navigation";
import { BrandLogo } from "./BrandLogo";
import { useTheme } from "../theme/ThemeContext";

const iconMap: Record<string, typeof LayoutDashboard> = {
  "layout-dashboard": LayoutDashboard,
  film: Film,
  "message-circle": MessageCircle,
  users: Users,
  "bar-chart-2": BarChart2,
  "dollar-sign": DollarSign,
  settings: Settings,
};

const sectionGlowStyle = {
  textShadow: "0 0 4px rgba(255,255,255,0.35), 0 0 8px rgba(255,255,255,0.15)",
};

type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

export function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const { pathname } = useLocation();
  const { palette } = useTheme();

  const iconGlowStyle = {
    color: palette.accent,
    filter: `drop-shadow(0 0 2px color-mix(in srgb, ${palette.accent} 60%, transparent))`,
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(288px,88vw)] flex-col border-r border-dt-border bg-dt-panel transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-[268px] lg:shrink-0 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative border-b border-dt-border">
          <NavLink to="/" className="block" onClick={onClose}>
            <BrandLogo variant="sidebar" />
          </NavLink>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-md p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3">
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
              <div key={section.label} className="mb-3.5">
                <div
                  className={`mb-1.5 flex w-full items-center gap-2 rounded-md px-2 py-2 ${
                    activeSection ? "bg-white/[0.04]" : ""
                  }`}
                >
                  <Icon
                    size={14}
                    strokeWidth={2.25}
                    className="shrink-0"
                    style={iconGlowStyle}
                  />
                  <span
                    className="min-w-0 flex-1 text-[10px] font-bold leading-tight tracking-[0.08em] text-white"
                    style={sectionGlowStyle}
                  >
                    {section.label}
                  </span>
                  {section.label !== "DASHBOARD" && (
                    <ChevronDown size={11} className="shrink-0 text-white/50" />
                  )}
                </div>

                <ul className="space-y-0.5 pl-0.5">
                  {section.items.map((item) => {
                    if (item.external) {
                      return (
                        <li key={item.label}>
                          <a
                            href={item.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onClose}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-[13px] text-white transition-colors hover:bg-white/[0.06]"
                          >
                            {item.label === "Flash Updates" ? (
                              <Zap
                                size={13}
                                className="shrink-0"
                                style={{ color: palette.accent }}
                              />
                            ) : null}
                            <span className="min-w-0 flex-1">{item.label}</span>
                            <ExternalLink
                              size={11}
                              className="shrink-0 text-white/40"
                            />
                          </a>
                        </li>
                      );
                    }

                    return (
                      <li key={item.label}>
                        <NavLink
                          to={item.path}
                          end={item.path === "/"}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `block w-full rounded-md px-3 py-1.5 text-left text-[13px] text-white transition-colors ${
                              isActive
                                ? "bg-white/[0.08] font-semibold"
                                : "font-normal hover:bg-white/[0.05]"
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
      </aside>
    </>
  );
}
