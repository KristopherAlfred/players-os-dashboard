import { Link } from "react-router-dom";
import { Plus, Calendar, SlidersHorizontal, Bell } from "lucide-react";

export function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header className="flex min-w-0 shrink-0 items-center justify-between gap-3 border-b border-dt-border bg-dt-panel px-4 py-4 lg:gap-4 lg:px-6">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold text-white lg:text-xl">
          {title}
        </h1>
        <p className="mt-0.5 truncate text-sm text-dt-muted">{subtitle}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2 lg:gap-3">
        <Link
          to="/content/upload"
          className="flex items-center gap-2 rounded-md bg-dt-red px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-dt-red-hover lg:px-4"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Upload Content</span>
        </Link>

        <button
          type="button"
          className="flex items-center gap-2 rounded-md border border-dt-border bg-dt-card px-2.5 py-2 text-sm text-[#d4d4d4] lg:px-3"
          aria-label="Date range May 25 — June 2, 2026"
        >
          <Calendar size={14} className="shrink-0 text-dt-muted" />
          <span className="hidden xl:inline">May 25 — June 2, 2026</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-md border border-dt-border bg-dt-card px-2.5 py-2 text-sm text-[#d4d4d4] lg:px-3"
        >
          <SlidersHorizontal size={14} className="shrink-0 text-dt-muted" />
          <span className="hidden md:inline">Filters</span>
        </button>

        <button
          type="button"
          className="relative rounded-md border border-dt-border bg-dt-card p-2 text-[#d4d4d4]"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-dt-red" />
        </button>

        <img
          src="/dame-headshot.png"
          alt="Damian Lillard"
          className="ml-1 h-9 w-9 shrink-0 rounded-full border-2 border-dt-red object-cover object-top"
        />
      </div>
    </header>
  );
}
