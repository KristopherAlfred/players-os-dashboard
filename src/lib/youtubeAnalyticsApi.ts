export type YouTubeVideoAnalytics = {
  id: string;
  title: string;
  viewCount: number;
  likeCount: number;
  publishedAt: string;
  permalink: string;
  durationSeconds: number;
};

export type YouTubeAnalytics = {
  syncedAt: string;
  source?: "live" | "cache";
  channel: {
    id: string;
    name: string;
    handle: string;
    permalink: string;
    subscribers: number;
    subscribersLabel: string;
  };
  kpis: {
    subscribers: number;
    totalVideos: number;
    totalViews: number;
    avgViews: number;
    avgLikes: number;
    engagementRate: number;
  };
  recentVideos: YouTubeVideoAnalytics[];
  topVideos: YouTubeVideoAnalytics[];
};

function getApiBase() {
  return (import.meta.env.VITE_DAME_BIO_API_URL ?? "https://sloane-bio.vercel.app").replace(/\/$/, "");
}

async function fetchJsonAnalytics(url: string): Promise<YouTubeAnalytics | null> {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok || !contentType.includes("application/json")) return null;
  const data = (await response.json()) as YouTubeAnalytics & { ok?: boolean };
  if (!data?.kpis) return null;
  return data;
}

export async function fetchYouTubeVideosFeed(limit = 48): Promise<{
  syncedAt: string;
  source?: "live" | "cache";
  channel: {
    id: string;
    name: string;
    handle: string;
    avatar?: string;
    subscribers?: number;
    subscribersLabel?: string;
  };
  videos: Array<{
    id: string;
    title: string;
    viewCount?: number;
    likeCount?: number;
    publishedAt?: string;
    permalink?: string;
    durationSeconds?: number;
  }>;
} | null> {
  const base = getApiBase();
  const urls = [
    `${base}/api/youtube/videos?refresh=1&limit=${limit}`,
    `${base}/api/social/analytics?source=youtube&view=videos&refresh=1&limit=${limit}`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok || !contentType.includes("application/json")) continue;
      const data = (await response.json()) as {
        ok?: boolean;
        syncedAt?: string;
        source?: "live" | "cache";
        channel?: {
          id?: string;
          name?: string;
          handle?: string;
          avatar?: string;
          subscribers?: number;
          subscribersLabel?: string;
        };
        videos?: Array<{
          id: string;
          title: string;
          viewCount?: number;
          likeCount?: number;
          publishedAt?: string;
          permalink?: string;
          durationSeconds?: number;
        }>;
      };
      if (!data?.videos?.length || !data.channel) continue;
      return {
        syncedAt: data.syncedAt || new Date().toISOString(),
        source: data.source,
        channel: {
          id: data.channel.id || "UCL88E7XtLyJKmLoaGpwxxtQ",
          name: data.channel.name || "Sloane Stephens",
          handle: data.channel.handle || "@sloanestephens",
          avatar: data.channel.avatar,
          subscribers: data.channel.subscribers,
          subscribersLabel: data.channel.subscribersLabel,
        },
        videos: data.videos,
      };
    } catch {
      // try next
    }
  }

  return null;
}

export async function fetchYouTubeAnalytics(): Promise<YouTubeAnalytics | null> {
  // Prefer the live videos feed API so newest uploads (e.g. And Still) show on Videos.
  const feed = await fetchYouTubeVideosFeed(48);
  if (feed?.videos.length) {
    const built = buildYouTubeAnalyticsFromFeed({
      syncedAt: feed.syncedAt,
      channel: feed.channel,
      videos: feed.videos,
    });
    if (built) {
      const withSource = { ...built, source: feed.source ?? "live" } as YouTubeAnalytics;
      return enrichSubscriberStats(withSource);
    }
  }

  const base = getApiBase();
  const apiUrls = [
    `${base}/api/social/analytics?source=youtube&refresh=1`,
    `${base}/api/youtube/analytics?refresh=1`,
    `${base}/api/youtube-analytics?refresh=1`,
  ];

  for (const url of apiUrls) {
    try {
      const data = await fetchJsonAnalytics(url);
      if (data) return data;
    } catch {
      // try next source
    }
  }

  const cacheUrls = [
    "/data/youtube-analytics.json",
    `${base}/data/youtube-analytics.json`,
  ];

  for (const url of cacheUrls) {
    try {
      const data = await fetchJsonAnalytics(url);
      if (data) return { ...data, source: "cache" };
    } catch {
      // try next source
    }
  }

  try {
    const response = await fetch(`${base}/data/youtube-videos.json`, { cache: "no-store" });
    if (!response.ok) return null;
    const staticFeed = (await response.json()) as {
      channel?: {
        id?: string;
        name?: string;
        handle?: string;
        subscribers?: number;
        subscribersLabel?: string;
      };
      videos?: Array<{
        id: string;
        title: string;
        viewCount?: number;
        likeCount?: number;
        publishedAt?: string;
        permalink?: string;
        durationSeconds?: number;
      }>;
      syncedAt?: string;
    };
    const built = buildYouTubeAnalyticsFromFeed(staticFeed);
    if (!built) return null;
    return enrichSubscriberStats(built);
  } catch {
    return null;
  }
}

