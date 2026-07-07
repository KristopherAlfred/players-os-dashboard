import type { ReactNode } from "react";
import type { DametimeAnalytics } from "../../lib/dametimeAnalyticsApi";
import { useAnalyticsView } from "../../hooks/useAnalyticsView";

export function DametimeLoading({ message = "Loading Dametime analytics…" }: { message?: string }) {
  return (
    <div className="dt-surface flex min-h-[280px] items-center justify-center rounded-lg border border-dt-border bg-dt-card p-6">
      <p className="text-sm text-dt-muted">{message}</p>
    </div>
  );
}

export function DametimeError({ message }: { message: string }) {
  return (
    <div className="dt-surface rounded-lg border border-dt-red/40 bg-dt-card p-6">
      <p className="text-sm font-medium text-white">Could not load Dametime analytics</p>
      <p className="mt-2 text-sm text-dt-muted">{message}</p>
    </div>
  );
}

export function DametimeSyncedAt({ analytics }: { analytics: DametimeAnalytics }) {
  return (
    <p className="text-xs text-dt-muted">
      Live from DameTime app · synced {new Date(analytics.syncedAt).toLocaleString()}
    </p>
  );
}

export function DametimeSourceBanner() {
  const { isDametime, analytics, loading } = useAnalyticsView();
  if (!isDametime) return null;

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
