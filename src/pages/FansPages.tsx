import { Panel, StatCard } from "../components/PageShell";
import { SignupHeatmap } from "../components/SignupHeatmap";
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
import {
  formatMetric as formatFbMetric,
  textPreview,
  type FacebookAnalytics,
} from "../lib/facebookAnalyticsApi";
import {
  formatMetric as formatTwMetric,
  textPreview as twTextPreview,
  type TwitterAnalytics,
} from "../lib/twitterAnalyticsApi";
import { ageDemographics, topCountries, audienceSnapshot } from "../data/mockData";

const segments = [
  { name: "Inner Circle Members", size: "48.2K", match: "Tier = Inner Circle" },
  { name: "Tour Intent — West Coast", size: "124K", match: "Location + engagement score" },
  { name: "Email Engaged (30d)", size: "89K", match: "Opened email in last 30 days" },
  { name: "High LTV Superfans", size: "12.4K", match: "LTV > $200" },
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
        <Panel title="Audience Reach">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Followers</span>
              <span className="font-medium">{formatIgMetric(analytics.kpis.followers)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Following</span>
              <span className="font-medium">{formatIgMetric(analytics.kpis.following)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total posts</span>
              <span className="font-medium">{formatIgMetric(analytics.kpis.totalPosts)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Engagement rate</span>
              <span className="font-medium text-dt-green">{analytics.kpis.engagementRate}%</span>
            </div>
          </div>
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
            className="flex items-center justify-between border-b border-dt-border/50 py-2 text-sm last:border-0 hover:text-dt-red"
          >
            <span className="line-clamp-1 pr-3">{captionPreview(post.caption, 60)}</span>
            <span className="shrink-0 font-medium">{formatIgMetric(post.likes)} likes</span>
          </a>
        ))}
      </Panel>
    </div>
  );
}

