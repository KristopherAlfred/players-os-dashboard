import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Panel, StatCard } from "../components/PageShell";
import { trafficOverTime, trafficSources } from "../data/mockData";

const campaigns = [
  { name: "Tour Launch — Instagram", spend: "$12,400", conversions: 2840, roas: "4.2x", status: "Active" },
  { name: "Inner Circle Push", spend: "$4,200", conversions: 920, roas: "6.1x", status: "Active" },
  { name: "Email Re-engagement", spend: "$800", conversions: 410, roas: "8.4x", status: "Paused" },
  { name: "TikTok Teaser", spend: "$8,600", conversions: 1920, roas: "3.8x", status: "Active" },
];

const reports = [
  { name: "Weekly Performance Summary", type: "Automated", last: "May 19, 2024" },
  { name: "Audience Growth Report", type: "Manual", last: "May 15, 2024" },
  { name: "Monetization Partner Export", type: "Scheduled", last: "May 12, 2024" },
  { name: "Campaign ROI Breakdown", type: "Manual", last: "May 10, 2024" },
];

export function TrafficOverviewPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Sessions (7d)" value="1.26M" trend="+18.4%" />
        <StatCard label="Avg. Duration" value="4m 32s" trend="+6%" />
        <StatCard label="Bounce Rate" value="24.8%" trend="-3.2%" />
        <StatCard label="Pages / Session" value="3.8" trend="+0.4" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Panel title="Sessions Over Time">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trafficOverTime}>
              <CartesianGrid stroke="#1e1e1e" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#6b6b6b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b6b6b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8 }} />
              <Line type="monotone" dataKey="visitors" stroke="#e50914" strokeWidth={2} dot={{ fill: "#e50914", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Source Breakdown">
          {trafficSources.map((s) => (
            <div key={s.name} className="mb-3">
              <div className="mb-1 flex justify-between text-sm"><span>{s.name}</span><span>{s.value}%</span></div>
              <div className="h-2 rounded-full bg-dt-border"><div className="h-full rounded-full bg-dt-red" style={{ width: `${s.value}%` }} /></div>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

export function ConversionFunnelPage() {
  const funnel = [
    { stage: "Visitors", count: 1260000, pct: 100 },
    { stage: "Engaged", count: 411600, pct: 33 },
    { stage: "Captured Email/SMS", count: 75300, pct: 6 },
    { stage: "Inner Circle", count: 12400, pct: 0.98 },
    { stage: "Converted", count: 8700, pct: 0.69 },
  ];
  return (
    <Panel title="Conversion Funnel">
      <div className="space-y-3">
        {funnel.map((f) => (
          <div key={f.stage}>
            <div className="mb-1 flex justify-between text-sm"><span className="font-medium">{f.stage}</span><span>{f.count.toLocaleString()} ({f.pct}%)</span></div>
            <div className="h-8 overflow-hidden rounded-md bg-dt-border"><div className="flex h-full items-center rounded-md bg-dt-red px-3 text-xs font-medium" style={{ width: `${Math.max(f.pct, 8)}%` }}>{f.pct}%</div></div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function CampaignsPage() {
  return (
    <Panel title="Active Campaigns">
      <table className="w-full text-left text-sm">
        <thead><tr className="border-b border-dt-border text-xs text-dt-muted"><th className="pb-2">Campaign</th><th className="pb-2">Spend</th><th className="pb-2">Conversions</th><th className="pb-2">ROAS</th><th className="pb-2">Status</th></tr></thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.name} className="border-b border-dt-border/50 hover:bg-white/[0.02]">
              <td className="py-3 font-medium">{c.name}</td><td className="py-3">{c.spend}</td><td className="py-3">{c.conversions.toLocaleString()}</td><td className="py-3 text-dt-green">{c.roas}</td>
              <td className="py-3"><span className={`rounded px-2 py-0.5 text-xs ${c.status === "Active" ? "bg-green-500/15 text-dt-green" : "bg-dt-border text-dt-muted"}`}>{c.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

export function ReportsPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><button type="button" className="rounded-md bg-dt-red px-4 py-2 text-sm font-semibold">+ Generate Report</button></div>
      <Panel title="Saved Reports">
        {reports.map((r) => (
          <div key={r.name} className="flex items-center justify-between border-b border-dt-border/50 py-3 last:border-0">
            <div><p className="font-medium">{r.name}</p><p className="text-xs text-dt-muted">{r.type} · Last run {r.last}</p></div>
            <div className="flex gap-2"><button type="button" className="rounded border border-dt-border px-3 py-1 text-xs">Download</button><button type="button" className="rounded border border-dt-border px-3 py-1 text-xs">Schedule</button></div>
          </div>
        ))}
      </Panel>
    </div>
  );
}

