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
    <header className="flex shrink-0 items-center justify-between border-b border-dt-border bg-dt-panel px-6 py-4">
      <div>
        <h1 className="text-xl font-semibold text-white">
          {title}
        </h1>
        <p className="mt-0.5 text-sm text-dt-muted">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/content/upload"
          className="flex items-center gap-2 rounded-md bg-dt-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-dt-red-hover"
        >
          <Plus size={16} />
          Upload Content
        </Link>

        <button
          type="button"
          className="flex items-center gap-2 rounded-md border border-dt-border bg-dt-card px-3 py-2 text-sm text-[#d4d4d4]"
        >
          <Calendar size={14} className="text-dt-muted" />
          May 12 — May 19, 2024
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-md border border-dt-border bg-dt-card px-3 py-2 text-sm text-[#d4d4d4]"
        >
          <SlidersHorizontal size={14} className="text-dt-muted" />
          Filters
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
          className="ml-1 h-9 w-9 rounded-full border-2 border-dt-red object-cover object-top"
        />
      </div>
    </header>
  );
}
