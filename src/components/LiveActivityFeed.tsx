import { Card } from "./ui/Card";
import { liveActivity } from "../data/mockData";

export function LiveActivityFeed() {
  return (
    <Card
      title="Live Activity Feed"
      className="h-[280px]"
      action={
        <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[10px] font-medium text-dt-green">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-dt-green" />
          LIVE
        </span>
      }
    >
      <div className="max-h-[220px] overflow-y-auto px-3 py-2">
        {liveActivity.map((item) => (
          <div
            key={`${item.user}-${item.time}`}
            className="flex items-start gap-3 border-b border-dt-border/60 py-2.5 last:border-0"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dt-red/20 text-[10px] font-bold text-dt-red">
              {item.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] text-white">
                <span className="font-medium">{item.user}</span>
                <span className="text-dt-muted"> — {item.action}</span>
              </p>
              <p className="text-[11px] text-dt-muted">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
