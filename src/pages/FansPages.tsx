import { Panel } from "../components/PageShell";
import { AnalyticsPageGate } from "../components/dametime/DametimeAnalyticsStates";
import { formatMetric } from "../lib/dametimeAnalyticsApi";
import { formatMetric as formatIgMetric } from "../lib/instagramAnalyticsApi";
import { formatMetric as formatYtMetric } from "../lib/youtubeAnalyticsApi";
import { formatMetric as formatFbMetric } from "../lib/facebookAnalyticsApi";
import { formatMetric as formatTwMetric } from "../lib/twitterAnalyticsApi";

const segments = [
  { name: "Inner Circle Members", size: "48.2K", match: "Tier = Inner Circle" },
  { name: "Tour Intent — West Coast", size: "124K", match: "Location + engagement score" },
  { name: "Email Engaged (30d)", size: "89K", match: "Opened email in last 30 days" },
  { name: "High LTV Superfans", size: "12.4K", match: "LTV > $200" },
];

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
