import { Card } from "./ui/Card";
import { ContentThumb } from "./ContentThumb";
import { topPerforming } from "../data/mockData";

export function TopPerformingContent() {
  return (
    <Card title="Top Performing Content" className="h-[260px]">
      <ol className="space-y-0 divide-y divide-dt-border px-2">
        {topPerforming.map((item) => (
          <li
            key={item.rank}
            className="flex items-center gap-3 px-2 py-2.5"
          >
            <span className="w-4 text-center text-xs font-bold text-dt-red">
              {item.rank}
            </span>
            <ContentThumb id={item.thumb} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-white">
                {item.title}
              </p>
            </div>
            <span className="text-xs font-semibold text-dt-green">
              {item.engagement}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
