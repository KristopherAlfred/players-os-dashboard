import { KpiCards } from "../components/KpiCards";
import { TrafficChart } from "../components/TrafficChart";
import { TrafficSourcesChart } from "../components/TrafficSourcesChart";
import { AudienceSnapshot } from "../components/AudienceSnapshot";
import { LiveActivityFeed } from "../components/LiveActivityFeed";
import { RecentContent } from "../components/RecentContent";
import { UploadWidget } from "../components/UploadWidget";
import { AudienceDemographics } from "../components/AudienceDemographics";
import { DeviceBreakdown } from "../components/DeviceBreakdown";
import { EmailSmsGrowth } from "../components/EmailSmsGrowth";
import { MonetizationOverview } from "../components/MonetizationOverview";
import { TopPerformingContent } from "../components/TopPerformingContent";
import { Footer } from "../components/Footer";
import { BrandLogo } from "../components/BrandLogo";

export function DashboardPage() {
  return (
    <div className="space-y-3 pb-4">
      <div className="flex items-center justify-between rounded-lg border border-dt-border bg-dt-card/50 px-4 py-3">
        <BrandLogo />
        <p className="hidden text-sm text-dt-muted md:block">
          Real-time performance of the DameTime ecosystem
        </p>
      </div>

      <KpiCards />

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 lg:col-span-5">
          <TrafficChart />
        </div>
        <div className="col-span-6 lg:col-span-2">
          <TrafficSourcesChart />
        </div>
        <div className="col-span-6 lg:col-span-2">
          <AudienceSnapshot />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <LiveActivityFeed />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 lg:col-span-8">
          <RecentContent />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <UploadWidget />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 lg:col-span-6">
          <AudienceDemographics />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <DeviceBreakdown />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <EmailSmsGrowth />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 lg:col-span-8">
          <MonetizationOverview />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <TopPerformingContent />
        </div>
      </div>

      <Footer />
    </div>
  );
}
