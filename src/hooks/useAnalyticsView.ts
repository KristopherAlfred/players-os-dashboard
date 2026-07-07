import { useDametimeAnalytics } from "../contexts/DametimeAnalyticsContext";
import { useInstagramAnalytics } from "../contexts/InstagramAnalyticsContext";
import { useYouTubeAnalytics } from "../contexts/YouTubeAnalyticsContext";
import { useDashboardSource } from "../contexts/DashboardSourceContext";

export function useAnalyticsView() {
  const { source } = useDashboardSource();
  const dametime = useDametimeAnalytics();
  const instagram = useInstagramAnalytics();
  const youtube = useYouTubeAnalytics();

  return {
    source,
    isOverview: source === "overview",
    isDametime: source === "dametime",
    isInstagram: source === "instagram",
    isYoutube: source === "youtube",
    ...dametime,
    instagram,
    youtube,
  };
}
