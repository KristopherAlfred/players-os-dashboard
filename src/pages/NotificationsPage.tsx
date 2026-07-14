import { useEffect, useMemo, useState } from "react";
import { Bell, Loader2, Plus, Trash2 } from "lucide-react";
import { Panel, StatCard } from "../components/PageShell";
import {
  createEmptyNotification,
  deleteNotificationItem,
  fetchNotificationFeed,
  fromLocalInputValue,
  publishNotificationFeed,
  toLocalInputValue,
  upsertNotificationItem,
  type AppNotification,
  type NotificationFeed,
  type NotificationStatus,
  type NotificationSurface,
} from "../lib/notificationsApi";

const FREQUENCY_PRESETS = [
  { label: "Every 15 seconds", value: 15 },
  { label: "Every 30 seconds", value: 30 },
  { label: "Every 1 minute", value: 60 },
  { label: "Every 2 minutes", value: 120 },
  { label: "Every 5 minutes", value: 300 },
  { label: "Every 10 minutes", value: 600 },
  { label: "Custom…", value: -1 },
];

function PreviewToast({ message }: { message: string }) {
  return (
    <div className="mx-auto w-full max-w-[220px]">
      <div
        className="relative overflow-hidden rounded-[10px] border bg-black"
        style={{ borderColor: "rgba(227, 24, 55, 0.75)", boxShadow: "inset 0 0 18px rgba(0,0,0,0.45)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(125deg, rgba(80, 0, 12, 0.95) 0%, rgba(180, 12, 32, 0.88) 42%, rgba(120, 0, 18, 0.92) 72%, rgba(40, 0, 8, 0.98) 100%)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
          }}
          aria-hidden
        />
        <p
          className="relative z-[1] m-0 px-2.5 py-2 text-center text-[11px] font-black uppercase leading-tight tracking-[0.08em] text-white"
          style={{ fontFamily: '"Barlow Condensed", "Bebas Neue", sans-serif' }}
        >
          {message || "Notification preview"}
        </p>
      </div>
      <p className="mt-2 text-center text-[10px] text-white/40">Same style as the +points toast in the app</p>
    </div>
  );
}

