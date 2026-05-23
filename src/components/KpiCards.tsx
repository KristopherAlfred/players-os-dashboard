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
    <div className="grid grid-cols-6 gap-3 min-w-0">
      {kpiMetrics.map((kpi) => {
        const Icon = iconMap[kpi.icon] ?? Users;
        return (
          <div
            key={kpi.label}
            className="rounded-lg border border-dt-border bg-dt-card p-4"
          >
            <div className="mb-3 flex items-start justify-between">
              <p className="text-[11px] font-medium uppercase tracking-wide text-dt-muted">
                {kpi.label}
              </p>
              <div className="rounded-md border border-dt-red/40 p-1.5 text-dt-red">
                <Icon size={16} strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            <p className="mt-1 text-xs font-medium text-dt-green">{kpi.change}</p>
          </div>
        );
      })}
    </div>
  );
}
