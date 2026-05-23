import { Panel, StatCard } from "../components/PageShell";

const partners = [
  { name: "LiveRamp", abbr: "LR", status: "Synced", segments: 12 },
  { name: "theTradeDesk", abbr: "TTD", status: "Synced", segments: 8 },
  { name: "Google DV360", abbr: "DV", status: "Pending", segments: 4 },
  { name: "Meta CAPI", abbr: "META", status: "Synced", segments: 6 },
];

const audiences = [
  { name: "High-Intent Tour Fans", size: "124K", cpm: "$4.80", active: true },
  { name: "Inner Circle Lookalike", size: "890K", cpm: "$2.40", active: true },
  { name: "Music Streamers 18-34", size: "2.1M", cpm: "$1.90", active: true },
  { name: "Portland DMA Superfans", size: "48K", cpm: "$6.20", active: false },
];

export function PartnersPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Active DSPs" value="14" />
        <StatCard label="Synced Segments" value="28" />
        <StatCard label="Last Sync" value="2h ago" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {partners.map((p) => (
          <div key={p.name} className="flex items-center gap-4 rounded-lg border border-dt-border bg-dt-card p-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-dt-red/20 text-sm font-bold text-dt-red">{p.abbr}</span>
            <div className="flex-1">
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-dt-muted">{p.segments} segments · {p.status}</p>
            </div>
            <button type="button" className="rounded border border-dt-border px-3 py-1 text-xs">Manage</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AudiencesPage() {
  return (
    <Panel title="Monetizable Audiences">
      <table className="w-full text-left text-sm">
        <thead><tr className="border-b border-dt-border text-xs text-dt-muted"><th className="pb-2">Audience</th><th className="pb-2">Size</th><th className="pb-2">Est. CPM</th><th className="pb-2">Status</th><th className="pb-2">Actions</th></tr></thead>
        <tbody>
          {audiences.map((a) => (
            <tr key={a.name} className="border-b border-dt-border/50">
              <td className="py-3 font-medium">{a.name}</td><td className="py-3">{a.size}</td><td className="py-3">{a.cpm}</td>
              <td className="py-3"><span className={`rounded px-2 py-0.5 text-xs ${a.active ? "bg-green-500/15 text-dt-green" : "bg-dt-border text-dt-muted"}`}>{a.active ? "Active" : "Paused"}</span></td>
              <td className="py-3"><button type="button" className="text-xs text-dt-red hover:underline">Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

export function RevenuePage() {
  const months = [
    { month: "Jan", revenue: 42000 },
    { month: "Feb", revenue: 58000 },
    { month: "Mar", revenue: 72000 },
    { month: "Apr", revenue: 81000 },
    { month: "May", revenue: 96420 },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Revenue (MTD)" value="$96,420" trend="+24.7%" />
        <StatCard label="Partner Yield" value="$68,200" />
        <StatCard label="Direct Sales" value="$28,220" />
        <StatCard label="Avg. CPM" value="$3.42" trend="+0.18" />
      </div>
      <Panel title="Monthly Revenue">
        <div className="flex h-48 items-end gap-3">
          {months.map((m) => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full rounded-t-md bg-dt-red" style={{ height: `${(m.revenue / 96420) * 160}px` }} />
              <span className="text-xs text-dt-muted">{m.month}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

