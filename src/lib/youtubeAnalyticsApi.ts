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
  return (import.meta.env.VITE_DAME_BIO_API_URL ?? "https://dametime-app.vercel.app").replace(/\/$/, "");
}

export async function fetchYouTubeAnalytics(): Promise<YouTubeAnalytics | null> {
  const base = getApiBase();

  try {
    const response = await fetch(`${base}/api/youtube/analytics`);
    if (response.ok) {
      const data = (await response.json()) as YouTubeAnalytics & { ok?: boolean };
      if (data?.kpis) return data;
    }
  } catch {
    // fall through to static cache
  }

  try {
    const response = await fetch(`${base}/data/youtube-analytics.json`);
    if (!response.ok) return null;
    const data = (await response.json()) as YouTubeAnalytics;
    if (!data?.kpis) return null;
    return { ...data, source: "cache" };
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
