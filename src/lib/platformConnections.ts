import { supabase } from "../integrations/supabase/client";

export type PlatformConnection = {
  id: string;
  platform: string;
  display_name: string;
  handle: string | null;
  connected: boolean;
  last_synced_at: string | null;
  follower_count: number | null;
};

export async function fetchPlatformConnections(): Promise<PlatformConnection[]> {
  const { data, error } = await supabase
    .from("platform_connections")
    .select("id, platform, display_name, handle, connected, last_synced_at, follower_count")
    .order("connected", { ascending: false })
    .order("display_name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as PlatformConnection[];
}

export async function setPlatformConnected(id: string, connected: boolean) {
  const { error } = await supabase
    .from("platform_connections")
    .update({
      connected,
      last_synced_at: connected ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) throw error;
}

export function formatSyncedAgo(iso: string | null): string {
  if (!iso) return "Not synced yet";
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `Synced ${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Synced ${hours}h ago`;
  const days = Math.round(hours / 24);
  return `Synced ${days}d ago`;
}
