import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  fallbackOverviewMetrics,
  fetchOverviewMetrics,
  type OverviewMetrics,
} from "../lib/overviewAnalytics";

const CACHE_KEY = "amx.overviewMetrics.v2";

type OverviewMetricsState = {
  metrics: OverviewMetrics;
  loading: boolean;
};

function readCachedMetrics(): OverviewMetrics | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OverviewMetrics;
    if (!parsed?.kpis?.length || typeof parsed.overallFollowers !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCachedMetrics(metrics: OverviewMetrics) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(metrics));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

const OverviewMetricsContext = createContext<OverviewMetricsState>({
  metrics: fallbackOverviewMetrics,
  loading: true,
});

export function OverviewMetricsProvider({ children }: { children: ReactNode }) {
  // Never hydrate KPIs from session cache on refresh — that flashes a stale total
  // (e.g. 20.31M) before live social counts arrive.
  const [metrics, setMetrics] = useState<OverviewMetrics>(fallbackOverviewMetrics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchOverviewMetrics()
      .then((next) => {
        if (cancelled) return;
        setMetrics(next);
        writeCachedMetrics(next);
      })
      .catch(() => {
        if (cancelled) return;
        const cached = readCachedMetrics();
        setMetrics(cached ?? fallbackOverviewMetrics);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <OverviewMetricsContext.Provider value={{ metrics, loading }}>
      {children}
    </OverviewMetricsContext.Provider>
  );
}

export function useOverviewMetrics() {
  return useContext(OverviewMetricsContext);
}
