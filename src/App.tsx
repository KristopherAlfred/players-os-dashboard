import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import {
  SocialContentPage,
  NewsContentPage,
  VideosContentPage,
  MusicContentPage,
  EventsGiveawaysPage,
  ContentCalendarPage,
} from "./pages/ContentPages";
import {
  EngagementOverviewPage,
  CommentsPage,
  MessagesPage,
} from "./pages/EngagementPages";
import {
  AudienceOverviewPage,
  FanProfilesPage,
  SubscribersPage,
} from "./pages/FansPages";
import { TrafficOverviewPage } from "./pages/PerformancePages";
import {
  PartnersPage,
  RevenuePage,
} from "./pages/MonetizationPages";
import { SettingsPage } from "./pages/SettingsPages";
import { AthleteHubPage } from "./pages/AthletePages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="content/social" element={<SocialContentPage />} />
          <Route path="content/news" element={<NewsContentPage />} />
          <Route path="content/videos" element={<VideosContentPage />} />
          <Route path="content/music" element={<MusicContentPage />} />
          <Route path="content/events" element={<EventsGiveawaysPage />} />
          <Route path="content/all" element={<Navigate to="/content/social" replace />} />
          <Route path="content/media" element={<Navigate to="/content/videos" replace />} />
          <Route path="content/playlists" element={<Navigate to="/content/music" replace />} />
          <Route path="content/upload" element={<Navigate to="/athletes/hub" replace />} />
          <Route path="athletes/hub" element={<AthleteHubPage />} />
          <Route path="content/calendar" element={<ContentCalendarPage />} />
          <Route path="engagement/overview" element={<EngagementOverviewPage />} />
          <Route path="engagement/comments" element={<CommentsPage />} />
          <Route path="engagement/messages" element={<MessagesPage />} />
          <Route path="engagement/polls" element={<Navigate to="/engagement/overview" replace />} />
          <Route path="fans/audience" element={<AudienceOverviewPage />} />
          <Route path="fans/profiles" element={<FanProfilesPage />} />
          <Route path="fans/segments" element={<Navigate to="/fans/audience" replace />} />
          <Route path="fans/subscribers" element={<SubscribersPage />} />
          <Route path="fans/behavior" element={<Navigate to="/fans/audience" replace />} />
          <Route path="performance/traffic" element={<TrafficOverviewPage />} />
          <Route path="performance/funnel" element={<Navigate to="/performance/traffic" replace />} />
          <Route path="performance/campaigns" element={<Navigate to="/performance/traffic" replace />} />
          <Route path="performance/reports" element={<Navigate to="/performance/traffic" replace />} />
          <Route path="monetization/partners" element={<PartnersPage />} />
          <Route path="monetization/audiences" element={<Navigate to="/monetization/partners" replace />} />
          <Route path="monetization/revenue" element={<RevenuePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/team" element={<Navigate to="/settings" replace />} />
          <Route path="settings/roles" element={<Navigate to="/settings" replace />} />
          <Route path="settings/integrations" element={<Navigate to="/settings" replace />} />
          <Route path="settings/account" element={<Navigate to="/settings" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
