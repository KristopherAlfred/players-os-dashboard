import { useEffect, useMemo, useState } from "react";
import { Film, Loader2, Plus, Trash2, Upload, Video } from "lucide-react";
import { Panel, StatCard } from "../components/PageShell";
import {
  createEmptyVideoItem,
  deleteVideoItem,
  extractYoutubeId,
  fetchVideoFeed,
  publishVideoFeed,
  resolveVideoAssetUrl,
  upsertVideoItem,
  type ExclusiveVideoFeed,
  type ExclusiveVideoItem,
  type VideoStatus,
} from "../lib/videosApi";

const MAX_VIDEO_UPLOAD_BYTES = 12 * 1024 * 1024; // ~12MB soft limit for data URL publishes

export function VideosContentPage() {
  const [feed, setFeed] = useState<ExclusiveVideoFeed | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ExclusiveVideoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    void fetchVideoFeed()
      .then((next) => {
        setFeed(next);
        const first = next.items[0];
        if (first) {
          setSelectedId(first.id);
          setDraft({ ...first });
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load videos"))
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
        item.videoUrl.toLowerCase().includes(q),
    );
  }, [feed, query]);

  const stats = useMemo(() => {
    const all = feed?.items ?? [];
    return {
      total: all.length,
      drafts: all.filter((i) => i.status === "draft").length,
      published: all.filter((i) => i.status === "published").length,
    };
  }, [feed]);

  function selectItem(item: ExclusiveVideoItem) {
    setSelectedId(item.id);
    setDraft({ ...item });
    setStatus(null);
    setError(null);
  }

  function startNew() {
    const item = createEmptyVideoItem();
    setSelectedId(item.id);
    setDraft(item);
    setStatus("New exclusive video — add title, video, thumbnail, then Publish to App");
    setError(null);
  }

  function patchDraft(patch: Partial<ExclusiveVideoItem>) {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function applyVideoUrl(url: string) {
    setDraft((prev) => {
      if (!prev) return prev;
      const youtubeId = extractYoutubeId(url);
      const shouldAutoThumb =
        !prev.thumbnail ||
        prev.thumbnail.includes("dameexclusive") ||
        prev.thumbnail.includes("ytimg");
      return {
        ...prev,
        videoUrl: url,
        ...(youtubeId && shouldAutoThumb
          ? { thumbnail: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` }
          : {}),
      };
    });
  }

  async function saveDraft(nextStatus?: VideoStatus) {
    if (!draft) return;
    if (!draft.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!draft.videoUrl.trim()) {
      setError("Add a video URL or upload a video file");
      return;
    }

    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      const payload: ExclusiveVideoItem = {
        ...draft,
        title: draft.title.trim(),
        description: draft.description.trim(),
        videoUrl: draft.videoUrl.trim(),
        thumbnail: draft.thumbnail.trim() || "/images/dameexclusive.png",
        duration: draft.duration.trim(),
        status: nextStatus ?? draft.status,
        publishedAt: nextStatus === "published" ? new Date().toISOString() : draft.publishedAt,
        date:
          nextStatus === "published"
            ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : draft.date,
        source: "manual",
      };
      const nextFeed = await upsertVideoItem(payload);
      setFeed(nextFeed);
      setDraft(payload);
      setSelectedId(payload.id);
      setStatus(
        payload.status === "published"
          ? "Published — live in DameTime Exclusive Videos"
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
    if (!window.confirm(`Delete “${draft.title || "this video"}”?`)) return;
    setSaving(true);
    setError(null);
    try {
      const nextFeed = await deleteVideoItem(draft.id);
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
      const next = await publishVideoFeed({
        ...feed,
        version: (feed.version || 1) + 1,
        updatedAt: new Date().toISOString(),
      });
      setFeed(next);
      setStatus("Full video feed republished to app");
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

  function onUploadVideo(file: File | null) {
    if (!file || !draft) return;
    if (file.size > MAX_VIDEO_UPLOAD_BYTES) {
      setError(
        `Video file is too large (${Math.round(file.size / (1024 * 1024))}MB). Use a YouTube/mp4 URL for big files, or upload a clip under ~12MB.`,
      );
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        patchDraft({ videoUrl: reader.result });
        setStatus("Video file attached — publish when ready");
      }
    };
    reader.readAsDataURL(file);
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-white/60">
        <Loader2 className="mr-2 animate-spin" size={18} /> Loading videos…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Exclusive videos" value={String(stats.total)} />
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
        <Panel title="Exclusive library">
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={startNew}
              className="inline-flex items-center gap-1 rounded-md bg-dt-red px-3 py-2 text-xs font-semibold text-white"
            >
              <Plus size={13} /> New video
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
                No exclusive videos yet. Upload one for the app.
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
                      src={resolveVideoAssetUrl(item.thumbnail)}
                      alt=""
                      className="h-14 w-20 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{item.title || "Untitled"}</p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-dt-muted">
                        <Film size={11} />
                        Exclusive · {item.status}
                      </p>
                      <p className="text-[10px] text-dt-muted">{item.date}</p>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </Panel>

        <Panel title={draft ? "Compose video" : "Editor"}>
          {!draft ? (
            <p className="text-sm text-dt-muted">Select a video or create a new exclusive upload.</p>
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
                  placeholder="EXCLUSIVE WORKOUT SESSION"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs text-dt-muted">Description</span>
                <textarea
                  value={draft.description}
                  onChange={(e) => patchDraft({ description: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none focus:border-dt-red/50"
                  placeholder="What fans will see under the title"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs text-dt-muted">Duration label</span>
                  <input
                    value={draft.duration}
                    onChange={(e) => patchDraft({ duration: e.target.value })}
                    className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none focus:border-dt-red/50"
                    placeholder="8:24"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs text-dt-muted">Status</span>
                  <select
                    value={draft.status}
                    onChange={(e) => patchDraft({ status: e.target.value as VideoStatus })}
                    className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>
              </div>

              <div className="space-y-2 rounded-lg border border-dt-border bg-dt-bg/40 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-dt-muted">Video</p>
                <label className="block space-y-1.5">
                  <span className="text-xs text-dt-muted">YouTube / mp4 URL</span>
                  <input
                    value={draft.videoUrl.startsWith("data:") ? "(uploaded video file)" : draft.videoUrl}
                    onChange={(e) => {
                      if (!e.target.value.startsWith("(")) applyVideoUrl(e.target.value);
                    }}
                    className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none focus:border-dt-red/50"
                    placeholder="https://youtube.com/watch?v=… or https://….mp4"
                  />
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-dt-border px-3 py-2 text-xs text-white/80 hover:border-dt-red/40">
                  <Video size={13} />
                  Upload video file
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => onUploadVideo(e.target.files?.[0] ?? null)}
                  />
                </label>
                <p className="text-[11px] leading-relaxed text-dt-muted">
                  Best for YouTube links or hosted mp4 URLs. Direct uploads work for short clips (~12MB max).
                </p>
              </div>

              <div className="space-y-2 rounded-lg border border-dt-border bg-dt-bg/40 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-dt-muted">Thumbnail</p>
                <img
                  src={resolveVideoAssetUrl(draft.thumbnail)}
                  alt=""
                  className="h-36 w-full rounded-md object-cover"
                />
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
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
