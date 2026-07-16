import { fetchFacebookAnalytics } from "./facebookAnalyticsApi";
import { fetchInstagramAnalytics } from "./instagramAnalyticsApi";
import { fetchTwitterAnalytics } from "./twitterAnalyticsApi";
import { fetchYouTubeAnalytics } from "./youtubeAnalyticsApi";

export type PlatformShare = {
  name: string;
  followers: number;
  value: number;
};

export type OverviewKpi = {
  label: string;
  value: string;
  change: string;
  icon: "users" | "user-check" | "mail" | "heart" | "eye" | "trending-up";
};

export type OverviewMetrics = {
  syncedAt: string;
  overallFollowers: number;
  platformShares: PlatformShare[];
  kpis: OverviewKpi[];
  audienceSnapshot: Array<{ label: string; value: string }>;
  followersOverTime: Array<{ date: string; followers: number }>;
};

const PLATFORM_COLORS = ["#e50914", "#ff4444", "#cc0000", "#990000"];

const FALLBACK_PLATFORMS = [
  { name: "Instagram", followers: 9_586_731 },
  { name: "Facebook", followers: 4_789_039 },
  { name: "X (Twitter)", followers: 3_464_190 },
  { name: "YouTube", followers: 2_660_000 },
];

export function formatMetric(value: number, compact = false) {
  if (!Number.isFinite(value)) return "—";
  if (compact) {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return value.toLocaleString();
}

function pctShare(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 1000) / 10;
}

function buildPlatformShares(
  platforms: Array<{ name: string; followers: number }>,
): PlatformShare[] {
  const total = platforms.reduce((sum, platform) => sum + platform.followers, 0);
  return platforms.map((platform) => ({
    name: platform.name,
    followers: platform.followers,
    value: pctShare(platform.followers, total),
  }));
}

function buildFollowersOverTime(total: number) {
  const milestones = [0.978, 0.982, 0.985, 0.988, 0.991, 0.994, 0.997, 1];
  const dates = ["May 25", "May 26", "May 27", "May 28", "May 29", "May 30", "May 31", "Jun 2"];
  return dates.map((date, index) => ({
    date,
    followers: Math.round(total * milestones[index]),
  }));
}

function buildKpis(
  overall: number,
  instagram: number,
  facebook: number,
  twitter: number,
  youtube: number,
  avgLikes: number,
): OverviewKpi[] {
  return [
    { label: "Overall Followers", value: formatMetric(overall, true), change: "+2.4%", icon: "users" },
    { label: "Instagram", value: formatMetric(instagram, true), change: "+1.8%", icon: "users" },
    { label: "Facebook", value: formatMetric(facebook, true), change: "+1.2%", icon: "user-check" },
    { label: "X (Twitter)", value: formatMetric(twitter, true), change: "+1.5%", icon: "heart" },
    { label: "YouTube", value: formatMetric(youtube, true), change: "+2.1%", icon: "eye" },
    {
      label: "Avg. Likes / Post",
      value: formatMetric(avgLikes, true),
      change: "+6.3%",
      icon: "trending-up",
    },
  ];
}

function buildAudienceSnapshot(
  instagram: number,
  facebook: number,
  twitter: number,
  youtube: number,
  igPosts: number,
  fbPosts: number,
  xPosts: number,
  ytVideos: number,
) {
  const totalPosts = igPosts + fbPosts + xPosts + ytVideos;
  return [
    { label: "Instagram Followers", value: formatMetric(instagram) },
    { label: "Facebook Followers", value: formatMetric(facebook) },
    { label: "X Followers", value: formatMetric(twitter) },
    { label: "YouTube Subscribers", value: formatMetric(youtube) },
    { label: "Total Posts", value: formatMetric(totalPosts) },
    { label: "Platforms Tracked", value: "4" },
  ];
}

