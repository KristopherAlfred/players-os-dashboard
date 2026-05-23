import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { KpiCards } from "./components/KpiCards";
import { TrafficChart } from "./components/TrafficChart";
import { TrafficSourcesChart } from "./components/TrafficSourcesChart";
import { AudienceSnapshot } from "./components/AudienceSnapshot";
import { LiveActivityFeed } from "./components/LiveActivityFeed";
import { RecentContent } from "./components/RecentContent";
import { UploadWidget } from "./components/UploadWidget";
import { AudienceDemographics } from "./components/AudienceDemographics";
import { DeviceBreakdown } from "./components/DeviceBreakdown";
import { EmailSmsGrowth } from "./components/EmailSmsGrowth";
import { MonetizationOverview } from "./components/MonetizationOverview";
import { TopPerformingContent } from "./components/TopPerformingContent";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-dt-bg">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-auto overflow-y-auto px-5 py-4">
          <div className="mx-auto min-w-[1200px] max-w-[1600px] space-y-4">
            <KpiCards />

            <div className="grid grid-cols-4 gap-3">
              <TrafficChart />
              <TrafficSourcesChart />
              <AudienceSnapshot />
              <LiveActivityFeed />
            </div>

            <div className="grid grid-cols-4 gap-3">
              <RecentContent />
              <UploadWidget />
            </div>

            <div className="grid grid-cols-4 gap-3">
              <AudienceDemographics />
              <DeviceBreakdown />
              <EmailSmsGrowth />
            </div>

            <div className="grid grid-cols-4 gap-3">
              <MonetizationOverview />
              <TopPerformingContent />
            </div>

            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
