import { Card } from "./ui/Card";
import { ageDemographics, topCountries } from "../data/mockData";

export function AudienceDemographics() {
  return (
    <Card title="Audience Demographics">
      <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dt-muted">Age</p>
          <div className="space-y-2.5">
            {ageDemographics.map((row) => (
              <div key={row.range}>
                <div className="mb-1 flex justify-between text-[12px]">
                  <span className="text-[#a3a3a3]">{row.range}</span>
                  <span className="text-white">{row.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-dt-border">
                  <div className="h-full rounded-full bg-dt-red" style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dt-muted">Top Countries</p>
          <ul className="space-y-3">
            {topCountries.map((c) => (
              <li key={c.country} className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2 text-[#d4d4d4]">
                  <span className="text-base">{c.flag}</span>
                  {c.country}
                </span>
                <span className="font-semibold text-white">{c.pct}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
