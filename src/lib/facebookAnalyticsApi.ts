export type FacebookPostAnalytics = {
  id: string;
  text: string;
  permalink: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
};

export type FacebookAnalytics = {
  syncedAt: string;
  source?: "live" | "cache";
  page: {
    id: string;
    name: string;
    slug: string;
    permalink: string;
    followers: number;
    followersLabel: string;
    talkingAbout: number;
  };
  kpis: {
    followers: number;
    totalPosts: number;
    avgLikes: number;
    avgComments: number;
    avgShares: number;
    engagementRate: number;
  };
  recentPosts: FacebookPostAnalytics[];
  topPosts: FacebookPostAnalytics[];
};

function getApiBase() {
  return (import.meta.env.VITE_DAME_BIO_API_URL ?? "https://sloane-bio.vercel.app").replace(/\/$/, "");
}

async function fetchJsonAnalytics(url: string): Promise<FacebookAnalytics | null> {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok || !contentType.includes("application/json")) return null;
  const data = (await response.json()) as FacebookAnalytics & { ok?: boolean };
  if (!data?.kpis) return null;
  const hasEngagement =
    Number(data.kpis.avgLikes ?? 0) + Number(data.kpis.avgComments ?? 0) + Number(data.kpis.avgShares ?? 0) > 0;
  if (!hasEngagement && data.source === "cache") return null;
  return data;
}

function normalizePost(post: {
  id: string;
  text?: string;
  permalink?: string;
  createdAt?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  stats?: { likes?: number; comments?: number; shares?: number };
}): FacebookPostAnalytics {
  return {
    id: post.id,
    text: post.text?.trim() || "Facebook post",
    permalink: post.permalink || `https://www.facebook.com/DamianLillard/posts/${post.id}/`,
    createdAt: post.createdAt || new Date().toISOString(),
    likes: Number(post.likes ?? post.stats?.likes ?? 0),
    comments: Number(post.comments ?? post.stats?.comments ?? 0),
    shares: Number(post.shares ?? post.stats?.shares ?? 0),
  };
}

function buildFacebookAnalyticsFromPosts(
  posts: FacebookPostAnalytics[],
  page?: Partial<FacebookAnalytics["page"]>,
): FacebookAnalytics | null {
  if (!posts.length) return null;

  const recentPosts = posts.slice(0, 12);
  const topPosts = [...posts]
    .sort((a, b) => b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares))
    .slice(0, 8);
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);
  const totalShares = posts.reduce((sum, post) => sum + post.shares, 0);
  const count = posts.length;
  const avgLikes = Math.round(totalLikes / count);
  const avgComments = Math.round(totalComments / count);
  const avgShares = Math.round(totalShares / count);
  const followers = Number(page?.followers ?? 0);

  return {
    syncedAt: new Date().toISOString(),
    source: "cache",
    page: {
      id: page?.id ?? "DamianLillard",
      name: page?.name ?? "Damian Lillard",
      slug: page?.slug ?? "DamianLillard",
      permalink: page?.permalink ?? "https://www.facebook.com/DamianLillard/",
      followers,
      followersLabel:
        page?.followersLabel ??
        (followers ? `${formatMetric(followers, true)} followers` : "Followers unavailable"),
      talkingAbout: Number(page?.talkingAbout ?? 0),
    },
    kpis: {
      followers,
      totalPosts: count,
      avgLikes,
      avgComments,
      avgShares,
      engagementRate:
        followers > 0
          ? Math.round(((avgLikes + avgComments + avgShares) / followers) * 10_000) / 100
          : 0,
    },
    recentPosts,
    topPosts,
  };
}

async function enrichFollowerStats(analytics: FacebookAnalytics): Promise<FacebookAnalytics> {
  if (analytics.kpis.followers > 0) return analytics;

  const base = getApiBase();
  const cacheUrls = ["/data/facebook-analytics.json", `${base}/data/facebook-analytics.json`];

  for (const url of cacheUrls) {
    try {
      const cached = await fetchJsonAnalytics(url);
      if (!cached?.kpis.followers) continue;
      return {
        ...analytics,
        page: {
          ...analytics.page,
          followers: cached.page.followers,
          followersLabel: cached.page.followersLabel,
          talkingAbout: cached.page.talkingAbout,
        },
        kpis: {
          ...analytics.kpis,
          followers: cached.kpis.followers,
          engagementRate: cached.kpis.engagementRate,
        },
      };
    } catch {
      // try next
    }
  }

  return analytics;
}

export async function fetchFacebookAnalytics(): Promise<FacebookAnalytics | null> {
  const base = getApiBase();
  const apiUrls = [`${base}/api/social/analytics?source=facebook`, `${base}/api/facebook/analytics`, `${base}/api/facebook-analytics`];

  for (const url of apiUrls) {
    try {
      const data = await fetchJsonAnalytics(url);
      if (data) return enrichFollowerStats(data);
    } catch {
      // try next source
    }
  }

  const cacheUrls = ["/data/facebook-analytics.json", `${base}/data/facebook-analytics.json`];

  for (const url of cacheUrls) {
    try {
      const data = await fetchJsonAnalytics(url);
      if (data) return enrichFollowerStats({ ...data, source: "cache" });
    } catch {
      // try next source
    }
  }

  try {
    const response = await fetch(`${base}/data/facebook-posts.json`);
    if (!response.ok) return null;
    const feed = (await response.json()) as Array<{
      id: string;
      text?: string;
      permalink?: string;
      createdAt?: string;
      stats?: { likes?: number; comments?: number; shares?: number };
    }>;
    const built = buildFacebookAnalyticsFromPosts(feed.map(normalizePost));
    if (!built) return null;
    return enrichFollowerStats(built);
  } catch {
    return null;
  }
}

export function formatMetric(value: number, compact = false) {
  if (compact) {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

export function formatRelativeTime(iso: string) {
  const deltaMs = Date.now() - Date.parse(iso);
  if (!Number.isFinite(deltaMs) || deltaMs < 0) return "just now";

  const seconds = Math.floor(deltaMs / 1000);
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function formatPostDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function textPreview(text: string, max = 80) {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (!trimmed) return "Facebook post";
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}
