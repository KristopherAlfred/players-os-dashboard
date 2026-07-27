import {
  Users,
  UserCheck,
  Mail,
  Heart,
  Eye,
  TrendingUp,
} from "lucide-react";
import { useOverviewMetrics } from "../contexts/OverviewMetricsContext";
import { buildDashboardStats } from "../lib/dashboardStats";

const iconMap: Record<string, typeof Users> = {
  users: Users,
  "user-check": UserCheck,
  mail: Mail,
  heart: Heart,
  eye: Eye,
  "trending-up": TrendingUp,
};

function AccentLoader({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-7 w-7 items-center justify-center xl:h-8 xl:w-8 ${className}`}
      aria-hidden
    >
      <span
        className="h-full w-full animate-spin rounded-full border-2 border-dt-green/25 border-t-dt-green"
        style={{
          filter:
            "drop-shadow(0 0 6px rgba(143,227,184,0.95)) drop-shadow(0 0 14px rgba(143,227,184,0.55))",
        }}
      />
    </span>
  );
}

export function KpiCards() {
  const { metrics, connections, loading } = useOverviewMetrics();
  const stats = buildDashboardStats(connections, metrics);

  return (
    <div className="grid w-full min-w-0 grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon] ?? Users;
        return (
          <div
            key={stat.label}
            className="dt-surface relative min-w-0 overflow-hidden rounded-lg border border-dt-border bg-dt-card p-3 sm:pr-10 xl:p-4 xl:pr-12"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black via-black to-black/95" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(143,227,184,0.04),transparent_55%)]" />
            <p className="relative text-[10px] font-medium uppercase tracking-wide text-white xl:text-[11px]">
              {stat.label}
            </p>
            {loading ? (
              <div className="relative mt-2 flex min-h-[28px] items-center xl:mt-2.5 xl:min-h-[32px]">
                <AccentLoader />
              </div>
            ) : (
              <>
                <p
                  className={`relative mt-1.5 text-xl font-bold xl:mt-2 xl:text-2xl ${
                    stat.connected ? "text-white" : "text-white/40"
                  }`}
                >
                  {stat.value}
                </p>
                <p
                  className={`relative mt-1 text-xs font-medium ${
                    stat.connected ? "text-dt-green" : "text-dt-muted"
                  }`}
                >
                  {stat.hint}
                </p>
              </>
            )}
            <div className="pointer-events-none absolute right-2 hidden sm:block sm:right-3 top-1/2 -translate-y-1/2">
              <Icon
                size={22}
                strokeWidth={1.75}
                className={stat.connected ? "text-dt-green" : "text-white/20"}
                style={
                  stat.connected
                    ? {
                        filter:
                          "drop-shadow(0 0 4px color-mix(in srgb, var(--theme-accent) 90%, transparent)) drop-shadow(0 0 14px color-mix(in srgb, var(--theme-accent) 55%, transparent))",
                      }
                    : undefined
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
