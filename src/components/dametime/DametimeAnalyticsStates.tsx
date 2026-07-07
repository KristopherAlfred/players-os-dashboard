import type { ReactNode } from "react";
import { useAnalyticsView } from "../../hooks/useAnalyticsView";
import type { DametimeAnalytics } from "../../lib/dametimeAnalyticsApi";
import type { InstagramAnalytics } from "../../lib/instagramAnalyticsApi";
import type { YouTubeAnalytics } from "../../lib/youtubeAnalyticsApi";

export function SourceLoading({ message = "Loading analytics…" }: { message?: string }) {
  return (
    <div className="dt-surface flex min-h-[280px] items-center justify-center rounded-lg border border-dt-border bg-dt-card p-6">
      <p className="text-sm text-dt-muted">{message}</p>
    </div>
  );
}

export function SourceError({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="dt-surface rounded-lg border border-dt-red/40 bg-dt-card p-6">
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="mt-2 text-sm text-dt-muted">{message}</p>
    </div>
  );
}

export function DametimeLoading({ message = "Loading Dametime analytics…" }: { message?: string }) {
  return <SourceLoading message={message} />;
}

export function DametimeError({ message }: { message: string }) {
  return <SourceError title="Could not load Dametime analytics" message={message} />;
}

export function SourceBanner() {
  const { isDametime, isInstagram, isYoutube, analytics, loading, instagram, youtube } =
    useAnalyticsView();

  if (isDametime) {
    return (
      <div className="mb-3 rounded-lg border border-dt-red/30 bg-dt-red/10 px-3 py-2">
        <p className="text-xs font-medium text-white">
          Dametime filter active — showing live analytics from the DameTime app.
        </p>
        {!loading && analytics && (
          <p className="mt-0.5 text-[11px] text-dt-muted">
            Last synced {new Date(analytics.syncedAt).toLocaleString()}
          </p>
        )}
      </div>
    );
  }

  if (isInstagram) {
    return (
      <div className="mb-3 rounded-lg border border-dt-red/30 bg-dt-red/10 px-3 py-2">
        <p className="text-xs font-medium text-white">
          Instagram filter active — showing{" "}
          {instagram.analytics?.source === "cache" ? "cached" : "live"} analytics for @damianlillard.
        </p>
        {!instagram.loading && instagram.analytics && (
          <p className="mt-0.5 text-[11px] text-dt-muted">
            Last synced {new Date(instagram.analytics.syncedAt).toLocaleString()}
          </p>
        )}
      </div>
    );
  }

  if (isYoutube) {
    return (
      <div className="mb-3 rounded-lg border border-dt-red/30 bg-dt-red/10 px-3 py-2">
        <p className="text-xs font-medium text-white">
          YouTube filter active — showing{" "}
          {youtube.analytics?.source === "cache" ? "cached" : "live"} analytics for @DamianLillard.
        </p>
        {!youtube.loading && youtube.analytics && (
          <p className="mt-0.5 text-[11px] text-dt-muted">
            Last synced {new Date(youtube.analytics.syncedAt).toLocaleString()}
          </p>
        )}
      </div>
    );
  }

  return null;
}

export function DametimePageGate({
  mock,
  children,
}: {
  mock: ReactNode;
  children: (analytics: DametimeAnalytics) => ReactNode;
}) {
  const { isDametime, analytics, loading, error } = useAnalyticsView();

  if (!isDametime) return mock;
  if (loading) return <DametimeLoading />;
  if (error) return <DametimeError message={error} />;
  if (!analytics) return <DametimeError message="No analytics data available." />;

  return <>{children(analytics)}</>;
}

export function InstagramPageGate({
  mock,
  children,
}: {
  mock: ReactNode;
  children: (analytics: InstagramAnalytics) => ReactNode;
}) {
  const { isInstagram, instagram } = useAnalyticsView();

  if (!isInstagram) return mock;
  if (instagram.loading) return <SourceLoading message="Loading Instagram analytics…" />;
  if (instagram.error) {
    return <SourceError title="Could not load Instagram analytics" message={instagram.error} />;
  }
  if (!instagram.analytics) {
    return <SourceError title="Could not load Instagram analytics" message="No data available." />;
  }

  return <>{children(instagram.analytics)}</>;
}

export function AnalyticsPageGate({
  mock,
  dametime,
  instagram,
  youtube,
}: {
  mock: ReactNode;
  dametime?: (analytics: DametimeAnalytics) => ReactNode;
  instagram?: (analytics: InstagramAnalytics) => ReactNode;
  youtube?: (analytics: YouTubeAnalytics) => ReactNode;
}) {
  const view = useAnalyticsView();

  if (view.isDametime && dametime) {
    if (view.loading) return <DametimeLoading />;
    if (view.error) return <DametimeError message={view.error} />;
    if (!view.analytics) return <DametimeError message="No analytics data available." />;
    return <>{dametime(view.analytics)}</>;
  }

  if (view.isInstagram && instagram) {
    if (view.instagram.loading) return <SourceLoading message="Loading Instagram analytics…" />;
    if (view.instagram.error) {
      return <SourceError title="Could not load Instagram analytics" message={view.instagram.error} />;
    }
    if (!view.instagram.analytics) {
      return <SourceError title="Could not load Instagram analytics" message="No data available." />;
    }
    return <>{instagram(view.instagram.analytics)}</>;
  }

  if (view.isYoutube && youtube) {
    if (view.youtube.loading) return <SourceLoading message="Loading YouTube analytics…" />;
    if (view.youtube.error) {
      return <SourceError title="Could not load YouTube analytics" message={view.youtube.error} />;
    }
    if (!view.youtube.analytics) {
      return <SourceError title="Could not load YouTube analytics" message="No data available." />;
    }
    return <>{youtube(view.youtube.analytics)}</>;
  }

  return mock;
}
