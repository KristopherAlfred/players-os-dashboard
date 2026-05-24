import { Card } from "./ui/Card";
import { audienceSnapshot } from "../data/mockData";

export function AudienceSnapshot() {
  return (
    <Card title="Audience Snapshot" className="h-[280px]">
      <div className="divide-y divide-dt-border">
        {audienceSnapshot.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 px-3 py-2"
          >
            <span className="min-w-0 text-[12px] leading-snug text-dt-muted">
              {row.label}
            </span>
            <span className="shrink-0 whitespace-nowrap text-[13px] font-semibold text-white">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
