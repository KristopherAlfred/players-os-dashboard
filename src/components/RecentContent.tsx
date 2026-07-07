import { useMemo, useState } from "react";
import { Search, MoreHorizontal, Pencil } from "lucide-react";
import { Card } from "./ui/Card";
import { ContentThumb } from "./ContentThumb";
import { recentContent } from "../data/mockData";

const tabs = ["All Content", "Videos", "Images", "Articles", "Audio"] as const;
type ContentTab = (typeof tabs)[number];

const tabTypeMap: Record<Exclude<ContentTab, "All Content">, string> = {
  Videos: "Video",
  Images: "Image",
  Articles: "Article",
  Audio: "Audio",
};

export function RecentContent() {
  const [activeTab, setActiveTab] = useState<ContentTab>("All Content");
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return recentContent.filter((row) => {
      const matchesTab =
        activeTab === "All Content" || row.type === tabTypeMap[activeTab];
      const matchesQuery =
        !normalizedQuery || row.title.toLowerCase().includes(normalizedQuery);

      return matchesTab && matchesQuery;
    });
  }, [activeTab, query]);

  return (
    <Card className="flex h-full w-full flex-col">
      <div className="border-b border-dt-border bg-gradient-to-r from-black via-[#080808] to-black px-4 py-3">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Recent Content</h3>
        </div>
        <div className="mb-3 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === tab
                  ? "bg-dt-red text-white"
                  : "text-white/80 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-dt-border bg-dt-bg px-3 py-1.5">
            <Search size={14} className="text-white" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search content..."
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/50"
            />
          </div>
          <select className="rounded-md border border-dt-border bg-dt-bg px-3 py-1.5 text-xs text-white">
            <option>Status</option>
          </select>
          <select className="rounded-md border border-dt-border bg-dt-bg px-3 py-1.5 text-xs text-white">
            <option>Types</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-dt-border text-[11px] uppercase tracking-wide text-white">
              <th className="px-4 py-2.5 font-medium">Content</th>
              <th className="px-3 py-2.5 font-medium">Type</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="px-3 py-2.5 font-medium">Published</th>
              <th className="px-3 py-2.5 font-medium">Views</th>
              <th className="px-3 py-2.5 font-medium">Engagement</th>
              <th className="px-4 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-dt-muted">
                  No {activeTab === "All Content" ? "content" : activeTab.toLowerCase()} found.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr
                  key={row.title}
                  className="border-b border-dt-border/60 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-2.5 align-middle">
                    <div className="flex items-center gap-3">
                      <ContentThumb id={row.thumb} />
                      <span className="max-w-[200px] truncate font-medium text-white">
                        {row.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 align-middle text-white">{row.type}</td>
                  <td className="px-3 py-2.5 align-middle">
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-medium ${
                        row.status === "Published"
                          ? "bg-green-500/15 text-dt-green"
                          : "bg-orange-500/15 text-dt-orange"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 align-middle text-white">{row.published}</td>
                  <td className="px-3 py-2.5 align-middle text-white">{row.views}</td>
                  <td className="px-3 py-2.5 align-middle text-white">{row.engagement}</td>
                  <td className="px-4 py-2.5 align-middle">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="rounded p-1 text-white hover:bg-dt-border hover:text-white"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        className="rounded p-1 text-white hover:bg-dt-border hover:text-white"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
