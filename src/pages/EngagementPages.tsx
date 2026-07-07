import { useState } from "react";
import { MessageSquare, Send, BarChart3 } from "lucide-react";
import { Panel, StatCard } from "../components/PageShell";
import { AnalyticsPageGate } from "../components/dametime/DametimeAnalyticsStates";
import {
  formatMetric,
  formatRelativeTime,
  initialsFromName,
  type DametimeAnalytics,
} from "../lib/dametimeAnalyticsApi";
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
import { liveActivity } from "../data/mockData";

const comments = [
  { user: "Trey_503", text: "This drop is insane 🔥", post: "Inner Circle Exclusive", time: "3m", flagged: false },
  { user: "BallIsLife", text: "When's the next stream?", post: "Studio Session BTS", time: "8m", flagged: false },
  { user: "RipCityFan", text: "Portland forever", post: "Tour Announcement", time: "12m", flagged: false },
  { user: "spam_bot", text: "Click here for free...", post: "Fan Q&A", time: "15m", flagged: true },
];

const messages = [
  { from: "Jordan K.", preview: "Just joined Inner Circle — where do I start?", unread: true, tier: "Inner Circle" },
  { from: "Maya R.", preview: "Loved the acoustic version!", unread: true, tier: "Superfan" },
  { from: "Alex T.", preview: "Can I get tour presale access?", unread: false, tier: "VIP" },
  { from: "Sam P.", preview: "Shared your post with my group", unread: false, tier: "Fan" },
];

const polls = [
  { question: "Which city should we add to the tour?", votes: 12400, status: "Active", ends: "2 days" },
  { question: "Next exclusive drop format?", votes: 8920, status: "Active", ends: "5 days" },
  { question: "Favorite BTS moment?", votes: 24100, status: "Closed", ends: "Ended" },
];

