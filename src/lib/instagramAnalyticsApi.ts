export type InstagramPostAnalytics = {
  id: string;
  code: string;
  caption: string;
  likes: number;
  comments: number;
  mediaType: "image" | "video" | "carousel" | "unknown";
  thumbnailUrl: string;
  image?: string;
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
    profilePicImage?: string;
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

function proxiedCdnUrl(url: string) {
  return `${getApiBase()}/api/instagram/image?url=${encodeURIComponent(url)}`;
}

export function instagramPostImage(post: InstagramPostAnalytics) {
  if (post.image) return `${getApiBase()}${post.image}`;
  if (post.thumbnailUrl.includes("cdninstagram.com") || post.thumbnailUrl.includes("fbcdn.net")) {
    return proxiedCdnUrl(post.thumbnailUrl);
  }
  return post.thumbnailUrl;
}

export function instagramProfileImage(profile: InstagramAnalytics["profile"]) {
  if (profile.profilePicImage) return `${getApiBase()}${profile.profilePicImage}`;
  if (
    profile.profilePicUrl.includes("cdninstagram.com") ||
    profile.profilePicUrl.includes("fbcdn.net")
  ) {
    return proxiedCdnUrl(profile.profilePicUrl);
  }
  return profile.profilePicUrl;
}

export async function fetchInstagramAnalytics(): Promise<InstagramAnalytics | null> {
  const base = getApiBase();
  const apiUrls = [
    `${base}/api/social/analytics?source=instagram&username=damianlillard`,
    `${base}/api/instagram/analytics?username=damianlillard`,
  ];

  for (const url of apiUrls) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const data = (await response.json()) as InstagramAnalytics & { ok?: boolean };
      if (!data?.kpis) continue;
      return data;
    } catch {
      // try next source
    }
  }

  const cacheUrls = ["/data/instagram-analytics.json", `${base}/data/instagram-analytics.json`];
  for (const url of cacheUrls) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const data = (await response.json()) as InstagramAnalytics;
      if (!data?.kpis) continue;
      return { ...data, source: "cache" };
    } catch {
      // try next source
    }
  }

  return null;
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

export function captionPreview(caption: string, max = 80) {
  const trimmed = caption.trim().replace(/\s+/g, " ");
  if (!trimmed) return "No caption";
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}

export function mediaTypeLabel(type: InstagramPostAnalytics["mediaType"]) {
  if (type === "video") return "Reel";
  if (type === "carousel") return "Album";
  if (type === "image") return "Photo";
  return "Post";
}
