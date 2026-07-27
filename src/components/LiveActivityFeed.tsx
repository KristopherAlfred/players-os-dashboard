import { Link } from "react-router-dom";
import { Card } from "./ui/Card";
import { liveActivity } from "../data/mockData";
import { useOverviewMetrics } from "../contexts/OverviewMetricsContext";

export function LiveActivityFeed() {
  const { hasConnected } = useOverviewMetrics();

  return (
    <Card
      title="Live Activity Feed"
      className="h-[280px]"
      action={
        hasConnected ? (
          <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[10px] font-medium text-dt-green">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-dt-green" />
            LIVE
          </span>
        ) : (
          <span className="shrink-0 whitespace-nowrap text-[10px] font-medium text-dt-muted">
            Not connected
          </span>
        )
      }
    >
      {!hasConnected ? (
        <div className="flex h-[220px] flex-col items-center justify-center gap-2 px-5 text-center">
          <p className="text-[12px] text-dt-muted">No activity to show yet</p>
          <Link to="/settings" className="text-[12px] font-medium text-dt-green hover:underline">
            Connect platforms
          </Link>
        </div>
      ) : (
        <div className="max-h-[220px] overflow-y-auto px-3 py-2">
          {liveActivity.map((item) => (
            <div
              key={`${item.user}-${item.time}`}
              className="flex items-start gap-3 border-b border-dt-border/60 py-2.5 last:border-0"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dt-green/20 text-[10px] font-bold text-dt-green">
                {item.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] text-white">
                  <span className="font-medium">{item.user}</span>
                  <span className="text-white"> — {item.action}</span>
                </p>
                <p className="text-[11px] text-white">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
