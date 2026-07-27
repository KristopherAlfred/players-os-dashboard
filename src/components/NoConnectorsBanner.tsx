import { Link } from "react-router-dom";
import { PlugZap } from "lucide-react";

export function NoConnectorsBanner() {
  return (
    <div className="dt-surface relative overflow-hidden rounded-lg border border-dt-border bg-dt-card px-6 py-8 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(143,227,184,0.08),transparent_60%)]" />
      <div className="relative mx-auto flex max-w-xl flex-col items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-dt-green/40 bg-dt-green/10">
          <PlugZap size={20} className="text-dt-green" />
        </span>
        <h2 className="font-display text-xl font-semibold text-white">No connected platforms yet</h2>
        <p className="text-sm text-dt-muted">
          Connect your social and analytics accounts to populate the dashboard with real data.
        </p>
        <Link
          to="/settings"
          className="mt-1 rounded-md bg-dt-green px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          Connect platforms in Settings
        </Link>
      </div>
    </div>
  );
}
