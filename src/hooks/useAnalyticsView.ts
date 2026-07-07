import { useDametimeAnalytics } from "../contexts/DametimeAnalyticsContext";
import { useInstagramAnalytics } from "../contexts/InstagramAnalyticsContext";
import { useDashboardSource } from "../contexts/DashboardSourceContext";

export function useAnalyticsView() {
  const { source } = useDashboardSource();
  const dametime = useDametimeAnalytics();
  const instagram = useInstagramAnalytics();

  return {
    source,
    isOverview: source === "overview",
    isDametime: source === "dametime",
    isInstagram: source === "instagram",
    ...dametime,
    instagram,
  };
}
