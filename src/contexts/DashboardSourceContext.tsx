import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type DashboardSource = "overview" | "dametime" | "instagram" | "youtube";

type DashboardSourceContextValue = {
  source: DashboardSource;
  setSource: (source: DashboardSource) => void;
  sourceLabel: string;
};

const DashboardSourceContext = createContext<DashboardSourceContextValue | null>(null);

const sourceLabels: Record<DashboardSource, string> = {
  overview: "Overview",
  dametime: "Dametime",
  instagram: "Instagram",
  youtube: "YouTube",
};

export function DashboardSourceProvider({ children }: { children: ReactNode }) {
  const [source, setSource] = useState<DashboardSource>("overview");

  const value = useMemo(
    () => ({
      source,
      setSource,
      sourceLabel: sourceLabels[source],
    }),
    [source],
  );

  return (
    <DashboardSourceContext.Provider value={value}>{children}</DashboardSourceContext.Provider>
  );
}

export function useDashboardSource() {
  const context = useContext(DashboardSourceContext);
  if (!context) {
    throw new Error("useDashboardSource must be used within DashboardSourceProvider");
  }
  return context;
}
