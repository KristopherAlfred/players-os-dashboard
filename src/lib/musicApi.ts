import type { TitleFontFamily, TitleFontSize } from "./typography";

export type MusicStatus = "draft" | "published";
export type MusicSource = "spotify" | "manual";

export type AppMusicItem = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  thumbnail: string;
  spotifyUrl: string;
  videoUrl: string;
  spotifyTrackId: string;
  albumName: string;
  status: MusicStatus;
  enabled: boolean;
  featured: boolean;
  order: number;
  publishedAt: string;
  source: MusicSource;
  titleFontFamily?: TitleFontFamily;
  titleFontSize?: TitleFontSize;
};

export type MusicFeed = {
  version: number;
  updatedAt: string;
  items: AppMusicItem[];
};

export type SpotifyCatalogTrack = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  spotifyUrl: string;
  albumName?: string;
  coverImage?: string;
  previewUrl?: string | null;
  trackNumber?: number;
  albumId?: string;
  releaseDate?: string;
  explicit?: boolean;
};

export type SpotifyCatalogRelease = {
  id: string;
  title: string;
  year: string;
  type: "album" | "single";
  explicit: boolean;
  spotifyUrl: string;
  coverImage: string;
  tracks: SpotifyCatalogTrack[];
  releaseDate?: string;
};

export type SpotifyCatalog = {
  topTracks: SpotifyCatalogTrack[];
  albums: SpotifyCatalogRelease[];
  singles: SpotifyCatalogRelease[];
};

function getApiBase() {
  return (import.meta.env.VITE_DAME_BIO_API_URL ?? "https://sloane-bio.vercel.app").replace(/\/$/, "");
}

function getAdminSecret() {
  return import.meta.env.VITE_ADMIN_EXPORT_SECRET?.trim() ?? "";
}

async function musicRequest(init?: RequestInit) {
  const secret = getAdminSecret();
  const headers = new Headers(init?.headers);
  if (secret) headers.set("x-admin-secret", secret);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${getApiBase()}/api/admin/analytics?view=music`, {
    ...init,
    headers,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { error?: string }).error || `Music request failed (${response.status})`);
  }
  return data;
}

export async function fetchMusicFeed(): Promise<MusicFeed> {
  const data = (await musicRequest()) as { feed: MusicFeed };
  return data.feed;
}

export async function publishMusicFeed(feed: MusicFeed): Promise<MusicFeed> {
  if (!getAdminSecret()) throw new Error("Set VITE_ADMIN_EXPORT_SECRET to publish music");
  const data = (await musicRequest({
    method: "POST",
    body: JSON.stringify({ action: "publish", feed }),
  })) as { feed: MusicFeed };
  return data.feed;
}

export async function upsertMusicItem(item: AppMusicItem): Promise<MusicFeed> {
  if (!getAdminSecret()) throw new Error("Set VITE_ADMIN_EXPORT_SECRET to save music");
  const data = (await musicRequest({
    method: "POST",
    body: JSON.stringify({ action: "upsert", item }),
  })) as { feed: MusicFeed };
  return data.feed;
}

export async function deleteMusicItem(id: string): Promise<MusicFeed> {
  if (!getAdminSecret()) throw new Error("Set VITE_ADMIN_EXPORT_SECRET to delete music");
  const data = (await musicRequest({
    method: "POST",
    body: JSON.stringify({ action: "delete", id }),
  })) as { feed: MusicFeed };
  return data.feed;
}

export type SpotifyCatalogResult = {
  tracks: SpotifyCatalogTrack[];
  catalog?: SpotifyCatalog;
  source: "spotify" | "dame-dolla-catalog";
  count: number;
};

export async function fetchSpotifyCatalog(refresh = false): Promise<SpotifyCatalogResult> {
  const url = `${getApiBase()}/api/spotify/artist-tracks${refresh ? "?refresh=1" : ""}`;
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  const tracks = Array.isArray((data as { tracks?: SpotifyCatalogTrack[] }).tracks)
    ? (data as { tracks: SpotifyCatalogTrack[] }).tracks
    : [];
  const catalog = (data as { catalog?: SpotifyCatalog }).catalog;

  if (!response.ok && !tracks.length) {
    throw new Error((data as { error?: string }).error || `Spotify catalog failed (${response.status})`);
  }

  return {
    tracks,
    catalog:
      catalog && Array.isArray(catalog.albums) && Array.isArray(catalog.singles)
        ? catalog
        : undefined,
    source: (data as { source?: string }).source === "spotify" ? "spotify" : "dame-dolla-catalog",
    count: tracks.length || Number((data as { count?: number }).count) || 0,
  };
}

export function createEmptyMusicItem(): AppMusicItem {
  const now = new Date();
  return {
    id: `music-${now.getTime().toString(36)}`,
    title: "",
    artist: "Dame D.O.L.L.A",
    duration: "",
    thumbnail: "",
    spotifyUrl: "",
    videoUrl: "",
    spotifyTrackId: "",
    albumName: "",
    status: "draft",
    enabled: true,
    featured: false,
    order: 0,
    publishedAt: now.toISOString(),
    source: "manual",
  };
}

export function musicItemFromSpotify(track: SpotifyCatalogTrack, existing?: AppMusicItem | null): AppMusicItem {
  const now = new Date().toISOString();
  return {
    id: existing?.id || track.id,
    title: existing?.title || track.title,
    artist: existing?.artist || track.artist || "Dame D.O.L.L.A",
    duration: existing?.duration || track.duration || "",
    thumbnail: existing?.thumbnail || track.coverImage || "",
    spotifyUrl: existing?.spotifyUrl || track.spotifyUrl || `https://open.spotify.com/track/${track.id}`,
    videoUrl: existing?.videoUrl || "",
    spotifyTrackId: track.id,
    albumName: existing?.albumName || track.albumName || "",
    status: existing?.status || "published",
    enabled: existing ? existing.enabled : true,
    featured: existing?.featured || false,
    order: existing?.order ?? 0,
    publishedAt: existing?.publishedAt || now,
    source: "spotify",
  };
}

export function resolveMusicAssetUrl(src: string) {
  if (!src) return "";
  if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${getApiBase()}${src.startsWith("/") ? "" : "/"}${src}`;
}

export function extractSpotifyTrackId(value: string): string {
  const raw = value.trim();
  if (!raw) return "";
  if (/^[a-zA-Z0-9]{22}$/.test(raw)) return raw;
  const match = raw.match(/spotify\.com\/(?:intl-[a-z]{2}\/)?track\/([a-zA-Z0-9]{22})/i);
  return match?.[1] ?? "";
}
