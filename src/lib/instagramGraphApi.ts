import { supabase } from "../integrations/supabase/client";

export type InstagramAccountStats = {
  ig_user_id: string;
  username: string | null;
  name: string | null;
  biography: string | null;
  profile_picture_url: string | null;
  website: string | null;
  followers_count: number;
  follows_count: number;
  media_count: number;
  reach: number;
  impressions: number;
  profile_views: number;
  last_synced_at: string | null;
};

export type InstagramMediaRow = {
  media_id: string;
  caption: string | null;
  media_type: string | null;
  media_product_type: string | null;
  media_url: string | null;
  thumbnail_url: string | null;
  permalink: string | null;
  like_count: number;
  comments_count: number;
  saved: number;
  reach: number;
  impressions: number;
  timestamp: string | null;
};

export type InstagramSyncResult = {
  ok?: boolean;
  synced_at?: string;
  username?: string | null;
  followers?: number;
  media_synced?: number;
  error?: string;
};

/** Pulls fresh data from the official Instagram Graph API into the backend. */
export async function syncInstagram(): Promise<InstagramSyncResult> {
  const { data, error } = await supabase.functions.invoke<InstagramSyncResult>("instagram-sync", {
    body: {},
  });
  if (error) throw new Error(data?.error ?? error.message);
  if (data?.error) throw new Error(data.error);
  return data ?? {};
}

export async function fetchInstagramAccountStats(): Promise<InstagramAccountStats | null> {
  const { data, error } = await supabase
    .from("instagram_account_stats")
    .select(
      "ig_user_id, username, name, biography, profile_picture_url, website, followers_count, follows_count, media_count, reach, impressions, profile_views, last_synced_at",
    )
    .order("last_synced_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data as InstagramAccountStats | null) ?? null;
}

export async function fetchInstagramMedia(limit = 12): Promise<InstagramMediaRow[]> {
  const { data, error } = await supabase
    .from("instagram_media")
    .select(
      "media_id, caption, media_type, media_product_type, media_url, thumbnail_url, permalink, like_count, comments_count, saved, reach, impressions, timestamp",
    )
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as InstagramMediaRow[];
}

export function instagramEngagementRate(
  stats: InstagramAccountStats | null,
  media: InstagramMediaRow[],
): number {
  if (!stats || !stats.followers_count || media.length === 0) return 0;
  const totalEngagement = media.reduce((sum, m) => sum + m.like_count + m.comments_count, 0);
  return (totalEngagement / media.length / stats.followers_count) * 100;
}
