import { useCallback, useEffect, useState } from "react";
import { Link2 } from "lucide-react";
import { BRAND_COLORS, brandIconMap } from "./BrandIcons";
import {
  fetchPlatformConnections,
  formatSyncedAgo,
  setPlatformConnected,
  type PlatformConnection,
} from "../../lib/platformConnections";
import { syncInstagram } from "../../lib/instagramGraphApi";



export function ConnectorCards() {
  const [rows, setRows] = useState<PlatformConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setRows(await fetchPlatformConnections());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load connectors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggle(row: PlatformConnection, connected: boolean) {
    setBusyId(row.id);
    try {
      if (row.platform === "instagram" && connected) {
        await syncInstagram();
      } else {
        await setPlatformConnected(row.id, connected);
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function resync(row: PlatformConnection) {
    setBusyId(row.id);
    try {
      await syncInstagram();
      await load();
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setBusyId(null);
    }
  }


  return (
    <section data-tour="connector-cards" className="overflow-hidden rounded-2xl border border-dt-border bg-dt-card">
      <div className="border-b border-dt-border px-5 py-4">
        <div className="flex items-center gap-2 text-dt-red">
          <Link2 size={16} />
          <h3 className="font-display text-sm font-semibold tracking-wide text-white">
            Connected platforms
          </h3>
        </div>
        <p className="mt-1 text-[11px] text-white/40">
          Social sources powering Content and overview analytics
        </p>
      </div>

      {error ? (
        <p className="px-5 py-4 text-sm text-white/60">{error}</p>
      ) : null}

      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[168px] animate-pulse rounded-2xl border border-dt-border bg-black/25"
              />
            ))
          : rows.map((row) => {
              const Icon = brandIconMap[row.platform];
              const brand = BRAND_COLORS[row.platform] ?? "var(--theme-accent)";
              const busy = busyId === row.id;
              return (
                <div
                  key={row.id}
                  className="dt-surface flex flex-col rounded-2xl border border-dt-border bg-black/25 p-4 transition hover:border-white/15"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/50"
                      style={{ color: brand, boxShadow: `inset 0 0 18px color-mix(in srgb, ${brand} 18%, transparent)` }}
                    >
                      {Icon ? <Icon size={20} /> : <Link2 size={18} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-white">
                        {row.display_name}
                      </p>
                      <p className="truncate text-[12px] text-white/45">
                        {row.connected ? row.handle ?? "—" : "Not connected"}
                      </p>
                    </div>
                    <span
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                        row.connected
                          ? "bg-dt-red shadow-[0_0_10px_var(--theme-accent)]"
                          : "border border-white/25 bg-transparent"
                      }`}
                      aria-label={row.connected ? "Connected" : "Not connected"}
                    />
                  </div>

                  <p className="mt-3 text-[11px] text-white/40">
                    {row.connected ? formatSyncedAgo(row.last_synced_at) : "Not connected"}
                  </p>

                  <div className="mt-4 flex gap-2">
                    {row.connected ? (
                      <>
                        <button
                          type="button"
                          className="flex-1 rounded-xl border border-dt-border bg-black/40 px-3 py-2 text-xs font-semibold text-white transition hover:border-dt-red/50 hover:text-dt-red"
                        >
                          Configure
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => toggle(row, false)}
                          className="flex-1 rounded-xl border border-dt-border bg-transparent px-3 py-2 text-xs font-semibold text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-50"
                        >
                          {busy ? "…" : "Disconnect"}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => toggle(row, true)}
                        className="w-full rounded-xl bg-dt-red px-3 py-2.5 text-xs font-semibold text-black transition hover:brightness-110 disabled:opacity-50"
                      >
                        {busy ? "Connecting…" : "Connect"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </section>
  );
}
