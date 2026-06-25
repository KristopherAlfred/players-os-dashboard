import { Calendar, SlidersHorizontal, Bell, Menu } from "lucide-react";

export function Header({
  title,
  subtitle,
  onMenuClick,
}: {
  title: string;
  subtitle: string;
  onMenuClick?: () => void;
}) {
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
            aria-label="Date range May 25 — June 2, 2026"
          >
            <Calendar size={14} className="shrink-0 text-dt-muted" />
            <span className="hidden xl:inline">May 25 — June 2, 2026</span>
          </button>

          <button
            type="button"
            className="hidden items-center gap-2 rounded-md border border-dt-border bg-dt-card px-2.5 py-2 text-sm text-[#d4d4d4] sm:flex lg:px-3"
          >
            <SlidersHorizontal size={14} className="shrink-0 text-dt-muted" />
            <span className="hidden md:inline">Filters</span>
          </button>

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
