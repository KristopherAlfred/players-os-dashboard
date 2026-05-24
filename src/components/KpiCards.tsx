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
    <div className="grid min-w-0 grid-cols-6 gap-3">
      {kpiMetrics.map((kpi) => {
        const Icon = iconMap[kpi.icon] ?? Users;
        return (
          <div
            key={kpi.label}
            className="relative overflow-hidden rounded-lg border border-dt-border bg-dt-card p-4 pr-12"
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-dt-muted">
              {kpi.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-white">{kpi.value}</p>
            <p className="mt-1 text-xs font-medium text-dt-green">{kpi.change}</p>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
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
