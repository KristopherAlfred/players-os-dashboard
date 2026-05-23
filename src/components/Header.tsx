import {
  Plus,
  Calendar,
  SlidersHorizontal,
  Bell,
} from "lucide-react";

export function Header() {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-dt-border bg-dt-panel px-6 py-4">
      <div>
        <h1 className="text-xl font-bold text-white">Dashboard Overview</h1>
        <p className="mt-0.5 text-sm text-dt-muted">
          Real-time performance of the DameTime ecosystem.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-dt-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-dt-red-hover"
        >
          <Plus size={16} />
          Upload Content
        </button>

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

        <div className="ml-1 h-9 w-9 overflow-hidden rounded-full border-2 border-dt-red bg-gradient-to-br from-[#333] to-[#111]">
          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
            D
          </div>
        </div>
      </div>
    </header>
  );
}
