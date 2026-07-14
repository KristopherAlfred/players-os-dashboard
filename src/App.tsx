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
} from "./pages/FansPages";
import { SubscribersPage } from "./pages/SubscribersPage";
import { TrafficOverviewPage } from "./pages/TrafficOverviewPage";
import { SettingsPage } from "./pages/SettingsPages";
import { LivePage } from "./pages/LivePage";
import { ExperiencePage } from "./pages/ExperiencePage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { LandingPage } from "./pages/LandingPage";
import { MarketingLandingPage } from "./pages/MarketingLandingPage";
import { RequireAuth, PublicOnly } from "./components/RequireAuth";
import { isDashboardAuthed } from "./lib/dashboardAuth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/welcome"
          element={
            <PublicOnly>
              <MarketingLandingPage />
            </PublicOnly>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnly>
              <LandingPage />
            </PublicOnly>
          }
        />
        <Route element={<RequireAuth />}>
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
          <Route path="content/upload" element={<Navigate to="/experience" replace />} />
          <Route path="athletes/hub" element={<Navigate to="/experience" replace />} />
          <Route path="live" element={<LivePage />} />
          <Route path="experience" element={<ExperiencePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="content/calendar" element={<ContentCalendarPage />} />
          <Route path="engagement/overview" element={<EngagementOverviewPage />} />
          <Route path="engagement/comments" element={<CommentsPage />} />
          <Route path="engagement/messages" element={<MessagesPage />} />
          <Route path="engagement/polls" element={<Navigate to="/engagement/overview" replace />} />
          <Route path="fans/audience" element={<AudienceOverviewPage />} />
          <Route path="fans/profiles" element={<Navigate to="/fans/audience" replace />} />
          <Route path="fans/segments" element={<Navigate to="/fans/audience" replace />} />
          <Route path="fans/subscribers" element={<SubscribersPage />} />
          <Route path="fans/behavior" element={<Navigate to="/fans/audience" replace />} />
          <Route path="performance/traffic" element={<TrafficOverviewPage />} />
          <Route path="performance/funnel" element={<Navigate to="/performance/traffic" replace />} />
          <Route path="performance/campaigns" element={<Navigate to="/performance/traffic" replace />} />
          <Route path="performance/reports" element={<Navigate to="/performance/traffic" replace />} />
          <Route path="monetization/partners" element={<Navigate to="/" replace />} />
          <Route path="monetization/audiences" element={<Navigate to="/" replace />} />
          <Route path="monetization/revenue" element={<Navigate to="/" replace />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/team" element={<Navigate to="/settings" replace />} />
          <Route path="settings/roles" element={<Navigate to="/settings" replace />} />
          <Route path="settings/integrations" element={<Navigate to="/settings" replace />} />
          <Route path="settings/account" element={<Navigate to="/settings" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={isDashboardAuthed() ? "/" : "/welcome"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
