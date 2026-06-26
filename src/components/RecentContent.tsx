import { Search, MoreHorizontal, Pencil } from "lucide-react";
import { Card } from "./ui/Card";
import { ContentThumb } from "./ContentThumb";
import { recentContent } from "../data/mockData";

const tabs = ["All Content", "Videos", "Images", "Articles", "Audio"];

export function RecentContent() {
  return (
    <Card className="flex h-full w-full flex-col">
      <div className="border-b border-dt-border bg-gradient-to-r from-dt-red/10 via-transparent to-transparent px-4 py-3">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Recent Content</h3>
        </div>
        <div className="mb-3 flex gap-1">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              type="button"
              className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                i === 0
                  ? "bg-dt-red text-white"
                  : "text-dt-muted hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-dt-border bg-dt-bg px-3 py-1.5">
            <Search size={14} className="text-dt-muted" />
            <input
              type="text"
              placeholder="Search content..."
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-dt-muted"
            />
          </div>
          <select className="rounded-md border border-dt-border bg-dt-bg px-3 py-1.5 text-xs text-[#d4d4d4]">
            <option>Status</option>
          </select>
          <select className="rounded-md border border-dt-border bg-dt-bg px-3 py-1.5 text-xs text-[#d4d4d4]">
            <option>Types</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-dt-border text-[11px] uppercase tracking-wide text-dt-muted">
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
            {recentContent.map((row) => (
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
                <td className="px-3 py-2.5 align-middle text-[#a3a3a3]">{row.type}</td>
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
                <td className="px-3 py-2.5 align-middle text-[#a3a3a3]">{row.published}</td>
                <td className="px-3 py-2.5 align-middle text-white">{row.views}</td>
                <td className="px-3 py-2.5 align-middle text-white">{row.engagement}</td>
                <td className="px-4 py-2.5 align-middle">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="rounded p-1 text-dt-muted hover:bg-dt-border hover:text-white"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1 text-dt-muted hover:bg-dt-border hover:text-white"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
