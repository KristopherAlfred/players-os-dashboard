import { useDametimeAnalytics } from "../contexts/DametimeAnalyticsContext";
import { useDashboardSource } from "../contexts/DashboardSourceContext";

export function useAnalyticsView() {
  const { source } = useDashboardSource();
  const analyticsState = useDametimeAnalytics();

  return {
    isDametime: source === "dametime",
    ...analyticsState,
  };
}
