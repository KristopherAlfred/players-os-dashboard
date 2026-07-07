import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchDametimeAnalytics, type DametimeAnalytics } from "../lib/dametimeAnalyticsApi";
import { useDashboardSource } from "./DashboardSourceContext";

type DametimeAnalyticsContextValue = {
  analytics: DametimeAnalytics | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const DametimeAnalyticsContext = createContext<DametimeAnalyticsContextValue | null>(null);

async function loadDametimeAnalytics() {
  const secret = import.meta.env.VITE_ADMIN_EXPORT_SECRET?.trim();
  if (!secret) {
    return {
      analytics: null,
      error: "Set VITE_ADMIN_EXPORT_SECRET in the dashboard environment to load live analytics.",
    };
  }

  const data = await fetchDametimeAnalytics();
  if (!data) {
    return {
      analytics: null,
      error:
        "Analytics request failed. Check VITE_DAME_BIO_API_URL and ADMIN_EXPORT_SECRET on the DameTime app.",
    };
  }

  return { analytics: data, error: null };
}

export function DametimeAnalyticsProvider({ children }: { children: ReactNode }) {
  const { source } = useDashboardSource();
  const [analytics, setAnalytics] = useState<DametimeAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await loadDametimeAnalytics();
    setAnalytics(result.analytics);
    setError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (source !== "dametime") {
      setAnalytics(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      const result = await loadDametimeAnalytics();
      if (cancelled) return;
      setAnalytics(result.analytics);
      setError(result.error);
      setLoading(false);
    }

    void load();
    const interval = window.setInterval(() => {
      void load();
    }, 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [source]);

  const value = useMemo(
    () => ({
      analytics,
      loading,
      error,
      refresh,
    }),
    [analytics, loading, error, refresh],
  );

  return (
    <DametimeAnalyticsContext.Provider value={value}>{children}</DametimeAnalyticsContext.Provider>
  );
}

export function useDametimeAnalytics() {
  const context = useContext(DametimeAnalyticsContext);
  if (!context) {
    throw new Error("useDametimeAnalytics must be used within DametimeAnalyticsProvider");
  }
  return context;
}
