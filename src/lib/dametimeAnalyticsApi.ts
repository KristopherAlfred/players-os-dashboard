export type DametimeAnalyticsKpis = {
  totalFans: number;
  emailCaptures: number;
  smsOptIns: number;
  totalEvents: number;
  totalClicks: number;
  pageViews: number;
  signups: number;
  activeFans7d: number;
  engagementRate: number;
};

export type DametimeAnalyticsEventPoint = {
  date: string;
  label: string;
  events: number;
  pageViews: number;
  clicks?: number;
  navClicks?: number;
};

export type DametimeAnalyticsEventType = {
  type: string;
  label: string;
  count: number;
};

export type DametimeAnalyticsTopUser = {
  email: string;
  name: string | null;
  username: string | null;
  points: number;
  eventCount: number;
};

export type DametimeAnalyticsTopTarget = {
  target: string;
  label: string;
  count: number;
};

export type DametimeAnalyticsActivity = {
  email: string;
  displayName: string;
  eventType: string;
  action: string;
  target: string | null;
  at: string;
};

export type DametimeAnalyticsGeo = {
  totalFans: number;
  mappedFans: number;
  countries: { country: string; flag: string; pct: number; count: number }[];
  points: { lat: number; lng: number; count: number; label: string }[];
};

export type DametimeAnalytics = {
  syncedAt: string;
  kpis: DametimeAnalyticsKpis;
  eventsOverTime: DametimeAnalyticsEventPoint[];
  eventTypes: DametimeAnalyticsEventType[];
  topUsers: DametimeAnalyticsTopUser[];
  topTargets: DametimeAnalyticsTopTarget[];
  recentActivity: DametimeAnalyticsActivity[];
  geo: DametimeAnalyticsGeo;
};

function getApiBase() {
  return (import.meta.env.VITE_DAME_BIO_API_URL ?? "https://dametime-app.vercel.app").replace(/\/$/, "");
}

function getAdminSecret() {
  return import.meta.env.VITE_ADMIN_EXPORT_SECRET?.trim() ?? "";
}

export async function fetchDametimeAnalytics(fanEmail?: string): Promise<DametimeAnalytics | null> {
  const secret = getAdminSecret();
  if (!secret) return null;

  try {
    const params = new URLSearchParams();
    const fan = fanEmail?.trim().toLowerCase();
    if (fan) params.set("fan", fan);
    const query = params.toString();
    const response = await fetch(`${getApiBase()}/api/admin/analytics${query ? `?${query}` : ""}`, {
      headers: { "x-admin-secret": secret },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as DametimeAnalytics & { ok?: boolean };
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
  return `${days}d ago`;
}

export function initialsFromName(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return value.slice(0, 2).toUpperCase();
}
