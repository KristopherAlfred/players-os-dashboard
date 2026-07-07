import { useState } from "react";
import { Search, Mail, Smartphone } from "lucide-react";
import { Panel, StatCard } from "../components/PageShell";
import { SignupHeatmap } from "../components/SignupHeatmap";
import { AnalyticsPageGate } from "../components/dametime/DametimeAnalyticsStates";
import { formatMetric, type DametimeAnalytics } from "../lib/dametimeAnalyticsApi";
import {
  captionPreview,
  formatMetric as formatIgMetric,
  formatRelativeTime,
  type InstagramAnalytics,
} from "../lib/instagramAnalyticsApi";
import { ageDemographics, topCountries, audienceSnapshot } from "../data/mockData";

const fans = [
  { name: "Jordan K.", tier: "Inner Circle", city: "Portland, OR", joined: "2022", ltv: "$284" },
  { name: "Maya R.", tier: "Superfan", city: "Atlanta, GA", joined: "2023", ltv: "$142" },
  { name: "Alex T.", tier: "VIP", city: "Toronto, ON", joined: "2021", ltv: "$398" },
  { name: "Sam P.", tier: "Fan", city: "Chicago, IL", joined: "2024", ltv: "$48" },
];

const segments = [
  { name: "Inner Circle Members", size: "48.2K", match: "Tier = Inner Circle" },
  { name: "Tour Intent — West Coast", size: "124K", match: "Location + engagement score" },
  { name: "Email Engaged (30d)", size: "89K", match: "Opened email in last 30 days" },
  { name: "High LTV Superfans", size: "12.4K", match: "LTV > $200" },
];

const subscribers = [
  { email: "jordan.k@email.com", channel: "Email", status: "Active", since: "Mar 2022" },
  { email: "+1 (503) 555-0142", channel: "SMS", status: "Active", since: "Jan 2024" },
  { email: "maya.r@email.com", channel: "Email", status: "Active", since: "Jun 2023" },
  { email: "+1 (404) 555-0198", channel: "SMS", status: "Unsubscribed", since: "Feb 2023" },
];

