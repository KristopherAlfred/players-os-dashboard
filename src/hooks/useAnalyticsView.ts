import { useDametimeAnalytics } from "../contexts/DametimeAnalyticsContext";
import { useInstagramAnalytics } from "../contexts/InstagramAnalyticsContext";
import { useYouTubeAnalytics } from "../contexts/YouTubeAnalyticsContext";
import { useFacebookAnalytics } from "../contexts/FacebookAnalyticsContext";
import { useTwitterAnalytics } from "../contexts/TwitterAnalyticsContext";
import { useDashboardSource } from "../contexts/DashboardSourceContext";

export function useAnalyticsView() {
  const { source } = useDashboardSource();
  const dametime = useDametimeAnalytics();
  const instagram = useInstagramAnalytics();
  const youtube = useYouTubeAnalytics();
  const facebook = useFacebookAnalytics();
  const twitter = useTwitterAnalytics();

  return {
    source,
    isOverview: source === "overview",
    isDametime: source === "dametime",
    isInstagram: source === "instagram",
    isYoutube: source === "youtube",
    isFacebook: source === "facebook",
    isTwitter: source === "twitter",
    ...dametime,
    instagram,
    youtube,
    facebook,
    twitter,
  };
}
