import {
  Users,
  UserPlus,
  Grid3x3,
  Heart,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "../ui/Card";
import { useTheme } from "../../theme/ThemeContext";
import { useAnalyticsView } from "../../hooks/useAnalyticsView";
import {
  captionPreview,
  formatMetric,
  formatRelativeTime,
  type InstagramAnalytics,
} from "../../lib/instagramAnalyticsApi";
import { SourceError, SourceLoading } from "../dametime/DametimeAnalyticsStates";

function KpiGrid({ analytics }: { analytics: InstagramAnalytics }) {
  const cards = [
    { label: "Followers", value: formatMetric(analytics.kpis.followers, true), icon: Users },
    { label: "Following", value: formatMetric(analytics.kpis.following, true), icon: UserPlus },
    { label: "Total Posts", value: formatMetric(analytics.kpis.totalPosts, true), icon: Grid3x3 },
    { label: "Avg. Likes", value: formatMetric(analytics.kpis.avgLikes, true), icon: Heart },
    { label: "Avg. Comments", value: formatMetric(analytics.kpis.avgComments, true), icon: MessageCircle },
    { label: "Engagement", value: `${analytics.kpis.engagementRate}%`, icon: TrendingUp },
  ];

  return (
    <div className="grid w-full min-w-0 grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="dt-surface relative min-w-0 overflow-hidden rounded-lg border border-dt-border bg-dt-card p-3 xl:p-4"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black via-black to-black/95" />
            <p className="relative text-[10px] font-medium uppercase tracking-wide text-white xl:text-[11px]">
              {card.label}
            </p>
            <p className="relative mt-1.5 text-xl font-bold text-white xl:mt-2 xl:text-2xl">{card.value}</p>
            <div className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 sm:block">
              <Icon size={20} strokeWidth={1.75} className="text-pink-500" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProfileCard({ analytics }: { analytics: InstagramAnalytics }) {
  const { profile } = analytics;
  return (
    <Card title="Instagram Profile" className="min-h-[280px]">
      <div className="flex gap-4 px-4 py-3">
        <img
          src={profile.profilePicUrl}
          alt={profile.fullName}
          className="h-16 w-16 shrink-0 rounded-full border-2 border-pink-500/40 object-cover"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">
            {profile.fullName}
            {profile.isVerified && <span className="ml-1 text-pink-400">✓</span>}
          </p>
          <a
            href={profile.permalink}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-pink-400 hover:underline"
          >
            @{profile.username}
          </a>
          {profile.biography && (
            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-dt-muted">{profile.biography}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

function TopPostsChart({ analytics }: { analytics: InstagramAnalytics }) {
  const { palette } = useTheme();
  const chartData = analytics.topPosts.slice(0, 6).map((post) => ({
    label: post.code.slice(0, 8),
    likes: post.likes,
    comments: post.comments,
  }));

  return (
    <Card title="Top Posts by Likes" className="h-[280px]">
      <div className="h-[230px] px-2 pb-2 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid stroke="#ffffff" strokeDasharray="3 3" strokeOpacity={0.15} vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#ffffff", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#ffffff", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#fff" }}
            />
            <Bar dataKey="likes" name="Likes" fill={palette.accent} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function RecentPosts({ analytics }: { analytics: InstagramAnalytics }) {
  return (
    <Card title="Recent Posts" className="min-h-[280px]">
      <div className="max-h-[420px] overflow-y-auto px-3 py-2">
        {analytics.recentPosts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noreferrer"
            className="flex gap-3 border-b border-dt-border/60 py-3 last:border-0 hover:bg-white/[0.02]"
          >
            <img
              src={post.thumbnailUrl}
              alt=""
              className="h-14 w-14 shrink-0 rounded-md object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-[13px] text-white">{captionPreview(post.caption, 100)}</p>
              <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-dt-muted">
                <span>{formatMetric(post.likes)} likes</span>
                <span>{formatMetric(post.comments)} comments</span>
                <span>{formatRelativeTime(post.takenAt)}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </Card>
  );
}

export function InstagramAnalyticsDashboard() {
  const { isInstagram, instagram } = useAnalyticsView();

  if (!isInstagram) return null;
  if (instagram.loading) return <SourceLoading message="Loading Instagram analytics…" />;
  if (instagram.error) {
    return <SourceError title="Could not load Instagram analytics" message={instagram.error} />;
  }
  if (!instagram.analytics) {
    return <SourceError title="Could not load Instagram analytics" message="No data available." />;
  }

  const analytics = instagram.analytics;

  return (
    <div className="space-y-3 pb-4">
      <KpiGrid analytics={analytics} />

      <div className="grid grid-cols-12 items-stretch gap-3">
        <div className="col-span-12 lg:col-span-4">
          <ProfileCard analytics={analytics} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <TopPostsChart analytics={analytics} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <RecentPosts analytics={analytics} />
        </div>
      </div>
    </div>
  );
}
