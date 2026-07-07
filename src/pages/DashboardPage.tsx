import { KpiCards } from "../components/KpiCards";
import { TrafficChart } from "../components/TrafficChart";
import { TrafficSourcesChart } from "../components/TrafficSourcesChart";
import { AudienceSnapshot } from "../components/AudienceSnapshot";
import { LiveActivityFeed } from "../components/LiveActivityFeed";
import { RecentContent } from "../components/RecentContent";
import { UploadWidget } from "../components/UploadWidget";
import { AudienceDemographics } from "../components/AudienceDemographics";
import { DeviceBreakdown } from "../components/DeviceBreakdown";
import { MonetizationOverview } from "../components/MonetizationOverview";
import { TopPerformingContent } from "../components/TopPerformingContent";
import { Footer } from "../components/Footer";
import { DametimeAnalyticsDashboard } from "../components/dametime/DametimeAnalyticsDashboard";
import { InstagramAnalyticsDashboard } from "../components/instagram/InstagramAnalyticsDashboard";
import { useDashboardSource } from "../contexts/DashboardSourceContext";

function OverviewDashboard() {
  return (
    <div className="space-y-3 pb-4">
      <KpiCards />

      <div className="grid grid-cols-12 items-stretch gap-3">
        <div className="col-span-12 lg:col-span-4">
          <TrafficChart />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <TrafficSourcesChart />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-2">
          <AudienceSnapshot />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <LiveActivityFeed />
        </div>
      </div>

      <div className="grid grid-cols-12 items-stretch gap-3">
        <div className="col-span-12 flex lg:col-span-8">
          <RecentContent />
        </div>
        <div className="col-span-12 flex lg:col-span-4">
          <UploadWidget />
        </div>
      </div>

      <div className="grid grid-cols-12 items-stretch gap-3">
        <div className="col-span-12 lg:col-span-8">
          <AudienceDemographics />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <DeviceBreakdown />
        </div>
      </div>

      <div className="grid grid-cols-12 items-stretch gap-3">
        <div className="col-span-12 flex lg:col-span-8">
          <MonetizationOverview />
        </div>
        <div className="col-span-12 flex lg:col-span-4">
          <TopPerformingContent />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export function DashboardPage() {
  const { source } = useDashboardSource();

  if (source === "dametime") {
    return <DametimeAnalyticsDashboard />;
  }

  if (source === "instagram") {
    return <InstagramAnalyticsDashboard />;
  }

  return <OverviewDashboard />;
}
