import { Card } from "./ui/Card";

const partners = [
  { name: "LiveRamp", abbr: "LR" },
  { name: "theTradeDesk", abbr: "TTD" },
  { name: "Google DV360", abbr: "DV" },
];

export function MonetizationOverview() {
  return (
    <Card title="Monetization Overview" className="flex h-full w-full flex-col">
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="rounded-lg border border-dt-border bg-dt-bg/50 p-3">
          <p className="text-[11px] text-dt-muted">Total Audience Segments</p>
          <p className="mt-1 text-2xl font-bold text-white">28</p>
        </div>
        <div className="rounded-lg border border-dt-border bg-dt-bg/50 p-3">
          <p className="text-[11px] text-dt-muted">Active on DSPs</p>
          <p className="mt-1 text-2xl font-bold text-white">14</p>
        </div>
        <div className="rounded-lg border border-dt-border bg-dt-bg/50 p-3">
          <p className="text-[11px] text-dt-muted">Revenue (MTD)</p>
          <p className="mt-1 text-2xl font-bold text-white">$96,420</p>
          <p className="text-xs font-medium text-dt-green">+24.7%</p>
        </div>
      </div>
      <div className="border-t border-dt-border px-4 py-3">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-dt-muted">
          Top Partners
        </p>
        <div className="flex gap-3">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-dt-border bg-dt-bg/50 py-2.5"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded bg-dt-red/20 text-[10px] font-bold text-dt-red">
                {p.abbr}
              </span>
              <span className="text-xs font-medium text-[#d4d4d4]">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
