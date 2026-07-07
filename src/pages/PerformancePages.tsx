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
import { DametimePageGate } from "../components/dametime/DametimeAnalyticsStates";
import { formatMetric, type DametimeAnalytics } from "../lib/dametimeAnalyticsApi";
import { trafficOverTime, trafficSources } from "../data/mockData";

const campaigns = [
  { name: "Tour Launch — Instagram", spend: "$12,400", conversions: 2840, roas: "4.2x", status: "Active" },
  { name: "Inner Circle Push", spend: "$4,200", conversions: 920, roas: "6.1x", status: "Active" },
  { name: "Email Re-engagement", spend: "$800", conversions: 410, roas: "8.4x", status: "Paused" },
  { name: "TikTok Teaser", spend: "$8,600", conversions: 1920, roas: "3.8x", status: "Active" },
];

const reports = [
  { name: "Weekly Performance Summary", type: "Automated", last: "Jun 2, 2026" },
  { name: "Audience Growth Report", type: "Manual", last: "May 29, 2026" },
  { name: "Monetization Partner Export", type: "Scheduled", last: "May 25, 2026" },
  { name: "Campaign ROI Breakdown", type: "Manual", last: "May 10, 2024" },
];

function DametimeTrafficOverview({ analytics }: { analytics: DametimeAnalytics }) {
  const totalEventCount = analytics.eventTypes.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Events" value={formatMetric(analytics.kpis.totalEvents)} />
        <StatCard label="Page Views" value={formatMetric(analytics.kpis.pageViews)} />
        <StatCard label="Total Clicks" value={formatMetric(analytics.kpis.totalClicks)} />
        <StatCard label="Engagement (7d)" value={`${analytics.kpis.engagementRate}%`} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Panel title="App Activity (14 days)">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={analytics.eventsOverTime}>
              <CartesianGrid stroke="#1e1e1e" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#6b6b6b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b6b6b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8 }} />
              <Line type="monotone" dataKey="events" stroke="#e50914" strokeWidth={2} dot={{ fill: "#e50914", r: 3 }} />
              <Line type="monotone" dataKey="pageViews" stroke="#ffffff" strokeWidth={2} dot={{ fill: "#ffffff", r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Event Breakdown">
          {analytics.eventTypes.map((eventType) => {
            const pct = totalEventCount ? Math.round((eventType.count / totalEventCount) * 1000) / 10 : 0;
            return (
              <div key={eventType.type} className="mb-3">
                <div className="mb-1 flex justify-between text-sm">
                  <span>{eventType.label}</span>
                  <span>
                    {formatMetric(eventType.count)} ({pct}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-dt-border">
                  <div className="h-full rounded-full bg-dt-red" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </Panel>
      </div>
    </div>
  );
}

function OverviewTrafficPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sessions (7d)" value="1.26M" trend="+18.4%" />
        <StatCard label="Avg. Duration" value="4m 32s" trend="+6%" />
        <StatCard label="Bounce Rate" value="24.8%" trend="-3.2%" />
        <StatCard label="Pages / Session" value="3.8" trend="+0.4" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Panel title="Sessions Over Time">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trafficOverTime}>
              <CartesianGrid stroke="#1e1e1e" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#6b6b6b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "#6b6b6b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8 }} />
              <Line type="monotone" dataKey="visitors" stroke="#e50914" strokeWidth={2} dot={{ fill: "#e50914", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Source Breakdown">
          {trafficSources.map((s) => (
            <div key={s.name} className="mb-3">
              <div className="mb-1 flex justify-between text-sm">
                <span>{s.name}</span>
                <span>{s.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-dt-border">
                <div className="h-full rounded-full bg-dt-red" style={{ width: `${s.value}%` }} />
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

export function TrafficOverviewPage() {
  return (
    <DametimePageGate mock={<OverviewTrafficPage />}>
      {(analytics) => <DametimeTrafficOverview analytics={analytics} />}
    </DametimePageGate>
  );
}

export function ConversionFunnelPage() {
  return (
    <DametimePageGate
      mock={
        <Panel title="Conversion Funnel">
          <div className="space-y-3">
            {[
              { stage: "Visitors", count: 1260000, pct: 100 },
              { stage: "Engaged", count: 411600, pct: 33 },
              { stage: "Captured Email/SMS", count: 75300, pct: 6 },
              { stage: "Inner Circle", count: 12400, pct: 0.98 },
              { stage: "Converted", count: 8700, pct: 0.69 },
            ].map((f) => (
              <div key={f.stage}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{f.stage}</span>
                  <span>
                    {f.count.toLocaleString()} ({f.pct}%)
                  </span>
                </div>
                <div className="h-8 overflow-hidden rounded-md bg-dt-border">
                  <div
                    className="flex h-full items-center rounded-md bg-dt-red px-3 text-xs font-medium"
                    style={{ width: `${Math.max(f.pct, 8)}%` }}
                  >
                    {f.pct}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      }
    >
      {(analytics) => (
        <Panel title="Conversion Funnel">
          <div className="space-y-3">
            {[
              { stage: "Sign-ups", count: analytics.kpis.signups, pct: 100 },
              { stage: "Email captures", count: analytics.kpis.emailCaptures, pct: analytics.kpis.signups ? Math.round((analytics.kpis.emailCaptures / analytics.kpis.signups) * 100) : 0 },
              { stage: "Page views", count: analytics.kpis.pageViews, pct: analytics.kpis.signups ? Math.min(100, Math.round((analytics.kpis.pageViews / analytics.kpis.signups) / 10)) : 0 },
              { stage: "Total clicks", count: analytics.kpis.totalClicks, pct: analytics.kpis.signups ? Math.min(100, Math.round((analytics.kpis.totalClicks / analytics.kpis.signups) / 5)) : 0 },
              { stage: "SMS opt-ins", count: analytics.kpis.smsOptIns, pct: analytics.kpis.emailCaptures ? Math.round((analytics.kpis.smsOptIns / analytics.kpis.emailCaptures) * 100) : 0 },
            ].map((f) => (
              <div key={f.stage}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{f.stage}</span>
                  <span>
                    {formatMetric(f.count)} ({f.pct}%)
                  </span>
                </div>
                <div className="h-8 overflow-hidden rounded-md bg-dt-border">
                  <div
                    className="flex h-full items-center rounded-md bg-dt-red px-3 text-xs font-medium"
                    style={{ width: `${Math.max(f.pct, 8)}%` }}
                  >
                    {f.pct}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </DametimePageGate>
  );
}

export function CampaignsPage() {
  return (
    <Panel title="Active Campaigns">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-dt-border text-xs text-dt-muted">
            <th className="pb-2">Campaign</th>
            <th className="pb-2">Spend</th>
            <th className="pb-2">Conversions</th>
            <th className="pb-2">ROAS</th>
            <th className="pb-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.name} className="border-b border-dt-border/50 hover:bg-white/[0.02]">
              <td className="py-3 font-medium">{c.name}</td>
              <td className="py-3">{c.spend}</td>
              <td className="py-3">{c.conversions.toLocaleString()}</td>
              <td className="py-3 text-dt-green">{c.roas}</td>
              <td className="py-3">
                <span
                  className={`rounded px-2 py-0.5 text-xs ${c.status === "Active" ? "bg-green-500/15 text-dt-green" : "bg-dt-border text-dt-muted"}`}
                >
                  {c.status}
                </span>
              </td>
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
      <div className="flex justify-end">
        <button type="button" className="rounded-md bg-dt-red px-4 py-2 text-sm font-semibold">
          + Generate Report
        </button>
      </div>
      <Panel title="Saved Reports">
        {reports.map((r) => (
          <div
            key={r.name}
            className="flex items-center justify-between border-b border-dt-border/50 py-3 last:border-0"
          >
            <div>
              <p className="font-medium">{r.name}</p>
              <p className="text-xs text-dt-muted">
                {r.type} · Last run {r.last}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="rounded border border-dt-border px-3 py-1 text-xs">
                Download
              </button>
              <button type="button" className="rounded border border-dt-border px-3 py-1 text-xs">
                Schedule
              </button>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  );
}
