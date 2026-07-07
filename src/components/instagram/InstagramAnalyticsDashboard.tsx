import { useState } from "react";
import {
  Users,
  UserPlus,
  Grid3x3,
  Heart,
  MessageCircle,
  TrendingUp,
  ExternalLink,
  Film,
  Images,
  Camera,
} from "lucide-react";
import { Card } from "../ui/Card";
import { useAnalyticsView } from "../../hooks/useAnalyticsView";
import {
  captionPreview,
  formatMetric,
  formatPostDate,
  formatRelativeTime,
  instagramPostImage,
  instagramProfileImage,
  mediaTypeLabel,
  type InstagramAnalytics,
  type InstagramPostAnalytics,
} from "../../lib/instagramAnalyticsApi";
import { SourceError, SourceLoading } from "../dametime/DametimeAnalyticsStates";

function MediaBadge({ type }: { type: InstagramPostAnalytics["mediaType"] }) {
  const Icon = type === "video" ? Film : type === "carousel" ? Images : Camera;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur-sm">
      <Icon size={10} />
      {mediaTypeLabel(type)}
    </span>
  );
}

function PostImage({
  post,
  className = "",
}: {
  post: InstagramPostAnalytics;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = instagramPostImage(post);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-black ${className}`}
      >
        <Camera size={20} className="text-pink-300/60" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={captionPreview(post.caption, 40)}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function ProfileImage({ analytics }: { analytics: InstagramAnalytics }) {
  const [failed, setFailed] = useState(false);
  const src = instagramProfileImage(analytics.profile);

  return (
    <div className="relative shrink-0">
      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400" />
      {failed ? (
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-dt-card text-2xl font-bold text-pink-400">
          DL
        </div>
      ) : (
        <img
          src={src}
          alt={analytics.profile.fullName}
          className="relative h-20 w-20 rounded-full border-2 border-black object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

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
            className="group relative min-w-0 overflow-hidden rounded-xl border border-pink-500/15 bg-dt-card p-3 xl:p-4"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-500/[0.08] via-transparent to-purple-500/[0.06] opacity-0 transition-opacity group-hover:opacity-100" />
            <p className="relative text-[10px] font-medium uppercase tracking-wider text-pink-200/70 xl:text-[11px]">
              {card.label}
            </p>
            <p className="relative mt-1.5 text-xl font-bold text-white xl:mt-2 xl:text-2xl">{card.value}</p>
            <div className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 sm:block">
              <Icon size={20} strokeWidth={1.75} className="text-pink-400/80" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProfileCard({ analytics }: { analytics: InstagramAnalytics }) {
  const { profile } = analytics;
  const stats = [
    { label: "Posts", value: formatMetric(profile.posts, true) },
    { label: "Followers", value: formatMetric(profile.followers, true) },
    { label: "Following", value: formatMetric(profile.following, true) },
  ];

  return (
    <Card title="Instagram Profile" className="overflow-hidden">
      <div className="relative px-4 pb-4 pt-3">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-pink-500/15 via-purple-500/10 to-transparent" />
        <div className="relative flex gap-4">
          <ProfileImage analytics={analytics} />
          <div className="min-w-0 flex-1 pt-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-base font-semibold text-white">
                  {profile.fullName}
                  {profile.isVerified && <span className="ml-1 text-sky-400">✓</span>}
                </p>
                <a
                  href={profile.permalink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-pink-400 hover:text-pink-300"
                >
                  @{profile.username}
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
            {profile.biography && (
              <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-dt-muted">
                {profile.biography}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-white/5 bg-black/20 p-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-sm font-bold text-white">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-wide text-dt-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function TopPostCard({ post, rank }: { post: InstagramPostAnalytics; rank: number }) {
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noreferrer"
      className="group relative aspect-square overflow-hidden rounded-xl border border-white/5 bg-black"
    >
      <PostImage post={post} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
      <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-[11px] font-bold text-white shadow-lg">
        {rank}
      </div>
      <div className="absolute right-2 top-2">
        <MediaBadge type={post.mediaType} />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="line-clamp-2 text-xs font-medium leading-snug text-white">
          {captionPreview(post.caption, 60)}
        </p>
        <div className="mt-2 flex items-center gap-3 text-[11px] text-pink-100/90">
          <span className="inline-flex items-center gap-1">
            <Heart size={11} className="fill-pink-400 text-pink-400" />
            {formatMetric(post.likes)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle size={11} />
            {formatMetric(post.comments)}
          </span>
        </div>
      </div>
    </a>
  );
}

function TopPostsGrid({ analytics }: { analytics: InstagramAnalytics }) {
  return (
    <Card title="Top Posts by Engagement" className="h-full">
      <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">
        {analytics.topPosts.slice(0, 6).map((post, index) => (
          <TopPostCard key={post.id} post={post} rank={index + 1} />
        ))}
      </div>
    </Card>
  );
}

function RecentPostRow({ post }: { post: InstagramPostAnalytics }) {
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noreferrer"
      className="group flex gap-3 rounded-lg p-2 transition-colors hover:bg-white/[0.03]"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
        <PostImage post={post} className="h-full w-full object-cover" />
        <div className="absolute bottom-1 left-1">
          <MediaBadge type={post.mediaType} />
        </div>
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <p className="line-clamp-2 text-[13px] font-medium leading-snug text-white group-hover:text-pink-100">
          {captionPreview(post.caption, 90)}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-dt-muted">
          <span className="inline-flex items-center gap-1 text-pink-300/90">
            <Heart size={10} className="fill-pink-400/80 text-pink-400/80" />
            {formatMetric(post.likes)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle size={10} />
            {formatMetric(post.comments)}
          </span>
          <span>{formatPostDate(post.takenAt)}</span>
          <span className="text-white/30">·</span>
          <span>{formatRelativeTime(post.takenAt)}</span>
        </div>
      </div>
      <ExternalLink
        size={14}
        className="mt-1 shrink-0 text-dt-muted opacity-0 transition-opacity group-hover:opacity-100"
      />
    </a>
  );
}

function RecentPosts({ analytics }: { analytics: InstagramAnalytics }) {
  return (
    <Card title="Recent Posts" className="h-full">
      <div className="max-h-[520px] divide-y divide-white/5 overflow-y-auto px-2 py-1">
        {analytics.recentPosts.map((post) => (
          <RecentPostRow key={post.id} post={post} />
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
    <div className="space-y-4 pb-4">
      <KpiGrid analytics={analytics} />

      <div className="grid grid-cols-12 items-start gap-4">
        <div className="col-span-12 xl:col-span-4">
          <ProfileCard analytics={analytics} />
        </div>
        <div className="col-span-12 xl:col-span-8">
          <TopPostsGrid analytics={analytics} />
        </div>
      </div>

      <RecentPosts analytics={analytics} />
    </div>
  );
}
