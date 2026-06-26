import { useEffect, useState } from "react";
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
  Trophy,
  X,
} from "lucide-react";
import {
  isNavPathActive,
  isSectionActive,
  navSections,
  type NavGroup,
  type NavItem,
  type NavSection,
} from "../config/navigation";
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
  trophy: Trophy,
};

const sectionGlowStyle = {
  textShadow: "0 0 4px rgba(255,255,255,0.35), 0 0 8px rgba(255,255,255,0.15)",
};

type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

function groupPaths(group: NavGroup) {
  return group.items.filter((i) => !i.external).map((i) => i.path);
}

function isGroupActive(pathname: string, group: NavGroup) {
  return groupPaths(group).some((path) => isNavPathActive(pathname, path));
}

function NavItemLink({
  item,
  onClose,
  nested = false,
}: {
  item: NavItem;
  onClose?: () => void;
  nested?: boolean;
}) {
  if (item.external) {
    return (
      <a
        href={item.path}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className={`flex w-full items-center gap-3 rounded-md py-2.5 text-left text-[17px] text-white transition-colors hover:bg-white/[0.06] ${
          nested ? "px-4 pl-8" : "px-4"
        }`}
      >
        {item.label === "Flash Updates" ? <Zap size={17} className="shrink-0 text-dt-red" /> : null}
        <span className="min-w-0 flex-1">{item.label}</span>
        <ExternalLink size={15} className="shrink-0 text-white/40" />
      </a>
    );
  }

  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      onClick={onClose}
      className={({ isActive }) =>
        `block w-full rounded-md py-3 text-left text-[17px] text-white transition-colors ${
          nested ? "px-4 pl-8" : "px-4"
        } ${isActive ? "bg-white/[0.08] font-semibold" : "font-normal hover:bg-white/[0.05]"}`
      }
    >
      {item.label}
    </NavLink>
  );
}

export function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const { pathname } = useLocation();
  const { palette } = useTheme();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const iconGlowStyle = {
    color: palette.accent,
    filter: `drop-shadow(0 0 2px color-mix(in srgb, ${palette.accent} 60%, transparent))`,
  };

  useEffect(() => {
    setOpenSections((prev) => {
      const next = { ...prev };
      for (const section of navSections) {
        if (section.label === "DASHBOARD") {
          next[section.label] = true;
        } else if (isSectionActive(pathname, section)) {
          next[section.label] = true;
        }
      }
      return next;
    });

    setOpenGroups((prev) => {
      const next = { ...prev };
      for (const section of navSections) {
        for (const group of section.groups ?? []) {
          const key = `${section.label}::${group.label}`;
          if (isGroupActive(pathname, group)) {
            next[key] = true;
          }
        }
      }
      return next;
    });
  }, [pathname]);

  function toggleSection(label: string) {
    if (label === "DASHBOARD") return;
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  function toggleGroup(sectionLabel: string, groupLabel: string) {
    const key = `${sectionLabel}::${groupLabel}`;
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function renderGroup(section: NavSection, group: NavGroup) {
    const key = `${section.label}::${group.label}`;
    const groupOpen = openGroups[key] ?? false;
    const groupActive = isGroupActive(pathname, group);

    return (
      <li key={group.label}>
        <button
          type="button"
          onClick={() => toggleGroup(section.label, group.label)}
          className={`flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left text-base transition-colors ${
            groupActive ? "bg-white/[0.04] font-semibold text-white" : "text-white/90 hover:bg-white/[0.05]"
          }`}
        >
          <Film size={18} className="shrink-0 text-dt-muted" />
          <span className="min-w-0 flex-1">{group.label}</span>
          <ChevronDown
            size={15}
            className={`shrink-0 text-white/50 transition-transform ${groupOpen ? "rotate-180" : ""}`}
          />
        </button>
        {groupOpen && (
          <ul className="mt-0.5 space-y-0.5 border-l border-dt-border/60 ml-4 pl-1">
            {group.items.map((item) => (
              <li key={item.label}>
                <NavItemLink item={item} onClose={onClose} nested />
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  function renderSection(section: NavSection) {
    const Icon = iconMap[section.icon] ?? LayoutDashboard;
    const activeSection = isSectionActive(pathname, section);
    const isDashboard = section.label === "DASHBOARD";
    const isDirectLink = Boolean(section.directPath);
    const sectionOpen = isDashboard ? true : isDirectLink ? false : (openSections[section.label] ?? false);
    const hasDropdown = !isDashboard && !isDirectLink;

    if (isDirectLink && section.directPath) {
      return (
        <div key={section.label} className="mb-5">
          <NavLink
            to={section.directPath}
            onClick={onClose}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-md px-3 py-3 transition-colors ${
                isActive ? "bg-white/[0.08]" : "hover:bg-white/[0.03]"
              }`
            }
          >
            <Icon size={20} strokeWidth={2.25} className="shrink-0" style={iconGlowStyle} />
            <span
              className="min-w-0 flex-1 text-sm font-bold leading-tight tracking-[0.08em] text-white"
              style={sectionGlowStyle}
            >
              {section.label}
            </span>
          </NavLink>
        </div>
      );
    }

    return (
      <div key={section.label} className="mb-5">
        <button
          type="button"
          onClick={() => toggleSection(section.label)}
          disabled={isDashboard}
          className={`mb-2 flex w-full items-center gap-3 rounded-md px-3 py-3 text-left transition-colors ${
            activeSection ? "bg-white/[0.04]" : "hover:bg-white/[0.03]"
          } ${isDashboard ? "cursor-default" : ""}`}
        >
          <Icon size={20} strokeWidth={2.25} className="shrink-0" style={iconGlowStyle} />
          <span
            className="min-w-0 flex-1 text-sm font-bold leading-tight tracking-[0.08em] text-white"
            style={sectionGlowStyle}
          >
            {section.label}
          </span>
          {hasDropdown && (
            <ChevronDown
              size={15}
              className={`shrink-0 text-white/50 transition-transform ${sectionOpen ? "rotate-180" : ""}`}
            />
          )}
        </button>

        {sectionOpen && (
          <ul className="space-y-1.5 pl-1">
            {section.items.map((item) => (
              <li key={item.label}>
                <NavItemLink item={item} onClose={onClose} />
              </li>
            ))}
            {section.groups?.map((group) => renderGroup(section, group))}
          </ul>
        )}
      </div>
    );
  }

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
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(360px,90vw)] flex-col border-r border-dt-border bg-dt-panel transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-[340px] lg:shrink-0 lg:translate-x-0 ${
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

        <nav className="flex-1 overflow-y-auto px-5 py-5">{navSections.map(renderSection)}</nav>
      </aside>
    </>
  );
}