function DametimeEngagementOverview({ analytics }: { analytics: DametimeAnalytics }) {
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
        <Panel title="Engagement by Event Type">
          {analytics.eventTypes.map((eventType) => {
            const pct = totalEventCount ? Math.round((eventType.count / totalEventCount) * 1000) / 10 : 0;
            return (
              <div key={eventType.type} className="mb-3">
                <div className="mb-1 flex justify-between text-sm">
                  <span>{eventType.label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-dt-border">
                  <div className="h-full rounded-full bg-dt-red" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </Panel>
        <Panel title="Recent Activity">
          {analytics.recentActivity.slice(0, 8).map((item) => (
            <div
              key={`${item.email}-${item.at}-${item.eventType}`}
              className="flex gap-3 border-b border-dt-border/50 py-2 last:border-0"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dt-red/20 text-[10px] font-bold text-dt-red">
                {initialsFromName(item.displayName)}
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">{item.displayName}</span> — {item.action}
                </p>
                <p className="text-xs text-dt-muted">{formatRelativeTime(item.at)}</p>
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

function InstagramEngagementOverview({ analytics }: { analytics: InstagramAnalytics }) {
  const totalEngagement = analytics.recentPosts.reduce((sum, post) => sum + post.likes + post.comments, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Followers" value={formatIgMetric(analytics.kpis.followers, true)} />
        <StatCard label="Avg. Likes" value={formatIgMetric(analytics.kpis.avgLikes, true)} />
        <StatCard label="Avg. Comments" value={formatIgMetric(analytics.kpis.avgComments, true)} />
        <StatCard label="Recent Engagement" value={formatIgMetric(totalEngagement, true)} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Panel title="Media Mix">
          {(["image", "video", "carousel", "unknown"] as const).map((type) => {
            const count = analytics.recentPosts.filter((post) => post.mediaType === type).length;
            const pct = analytics.recentPosts.length
              ? Math.round((count / analytics.recentPosts.length) * 100)
              : 0;
            if (!count) return null;
            return (
              <div key={type} className="mb-3">
                <div className="mb-1 flex justify-between text-sm capitalize">
                  <span>{type}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-dt-border">
                  <div className="h-full rounded-full bg-dt-red" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </Panel>
        <Panel title="Recent Posts">
          {analytics.recentPosts.slice(0, 6).map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between border-b border-dt-border/50 py-2 last:border-0 hover:text-dt-red"
            >
              <p className="line-clamp-1 flex-1 pr-3 text-sm text-white">{captionPreview(post.caption, 60)}</p>
              <p className="shrink-0 text-xs text-dt-muted">
                {formatIgMetric(post.likes)} likes · {formatIgMetric(post.comments)} comments
              </p>
            </a>
          ))}
        </Panel>
      </div>
    </div>
  );
}

function YouTubeEngagementOverview({ analytics }: { analytics: YouTubeAnalytics }) {
  const totalEngagement = analytics.recentVideos.reduce(
    (sum, video) => sum + video.viewCount + video.likeCount,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Subscribers" value={formatYtMetric(analytics.kpis.subscribers, true)} />
        <StatCard label="Avg. Views" value={formatYtMetric(analytics.kpis.avgViews, true)} />
        <StatCard label="Avg. Likes" value={formatYtMetric(analytics.kpis.avgLikes, true)} />
        <StatCard label="Recent Engagement" value={formatYtMetric(totalEngagement, true)} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Panel title="Performance Mix">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Total views (tracked)</span>
              <span className="font-medium">{formatYtMetric(analytics.kpis.totalViews)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Videos tracked</span>
              <span className="font-medium">{formatYtMetric(analytics.kpis.totalVideos)}</span>
            </div>
            <div className="h-2 rounded-full bg-dt-border">
              <div className="h-full rounded-full bg-dt-red" style={{ width: "72%" }} />
            </div>
          </div>
        </Panel>
        <Panel title="Recent Videos">
          {analytics.recentVideos.slice(0, 6).map((video) => (
            <a
              key={video.id}
              href={video.permalink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between border-b border-dt-border/50 py-2 last:border-0 hover:text-dt-red"
            >
              <p className="line-clamp-1 flex-1 pr-3 text-sm text-white">{titlePreview(video.title, 60)}</p>
              <p className="shrink-0 text-xs text-dt-muted">
                {formatYtMetric(video.viewCount)} views · {formatYtMetric(video.likeCount)} likes
              </p>
            </a>
          ))}
        </Panel>
      </div>
    </div>
  );
}

function FacebookEngagementOverview({ analytics }: { analytics: FacebookAnalytics }) {
  const totalEngagement = analytics.recentPosts.reduce(
    (sum, post) => sum + post.likes + post.comments + post.shares,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Followers" value={formatFbMetric(analytics.kpis.followers, true)} />
        <StatCard label="Avg. Likes" value={formatFbMetric(analytics.kpis.avgLikes, true)} />
        <StatCard label="Avg. Comments" value={formatFbMetric(analytics.kpis.avgComments, true)} />
        <StatCard label="Recent Engagement" value={formatFbMetric(totalEngagement, true)} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Panel title="Performance Mix">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Talking about this</span>
              <span className="font-medium">{formatFbMetric(analytics.page.talkingAbout)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Posts tracked</span>
              <span className="font-medium">{formatFbMetric(analytics.kpis.totalPosts)}</span>
            </div>
            <div className="h-2 rounded-full bg-dt-border">
              <div className="h-full rounded-full bg-dt-red" style={{ width: "72%" }} />
            </div>
          </div>
        </Panel>
        <Panel title="Recent Posts">
          {analytics.recentPosts.slice(0, 6).map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between border-b border-dt-border/50 py-2 last:border-0 hover:text-dt-red"
            >
              <p className="line-clamp-1 flex-1 pr-3 text-sm text-white">{textPreview(post.text, 60)}</p>
              <p className="shrink-0 text-xs text-dt-muted">
                {formatFbMetric(post.likes)} likes · {formatFbMetric(post.comments)} comments
              </p>
            </a>
          ))}
        </Panel>
      </div>
    </div>
  );
}

function OverviewEngagementPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Comments (7d)" value="18.4K" trend="+22%" />
        <StatCard label="Reactions" value="142K" trend="+15%" />
        <StatCard label="Shares" value="28.6K" trend="+31%" />
        <StatCard label="Poll Votes" value="45.4K" trend="+18%" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Panel title="Engagement by Channel">
          {["Instagram", "TikTok", "YouTube", "Twitter/X"].map((ch, i) => (
            <div key={ch} className="mb-3">
              <div className="mb-1 flex justify-between text-sm">
                <span>{ch}</span>
                <span>{[42, 28, 18, 12][i]}%</span>
              </div>
              <div className="h-2 rounded-full bg-dt-border">
                <div className="h-full rounded-full bg-dt-red" style={{ width: `${[42, 28, 18, 12][i]}%` }} />
              </div>
            </div>
          ))}
        </Panel>
        <Panel title="Recent Activity">
          {liveActivity.slice(0, 4).map((a) => (
            <div key={a.user} className="flex gap-3 border-b border-dt-border/50 py-2 last:border-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dt-red/20 text-[10px] font-bold text-dt-red">
                {a.avatar}
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">{a.user}</span> — {a.action}
                </p>
                <p className="text-xs text-dt-muted">{a.time}</p>
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

export function EngagementOverviewPage() {
  return (
    <AnalyticsPageGate
      mock={<OverviewEngagementPage />}
      dametime={(analytics) => <DametimeEngagementOverview analytics={analytics} />}
      instagram={(analytics) => <InstagramEngagementOverview analytics={analytics} />}
      youtube={(analytics) => <YouTubeEngagementOverview analytics={analytics} />}
      facebook={(analytics) => <FacebookEngagementOverview analytics={analytics} />}
    />
  );
}

export function CommentsPage() {
  const [filter, setFilter] = useState<"all" | "flagged">("all");
  const list = filter === "flagged" ? comments.filter((c) => c.flagged) : comments;

  return (
    <AnalyticsPageGate
      mock={
        <Panel title="Comment Moderation">
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-md px-3 py-1.5 text-xs ${filter === "all" ? "bg-dt-red text-white" : "border border-dt-border"}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("flagged")}
              className={`rounded-md px-3 py-1.5 text-xs ${filter === "flagged" ? "bg-dt-red text-white" : "border border-dt-border"}`}
            >
              Flagged
            </button>
          </div>
          <div className="space-y-2">
            {list.map((c) => (
              <div
                key={c.user + c.time}
                className={`flex items-start justify-between rounded-lg border p-3 ${c.flagged ? "border-orange-500/40 bg-orange-500/5" : "border-dt-border bg-dt-bg/40"}`}
              >
                <div className="flex gap-3">
                  <MessageSquare size={16} className="mt-0.5 text-dt-muted" />
                  <div>
                    <p className="text-sm font-medium">
                      {c.user} <span className="font-normal text-dt-muted">on {c.post}</span>
                    </p>
                    <p className="mt-1 text-sm">{c.text}</p>
                    <p className="mt-1 text-xs text-dt-muted">{c.time} ago</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      }
      dametime={(analytics) => (
        <Panel title="Top Clicked Content">
          <div className="space-y-2">
            {analytics.topTargets.length === 0 ? (
              <p className="text-sm text-dt-muted">No click data yet.</p>
            ) : (
              analytics.topTargets.map((target, index) => (
                <div
                  key={target.target}
                  className="flex items-center justify-between border-b border-dt-border/50 py-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-dt-red">{index + 1}</span>
                    <span className="text-sm font-medium">{target.label}</span>
                  </div>
                  <span className="text-sm text-dt-muted">{formatMetric(target.count)} clicks</span>
                </div>
              ))
            )}
          </div>
        </Panel>
      )}
      instagram={(analytics) => (
        <Panel title="Top Posts by Engagement">
          <div className="space-y-2">
            {analytics.topPosts.map((post, index) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border-b border-dt-border/50 py-3 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-dt-red">{index + 1}</span>
                  <span className="line-clamp-1 text-sm font-medium">{captionPreview(post.caption, 50)}</span>
                </div>
                <span className="shrink-0 text-sm text-dt-muted">
                  {formatIgMetric(post.likes + post.comments)} interactions
                </span>
              </a>
            ))}
          </div>
        </Panel>
      )}
      youtube={(analytics) => (
        <Panel title="Top Videos by Engagement">
          <div className="space-y-2">
            {analytics.topVideos.map((video, index) => (
              <a
                key={video.id}
                href={video.permalink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border-b border-dt-border/50 py-3 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-dt-red">{index + 1}</span>
                  <span className="line-clamp-1 text-sm font-medium">{titlePreview(video.title, 50)}</span>
                </div>
                <span className="shrink-0 text-sm text-dt-muted">
                  {formatYtMetric(video.viewCount + video.likeCount)} interactions
                </span>
              </a>
            ))}
          </div>
        </Panel>
      )}
      facebook={(analytics) => (
        <Panel title="Top Posts by Engagement">
          <div className="space-y-2">
            {analytics.topPosts.map((post, index) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border-b border-dt-border/50 py-3 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-dt-red">{index + 1}</span>
                  <span className="line-clamp-1 text-sm font-medium">{textPreview(post.text, 50)}</span>
                </div>
                <span className="shrink-0 text-sm text-dt-muted">
                  {formatFbMetric(post.likes + post.comments + post.shares)} interactions
                </span>
              </a>
            ))}
          </div>
        </Panel>
      )}
    />
  );
}

export function MessagesPage() {
  const [selected, setSelected] = useState(0);

  return (
    <AnalyticsPageGate
      mock={
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Panel title="Inbox">
            {messages.map((m, i) => (
              <button
                key={m.from}
                type="button"
                onClick={() => setSelected(i)}
                className={`mb-1 w-full rounded-md p-3 text-left ${selected === i ? "border border-dt-red/30 bg-dt-red/15" : "hover:bg-white/[0.03]"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{m.from}</span>
                  {m.unread && <span className="h-2 w-2 rounded-full bg-dt-red" />}
                </div>
                <p className="mt-1 truncate text-xs text-dt-muted">{m.preview}</p>
              </button>
            ))}
          </Panel>
          <div className="col-span-2">
            <Panel title={messages[selected].from}>
              <div className="mb-4 space-y-3">
                <div className="ml-auto max-w-[80%] rounded-lg bg-dt-red/20 p-3 text-sm">
                  Hey! Welcome to Inner Circle — check the Exclusives tab for your first drop.
                </div>
                <div className="max-w-[80%] rounded-lg border border-dt-border bg-dt-bg p-3 text-sm">
                  {messages[selected].preview}
                </div>
              </div>
              <div className="flex gap-2">
                <input className="flex-1 rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm" placeholder="Reply to fan..." />
                <button type="button" className="rounded-md bg-dt-red px-4">
                  <Send size={16} />
                </button>
              </div>
            </Panel>
          </div>
        </div>
      }
      dametime={(analytics) => (
        <Panel title="Recent Fan Activity">
          <div className="space-y-2">
            {analytics.recentActivity.map((item) => (
              <div
                key={`${item.email}-${item.at}-${item.eventType}`}
                className="flex gap-3 border-b border-dt-border/50 py-3 last:border-0"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dt-red/20 text-[10px] font-bold text-dt-red">
                  {initialsFromName(item.displayName)}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.displayName}</p>
                  <p className="text-sm text-dt-muted">{item.action}</p>
                  <p className="text-xs text-dt-muted">{formatRelativeTime(item.at)}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
      instagram={(analytics) => (
        <Panel title="Recent Instagram Posts">
          <div className="space-y-2">
            {analytics.recentPosts.map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border-b border-dt-border/50 py-3 last:border-0 hover:text-dt-red"
              >
                <p className="line-clamp-2 flex-1 pr-3 text-sm text-white">{captionPreview(post.caption, 80)}</p>
                <p className="shrink-0 text-xs text-dt-muted">
                  {formatIgMetric(post.likes)} likes · {formatIgMetric(post.comments)} comments
                </p>
              </a>
            ))}
          </div>
        </Panel>
      )}
      youtube={(analytics) => (
        <Panel title="Recent YouTube Videos">
          <div className="space-y-2">
            {analytics.recentVideos.map((video) => (
              <a
                key={video.id}
                href={video.permalink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border-b border-dt-border/50 py-3 last:border-0 hover:text-dt-red"
              >
                <p className="line-clamp-2 flex-1 pr-3 text-sm text-white">{titlePreview(video.title, 80)}</p>
                <p className="shrink-0 text-xs text-dt-muted">
                  {formatYtMetric(video.viewCount)} views · {formatYtMetric(video.likeCount)} likes
                </p>
              </a>
            ))}
          </div>
        </Panel>
      )}
      facebook={(analytics) => (
        <Panel title="Recent Facebook Posts">
          <div className="space-y-2">
            {analytics.recentPosts.map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border-b border-dt-border/50 py-3 last:border-0 hover:text-dt-red"
              >
                <p className="line-clamp-2 flex-1 pr-3 text-sm text-white">{textPreview(post.text, 80)}</p>
                <p className="shrink-0 text-xs text-dt-muted">
                  {formatFbMetric(post.likes)} likes · {formatFbMetric(post.comments)} comments
                </p>
              </a>
            ))}
          </div>
        </Panel>
      )}
    />
  );
}

export function PollsPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" className="rounded-md bg-dt-red px-4 py-2 text-sm font-semibold">
          + Create Poll
        </button>
      </div>
      {polls.map((p) => (
        <div key={p.question} className="rounded-lg border border-dt-border bg-dt-card p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">{p.question}</p>
              <p className="mt-1 text-sm text-dt-muted">
                {p.votes.toLocaleString()} votes · {p.ends}
              </p>
            </div>
            <span
              className={`rounded px-2 py-0.5 text-xs ${p.status === "Active" ? "bg-green-500/15 text-dt-green" : "bg-dt-border text-dt-muted"}`}
            >
              {p.status}
            </span>
          </div>
          <div className="mt-4 flex gap-4">
            <BarChart3 size={16} className="text-dt-red" />
            <div className="flex-1 space-y-2">
              {["Option A", "Option B", "Option C"].map((o, i) => (
                <div key={o}>
                  <div className="flex justify-between text-xs">
                    <span>{o}</span>
                    <span>{[52, 31, 17][i]}%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-dt-border">
                    <div className="h-full rounded-full bg-dt-red" style={{ width: `${[52, 31, 17][i]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
