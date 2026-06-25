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
  PollsPage,
} from "./pages/EngagementPages";
import {
  AudienceOverviewPage,
  FanProfilesPage,
  SegmentsPage,
  SubscribersPage,
  BehaviorInsightsPage,
} from "./pages/FansPages";
import {
  TrafficOverviewPage,
  ConversionFunnelPage,
  CampaignsPage,
  ReportsPage,
} from "./pages/PerformancePages";
import {
  PartnersPage,
  AudiencesPage,
  RevenuePage,
} from "./pages/MonetizationPages";
import {
  TeamPage,
  RolesPage,
  IntegrationsPage,
  AccountPage,
} from "./pages/SettingsPages";
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
          <Route path="engagement/polls" element={<PollsPage />} />
          <Route path="fans/audience" element={<AudienceOverviewPage />} />
          <Route path="fans/profiles" element={<FanProfilesPage />} />
          <Route path="fans/segments" element={<SegmentsPage />} />
          <Route path="fans/subscribers" element={<SubscribersPage />} />
          <Route path="fans/behavior" element={<BehaviorInsightsPage />} />
          <Route path="performance/traffic" element={<TrafficOverviewPage />} />
          <Route path="performance/funnel" element={<ConversionFunnelPage />} />
          <Route path="performance/campaigns" element={<CampaignsPage />} />
          <Route path="performance/reports" element={<ReportsPage />} />
          <Route path="monetization/partners" element={<PartnersPage />} />
          <Route path="monetization/audiences" element={<AudiencesPage />} />
          <Route path="monetization/revenue" element={<RevenuePage />} />
          <Route path="settings/team" element={<TeamPage />} />
          <Route path="settings/roles" element={<RolesPage />} />
          <Route path="settings/integrations" element={<IntegrationsPage />} />
          <Route path="settings/account" element={<AccountPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
