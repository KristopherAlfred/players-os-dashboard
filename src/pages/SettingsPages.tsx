import { useState } from "react";
import { Check } from "lucide-react";
import { Panel } from "../components/PageShell";
import { useTheme } from "../theme/ThemeContext";
import type { ThemeTemplate } from "../theme/themes";

const team = [
  { name: "Demetri W.", role: "Admin", email: "demetri@dametime.com", status: "Active" },
  { name: "Sarah K.", role: "Editor", email: "sarah@dametime.com", status: "Active" },
  { name: "Mike T.", role: "Analyst", email: "mike@dametime.com", status: "Active" },
  { name: "Guest", role: "Viewer", email: "guest@partner.com", status: "Pending" },
];

const integrations = [
  { name: "Instagram", connected: true, last: "Synced 5m ago" },
  { name: "TikTok", connected: true, last: "Synced 12m ago" },
  { name: "Mailchimp", connected: true, last: "Synced 1h ago" },
  { name: "Twilio SMS", connected: true, last: "Synced 30m ago" },
  { name: "Google Analytics", connected: false, last: "Not connected" },
  { name: "Shopify", connected: false, last: "Not connected" },
];

const permissions = [
  { role: "Admin", publish: true, export: true, monetize: true, settings: true },
  { role: "Editor", publish: true, export: false, monetize: false, settings: false },
  { role: "Analyst", publish: false, export: true, monetize: false, settings: false },
  { role: "Viewer", publish: false, export: false, monetize: false, settings: false },
];

export function TeamPage() {
  return (
    <Panel title="Team Members">
      <div className="mb-4 flex justify-end"><button type="button" className="rounded-md bg-dt-red px-4 py-2 text-sm font-semibold">+ Invite Member</button></div>
      <table className="w-full text-left text-sm">
        <thead><tr className="border-b border-dt-border text-xs text-dt-muted"><th className="pb-2">Name</th><th className="pb-2">Role</th><th className="pb-2">Email</th><th className="pb-2">Status</th></tr></thead>
        <tbody>
          {team.map((m) => (
            <tr key={m.email} className="border-b border-dt-border/50">
              <td className="py-3 font-medium">{m.name}</td><td className="py-3">{m.role}</td><td className="py-3 text-dt-muted">{m.email}</td>
              <td className="py-3"><span className={`rounded px-2 py-0.5 text-xs ${m.status === "Active" ? "bg-green-500/15 text-dt-green" : "bg-orange-500/15 text-dt-orange"}`}>{m.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

export function RolesPage() {
  return (
    <Panel title="Roles & Permissions">
      <table className="w-full text-left text-sm">
        <thead><tr className="border-b border-dt-border text-xs text-dt-muted"><th className="pb-2">Role</th><th className="pb-2">Publish</th><th className="pb-2">Export Data</th><th className="pb-2">Monetize</th><th className="pb-2">Settings</th></tr></thead>
        <tbody>
          {permissions.map((p) => (
            <tr key={p.role} className="border-b border-dt-border/50">
              <td className="py-3 font-medium">{p.role}</td>
              {[p.publish, p.export, p.monetize, p.settings].map((v, i) => (
                <td key={i} className="py-3">{v ? <span className="text-dt-green">✓</span> : <span className="text-dt-muted">—</span>}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

export function IntegrationsPage() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {integrations.map((i) => (
        <div key={i.name} className="rounded-lg border border-dt-border bg-dt-card p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">{i.name}</p>
            <span className={`h-2 w-2 rounded-full ${i.connected ? "bg-dt-green" : "bg-dt-muted"}`} />
          </div>
          <p className="mt-2 text-xs text-dt-muted">{i.last}</p>
          <button type="button" className="mt-3 text-xs text-dt-red hover:underline">{i.connected ? "Configure" : "Connect"}</button>
        </div>
      ))}
    </div>
  );
}

export function AccountPage() {
  const [notifications, setNotifications] = useState(true);
  const { template, setTemplate, templates } = useTheme();

  return (
    <div className="space-y-4">
      <Panel title="Color Template">
        <p className="mb-4 text-sm text-dt-muted">
          Switch the dashboard color palette. Branding and copy stay the same.
        </p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplate(t.id as ThemeTemplate)}
              className={`relative rounded-lg border p-4 text-left transition-colors ${
                template === t.id
                  ? "border-dt-red bg-dt-red/10"
                  : "border-dt-border bg-dt-bg/50 hover:border-dt-muted"
              }`}
            >
              {template === t.id && (
                <span className="absolute right-3 top-3 text-dt-red">
                  <Check size={16} />
                </span>
              )}
              <div className="mb-3 flex gap-1.5">
                {t.swatches.map((color) => (
                  <span
                    key={color}
                    className="h-6 w-6 rounded-full border border-white/10"
                    style={{ background: color }}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-white">{t.name}</p>
              <p className="mt-1 text-xs text-dt-muted">{t.description}</p>
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Panel title="Profile">
        <form className="space-y-3 text-sm">
          <label className="block"><span className="text-dt-muted">Display Name</span><input defaultValue="Dame Time Admin" className="mt-1 w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2" /></label>
          <label className="block"><span className="text-dt-muted">Email</span><input defaultValue="admin@dametime.com" className="mt-1 w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2" /></label>
          <label className="block"><span className="text-dt-muted">Timezone</span><select className="mt-1 w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2"><option>Pacific Time (PT)</option></select></label>
          <button type="button" className="rounded-md bg-dt-red px-4 py-2 font-semibold">Save Changes</button>
        </form>
      </Panel>
      <Panel title="Preferences">
        <label className="flex items-center justify-between py-2 text-sm">
          <span>Email notifications</span>
          <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} className="accent-dt-red" />
        </label>
        <label className="flex items-center justify-between py-2 text-sm"><span>SMS alerts for live drops</span><input type="checkbox" defaultChecked className="accent-dt-red" /></label>
        <label className="flex items-center justify-between py-2 text-sm"><span>Weekly digest</span><input type="checkbox" defaultChecked className="accent-dt-red" /></label>
      </Panel>
      </div>
    </div>
  );
}

export function SettingsPage() {
  return (
    <div className="space-y-4">
      <TeamPage />
      <RolesPage />
      <IntegrationsPage />
      <AccountPage />
    </div>
  );
}

