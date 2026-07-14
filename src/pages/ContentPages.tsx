import { useState } from "react";
import { Search, Filter, Grid, List, Play, Image, FileText, Music, Gift, CalendarDays } from "lucide-react";
import { ContentThumb } from "../components/ContentThumb";
import { Panel, StatCard } from "../components/PageShell";
import {
  socialContent,
  type ContentItem,
} from "../data/contentCategories";

export { NewsContentPage } from "./NewsContentPage";
export { VideosContentPage } from "./VideosContentPage";
export { EventsGiveawaysPage } from "./EventsGiveawaysPage";
export { MusicContentPage } from "./MusicContentPage";
export { ContentCalendarPage } from "./ContentCalendarPage";

const typeIcons: Record<string, typeof Play> = {
  Video: Play,
  Image: Image,
  Newsletter: FileText,
  Article: FileText,
  Audio: Music,
  Story: Image,
  Reel: Play,
  Post: Image,
  Press: FileText,
  Feature: FileText,
  Playlist: Music,
  Event: CalendarDays,
  Giveaway: Gift,
};

function ContentCategoryPage({
  title,
  items,
  stats,
}: {
  title: string;
  items: ContentItem[];
  stats: { label: string; value: string; hint?: string }[];
}) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-4">
      <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${stats.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} hint={s.hint} />
        ))}
      </div>
      <Panel title={title}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-dt-border bg-dt-bg px-3 py-2">
            <Search size={14} className="text-dt-muted" />
            <input placeholder="Search titles, tags..." className="flex-1 bg-transparent text-sm outline-none" />
          </div>
          <button type="button" className="flex items-center gap-1 rounded-md border border-dt-border px-3 py-2 text-xs">
            <Filter size={13} /> Filter
          </button>
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`rounded-md p-2 ${view === "grid" ? "bg-dt-red text-white" : "border border-dt-border"}`}
          >
            <Grid size={14} />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`rounded-md p-2 ${view === "list" ? "bg-dt-red text-white" : "border border-dt-border"}`}
          >
            <List size={14} />
          </button>
        </div>
        <div className={view === "grid" ? "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" : "space-y-2"}>
          {items.map((item) => {
            const Icon = typeIcons[item.type] ?? Play;
            return (
              <div
                key={item.title}
                className="flex gap-3 rounded-lg border border-dt-border bg-dt-bg/60 p-3 hover:border-dt-red/40"
              >
                <ContentThumb id={item.thumb} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{item.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-dt-muted">
                    <Icon size={11} /> {item.type}
                    {item.channel ? ` · ${item.channel}` : ""} · {item.views}
                  </p>
                  <p className="mt-0.5 text-[10px] text-dt-muted">{item.status} · {item.published}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

export function SocialContentPage() {
  return (
    <ContentCategoryPage
      title="Social"
      items={socialContent}
      stats={[
        { label: "Posts (7d)", value: "24", hint: "Across all channels" },
        { label: "Scheduled", value: "6" },
        { label: "Avg. engagement", value: "14.2%", hint: "+3.1% vs last week" },
      ]}
    />
  );
}