async function enrichSubscriberStats(analytics: YouTubeAnalytics): Promise<YouTubeAnalytics> {
  if (analytics.kpis.subscribers > 0) return analytics;

  const base = getApiBase();
  const cacheUrls = ["/data/youtube-analytics.json", `${base}/data/youtube-analytics.json`];

  for (const url of cacheUrls) {
    try {
      const cached = await fetchJsonAnalytics(url);
      if (!cached?.kpis.subscribers) continue;
      return {
        ...analytics,
        channel: {
          ...analytics.channel,
          subscribers: cached.channel.subscribers,
          subscribersLabel: cached.channel.subscribersLabel,
        },
        kpis: {
          ...analytics.kpis,
          subscribers: cached.kpis.subscribers,
        },
      };
    } catch {
      // try next
    }
  }

  return analytics;
}

function buildYouTubeAnalyticsFromFeed(feed: {
  channel?: {
    id?: string;
    name?: string;
    handle?: string;
    subscribers?: number;
    subscribersLabel?: string;
  };
  videos?: Array<{
    id: string;
    title: string;
    viewCount?: number;
    likeCount?: number;
    publishedAt?: string;
    permalink?: string;
    durationSeconds?: number;
  }>;
  syncedAt?: string;
}): YouTubeAnalytics | null {
  const videos = (feed.videos ?? []).map((video) => ({
    id: video.id,
    title: video.title,
    viewCount: Number(video.viewCount ?? 0),
    likeCount: Number(video.likeCount ?? 0),
    publishedAt: video.publishedAt || new Date().toISOString(),
    permalink: video.permalink || `https://www.youtube.com/watch?v=${video.id}`,
    durationSeconds: Number(video.durationSeconds ?? 0),
  }));

  if (!videos.length) return null;

  const recentVideos = videos.slice(0, 12);
  const topVideos = [...videos].sort((a, b) => b.viewCount - a.viewCount).slice(0, 8);
  const totalViews = videos.reduce((sum, video) => sum + video.viewCount, 0);
  const totalLikes = videos.reduce((sum, video) => sum + video.likeCount, 0);
  const avgViews = Math.round(totalViews / videos.length);
  const avgLikes = Math.round(totalLikes / videos.length);
  const subscribers = Number(feed.channel?.subscribers ?? 0);
  const handle = feed.channel?.handle ?? "@sloanestephens";

  return {
    syncedAt: feed.syncedAt || new Date().toISOString(),
    source: "live",
    channel: {
      id: feed.channel?.id ?? "UCL88E7XtLyJKmLoaGpwxxtQ",
      name: feed.channel?.name ?? "Sloane Stephens",
      handle,
      permalink: `https://www.youtube.com/${handle.replace(/^@/, "@")}`,
      subscribers,
      subscribersLabel: feed.channel?.subscribersLabel ?? (subscribers ? `${formatMetric(subscribers, true)} subscribers` : "Subscribers unavailable"),
    },
    kpis: {
      subscribers,
      totalVideos: videos.length,
      totalViews,
      avgViews,
      avgLikes,
      engagementRate: avgViews > 0 ? Math.round((avgLikes / avgViews) * 10_000) / 100 : 0,
    },
    recentVideos,
    topVideos,
  };
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

export function titlePreview(title: string, max = 80) {
  const trimmed = title.trim().replace(/\s+/g, " ");
  if (!trimmed) return "Untitled video";
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}

export function formatDuration(seconds: number) {
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remaining = total % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
  }
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}
