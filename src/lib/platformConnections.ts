import { supabase } from "../integrations/supabase/client";
import { resolveCurrentAthlete } from "./athletes";

export type PlatformConnection = {
  id: string;
  platform: string;
  display_name: string;
  handle: string | null;
  connected: boolean;
  last_synced_at: string | null;
  follower_count: number | null;
};

/** Connectors and snapshots are per athlete, so every read scopes to them. */
let athleteIdPromise: Promise<string | null> | null = null;

async function currentAthleteId(): Promise<string | null> {
  if (!athleteIdPromise) {
    athleteIdPromise = resolveCurrentAthlete()
      .then((athlete) => athlete?.id ?? null)
      .catch(() => null);
  }
  return athleteIdPromise;
}

export async function fetchPlatformConnections(): Promise<PlatformConnection[]> {
  const athleteId = await currentAthleteId();
  let query = supabase
    .from("platform_connections")
    .select("id, platform, display_name, handle, connected, last_synced_at, follower_count")
    .order("connected", { ascending: false })
    .order("display_name", { ascending: true });

  if (athleteId) query = query.eq("athlete_id", athleteId);

  const { data, error } = await query;

  if (error) throw error;
  return (data ?? []) as PlatformConnection[];
}

export async function setPlatformConnected(id: string, connected: boolean) {
  const { error } = await supabase.functions.invoke("dashboard-state", {
    body: { action: "set_platform_connected", id, connected },
  });

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

export type FollowerSnapshot = {
  platform: string;
  captured_on: string;
  follower_count: number;
};

export async function fetchFollowerSnapshots(days = 30): Promise<FollowerSnapshot[]> {
  const since = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
  const athleteId = await currentAthleteId();
  let query = supabase
    .from("platform_follower_snapshots")
    .select("platform, captured_on, follower_count")
    .gte("captured_on", since)
    .order("captured_on", { ascending: true });

  if (athleteId) query = query.eq("athlete_id", athleteId);

  const { data, error } = await query;

  if (error) throw error;
  return (data ?? []) as FollowerSnapshot[];
}

export async function recordFollowerSnapshots() {
  const { data, error } = await supabase.functions.invoke("snapshot-followers");
  if (error) throw error;
  return data as { recorded: number; captured_on?: string };
}
