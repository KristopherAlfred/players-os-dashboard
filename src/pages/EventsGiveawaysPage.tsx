import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Gift, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { Panel, StatCard } from "../components/PageShell";
import {
  createEmptyEventItem,
  deleteEventItem,
  fetchEventsFeed,
  formatDeadlineDisplay,
  fromLocalInputValue,
  publishEventsFeed,
  resolveEventAssetUrl,
  toLocalInputValue,
  upsertEventItem,
  type AppEventItem,
  type EventKind,
  type EventStatus,
  type EventsFeed,
} from "../lib/eventsApi";

export function EventsGiveawaysPage() {
  const [feed, setFeed] = useState<EventsFeed | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AppEventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | EventKind>("all");

  useEffect(() => {
    void fetchEventsFeed()
      .then((next) => {
        setFeed(next);
        const first = next.items[0];
        if (first) {
          setSelectedId(first.id);
          setDraft({ ...first });
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load events"))
      .finally(() => setLoading(false));
  }, []);

  const items = useMemo(() => {
    let list = feed?.items ?? [];
    if (typeFilter !== "all") list = list.filter((item) => item.type === typeFilter);
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q),
    );
  }, [feed, query, typeFilter]);

  const stats = useMemo(() => {
    const all = feed?.items ?? [];
    return {
      events: all.filter((i) => i.type === "event").length,
      giveaways: all.filter((i) => i.type === "giveaway").length,
      published: all.filter((i) => i.status === "published" && i.enabled).length,
    };
  }, [feed]);

  function selectItem(item: AppEventItem) {
    setSelectedId(item.id);
    setDraft({ ...item });
    setStatus(null);
    setError(null);
  }

  function startNew(type: EventKind) {
    const item = createEmptyEventItem(type);
    setSelectedId(item.id);
    setDraft(item);
    setStatus(`New ${type} — fill details, then Publish to App`);
    setError(null);
  }

  function patchDraft(patch: Partial<AppEventItem>) {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  async function saveDraft(nextStatus?: EventStatus) {
    if (!draft) return;
    if (!draft.title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      const deadline = draft.deadline.trim();
      const payload: AppEventItem = {
        ...draft,
        title: draft.title.trim(),
        description: draft.description.trim(),
        thumbnail: draft.thumbnail.trim() || "/images/eventsbackground.png",
        href: draft.href.trim(),
        location: draft.location.trim(),
        dateLabel: draft.dateLabel.trim(),
        deadline,
        deadlineDisplay: draft.deadlineDisplay.trim() || formatDeadlineDisplay(deadline),
        status: nextStatus ?? draft.status,
        publishedAt: nextStatus === "published" ? new Date().toISOString() : draft.publishedAt,
        source: "manual",
      };
      const nextFeed = await upsertEventItem(payload);
      setFeed(nextFeed);
      setDraft(payload);
      setSelectedId(payload.id);
      setStatus(
        payload.status === "published"
          ? `Published — live in DameTime ${payload.type === "giveaway" ? "Giveaways" : "Upcoming"}`
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
    if (!window.confirm(`Delete “${draft.title || "this item"}”?`)) return;
    setSaving(true);
    setError(null);
    try {
      const nextFeed = await deleteEventItem(draft.id);
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
      const next = await publishEventsFeed({
        ...feed,
        version: (feed.version || 1) + 1,
        updatedAt: new Date().toISOString(),
      });
      setFeed(next);
      setStatus("Full events feed republished to app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setSaving(false);
    }
  }

  function onUploadThumbnail(file: File | null) {
    if (!file || !draft) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") patchDraft({ thumbnail: reader.result });
    };
    reader.readAsDataURL(file);
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-white/60">
        <Loader2 className="mr-2 animate-spin" size={18} /> Loading events…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Events" value={String(stats.events)} />
        <StatCard label="Giveaways" value={String(stats.giveaways)} />
        <StatCard label="Published" value={String(stats.published)} />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>
      ) : null}
      {status ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
          {status}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Panel title="Library">
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => startNew("event")}
              className="inline-flex items-center gap-1 rounded-md bg-dt-red px-3 py-2 text-xs font-semibold text-white"
            >
              <Plus size={13} /> New event
            </button>
            <button
              type="button"
              onClick={() => startNew("giveaway")}
              className="inline-flex items-center gap-1 rounded-md border border-dt-border px-3 py-2 text-xs text-white/80"
            >
              <Plus size={13} /> New giveaway
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

          <div className="mb-3 flex gap-2">
            {([
              ["all", "All"],
              ["event", "Events"],
              ["giveaway", "Giveaways"],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTypeFilter(id)}
                className={`rounded-md px-2.5 py-1.5 text-xs ${
                  typeFilter === id ? "bg-dt-red text-white" : "border border-dt-border text-white/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles…"
            className="mb-3 w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none"
          />

          <ul className="max-h-[58vh] space-y-2 overflow-y-auto pr-1">
            {items.length === 0 ? (
              <li className="rounded-md border border-dashed border-dt-border px-3 py-6 text-center text-sm text-dt-muted">
                No items yet. Create an event or giveaway for the app.
              </li>
            ) : (
              items.map((item) => (
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
                    <img
                      src={resolveEventAssetUrl(item.thumbnail)}
                      alt=""
                      className="h-16 w-12 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{item.title || "Untitled"}</p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-dt-muted">
                        {item.type === "giveaway" ? <Gift size={11} /> : <CalendarDays size={11} />}
                        {item.type === "giveaway" ? "Giveaway" : "Event"} · {item.status}
                      </p>
                      <p className="text-[10px] text-dt-muted">
                        {item.deadlineDisplay || item.dateLabel || "No deadline"}
                      </p>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </Panel>

        <Panel title={draft ? "Compose" : "Editor"}>
          {!draft ? (
            <p className="text-sm text-dt-muted">Select an item or create a new event / giveaway.</p>
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

              <label className="block space-y-1.5">
                <span className="text-xs text-dt-muted">Title</span>
                <input
                  value={draft.title}
                  onChange={(e) => patchDraft({ title: e.target.value })}
                  className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none focus:border-dt-red/50"
                  placeholder="Meet & Greet — Milwaukee"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs text-dt-muted">Description</span>
                <textarea
                  value={draft.description}
                  onChange={(e) => patchDraft({ description: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none focus:border-dt-red/50"
                  placeholder="What fans need to know"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs text-dt-muted">Type</span>
                  <select
                    value={draft.type}
                    onChange={(e) => patchDraft({ type: e.target.value as EventKind })}
                    className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none"
                  >
                    <option value="event">Event (Upcoming tab)</option>
                    <option value="giveaway">Giveaway</option>
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs text-dt-muted">Status</span>
                  <select
                    value={draft.status}
                    onChange={(e) => patchDraft({ status: e.target.value as EventStatus })}
                    className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs text-dt-muted">Deadline</span>
                  <input
                    type="datetime-local"
                    value={toLocalInputValue(draft.deadline)}
                    onChange={(e) => {
                      const iso = fromLocalInputValue(e.target.value);
                      patchDraft({
                        deadline: iso,
                        deadlineDisplay: formatDeadlineDisplay(iso),
                      });
                    }}
                    className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none focus:border-dt-red/50"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs text-dt-muted">Date label (optional)</span>
                  <input
                    value={draft.dateLabel}
                    onChange={(e) => patchDraft({ dateLabel: e.target.value })}
                    className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none focus:border-dt-red/50"
                    placeholder="Jul 20 · 7PM CT"
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs text-dt-muted">Location (optional)</span>
                <input
                  value={draft.location}
                  onChange={(e) => patchDraft({ location: e.target.value })}
                  className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none focus:border-dt-red/50"
                  placeholder="Fiserv Forum"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs text-dt-muted">Link (ticket / entry URL)</span>
                <input
                  value={draft.href}
                  onChange={(e) => patchDraft({ href: e.target.value })}
                  className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none focus:border-dt-red/50"
                  placeholder="https://…"
                />
              </label>

              <div className="space-y-2 rounded-lg border border-dt-border bg-dt-bg/40 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-dt-muted">Thumbnail</p>
                <div className="mx-auto w-40 overflow-hidden rounded-lg border border-white/10">
                  <img
                    src={resolveEventAssetUrl(draft.thumbnail)}
                    alt=""
                    className="aspect-[3/4] w-full object-cover"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-dt-border px-3 py-2 text-xs text-white/80">
                    <Upload size={13} /> Upload thumbnail
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onUploadThumbnail(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  <input
                    value={draft.thumbnail.startsWith("data:") ? "(uploaded image)" : draft.thumbnail}
                    onChange={(e) => {
                      if (!e.target.value.startsWith("(")) patchDraft({ thumbnail: e.target.value });
                    }}
                    className="min-w-[220px] flex-1 rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-xs outline-none"
                    placeholder="Thumbnail URL or /images/..."
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-white/75">
                <input
                  type="checkbox"
                  checked={draft.enabled}
                  onChange={(e) => patchDraft({ enabled: e.target.checked })}
                  className="accent-dt-red"
                />
                Enabled (hidden in app if off)
              </label>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
