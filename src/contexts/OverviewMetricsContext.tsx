import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  fallbackOverviewMetrics,
  fetchOverviewMetrics,
  type OverviewMetrics,
} from "../lib/overviewAnalytics";

type OverviewMetricsState = {
  metrics: OverviewMetrics;
  loading: boolean;
};

const OverviewMetricsContext = createContext<OverviewMetricsState>({
  metrics: fallbackOverviewMetrics,
  loading: true,
});

export function OverviewMetricsProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<OverviewMetrics>(fallbackOverviewMetrics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchOverviewMetrics()
      .then((next) => {
        if (!cancelled) setMetrics(next);
      })
      .catch(() => {
        if (!cancelled) setMetrics(fallbackOverviewMetrics);
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