export function buildOverviewMetrics(input: {
  instagram: number;
  facebook: number;
  twitter: number;
  youtube: number;
  igPosts?: number;
  fbPosts?: number;
  xPosts?: number;
  ytVideos?: number;
  avgLikes?: number;
  syncedAt?: string;
}): OverviewMetrics {
  const platforms = [
    { name: "Instagram", followers: input.instagram },
    { name: "Facebook", followers: input.facebook },
    { name: "X (Twitter)", followers: input.twitter },
    { name: "YouTube", followers: input.youtube },
  ].filter((platform) => platform.followers > 0);

  const overallFollowers = platforms.reduce((sum, platform) => sum + platform.followers, 0);
  const avgLikes =
    input.avgLikes ??
    Math.round(
      (34_885 + 137 + 90_276 + 1_374) / 4,
    );

  return {
    syncedAt: input.syncedAt ?? new Date().toISOString(),
    overallFollowers,
    platformShares: buildPlatformShares(platforms.length ? platforms : FALLBACK_PLATFORMS),
    kpis: buildKpis(
      overallFollowers,
      input.instagram,
      input.facebook,
      input.twitter,
      input.youtube,
      avgLikes,
    ),
    audienceSnapshot: buildAudienceSnapshot(
      input.instagram,
      input.facebook,
      input.twitter,
      input.youtube,
      input.igPosts ?? 5_224,
      input.fbPosts ?? 10,
      input.xPosts ?? 26_171,
      input.ytVideos ?? 30,
    ),
    followersOverTime: buildFollowersOverTime(overallFollowers),
  };
}

export const fallbackOverviewMetrics = buildOverviewMetrics({
  instagram: FALLBACK_PLATFORMS[0].followers,
  facebook: FALLBACK_PLATFORMS[1].followers,
  twitter: FALLBACK_PLATFORMS[2].followers,
  youtube: FALLBACK_PLATFORMS[3].followers,
});

export async function fetchOverviewMetrics(): Promise<OverviewMetrics> {
  const [instagram, facebook, twitter, youtube] = await Promise.allSettled([
    fetchInstagramAnalytics(),
    fetchFacebookAnalytics(),
    fetchTwitterAnalytics(),
    fetchYouTubeAnalytics(),
  ]);

  const ig = instagram.status === "fulfilled" ? instagram.value : null;
  const fb = facebook.status === "fulfilled" ? facebook.value : null;
  const tw = twitter.status === "fulfilled" ? twitter.value : null;
  const yt = youtube.status === "fulfilled" ? youtube.value : null;

  if (!ig && !fb && !tw && !yt) {
    return fallbackOverviewMetrics;
  }

  const igFollowers = ig?.kpis.followers ?? FALLBACK_PLATFORMS[0].followers;
  const fbFollowers = fb?.kpis.followers ?? FALLBACK_PLATFORMS[1].followers;
  const twFollowers = tw?.kpis.followers ?? FALLBACK_PLATFORMS[2].followers;
  const ytFollowers = yt?.kpis.subscribers ?? FALLBACK_PLATFORMS[3].followers;

  const avgLikes = Math.round(
    ((ig?.kpis.avgLikes ?? 0) +
      (fb?.kpis.avgLikes ?? 0) +
      (tw?.kpis.avgLikes ?? 0) +
      (yt?.kpis.avgLikes ?? 0)) /
      [ig, fb, tw, yt].filter(Boolean).length,
  );

  const syncedAt = [ig?.syncedAt, fb?.syncedAt, tw?.syncedAt, yt?.syncedAt]
    .filter(Boolean)
    .sort()
    .reverse()[0];

  return buildOverviewMetrics({
    instagram: igFollowers,
    facebook: fbFollowers,
    twitter: twFollowers,
    youtube: ytFollowers,
    igPosts: ig?.kpis.totalPosts,
    fbPosts: fb?.kpis.totalPosts,
    xPosts: tw?.profile.totalPosts,
    ytVideos: yt?.kpis.totalVideos,
    avgLikes,
    syncedAt,
  });
}

export { PLATFORM_COLORS };
