import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { PlatformIcon } from "./PlatformIcon";
import { useContentStudio, type ContentRecord } from "../../lib/contentStudio/store";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dayKey(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}

const STATUS_TONE: Record<ContentRecord["status"], string> = {
  draft: "border-white/15 bg-white/[0.05] text-white/70",
  scheduled: "border-sky-500/35 bg-sky-500/10 text-sky-200",
  publishing: "border-amber-500/35 bg-amber-500/10 text-amber-200",
  published: "border-dt-green/35 bg-dt-green/10 text-dt-green",
  failed: "border-dt-red/40 bg-dt-red/10 text-dt-red",
};

/** Month / week calendar of everything this workspace has drafted or scheduled. */
export function StudioCalendar({
  onSelect,
  onCreate,
}: {
  onSelect?: (record: ContentRecord) => void;
  onCreate?: (dateIso: string) => void;
}) {
  const { content } = useContentStudio();
  const [cursor, setCursor] = useState(() => new Date());
  const [view, setView] = useState<"month" | "week">("month");

  const byDay = useMemo(() => {
    const map = new Map<string, ContentRecord[]>();
    for (const record of content) {
      const iso = record.scheduledAt ?? record.createdAt;
      const key = dayKey(iso);
      map.set(key, [...(map.get(key) ?? []), record]);
    }
    return map;
  }, [content]);

  const days = useMemo(() => {
    if (view === "week") {
      const start = new Date(cursor);
      start.setDate(start.getDate() - start.getDay());
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
      });
    }
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [cursor, view]);

  function shift(delta: number) {
    const next = new Date(cursor);
    if (view === "week") next.setDate(next.getDate() + delta * 7);
    else next.setMonth(next.getMonth() + delta);
    setCursor(next);
  }

  const todayKey = new Date().toISOString().slice(0, 10);

  return (
    <div className="dt-surface rounded-2xl border border-dt-border bg-dt-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dt-border px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => shift(-1)}
            className="rounded-lg border border-dt-border p-1.5 text-white/60 hover:text-white"
          >
            <ChevronLeft size={14} />
          </button>
          <h2 className="font-display text-sm font-semibold tracking-wide text-white">
            {cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <button
            type="button"
            aria-label="Next"
            onClick={() => shift(1)}
            className="rounded-lg border border-dt-border p-1.5 text-white/60 hover:text-white"
          >
            <ChevronRight size={14} />
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date())}
            className="rounded-lg border border-dt-border px-2.5 py-1.5 text-[11px] font-semibold text-white/60 hover:text-white"
          >
            Today
          </button>
        </div>
        <div className="flex rounded-lg border border-dt-border p-0.5">
          {(["month", "week"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold capitalize transition ${
                view === mode ? "bg-white/12 text-white" : "text-white/50"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-dt-border">
        {WEEKDAYS.map((day) => (
          <div key={day} className="px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wide text-dt-muted">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const key = day.toISOString().slice(0, 10);
          const items = byDay.get(key) ?? [];
          const outside = view === "month" && day.getMonth() !== cursor.getMonth();
          return (
            <div
              key={key}
              className={`group relative min-h-[104px] border-b border-r border-dt-border p-1.5 ${
                outside ? "opacity-35" : ""
              } ${key === todayKey ? "bg-white/[0.03]" : ""}`}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-white/55">{day.getDate()}</span>
                <button
                  type="button"
                  aria-label="Create content"
                  onClick={() => onCreate?.(day.toISOString())}
                  className="rounded p-0.5 text-white/40 opacity-0 transition group-hover:opacity-100 hover:text-white"
                >
                  <Plus size={12} />
                </button>
              </div>
              <div className="space-y-1">
                {items.slice(0, 3).map((record) => (
                  <button
                    key={record.id}
                    type="button"
                    onClick={() => onSelect?.(record)}
                    className={`flex w-full items-center gap-1 rounded-md border px-1.5 py-1 text-left text-[10px] font-medium ${STATUS_TONE[record.status]}`}
                  >
                    <span className="flex gap-0.5">
                      {record.platforms.slice(0, 3).map((platform) => (
                        <PlatformIcon key={platform} platform={platform} size={9} />
                      ))}
                    </span>
                    <span className="truncate">{record.title || record.caption || "Untitled"}</span>
                  </button>
                ))}
                {items.length > 3 && (
                  <p className="pl-1 text-[9px] text-dt-muted">+{items.length - 3} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
