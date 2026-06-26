import {
  Users,
  UserCheck,
  Mail,
  Heart,
  Eye,
  TrendingUp,
} from "lucide-react";
import { kpiMetrics } from "../data/mockData";

const iconMap: Record<string, typeof Users> = {
  users: Users,
  "user-check": UserCheck,
  mail: Mail,
  heart: Heart,
  eye: Eye,
  "trending-up": TrendingUp,
};

export function KpiCards() {
  return (
    <div className="grid w-full min-w-0 grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {kpiMetrics.map((kpi) => {
        const Icon = iconMap[kpi.icon] ?? Users;
        return (
          <div
            key={kpi.label}
            className="dt-surface relative min-w-0 overflow-hidden rounded-lg border border-dt-border bg-dt-card p-3 sm:pr-10 xl:p-4 xl:pr-12"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black via-black to-black/95" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(229,9,20,0.04),transparent_55%)]" />
            <p className="relative text-[10px] font-medium uppercase tracking-wide text-white xl:text-[11px]">
              {kpi.label}
            </p>
            <p className="relative mt-1.5 text-xl font-bold text-white xl:mt-2 xl:text-2xl">{kpi.value}</p>
            <p className="relative mt-1 text-xs font-medium text-dt-green">{kpi.change}</p>
            <div className="pointer-events-none absolute right-2 hidden sm:block sm:right-3 top-1/2 -translate-y-1/2">
              <Icon
                size={22}
                strokeWidth={1.75}
                className="text-dt-red"
                style={{
                  filter:
                    "drop-shadow(0 0 4px color-mix(in srgb, var(--theme-accent) 90%, transparent)) drop-shadow(0 0 14px color-mix(in srgb, var(--theme-accent) 55%, transparent))",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