function DametimeAudienceOverview({ analytics }: { analytics: DametimeAnalytics }) {
  const stats = [
    { label: "Total Fans", value: formatMetric(analytics.kpis.totalFans) },
    { label: "Email Captures", value: formatMetric(analytics.kpis.emailCaptures) },
    { label: "SMS Opt-ins", value: formatMetric(analytics.kpis.smsOptIns) },
    { label: "Active Fans (7d)", value: formatMetric(analytics.kpis.activeFans7d) },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Panel title="Engagement">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Engagement rate (7d)</span>
              <span className="font-medium">{analytics.kpis.engagementRate}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total events</span>
              <span className="font-medium">{formatMetric(analytics.kpis.totalEvents)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Page views</span>
              <span className="font-medium">{formatMetric(analytics.kpis.pageViews)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Mapped signups</span>
              <span className="font-medium">{formatMetric(analytics.geo.mappedFans)}</span>
            </div>
          </div>
        </Panel>
        <Panel title="Top Countries">
          {analytics.geo.countries.length === 0 ? (
            <p className="text-sm text-dt-muted">No geo data yet.</p>
          ) : (
            analytics.geo.countries.map((country) => (
              <div
                key={country.country}
                className="flex justify-between border-b border-dt-border/50 py-2 text-sm last:border-0"
              >
                <span>
                  {country.flag} {country.country}
                </span>
                <span className="font-medium">
                  {country.pct}% ({formatMetric(country.count)})
                </span>
              </div>
            ))
          )}
        </Panel>
      </div>
      <Panel title="Signup locations">
        {analytics.geo.points.length === 0 ? (
          <p className="text-sm text-dt-muted">No mapped signup locations yet.</p>
        ) : (
          <div className="space-y-2">
            {analytics.geo.points.map((point) => (
              <div
                key={`${point.lat}-${point.lng}-${point.label}`}
                className="flex justify-between border-b border-dt-border/50 py-2 text-sm last:border-0"
              >
                <span>{point.label}</span>
                <span className="font-medium text-dt-red">{formatMetric(point.count)} fans</span>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

function InstagramAudienceOverview({ analytics }: { analytics: InstagramAnalytics }) {
  const stats = [
    { label: "Followers", value: formatIgMetric(analytics.kpis.followers, true) },
    { label: "Following", value: formatIgMetric(analytics.kpis.following, true) },
    { label: "Total Posts", value: formatIgMetric(analytics.kpis.totalPosts, true) },
    { label: "Engagement", value: `${analytics.kpis.engagementRate}%` },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Panel title="Profile">
          <p className="text-sm font-medium text-white">{analytics.profile.fullName}</p>
          <p className="text-xs text-pink-400">@{analytics.profile.username}</p>
          {analytics.profile.biography && (
            <p className="mt-2 text-sm text-dt-muted">{analytics.profile.biography}</p>
          )}
        </Panel>
        <Panel title="Recent Engagement">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Avg. likes</span>
              <span className="font-medium">{formatIgMetric(analytics.kpis.avgLikes)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Avg. comments</span>
              <span className="font-medium">{formatIgMetric(analytics.kpis.avgComments)}</span>
            </div>
          </div>
        </Panel>
      </div>
      <Panel title="Top Posts">
        {analytics.topPosts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between border-b border-dt-border/50 py-2 text-sm last:border-0 hover:text-pink-400"
          >
            <span className="line-clamp-1 pr-3">{captionPreview(post.caption, 60)}</span>
            <span className="shrink-0 font-medium">{formatIgMetric(post.likes)} likes</span>
          </a>
        ))}
      </Panel>
    </div>
  );
}

function OverviewAudiencePage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {audienceSnapshot.slice(0, 4).map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Panel title="Age Distribution">
          {ageDemographics.map((a) => (
            <div key={a.range} className="mb-2">
              <div className="flex justify-between text-xs">
                <span>{a.range}</span>
                <span>{a.pct}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-dt-border">
                <div className="h-full rounded-full bg-dt-red" style={{ width: `${a.pct}%` }} />
              </div>
            </div>
          ))}
        </Panel>
        <Panel title="Top Countries">
          {topCountries.map((c) => (
            <div
              key={c.country}
              className="flex justify-between border-b border-dt-border/50 py-2 text-sm last:border-0"
            >
              <span>
                {c.flag} {c.country}
              </span>
              <span className="font-medium">{c.pct}%</span>
            </div>
          ))}
        </Panel>
      </div>
      <Panel title="Signup locations">
        <SignupHeatmap />
      </Panel>
    </div>
  );
}

export function AudienceOverviewPage() {
  return (
    <AnalyticsPageGate
      mock={<OverviewAudiencePage />}
      dametime={(analytics) => <DametimeAudienceOverview analytics={analytics} />}
      instagram={(analytics) => <InstagramAudienceOverview analytics={analytics} />}
    />
  );
}

function DametimeFanProfiles({ analytics }: { analytics: DametimeAnalytics }) {
  const [query, setQuery] = useState("");
  const filtered = analytics.topUsers.filter((fan) => {
    const label = fan.name || fan.username || fan.email;
    return label.toLowerCase().includes(query.toLowerCase()) || fan.email.includes(query.toLowerCase());
  });

  return (
    <Panel title="Fan Profiles">
      <div className="mb-4 flex items-center gap-2 rounded-md border border-dt-border bg-dt-bg px-3 py-2">
        <Search size={14} className="text-dt-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-dt-border text-xs text-dt-muted">
            <th className="pb-2">Fan</th>
            <th className="pb-2">Events</th>
            <th className="pb-2">Points</th>
            <th className="pb-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((fan) => (
            <tr key={fan.email} className="border-b border-dt-border/50 hover:bg-white/[0.02]">
              <td className="py-3 font-medium">
                {fan.name || (fan.username ? `@${fan.username}` : fan.email.split("@")[0])}
              </td>
              <td className="py-3">{formatMetric(fan.eventCount)}</td>
              <td className="py-3">{formatMetric(fan.points)}</td>
              <td className="py-3 text-dt-muted">{fan.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

function InstagramFanProfiles({ analytics }: { analytics: InstagramAnalytics }) {
  const [query, setQuery] = useState("");
  const filtered = analytics.recentPosts.filter((post) =>
    post.caption.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Panel title="Recent Instagram Posts">
      <div className="mb-4 flex items-center gap-2 rounded-md border border-dt-border bg-dt-bg px-3 py-2">
        <Search size={14} className="text-dt-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search captions..."
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-dt-border text-xs text-dt-muted">
            <th className="pb-2">Post</th>
            <th className="pb-2">Likes</th>
            <th className="pb-2">Comments</th>
            <th className="pb-2">Posted</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((post) => (
            <tr key={post.id} className="border-b border-dt-border/50 hover:bg-white/[0.02]">
              <td className="py-3">
                <a href={post.permalink} target="_blank" rel="noreferrer" className="font-medium hover:text-pink-400">
                  {captionPreview(post.caption, 50)}
                </a>
              </td>
              <td className="py-3">{formatIgMetric(post.likes)}</td>
              <td className="py-3">{formatIgMetric(post.comments)}</td>
              <td className="py-3 text-dt-muted">{formatRelativeTime(post.takenAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

export function FanProfilesPage() {
  const [query, setQuery] = useState("");
  const filtered = fans.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnalyticsPageGate
      mock={
        <Panel title="Fan Profiles">
          <div className="mb-4 flex items-center gap-2 rounded-md border border-dt-border bg-dt-bg px-3 py-2">
            <Search size={14} className="text-dt-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, city, tier..."
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-dt-border text-xs text-dt-muted">
                <th className="pb-2">Fan</th>
                <th className="pb-2">Tier</th>
                <th className="pb-2">Location</th>
                <th className="pb-2">Since</th>
                <th className="pb-2">LTV</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.name} className="border-b border-dt-border/50 hover:bg-white/[0.02]">
                  <td className="py-3 font-medium">{f.name}</td>
                  <td className="py-3">
                    <span className="rounded bg-dt-red/15 px-2 py-0.5 text-xs text-dt-red">{f.tier}</span>
                  </td>
                  <td className="py-3 text-dt-muted">{f.city}</td>
                  <td className="py-3 text-dt-muted">{f.joined}</td>
                  <td className="py-3">{f.ltv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      }
      dametime={(analytics) => <DametimeFanProfiles analytics={analytics} />}
      instagram={(analytics) => <InstagramFanProfiles analytics={analytics} />}
    />
  );
}

export function SegmentsPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" className="rounded-md bg-dt-red px-4 py-2 text-sm font-semibold">
          + Create Segment
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {segments.map((s) => (
          <div key={s.name} className="rounded-lg border border-dt-border bg-dt-card p-4">
            <p className="font-medium">{s.name}</p>
            <p className="mt-2 text-2xl font-display font-semibold">{s.size}</p>
            <p className="mt-1 text-xs text-dt-muted">{s.match}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DametimeSubscribers({ analytics }: { analytics: DametimeAnalytics }) {
  return (
    <Panel title="Email / SMS Subscribers">
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Email Captures" value={formatMetric(analytics.kpis.emailCaptures)} />
        <StatCard label="SMS Opt-ins" value={formatMetric(analytics.kpis.smsOptIns)} />
        <StatCard label="Sign-ups Tracked" value={formatMetric(analytics.kpis.signups)} />
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-dt-border text-xs text-dt-muted">
            <th className="pb-2">Fan</th>
            <th className="pb-2">Events</th>
            <th className="pb-2">Points</th>
          </tr>
        </thead>
        <tbody>
          {analytics.topUsers.map((fan) => (
            <tr key={fan.email} className="border-b border-dt-border/50">
              <td className="py-3">
                <p className="font-medium">
                  {fan.name || (fan.username ? `@${fan.username}` : fan.email.split("@")[0])}
                </p>
                <p className="text-xs text-dt-muted">{fan.email}</p>
              </td>
              <td className="py-3">{formatMetric(fan.eventCount)}</td>
              <td className="py-3">{formatMetric(fan.points)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

function InstagramSubscribers({ analytics }: { analytics: InstagramAnalytics }) {
  return (
    <Panel title="@damianlillard on Instagram">
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Followers" value={formatIgMetric(analytics.kpis.followers)} />
        <StatCard label="Following" value={formatIgMetric(analytics.kpis.following)} />
        <StatCard label="Avg. Engagement" value={`${analytics.kpis.engagementRate}%`} />
      </div>
      <p className="mb-3 text-sm text-dt-muted">
        Instagram does not expose email/SMS subscribers publicly. Showing live profile reach instead.
      </p>
      <a
        href={analytics.profile.permalink}
        target="_blank"
        rel="noreferrer"
        className="inline-flex text-sm text-pink-400 hover:underline"
      >
        View @{analytics.profile.username} on Instagram
      </a>
    </Panel>
  );
}

export function SubscribersPage() {
  return (
    <AnalyticsPageGate
      mock={
        <Panel title="Email / SMS Subscribers">
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Email Subscribers" value="362,540" trend="+4.2%" />
            <StatCard label="SMS Subscribers" value="89,210" trend="+8.1%" />
            <StatCard label="Deliverability" value="98.4%" hint="Last 30 days" />
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-dt-border text-xs text-dt-muted">
                <th className="pb-2">Contact</th>
                <th className="pb-2">Channel</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Since</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.email} className="border-b border-dt-border/50">
                  <td className="py-3">{s.email}</td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 text-dt-muted">
                      {s.channel === "Email" ? <Mail size={12} /> : <Smartphone size={12} />}
                      {s.channel}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${s.status === "Active" ? "bg-green-500/15 text-dt-green" : "bg-dt-border text-dt-muted"}`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 text-dt-muted">{s.since}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      }
      dametime={(analytics) => <DametimeSubscribers analytics={analytics} />}
      instagram={(analytics) => <InstagramSubscribers analytics={analytics} />}
    />
  );
}

export function BehaviorInsightsPage() {
  return (
    <AnalyticsPageGate
      mock={
        <Panel title="Fan Journey Funnel">
          <div className="space-y-2">
            {[
              { step: "Landing Page", users: "1.26M", drop: "0%" },
              { step: "Content View", users: "842K", drop: "33%" },
              { step: "Email Capture", users: "75.3K", drop: "91%" },
              { step: "Inner Circle Signup", users: "12.4K", drop: "84%" },
              { step: "Purchase / Convert", users: "8.7K", drop: "30%" },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-4">
                <span className="w-6 text-center text-xs font-bold text-dt-red">{i + 1}</span>
                <div className="flex-1 rounded-lg border border-dt-border bg-dt-bg/50 p-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{s.step}</span>
                    <span>{s.users}</span>
                  </div>
                  {i > 0 && <p className="mt-1 text-xs text-dt-muted">{s.drop} drop-off from previous step</p>}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      }
      dametime={(analytics) => (
        <Panel title="Fan Journey Funnel">
          <div className="space-y-2">
            {[
              { step: "Sign-ups", users: analytics.kpis.signups },
              { step: "Active fans (7d)", users: analytics.kpis.activeFans7d },
              { step: "Page views", users: analytics.kpis.pageViews },
              { step: "Total clicks", users: analytics.kpis.totalClicks },
              { step: "SMS opt-ins", users: analytics.kpis.smsOptIns },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-4">
                <span className="w-6 text-center text-xs font-bold text-dt-red">{i + 1}</span>
                <div className="flex-1 rounded-lg border border-dt-border bg-dt-bg/50 p-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{s.step}</span>
                    <span>{formatMetric(s.users)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
      instagram={(analytics) => (
        <Panel title="Instagram Engagement Funnel">
          <div className="space-y-2">
            {[
              { step: "Followers", users: analytics.kpis.followers },
              { step: "Avg. likes per post", users: analytics.kpis.avgLikes },
              { step: "Avg. comments per post", users: analytics.kpis.avgComments },
              { step: "Recent posts sampled", users: analytics.recentPosts.length },
              { step: "Engagement rate", users: analytics.kpis.engagementRate, suffix: "%" },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-4">
                <span className="w-6 text-center text-xs font-bold text-pink-500">{i + 1}</span>
                <div className="flex-1 rounded-lg border border-dt-border bg-dt-bg/50 p-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{s.step}</span>
                    <span>
                      {formatIgMetric(s.users)}
                      {s.suffix ?? ""}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    />
  );
}
