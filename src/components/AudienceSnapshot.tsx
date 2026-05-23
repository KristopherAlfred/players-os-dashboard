import { Card } from "./ui/Card";
import { audienceSnapshot } from "../data/mockData";

export function AudienceSnapshot() {
  return (
    <Card title="Audience Snapshot" className="h-[280px]">
      <div className="divide-y divide-dt-border">
        {audienceSnapshot.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-4 py-2.5"
          >
            <span className="text-[13px] text-dt-muted">{row.label}</span>
            <span className="text-sm font-semibold text-white">{row.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
