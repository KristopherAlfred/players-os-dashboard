import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { Panel, StatCard } from "../components/PageShell";
import {
  createEmptyNewsItem,
  deleteNewsItem,
  fetchNewsFeed,
  publishNewsFeed,
  resolveNewsAssetUrl,
  upsertNewsItem,
  type NewsCategory,
  type NewsFeed,
  type NewsItem,
  type NewsStatus,
} from "../lib/newsApi";
import { TypographyControls } from "../components/TypographyControls";
import { DtSelect } from "../components/DtSelect";
import { titleTypographyStyle } from "../lib/typography";

function categoryLabel(category: NewsCategory) {
  if (category === "insights") return "Insight";
  if (category === "news") return "News";
  return "Newsletter";
}

export function NewsContentPage() {
  const [feed, setFeed] = useState<NewsFeed | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    void fetchNewsFeed()
      .then((next) => {
        setFeed(next);
        const first = next.items[0];
        if (first) {
          setSelectedId(first.id);
          setDraft({ ...first });
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load news"))
      .finally(() => setLoading(false));
  }, []);

  const items = useMemo(() => {
    const list = feed?.items ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    );
  }, [feed, query]);

  const stats = useMemo(() => {
    const all = feed?.items ?? [];
    return {
      newsletters: all.filter((i) => i.category === "newsletters" || i.category === "news").length,
      drafts: all.filter((i) => i.status === "draft").length,
      published: all.filter((i) => i.status === "published").length,
    };
  }, [feed]);

  function selectItem(item: NewsItem) {
    setSelectedId(item.id);
    setDraft({ ...item });
    setStatus(null);
    setError(null);
  }

  function startNew(category: NewsCategory = "newsletters") {
    const item = createEmptyNewsItem(category);
    setSelectedId(item.id);
    setDraft(item);
    setStatus("New draft — write it, then Publish to App");
    setError(null);
  }

  function patchDraft(patch: Partial<NewsItem>) {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  async function saveDraft(nextStatus?: NewsStatus) {
    if (!draft) return;
    if (!draft.title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      const payload: NewsItem = {
        ...draft,
        title: draft.title.trim(),
        description: draft.description.trim(),
        body: draft.body.trim(),
        href: draft.href.trim(),
        status: nextStatus ?? draft.status,
        publishedAt: nextStatus === "published" ? new Date().toISOString() : draft.publishedAt,
        date:
          nextStatus === "published"
            ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : draft.date,
        source: draft.source || "manual",
      };
      const nextFeed = await upsertNewsItem(payload);
      setFeed(nextFeed);
      setDraft(payload);
      setSelectedId(payload.id);
      setStatus(
        payload.status === "published"
          ? "Published — live on DameTime News"
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
      const nextFeed = await deleteNewsItem(draft.id);
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
      const next = await publishNewsFeed({
        ...feed,
        version: (feed.version || 1) + 1,
        updatedAt: new Date().toISOString(),
      });
      setFeed(next);
      setStatus("Full news feed republished to app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setSaving(false);
    }
  }

  function onUpload(file: File | null) {
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
        <Loader2 className="mr-2 animate-spin" size={18} /> Loading news…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Newsletters" value={String(stats.newsletters)} />
        <StatCard label="Published" value={String(stats.published)} />
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

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Panel title="Stories">
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => startNew("newsletters")}
              className="inline-flex items-center gap-1 rounded-md bg-dt-red px-3 py-2 text-xs font-semibold text-white"
            >
              <Plus size={13} /> New newsletter
            </button>
            <button
              type="button"
              onClick={() => startNew("insights")}
              className="inline-flex items-center gap-1 rounded-md border border-dt-border px-3 py-2 text-xs text-white/80"
            >
              <Plus size={13} /> New insight
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

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles…"
            className="mb-3 w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none"
          />

          <ul className="max-h-[58vh] space-y-2 overflow-y-auto pr-1">
            {items.length === 0 ? (
              <li className="rounded-md border border-dashed border-dt-border px-3 py-6 text-center text-sm text-dt-muted">
                No stories yet. Start a newsletter.
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
                      src={resolveNewsAssetUrl(item.thumbnail)}
                      alt=""
                      className="h-14 w-20 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{item.title || "Untitled"}</p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-dt-muted">
                        <FileText size={11} />
                        {categoryLabel(item.category)} · {item.status}
                      </p>
                      <p className="text-[10px] text-dt-muted">{item.date}</p>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </Panel>

        <Panel title={draft ? "Compose" : "Editor"}>
          {!draft ? (
            <p className="text-sm text-dt-muted">Select a story or create a new newsletter.</p>
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
                  placeholder="Loyalty Over Everything"
                  style={titleTypographyStyle(draft)}
                />
              </label>

              <TypographyControls
                fontFamily={draft.titleFontFamily || "default"}
                fontSize={draft.titleFontSize || "md"}
                onFontFamilyChange={(titleFontFamily) => patchDraft({ titleFontFamily })}
                onFontSizeChange={(titleFontSize) => patchDraft({ titleFontSize })}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs text-dt-muted">Category</span>
                  <DtSelect
                    value={draft.category}
                    aria-label="Category"
                    onChange={(value) => patchDraft({ category: value as NewsCategory })}
                    options={[
                      { value: "newsletters", label: "Newsletter" },
                      { value: "insights", label: "Insight" },
                      { value: "news", label: "News" },
                    ]}
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs text-dt-muted">Status</span>
                  <DtSelect
                    value={draft.status}
                    aria-label="Status"
                    onChange={(value) => patchDraft({ status: value as NewsStatus })}
                    options={[
                      { value: "draft", label: "Draft" },
                      { value: "published", label: "Published" },
                    ]}
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs text-dt-muted">Short description (list preview)</span>
                <textarea
                  value={draft.description}
                  onChange={(e) => patchDraft({ description: e.target.value })}
                  rows={2}
                  className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none focus:border-dt-red/50"
                  placeholder="One or two lines fans see in the News list"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs text-dt-muted">Newsletter body</span>
                <textarea
                  value={draft.body}
                  onChange={(e) => patchDraft({ body: e.target.value })}
                  rows={12}
                  className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 font-mono text-sm leading-relaxed outline-none focus:border-dt-red/50"
                  placeholder="Type the full newsletter here. Fans read this in the DameTime app."
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs text-dt-muted">External link (optional)</span>
                <input
                  value={draft.href}
                  onChange={(e) => patchDraft({ href: e.target.value })}
                  className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none focus:border-dt-red/50"
                  placeholder="https://www.theplayerstribune.com/...  — leave blank to open in-app"
                />
              </label>

              <div className="space-y-2 rounded-lg border border-dt-border bg-dt-bg/40 p-3">
                <p className="text-xs text-dt-muted">Thumbnail</p>
                <img
                  src={resolveNewsAssetUrl(draft.thumbnail)}
                  alt=""
                  className="h-36 w-full rounded-md object-cover"
                />
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-dt-border px-3 py-2 text-xs text-white/80">
                    <Upload size={13} /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  <input
                    value={draft.thumbnail.startsWith("data:") ? "(uploaded image)" : draft.thumbnail}
                    onChange={(e) => {
                      if (!e.target.value.startsWith("(")) patchDraft({ thumbnail: e.target.value });
                    }}
                    className="min-w-[220px] flex-1 rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-xs outline-none"
                    placeholder="Image URL or /images/..."
                  />
                </div>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