export function NotificationsPage() {
  const [feed, setFeed] = useState<NotificationFeed | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AppNotification | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [customFrequency, setCustomFrequency] = useState(false);

  useEffect(() => {
    void fetchNotificationFeed()
      .then((next) => {
        setFeed(next);
        const first = next.items[0];
        if (first) {
          setSelectedId(first.id);
          setDraft({ ...first });
          setCustomFrequency(!FREQUENCY_PRESETS.some((p) => p.value === first.frequencySeconds && p.value > 0));
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load notifications"))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const all = feed?.items ?? [];
    return {
      total: all.length,
      published: all.filter((i) => i.status === "published" && i.enabled).length,
      drafts: all.filter((i) => i.status === "draft").length,
    };
  }, [feed]);

  function selectItem(item: AppNotification) {
    setSelectedId(item.id);
    setDraft({ ...item });
    setCustomFrequency(!FREQUENCY_PRESETS.some((p) => p.value === item.frequencySeconds && p.value > 0));
    setStatus(null);
    setError(null);
  }

  function startNew() {
    const item = createEmptyNotification();
    setSelectedId(item.id);
    setDraft(item);
    setCustomFrequency(false);
    setStatus("New notification — set message, frequency, schedule, then Publish");
    setError(null);
  }

  function patchDraft(patch: Partial<AppNotification>) {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  async function saveDraft(nextStatus?: NotificationStatus) {
    if (!draft) return;
    if (!draft.message.trim()) {
      setError("Message is required");
      return;
    }

    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      const payload: AppNotification = {
        ...draft,
        message: draft.message.trim(),
        status: nextStatus ?? draft.status,
        frequencySeconds: Math.min(3600, Math.max(5, Math.round(draft.frequencySeconds || 30))),
        displayDurationMs: Math.min(15000, Math.max(1500, Math.round(draft.displayDurationMs || 3000))),
      };
      const nextFeed = await upsertNotificationItem(payload);
      setFeed(nextFeed);
      setDraft(payload);
      setSelectedId(payload.id);
      setStatus(
        payload.status === "published"
          ? "Published — live in DameTime app toasts"
          : "Draft saved",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function removeItem() {
    if (!draft) return;
    if (!window.confirm("Delete this notification?")) return;
    setSaving(true);
    setError(null);
    try {
      const nextFeed = await deleteNotificationItem(draft.id);
      setFeed(nextFeed);
      const next = nextFeed.items[0] ?? null;
      setSelectedId(next?.id ?? null);
      setDraft(next ? { ...next } : null);
      setStatus("Deleted");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  async function republishAll() {
    if (!feed) return;
    setSaving(true);
    setError(null);
    try {
      const next = await publishNotificationFeed({
        ...feed,
        version: (feed.version || 1) + 1,
        updatedAt: new Date().toISOString(),
      });
      setFeed(next);
      setStatus("All notifications republished to app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-white/60">
        <Loader2 className="mr-2 animate-spin" size={18} /> Loading notifications…
      </div>
    );
  }

  const frequencySelectValue = customFrequency
    ? -1
    : FREQUENCY_PRESETS.some((p) => p.value === draft?.frequencySeconds)
      ? draft?.frequencySeconds ?? 30
      : -1;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Notifications" value={String(stats.total)} />
        <StatCard label="Live in app" value={String(stats.published)} />
        <StatCard label="Drafts" value={String(stats.drafts)} />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>
      ) : null}
      {status ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
          {status}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
        <Panel title="Notification list">
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={startNew}
              className="inline-flex items-center gap-1 rounded-md bg-dt-red px-3 py-2 text-xs font-semibold text-white"
            >
              <Plus size={13} /> New notification
            </button>
            <button
              type="button"
              onClick={() => void republishAll()}
              disabled={saving}
              className="inline-flex items-center gap-1 rounded-md border border-dt-border px-3 py-2 text-xs text-white/70 disabled:opacity-50"
            >
              Republish all
            </button>
          </div>

          <ul className="max-h-[58vh] space-y-2 overflow-y-auto pr-1">
            {(feed?.items ?? []).length === 0 ? (
              <li className="rounded-md border border-dashed border-dt-border px-3 py-6 text-center text-sm text-dt-muted">
                No notifications yet. Create one for the app toast.
              </li>
            ) : (
              (feed?.items ?? []).map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => selectItem(item)}
                    className={`flex w-full gap-3 rounded-lg border p-2.5 text-left transition ${
                      selectedId === item.id
                        ? "border-dt-red/60 bg-dt-red/10"
                        : "border-dt-border bg-dt-bg/50 hover:border-dt-red/30"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-dt-red/30 bg-dt-red/10 text-dt-red">
                      <Bell size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium text-white">{item.message}</p>
                      <p className="mt-1 text-[11px] text-dt-muted">
                        Every {item.frequencySeconds}s · {item.status}
                        {!item.enabled ? " · paused" : ""}
                      </p>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </Panel>

        <Panel title={draft ? "Edit notification" : "Editor"}>
          {!draft ? (
            <p className="text-sm text-dt-muted">Select a notification or create a new one.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void saveDraft("draft")}
                  className="rounded-md border border-dt-border px-3 py-2 text-sm text-white/80 disabled:opacity-50"
                >
                  Save draft
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void saveDraft("published")}
                  className="inline-flex items-center gap-2 rounded-md bg-dt-red px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                  Publish to app
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void removeItem()}
                  className="ml-auto inline-flex items-center gap-1 rounded-md border border-red-500/30 px-3 py-2 text-sm text-red-200"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>

              <div className="rounded-xl border border-dt-border bg-black/40 p-4">
                <PreviewToast message={draft.message} />
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs text-dt-muted">Message</span>
                <textarea
                  value={draft.message}
                  onChange={(e) => patchDraft({ message: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none focus:border-dt-red/50"
                  placeholder="+10 points! Login tomorrow to earn more 🔥"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs text-dt-muted">Frequency</span>
                  <select
                    value={frequencySelectValue}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (v === -1) {
                        setCustomFrequency(true);
                        return;
                      }
                      setCustomFrequency(false);
                      patchDraft({ frequencySeconds: v });
                    }}
                    className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none"
                  >
                    {FREQUENCY_PRESETS.map((p) => (
                      <option key={p.label} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </label>
                {(customFrequency || frequencySelectValue === -1) && (
                  <label className="block space-y-1.5">
                    <span className="text-xs text-dt-muted">Custom seconds</span>
                    <input
                      type="number"
                      min={5}
                      max={3600}
                      value={draft.frequencySeconds}
                      onChange={(e) => patchDraft({ frequencySeconds: Number(e.target.value) || 30 })}
                      className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none focus:border-dt-red/50"
                    />
                  </label>
                )}
                <label className="block space-y-1.5">
                  <span className="text-xs text-dt-muted">How long it stays on screen</span>
                  <select
                    value={draft.displayDurationMs}
                    onChange={(e) => patchDraft({ displayDurationMs: Number(e.target.value) })}
                    className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none"
                  >
                    <option value={2000}>2 seconds</option>
                    <option value={3000}>3 seconds (points toast)</option>
                    <option value={4000}>4 seconds</option>
                    <option value={5000}>5 seconds</option>
                    <option value={8000}>8 seconds</option>
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs text-dt-muted">Show on</span>
                  <select
                    value={draft.surface}
                    onChange={(e) => patchDraft({ surface: e.target.value as NotificationSurface })}
                    className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none"
                  >
                    <option value="all">All app screens</option>
                    <option value="home">Home only</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs text-dt-muted">Schedule start (optional)</span>
                  <input
                    type="datetime-local"
                    value={toLocalInputValue(draft.scheduleStart)}
                    onChange={(e) => patchDraft({ scheduleStart: fromLocalInputValue(e.target.value) })}
                    className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none focus:border-dt-red/50"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs text-dt-muted">Schedule end (optional)</span>
                  <input
                    type="datetime-local"
                    value={toLocalInputValue(draft.scheduleEnd)}
                    onChange={(e) => patchDraft({ scheduleEnd: fromLocalInputValue(e.target.value) })}
                    className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none focus:border-dt-red/50"
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs text-dt-muted">Status</span>
                  <select
                    value={draft.status}
                    onChange={(e) => patchDraft({ status: e.target.value as NotificationStatus })}
                    className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>
                <label className="flex items-end gap-2 pb-2 text-sm text-white/75">
                  <input
                    type="checkbox"
                    checked={draft.enabled}
                    onChange={(e) => patchDraft({ enabled: e.target.checked })}
                    className="accent-dt-red"
                  />
                  Enabled (paused if off)
                </label>
              </div>

              <p className="text-[11px] leading-relaxed text-dt-muted">
                Frequency is the wait after a toast finishes before the next one pops. Example: show for 3s, then wait 30s, repeat — while inside the schedule window.
              </p>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