function YouTubeAudienceOverview({ analytics }: { analytics: YouTubeAnalytics }) {
  const stats = [
    { label: "Subscribers", value: formatYtMetric(analytics.kpis.subscribers, true) },
    { label: "Total Videos", value: formatYtMetric(analytics.kpis.totalVideos, true) },
    { label: "Total Views", value: formatYtMetric(analytics.kpis.totalViews, true) },
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
        <Panel title="Channel Reach">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subscribers</span>
              <span className="font-medium">{analytics.channel.subscribersLabel}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Videos tracked</span>
              <span className="font-medium">{formatYtMetric(analytics.kpis.totalVideos)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total views</span>
              <span className="font-medium">{formatYtMetric(analytics.kpis.totalViews)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Avg. views / video</span>
              <span className="font-medium text-dt-green">{formatYtMetric(analytics.kpis.avgViews)}</span>
            </div>
          </div>
        </Panel>
        <Panel title="Engagement">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Avg. likes</span>
              <span className="font-medium">{formatYtMetric(analytics.kpis.avgLikes)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Engagement rate</span>
              <span className="font-medium">{analytics.kpis.engagementRate}%</span>
            </div>
          </div>
        </Panel>
      </div>
      <Panel title="Top Videos">
        {analytics.topVideos.map((video) => (
          <a
            key={video.id}
            href={video.permalink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between border-b border-dt-border/50 py-2 text-sm last:border-0 hover:text-dt-red"
          >
            <span className="line-clamp-1 pr-3">{titlePreview(video.title, 60)}</span>
            <span className="shrink-0 font-medium">{formatYtMetric(video.viewCount)} views</span>
          </a>
        ))}
      </Panel>
    </div>
  );
}

function FacebookAudienceOverview({ analytics }: { analytics: FacebookAnalytics }) {
  const stats = [
    { label: "Followers", value: formatFbMetric(analytics.kpis.followers, true) },
    { label: "Total Posts", value: formatFbMetric(analytics.kpis.totalPosts, true) },
    { label: "Talking About", value: formatFbMetric(analytics.page.talkingAbout, true) },
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
        <Panel title="Page Reach">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Followers</span>
              <span className="font-medium">{analytics.page.followersLabel}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Talking about this</span>
              <span className="font-medium">{formatFbMetric(analytics.page.talkingAbout)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Posts tracked</span>
              <span className="font-medium">{formatFbMetric(analytics.kpis.totalPosts)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Engagement rate</span>
              <span className="font-medium text-dt-green">{analytics.kpis.engagementRate}%</span>
            </div>
          </div>
        </Panel>
        <Panel title="Recent Engagement">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Avg. likes</span>
              <span className="font-medium">{formatFbMetric(analytics.kpis.avgLikes)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Avg. comments</span>
              <span className="font-medium">{formatFbMetric(analytics.kpis.avgComments)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Avg. shares</span>
              <span className="font-medium">{formatFbMetric(analytics.kpis.avgShares)}</span>
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
            className="flex items-center justify-between border-b border-dt-border/50 py-2 text-sm last:border-0 hover:text-dt-red"
          >
            <span className="line-clamp-1 pr-3">{textPreview(post.text, 60)}</span>
            <span className="shrink-0 font-medium">
              {formatFbMetric(post.likes + post.comments + post.shares)} engagement
            </span>
          </a>
        ))}
      </Panel>
    </div>
  );
}

function TwitterAudienceOverview({ analytics }: { analytics: TwitterAnalytics }) {
  const stats = [
    { label: "Followers", value: formatTwMetric(analytics.kpis.followers, true) },
    { label: "Following", value: formatTwMetric(analytics.kpis.following, true) },
    { label: "Sampled Posts", value: formatTwMetric(analytics.kpis.sampledPosts, true) },
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
        <Panel title="Profile Reach">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Followers</span>
              <span className="font-medium">{analytics.profile.followersLabel}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Following</span>
              <span className="font-medium">{formatTwMetric(analytics.profile.following)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total posts</span>
              <span className="font-medium">{formatTwMetric(analytics.profile.totalPosts)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Engagement rate</span>
              <span className="font-medium text-dt-green">{analytics.kpis.engagementRate}%</span>
            </div>
          </div>
        </Panel>
        <Panel title="Recent Engagement">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Avg. likes</span>
              <span className="font-medium">{formatTwMetric(analytics.kpis.avgLikes)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Avg. replies</span>
              <span className="font-medium">{formatTwMetric(analytics.kpis.avgReplies)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Avg. reposts</span>
              <span className="font-medium">{formatTwMetric(analytics.kpis.avgReposts)}</span>
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
            className="flex items-center justify-between border-b border-dt-border/50 py-2 text-sm last:border-0 hover:text-dt-red"
          >
            <span className="line-clamp-1 pr-3">{twTextPreview(post.text, 60)}</span>
            <span className="shrink-0 font-medium">
              {formatTwMetric(post.likes + post.replies + post.reposts)} engagement
            </span>
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
      youtube={(analytics) => <YouTubeAudienceOverview analytics={analytics} />}
      facebook={(analytics) => <FacebookAudienceOverview analytics={analytics} />}
      twitter={(analytics) => <TwitterAudienceOverview analytics={analytics} />}
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
                <span className="w-6 text-center text-xs font-bold text-dt-red">{i + 1}</span>
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
      youtube={(analytics) => (
        <Panel title="YouTube Engagement Funnel">
          <div className="space-y-2">
            {[
              { step: "Subscribers", users: analytics.kpis.subscribers },
              { step: "Avg. views per video", users: analytics.kpis.avgViews },
              { step: "Avg. likes per video", users: analytics.kpis.avgLikes },
              { step: "Recent videos sampled", users: analytics.recentVideos.length },
              { step: "Engagement rate", users: analytics.kpis.engagementRate, suffix: "%" },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-4">
                <span className="w-6 text-center text-xs font-bold text-dt-red">{i + 1}</span>
                <div className="flex-1 rounded-lg border border-dt-border bg-dt-bg/50 p-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{s.step}</span>
                    <span>
                      {formatYtMetric(s.users)}
                      {s.suffix ?? ""}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
      facebook={(analytics) => (
        <Panel title="Facebook Engagement Funnel">
          <div className="space-y-2">
            {[
              { step: "Followers", users: analytics.kpis.followers },
              { step: "Talking about this", users: analytics.page.talkingAbout },
              { step: "Avg. likes per post", users: analytics.kpis.avgLikes },
              { step: "Recent posts sampled", users: analytics.recentPosts.length },
              { step: "Engagement rate", users: analytics.kpis.engagementRate, suffix: "%" },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-4">
                <span className="w-6 text-center text-xs font-bold text-dt-red">{i + 1}</span>
                <div className="flex-1 rounded-lg border border-dt-border bg-dt-bg/50 p-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{s.step}</span>
                    <span>
                      {formatFbMetric(s.users)}
                      {s.suffix ?? ""}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
      twitter={(analytics) => (
        <Panel title="X Engagement Funnel">
          <div className="space-y-2">
            {[
              { step: "Followers", users: analytics.kpis.followers },
              { step: "Following", users: analytics.kpis.following },
              { step: "Avg. likes per post", users: analytics.kpis.avgLikes },
              { step: "Recent posts sampled", users: analytics.recentPosts.length },
              { step: "Engagement rate", users: analytics.kpis.engagementRate, suffix: "%" },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-4">
                <span className="w-6 text-center text-xs font-bold text-dt-red">{i + 1}</span>
                <div className="flex-1 rounded-lg border border-dt-border bg-dt-bg/50 p-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{s.step}</span>
                    <span>
                      {formatTwMetric(s.users)}
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
