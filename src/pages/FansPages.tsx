import { useState } from "react";
import { Search, Users, Mail, Smartphone } from "lucide-react";
import { Panel, StatCard } from "../components/PageShell";
import { ageDemographics, topCountries, audienceSnapshot } from "../data/mockData";

const fans = [
  { name: "Jordan K.", tier: "Inner Circle", city: "Portland, OR", joined: "2022", ltv: "$284" },
  { name: "Maya R.", tier: "Superfan", city: "Atlanta, GA", joined: "2023", ltv: "$142" },
  { name: "Alex T.", tier: "VIP", city: "Toronto, ON", joined: "2021", ltv: "$398" },
  { name: "Sam P.", tier: "Fan", city: "Chicago, IL", joined: "2024", ltv: "$48" },
];

const segments = [
  { name: "Inner Circle Members", size: "48.2K", match: "Tier = Inner Circle" },
  { name: "Tour Intent — West Coast", size: "124K", match: "Location + engagement score" },
  { name: "Email Engaged (30d)", size: "89K", match: "Opened email in last 30 days" },
  { name: "High LTV Superfans", size: "12.4K", match: "LTV > $200" },
];

const subscribers = [
  { email: "jordan.k@email.com", channel: "Email", status: "Active", since: "Mar 2022" },
  { email: "+1 (503) 555-0142", channel: "SMS", status: "Active", since: "Jan 2024" },
  { email: "maya.r@email.com", channel: "Email", status: "Active", since: "Jun 2023" },
  { email: "+1 (404) 555-0198", channel: "SMS", status: "Unsubscribed", since: "Feb 2023" },
];

export function AudienceOverviewPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {audienceSnapshot.slice(0, 4).map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Panel title="Age Distribution">
          {ageDemographics.map((a) => (
            <div key={a.range} className="mb-2">
              <div className="flex justify-between text-xs"><span>{a.range}</span><span>{a.pct}%</span></div>
              <div className="mt-1 h-2 rounded-full bg-dt-border"><div className="h-full rounded-full bg-dt-red" style={{ width: `${a.pct}%` }} /></div>
            </div>
          ))}
        </Panel>
        <Panel title="Top Countries">
          {topCountries.map((c) => (
            <div key={c.country} className="flex justify-between border-b border-dt-border/50 py-2 text-sm last:border-0">
              <span>{c.flag} {c.country}</span><span className="font-medium">{c.pct}%</span>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

export function FanProfilesPage() {
  const [query, setQuery] = useState("");
  const filtered = fans.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <Panel title="Fan Profiles">
      <div className="mb-4 flex items-center gap-2 rounded-md border border-dt-border bg-dt-bg px-3 py-2">
        <Search size={14} className="text-dt-muted" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, city, tier..." className="flex-1 bg-transparent text-sm outline-none" />
      </div>
      <table className="w-full text-left text-sm">
        <thead><tr className="border-b border-dt-border text-xs text-dt-muted"><th className="pb-2">Fan</th><th className="pb-2">Tier</th><th className="pb-2">Location</th><th className="pb-2">Since</th><th className="pb-2">LTV</th></tr></thead>
        <tbody>
          {filtered.map((f) => (
            <tr key={f.name} className="border-b border-dt-border/50 hover:bg-white/[0.02]">
              <td className="py-3 font-medium">{f.name}</td><td className="py-3"><span className="rounded bg-dt-red/15 px-2 py-0.5 text-xs text-dt-red">{f.tier}</span></td><td className="py-3 text-dt-muted">{f.city}</td><td className="py-3 text-dt-muted">{f.joined}</td><td className="py-3">{f.ltv}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

export function SegmentsPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><button type="button" className="rounded-md bg-dt-red px-4 py-2 text-sm font-semibold">+ Create Segment</button></div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {segments.map((s) => (
          <div key={s.name} className="rounded-lg border border-dt-border bg-dt-card p-4">
            <div className="flex items-start justify-between"><p className="font-medium">{s.name}</p><Users size={16} className="text-dt-red" /></div>
            <p className="mt-2 text-2xl font-display font-semibold">{s.size}</p>
            <p className="mt-1 text-xs text-dt-muted">{s.match}</p>
            <button type="button" className="mt-3 text-xs text-dt-red hover:underline">Edit rules</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SubscribersPage() {
  return (
    <Panel title="Email / SMS Subscribers">
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Email Subscribers" value="362,540" trend="+4.2%" />
        <StatCard label="SMS Subscribers" value="89,210" trend="+8.1%" />
        <StatCard label="Deliverability" value="98.4%" hint="Last 30 days" />
      </div>
      <table className="w-full text-left text-sm">
        <thead><tr className="border-b border-dt-border text-xs text-dt-muted"><th className="pb-2">Contact</th><th className="pb-2">Channel</th><th className="pb-2">Status</th><th className="pb-2">Since</th></tr></thead>
        <tbody>
          {subscribers.map((s) => (
            <tr key={s.email} className="border-b border-dt-border/50">
              <td className="py-3">{s.email}</td>
              <td className="py-3"><span className="flex items-center gap-1 text-dt-muted">{s.channel === "Email" ? <Mail size={12} /> : <Smartphone size={12} />}{s.channel}</span></td>
              <td className="py-3"><span className={`rounded px-2 py-0.5 text-xs ${s.status === "Active" ? "bg-green-500/15 text-dt-green" : "bg-dt-border text-dt-muted"}`}>{s.status}</span></td>
              <td className="py-3 text-dt-muted">{s.since}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

export function BehaviorInsightsPage() {
  const steps = [
    { step: "Landing Page", users: "1.26M", drop: "0%" },
    { step: "Content View", users: "842K", drop: "33%" },
    { step: "Email Capture", users: "75.3K", drop: "91%" },
    { step: "Inner Circle Signup", users: "12.4K", drop: "84%" },
    { step: "Purchase / Convert", users: "8.7K", drop: "30%" },
  ];
  return (
    <Panel title="Fan Journey Funnel">
      <div className="space-y-2">
        {steps.map((s, i) => (
          <div key={s.step} className="flex items-center gap-4">
            <span className="w-6 text-center text-xs font-bold text-dt-red">{i + 1}</span>
            <div className="flex-1 rounded-lg border border-dt-border bg-dt-bg/50 p-3">
              <div className="flex justify-between text-sm"><span className="font-medium">{s.step}</span><span>{s.users}</span></div>
              {i > 0 && <p className="mt-1 text-xs text-dt-muted">{s.drop} drop-off from previous step</p>}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

