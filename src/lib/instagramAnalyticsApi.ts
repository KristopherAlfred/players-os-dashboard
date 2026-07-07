export type InstagramPostAnalytics = {
  id: string;
  code: string;
  caption: string;
  likes: number;
  comments: number;
  mediaType: "image" | "video" | "carousel" | "unknown";
  thumbnailUrl: string;
  permalink: string;
  takenAt: string;
};

export type InstagramAnalytics = {
  syncedAt: string;
  source?: "live" | "cache";
  profile: {
    username: string;
    fullName: string;
    biography: string;
    profilePicUrl: string;
    followers: number;
    following: number;
    posts: number;
    isVerified: boolean;
    externalUrl: string | null;
    permalink: string;
  };
  kpis: {
    followers: number;
    following: number;
    totalPosts: number;
    avgLikes: number;
    avgComments: number;
    engagementRate: number;
  };
  recentPosts: InstagramPostAnalytics[];
  topPosts: InstagramPostAnalytics[];
};

function getApiBase() {
  return (import.meta.env.VITE_DAME_BIO_API_URL ?? "https://dametime-app.vercel.app").replace(/\/$/, "");
}

export async function fetchInstagramAnalytics(): Promise<InstagramAnalytics | null> {
  try {
    const response = await fetch(
      `${getApiBase()}/api/instagram/analytics?username=damianlillard`,
    );
    if (!response.ok) return null;
    const data = (await response.json()) as InstagramAnalytics & { ok?: boolean };
    if (!data?.kpis) return null;
    return data;
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

export function captionPreview(caption: string, max = 80) {
  const trimmed = caption.trim().replace(/\s+/g, " ");
  if (!trimmed) return "No caption";
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}
