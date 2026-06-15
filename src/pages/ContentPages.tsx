import { useState } from "react";
import { Search, Filter, Grid, List, Play, Image, FileText, Music } from "lucide-react";
import { recentContent } from "../data/mockData";
import { ContentThumb } from "../components/ContentThumb";
import { Panel, StatCard } from "../components/PageShell";

const typeIcons = { Video: Play, Image: Image, Article: FileText, Audio: Music };

export function AllContentPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Assets" value="248" trend="+12 this week" />
        <StatCard label="Published" value="186" />
        <StatCard label="Scheduled" value="34" />
        <StatCard label="Drafts" value="28" />
      </div>
      <Panel title="Content Library">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-dt-border bg-dt-bg px-3 py-2">
            <Search size={14} className="text-dt-muted" />
            <input placeholder="Search titles, tags, campaigns..." className="flex-1 bg-transparent text-sm outline-none" />
          </div>
          <button type="button" className="flex items-center gap-1 rounded-md border border-dt-border px-3 py-2 text-xs"><Filter size={13} /> Filter</button>
          <button type="button" onClick={() => setView("grid")} className={`rounded-md p-2 ${view === "grid" ? "bg-dt-red text-white" : "border border-dt-border"}`}><Grid size={14} /></button>
          <button type="button" onClick={() => setView("list")} className={`rounded-md p-2 ${view === "list" ? "bg-dt-red text-white" : "border border-dt-border"}`}><List size={14} /></button>
        </div>
        <div className={view === "grid" ? "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" : "space-y-2"}>
          {recentContent.map((item) => {
            const Icon = typeIcons[item.type as keyof typeof typeIcons] ?? Play;
            return (
              <div key={item.title} className="flex gap-3 rounded-lg border border-dt-border bg-dt-bg/60 p-3 hover:border-dt-red/40">
                <ContentThumb id={item.thumb} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{item.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-dt-muted"><Icon size={11} /> {item.type} · {item.views} views</p>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

const calendarEvents = [
  { date: "May 20", title: "Tour Announcement Teaser", type: "Image" },
  { date: "May 22", title: "Inner Circle Live Stream", type: "Video" },
  { date: "May 24", title: "Playlist Refresh — Tour Hype", type: "Playlist" },
  { date: "May 26", title: "Email Blast — Flash Drop", type: "Campaign" },
];

export function ContentCalendarPage() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="col-span-1 lg:col-span-2">
        <Panel title="May 2024">
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="py-2 text-dt-muted">{d}</div>)}
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className={`min-h-[72px] rounded-md border border-dt-border/50 p-1 ${i >= 12 && i <= 19 ? "border-dt-red/30 bg-dt-red/5" : "bg-dt-bg/40"}`}>
                <span className="text-[10px] text-dt-muted">{((i % 31) + 1)}</span>
                {i === 20 && <p className="mt-1 truncate rounded bg-dt-red/20 px-1 text-[9px] text-dt-red">Teaser</p>}
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel title="Upcoming">
        <ul className="space-y-3">
          {calendarEvents.map((e) => (
            <li key={e.title} className="rounded-md border border-dt-border bg-dt-bg/50 p-3">
              <p className="text-xs text-dt-red">{e.date}</p>
              <p className="mt-1 text-sm font-medium">{e.title}</p>
              <p className="text-xs text-dt-muted">{e.type}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

const folders = [
  { name: "Tour 2024", files: 42, size: "18.4 GB", image: "/content/tour.jpg" },
  { name: "Studio Sessions", files: 86, size: "124 GB", image: "/content/studio.jpg" },
  { name: "Brand Assets", files: 156, size: "2.1 GB", image: "/dame-brand.png" },
  { name: "Social Exports", files: 312, size: "8.6 GB", image: "/content/drop.jpg" },
];

export function MediaLibraryPage() {
  return (
    <Panel title="Folders">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {folders.map((f) => (
          <button
            key={f.name}
            type="button"
            className="rounded-lg border border-dt-border bg-dt-bg/50 p-4 text-left hover:border-dt-red/40"
          >
            <div className="mb-3 h-12 w-12 overflow-hidden rounded-md border border-dt-border/60">
              <img
                src={f.image}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
            <p className="font-medium">{f.name}</p>
            <p className="mt-1 text-xs text-dt-muted">
              {f.files} files · {f.size}
            </p>
          </button>
        ))}
      </div>
    </Panel>
  );
}

const playlists = [
  {
    name: "Inner Circle Exclusives",
    tracks: 24,
    followers: "48.2K",
    image: "/content/studio.jpg",
  },
  { name: "Tour Hype", tracks: 18, followers: "112K", image: "/content/drop.jpg" },
  {
    name: "Behind The Scenes",
    tracks: 31,
    followers: "76K",
    image: "/content/tour.jpg",
  },
  {
    name: "Fan Favorites",
    tracks: 42,
    followers: "203K",
    image: "/content/qa.jpg",
  },
];

export function PlaylistsPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          className="rounded-md bg-dt-red px-4 py-2 text-sm font-semibold"
        >
          + New Playlist
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {playlists.map((p) => (
          <div
            key={p.name}
            className="flex gap-4 rounded-lg border border-dt-border bg-dt-card p-4"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-dt-border/60">
              <img
                src={p.image}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="mt-1 text-sm text-dt-muted">
                {p.tracks} items · {p.followers} followers
              </p>
              <button
                type="button"
                className="mt-2 text-xs text-dt-red hover:underline"
              >
                Edit playlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
