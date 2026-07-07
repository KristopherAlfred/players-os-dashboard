import { useEffect, useRef, useState } from "react";
import { Calendar, SlidersHorizontal, Bell, Menu, Check } from "lucide-react";
import {
  useDashboardSource,
  type DashboardSource,
} from "../contexts/DashboardSourceContext";

const filterOptions: { id: DashboardSource; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "dametime", label: "Dametime" },
];

export function Header({
  title,
  subtitle,
  onMenuClick,
}: {
  title: string;
  subtitle: string;
  onMenuClick?: () => void;
}) {
  const { source, setSource, sourceLabel } = useDashboardSource();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!filtersRef.current?.contains(event.target as Node)) {
        setFiltersOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <header className="shrink-0 border-b border-dt-border bg-dt-panel px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
      <div className="flex min-w-0 items-start justify-between gap-2 sm:items-center sm:gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:items-center sm:gap-3">
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={onMenuClick}
            className="mt-0.5 shrink-0 rounded-md border border-dt-border bg-dt-card p-2 text-white lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold text-white sm:text-lg lg:text-xl">
              {title}
            </h1>
            <p className="mt-0.5 hidden truncate text-sm text-white sm:block">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:gap-3">
          <button
            type="button"
            className="hidden items-center gap-2 rounded-md border border-dt-border bg-dt-card px-2.5 py-2 text-sm text-[#d4d4d4] md:flex lg:px-3"
            aria-label="Date range June 26 — July 4, 2026"
          >
            <Calendar size={14} className="shrink-0 text-dt-muted" />
            <span className="hidden xl:inline">June 26 — July 4, 2026</span>
          </button>

          <div className="relative" ref={filtersRef}>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((open) => !open)}
              className="flex items-center gap-2 rounded-md border border-dt-border bg-dt-card px-2.5 py-2 text-sm text-[#d4d4d4] lg:px-3"
            >
              <SlidersHorizontal size={14} className="shrink-0 text-dt-muted" />
              <span className="hidden sm:inline">{sourceLabel}</span>
              <span className="sm:hidden">Filter</span>
            </button>

            {filtersOpen && (
              <div
                role="listbox"
                aria-label="Dashboard data source"
                className="absolute right-0 z-50 mt-2 min-w-[180px] overflow-hidden rounded-md border border-dt-border bg-[#111111] shadow-xl"
              >
                {filterOptions.map((option) => {
                  const active = source === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        setSource(option.id);
                        setFiltersOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition hover:bg-white/5 ${
                        active ? "bg-dt-red/10 text-white" : "text-[#d4d4d4]"
                      }`}
                    >
                      <span>{option.label}</span>
                      {active && <Check size={14} className="shrink-0 text-dt-red" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            className="relative hidden rounded-md border border-dt-border bg-dt-card p-2 text-[#d4d4d4] sm:inline-flex"
          >
            <Bell size={18} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-dt-red" />
          </button>

          <img
            src="/dame-headshot.png"
            alt="Damian Lillard"
            className="hidden h-9 w-9 shrink-0 rounded-full border-2 border-dt-red object-cover object-top sm:block"
          />
        </div>
      </div>
    </header>
  );
}
