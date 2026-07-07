import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Panel, StatCard } from "../components/PageShell";
import { AnalyticsPageGate } from "../components/dametime/DametimeAnalyticsStates";
import { formatMetric, type DametimeAnalytics } from "../lib/dametimeAnalyticsApi";
import {
  captionPreview,
  formatMetric as formatIgMetric,
  type InstagramAnalytics,
} from "../lib/instagramAnalyticsApi";
import {
  formatMetric as formatYtMetric,
  titlePreview,
  type YouTubeAnalytics,
} from "../lib/youtubeAnalyticsApi";
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

function InstagramTrafficOverview({ analytics }: { analytics: InstagramAnalytics }) {
  const lineData = [...analytics.recentPosts]
    .sort((a, b) => Date.parse(a.takenAt) - Date.parse(b.takenAt))
    .map((post) => ({
      label: new Date(post.takenAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      likes: post.likes,
      comments: post.comments,
    }));

  const barData = analytics.topPosts.slice(0, 6).map((post) => ({
    label: new Date(post.takenAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    likes: post.likes,
    comments: post.comments,
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Followers" value={formatIgMetric(analytics.kpis.followers, true)} />
        <StatCard label="Following" value={formatIgMetric(analytics.kpis.following, true)} />
        <StatCard label="Avg. Likes" value={formatIgMetric(analytics.kpis.avgLikes, true)} />
        <StatCard label="Engagement" value={`${analytics.kpis.engagementRate}%`} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Panel title="Post Engagement Over Time">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={lineData}>
              <CartesianGrid stroke="#1e1e1e" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#6b6b6b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b6b6b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="likes" name="Likes" stroke="#e50914" strokeWidth={2} dot={{ fill: "#e50914", r: 3 }} />
              <Line type="monotone" dataKey="comments" name="Comments" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Top Posts by Engagement">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData}>
              <CartesianGrid stroke="#1e1e1e" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#6b6b6b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b6b6b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="likes" name="Likes" fill="#e50914" radius={[4, 4, 0, 0]} />
              <Bar dataKey="comments" name="Comments" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <Panel title="Top Posts">
        {analytics.topPosts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noreferrer"
            className="mb-3 block"
          >
            <div className="mb-1 flex justify-between text-sm">
              <span className="line-clamp-1 pr-3">{captionPreview(post.caption, 40)}</span>
              <span>{formatIgMetric(post.likes)} likes</span>
            </div>
            <div className="h-2 rounded-full bg-dt-border">
              <div
                className="h-full rounded-full bg-dt-red"
                style={{
                  width: `${Math.max(8, Math.round((post.likes / Math.max(analytics.topPosts[0]?.likes ?? 1, 1)) * 100))}%`,
                }}
              />
            </div>
          </a>
        ))}
      </Panel>
    </div>
  );
}

function YouTubeTrafficOverview({ analytics }: { analytics: YouTubeAnalytics }) {
  const lineData = [...analytics.recentVideos]
    .sort((a, b) => Date.parse(a.publishedAt) - Date.parse(b.publishedAt))
    .map((video) => ({
      label: new Date(video.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: video.viewCount,
      likes: video.likeCount,
    }));

  const barData = analytics.topVideos.slice(0, 6).map((video, index) => ({
    label: `#${index + 1}`,
    views: video.viewCount,
    likes: video.likeCount,
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Subscribers" value={formatYtMetric(analytics.kpis.subscribers, true)} />
        <StatCard label="Total Videos" value={formatYtMetric(analytics.kpis.totalVideos, true)} />
        <StatCard label="Avg. Views" value={formatYtMetric(analytics.kpis.avgViews, true)} />
        <StatCard label="Engagement" value={`${analytics.kpis.engagementRate}%`} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Panel title="Video Performance Over Time">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={lineData}>
              <CartesianGrid stroke="#1e1e1e" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#6b6b6b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b6b6b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="views" name="Views" stroke="#e50914" strokeWidth={2} dot={{ fill: "#e50914", r: 3 }} />
              <Line type="monotone" dataKey="likes" name="Likes" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Top Videos by Views">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData}>
              <CartesianGrid stroke="#1e1e1e" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#6b6b6b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b6b6b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="views" name="Views" fill="#e50914" radius={[4, 4, 0, 0]} />
              <Bar dataKey="likes" name="Likes" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <Panel title="Top Videos">
        {analytics.topVideos.map((video) => (
          <a
            key={video.id}
            href={video.permalink}
            target="_blank"
            rel="noreferrer"
            className="mb-3 block"
          >
            <div className="mb-1 flex justify-between text-sm">
              <span className="line-clamp-1 pr-3">{titlePreview(video.title, 40)}</span>
              <span>{formatYtMetric(video.viewCount)} views</span>
            </div>
            <div className="h-2 rounded-full bg-dt-border">
              <div
                className="h-full rounded-full bg-dt-red"
                style={{
                  width: `${Math.max(8, Math.round((video.viewCount / Math.max(analytics.topVideos[0]?.viewCount ?? 1, 1)) * 100))}%`,
                }}
              />
            </div>
          </a>
        ))}
      </Panel>
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
    <AnalyticsPageGate
      mock={<OverviewTrafficPage />}
      dametime={(analytics) => <DametimeTrafficOverview analytics={analytics} />}
      instagram={(analytics) => <InstagramTrafficOverview analytics={analytics} />}
      youtube={(analytics) => <YouTubeTrafficOverview analytics={analytics} />}
    />
  );
}

export function ConversionFunnelPage() {
  return (
    <AnalyticsPageGate
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
      dametime={(analytics) => (
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
      instagram={(analytics) => (
        <Panel title="Post Performance Funnel">
          <div className="space-y-3">
            {analytics.topPosts.slice(0, 5).map((post, _index, arr) => {
              const pct = arr[0]?.likes ? Math.round((post.likes / arr[0].likes) * 100) : 0;
              return (
                <div key={post.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium line-clamp-1 pr-3">{captionPreview(post.caption, 40)}</span>
                    <span>
                      {formatIgMetric(post.likes)} likes ({pct}%)
                    </span>
                  </div>
                  <div className="h-8 overflow-hidden rounded-md bg-dt-border">
                    <div
                      className="flex h-full items-center rounded-md bg-dt-red px-3 text-xs font-medium"
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    >
                      {pct}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}
      youtube={(analytics) => (
        <Panel title="Video Performance Funnel">
          <div className="space-y-3">
            {analytics.topVideos.slice(0, 5).map((video, _index, arr) => {
              const pct = arr[0]?.viewCount ? Math.round((video.viewCount / arr[0].viewCount) * 100) : 0;
              return (
                <div key={video.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="line-clamp-1 pr-3 font-medium">{titlePreview(video.title, 40)}</span>
                    <span>
                      {formatYtMetric(video.viewCount)} views ({pct}%)
                    </span>
                  </div>
                  <div className="h-8 overflow-hidden rounded-md bg-dt-border">
                    <div
                      className="flex h-full items-center rounded-md bg-dt-red px-3 text-xs font-medium"
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    >
                      {pct}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}
    />
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
