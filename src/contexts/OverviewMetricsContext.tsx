import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  fallbackOverviewMetrics,
  fetchOverviewMetrics,
  type OverviewMetrics,
} from "../lib/overviewAnalytics";

const CACHE_KEY = "amx.overviewMetrics.v1";

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
  const initialCache = useRef<OverviewMetrics | null | undefined>(undefined);
  if (initialCache.current === undefined) {
    initialCache.current = typeof window !== "undefined" ? readCachedMetrics() : null;
  }

  const [metrics, setMetrics] = useState<OverviewMetrics>(
    () => initialCache.current ?? fallbackOverviewMetrics,
  );
  const [loading, setLoading] = useState(() => !initialCache.current);
  const hadCacheRef = useRef(Boolean(initialCache.current));

  useEffect(() => {
    let cancelled = false;

    fetchOverviewMetrics()
      .then((next) => {
        if (cancelled) return;
        setMetrics(next);
        writeCachedMetrics(next);
        hadCacheRef.current = true;
      })
      .catch(() => {
        if (cancelled) return;
        if (!hadCacheRef.current) setMetrics(fallbackOverviewMetrics);
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
