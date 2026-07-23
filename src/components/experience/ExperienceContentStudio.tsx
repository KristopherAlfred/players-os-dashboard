import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Film,
  Loader2,
  Newspaper,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import {
  createEmptyNewsItem,
  deleteNewsItem,
  fetchNewsFeed,
  resolveNewsAssetUrl,
  upsertNewsItem,
  type NewsFeed,
  type NewsItem,
  type NewsStatus,
} from "../../lib/newsApi";
import {
  createEmptyVideoItem,
  deleteVideoItem,
  fetchVideoFeed,
  resolveVideoAssetUrl,
  upsertVideoItem,
  type ExclusiveVideoFeed,
  type ExclusiveVideoItem,
  type VideoStatus,
} from "../../lib/videosApi";
import { DtSelect } from "../DtSelect";

export type ExperienceContentKind = "videos" | "news";

const PHONE_TABS = ["HOME", "SOCIAL", "VIDEOS", "NEWS", "PROFILE"] as const;

function PhoneChrome({
  title,
  activeTab,
  children,
}: {
  title: string;
  activeTab: "VIDEOS" | "NEWS";
  children: ReactNode;
}) {
  return (
    <div className="sticky top-4 self-start">
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
        Live phone · {title}
      </p>
      <div className="relative mx-auto w-full max-w-[300px] overflow-hidden rounded-[2.35rem] border border-white/15 bg-black shadow-[0_0_48px_rgba(143,227,184,0.12)]">
        <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-5 w-28 -translate-x-1/2 rounded-full bg-black/90" />
        <div className="border-b border-white/10 bg-[#0d0d0d] px-4 pb-2.5 pt-8 text-center">
          <p className="text-[10px] font-semibold tracking-[0.22em] text-white">SLOANE GLO</p>
          <p className="mt-0.5 text-[9px] text-[#8FE3B8]">{title}</p>
        </div>
        <div className="h-[420px] overflow-y-auto bg-[#050505] px-2.5 py-2">{children}</div>
        <div className="border-t border-white/10 bg-[#0a0a0a] px-1 pb-3 pt-2">
          <div className="grid grid-cols-5">
            {PHONE_TABS.map((tab) => (
              <div key={tab} className="flex flex-col items-center gap-0.5 py-1">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${tab === activeTab ? "bg-dt-red" : "bg-white/25"}`}
                />
                <span
                  className={`font-display text-[7px] tracking-[0.1em] ${
                    tab === activeTab ? "text-dt-red" : "text-white/45"
                  }`}
                >
                  {tab}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function fieldClass() {
  return "w-full rounded-xl border border-dt-border bg-black/50 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-dt-red/55";
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not read file"));
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

/** Shrink image uploads so Vercel/API body limits don't kill newsletter saves. */
async function compressImageFile(file: File, maxEdge = 1280, quality = 0.72): Promise<string> {
  if (!file.type.startsWith("image/")) return readFileAsDataUrl(file);
  const dataUrl = await readFileAsDataUrl(file);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      try {
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => reject(new Error("Could not process image"));
    img.src = dataUrl;
  });
}

function NewsPhonePreview({ items, selectedId }: { items: NewsItem[]; selectedId: string | null }) {
  const published = items.filter((i) => i.status === "published");
  const list = published.length ? published : items.slice(0, 6);
  return (
    <PhoneChrome title="News" activeTab="NEWS">
      <div className="mb-2 rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-black/60 px-3 py-3">
        <p className="font-display text-sm font-extrabold tracking-wide text-white">Latest News</p>
        <p className="mt-0.5 text-[10px] text-white/45">Newsletters & insights</p>
      </div>
      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 px-3 py-8 text-center text-[11px] text-white/35">
          No newsletters yet — create one on the right
        </div>
      ) : (
        <div className="space-y-1.5">
          {list.map((item) => (
            <div
              key={item.id}
              className={`flex gap-2 rounded-xl border p-2 ${
                item.id === selectedId ? "border-dt-red/60 bg-dt-red/10" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md bg-black/50">
                {item.thumbnail ? (
                  <img src={resolveNewsAssetUrl(item.thumbnail)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[8px] text-white/25">Art</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold text-white">{item.title || "Untitled"}</p>
                <p className="mt-0.5 line-clamp-2 text-[9px] text-white/45">
                  {item.description || item.body || "No preview yet"}
                </p>
                <p className="mt-0.5 text-[8px] uppercase tracking-wide text-white/30">
                  {item.status}
                  {item.date ? ` · ${item.date}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </PhoneChrome>
  );
}

function VideosPhonePreview({
  items,
  selectedId,
}: {
  items: ExclusiveVideoItem[];
  selectedId: string | null;
}) {
  const published = items.filter((i) => i.status === "published");
  const list = published.length ? published : items.slice(0, 6);
  return (
    <PhoneChrome title="Videos" activeTab="VIDEOS">
      <div className="mb-2 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-black/40 p-1">
        <div className="rounded-lg px-2 py-1.5 text-center text-[9px] font-bold tracking-wide text-white/40">
          YOUTUBE
        </div>
        <div className="rounded-lg bg-dt-red px-2 py-1.5 text-center text-[9px] font-bold tracking-wide text-white">
          EXCLUSIVE
        </div>
      </div>
      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 px-3 py-8 text-center text-[11px] text-white/35">
          No exclusive videos yet — upload on the right
        </div>
      ) : (
        <div className="space-y-1.5">
          {list.map((item) => (
            <div
              key={item.id}
              className={`flex gap-2 rounded-xl border p-2 ${
                item.id === selectedId ? "border-dt-red/60 bg-dt-red/10" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md bg-black/50">
                {item.thumbnail ? (
                  <img src={resolveVideoAssetUrl(item.thumbnail)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[8px] text-white/25">Thumb</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold text-white">{item.title || "Untitled"}</p>
                <p className="mt-0.5 text-[9px] text-white/45">Exclusive · {item.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </PhoneChrome>
  );
}

function NewsStudio({ onBack }: { onBack: () => void }) {
  const [feed, setFeed] = useState<NewsFeed | null>(null);
  const [draft, setDraft] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    void fetchNewsFeed()
      .then((next) => {
        setFeed(next);
        if (next.items[0]) setDraft({ ...next.items[0] });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load news"))
      .finally(() => setLoading(false));
  }, []);

  const items = feed?.items ?? [];

  function patchDraft(patch: Partial<NewsItem>) {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function startNew() {
    const item = createEmptyNewsItem("newsletters");
    setDraft(item);
    setStatus("New newsletter draft — write it, then Publish");
    setError(null);
  }

  async function saveDraft(nextStatus?: NewsStatus) {
    if (!draft) return;
    const title = draft.title.trim() || "Untitled newsletter";
    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      const payload: NewsItem = {
        ...draft,
        title,
        description: draft.description.trim(),
        body: draft.body.trim(),
        href: draft.href.trim(),
        thumbnail: draft.thumbnail || "",
        status: nextStatus ?? draft.status,
        publishedAt: nextStatus === "published" ? new Date().toISOString() : draft.publishedAt,
        date:
          nextStatus === "published"
            ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : draft.date,
      };
      const nextFeed = await upsertNewsItem(payload);
      setFeed(nextFeed);
      setDraft(payload);
      setStatus(payload.status === "published" ? "Published — live in the app News tab" : "Draft saved");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed";
      setError(
        /413|too large|payload|entity too large/i.test(message)
          ? "Image is too large for upload. Try a smaller JPG/PNG (under ~2MB)."
          : message,
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeItem() {
    if (!draft) return;
    if (!window.confirm(`Delete “${draft.title || "this newsletter"}”?`)) return;
    setSaving(true);
    try {
      const nextFeed = await deleteNewsItem(draft.id);
      setFeed(nextFeed);
      setDraft(nextFeed.items[0] ? { ...nextFeed.items[0] } : null);
      setStatus("Deleted");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  async function onUpload(file: File | null) {
    if (!file || !draft) return;
    try {
      if (file.size > 8 * 1024 * 1024) {
        setError("Image is too large. Use a file under 8MB.");
        return;
      }
      const thumbnail = await compressImageFile(file);
      patchDraft({ thumbnail });
      setStatus("Thumbnail attached — hit Save draft or Publish");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-white/60">
        <Loader2 className="mr-2 animate-spin" size={18} /> Loading news…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs text-white/80 hover:bg-white/[0.04]"
        >
          <ArrowLeft size={13} /> Back to Home boxes
        </button>
        <p className="text-sm text-white/55">
          Editing <span className="text-dt-red">News</span> — changes show on the phone, then publish live
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>
      ) : null}
      {status ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
          {status}
        </div>
      ) : null}

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="overflow-hidden rounded-2xl border border-dt-border bg-dt-card">
          <div className="flex items-center justify-between border-b border-dt-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Newspaper size={15} className="text-dt-red" />
              <h3 className="font-display text-sm font-semibold text-white">Newsletter editor</h3>
            </div>
            <button
              type="button"
              onClick={startNew}
              className="inline-flex items-center gap-1 rounded-lg bg-dt-red px-3 py-1.5 text-xs font-semibold text-white"
            >
              <Plus size={13} /> New newsletter
            </button>
          </div>

          <div className="grid gap-0 lg:grid-cols-[220px_minmax(0,1fr)]">
            <ul className="max-h-[70vh] space-y-1 overflow-y-auto border-b border-dt-border p-3 lg:border-b-0 lg:border-r">
              {items.length === 0 ? (
                <li className="px-2 py-6 text-center text-xs text-white/40">No stories yet</li>
              ) : (
                items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setDraft({ ...item });
                        setStatus(null);
                        setError(null);
                      }}
                      className={`w-full rounded-lg border px-2.5 py-2 text-left text-xs ${
                        draft?.id === item.id
                          ? "border-dt-red/50 bg-dt-red/10 text-white"
                          : "border-transparent text-white/65 hover:bg-white/[0.04]"
                      }`}
                    >
                      <p className="truncate font-medium">{item.title || "Untitled"}</p>
                      <p className="mt-0.5 text-[10px] text-white/35">{item.status}</p>
                    </button>
                  </li>
                ))
              )}
            </ul>

            <div className="space-y-3 p-4">
              {!draft ? (
                <p className="text-sm text-white/45">Create a newsletter to get started.</p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void saveDraft("draft")}
                      className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/80 disabled:opacity-50"
                    >
                      Save draft
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void saveDraft("published")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-dt-red px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      {saving ? <Loader2 size={13} className="animate-spin" /> : null}
                      Publish to app
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void removeItem()}
                      className="ml-auto inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-200"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>

                  <label className="block space-y-1">
                    <span className="text-[11px] text-white/45">Title</span>
                    <input
                      value={draft.title}
                      onChange={(e) => patchDraft({ title: e.target.value })}
                      className={fieldClass()}
                      placeholder="Sincerely, Sloane Episode #21"
                    />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-[11px] text-white/45">Status</span>
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

                  <label className="block space-y-1">
                    <span className="text-[11px] text-white/45">List preview</span>
                    <textarea
                      value={draft.description}
                      onChange={(e) => patchDraft({ description: e.target.value })}
                      rows={2}
                      className={fieldClass()}
                      placeholder="One or two lines fans see in the News list"
                    />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-[11px] text-white/45">Newsletter body</span>
                    <textarea
                      value={draft.body}
                      onChange={(e) => patchDraft({ body: e.target.value })}
                      rows={10}
                      className={`${fieldClass()} font-mono text-[13px] leading-relaxed`}
                      placeholder="Full newsletter text fans read in the app"
                    />
                  </label>

                  <div className="rounded-xl border border-white/10 p-3">
                    <p className="mb-2 text-[11px] text-white/45">Thumbnail</p>
                    <div className="mb-2 h-28 overflow-hidden rounded-lg bg-black/40">
                      {draft.thumbnail ? (
                        <img
                          src={resolveNewsAssetUrl(draft.thumbnail)}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-white/30">
                          No image yet
                        </div>
                      )}
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs text-white/80">
                      <Upload size={13} /> Upload image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => void onUpload(e.target.files?.[0] ?? null)}
                      />
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <NewsPhonePreview items={items} selectedId={draft?.id ?? null} />
      </div>
    </div>
  );
}

function VideosStudio({ onBack }: { onBack: () => void }) {
  const [feed, setFeed] = useState<ExclusiveVideoFeed | null>(null);
  const [draft, setDraft] = useState<ExclusiveVideoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    void fetchVideoFeed()
      .then((next) => {
        setFeed(next);
        if (next.items[0]) setDraft({ ...next.items[0] });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load videos"))
      .finally(() => setLoading(false));
  }, []);

  const items = useMemo(() => feed?.items ?? [], [feed]);

  function patchDraft(patch: Partial<ExclusiveVideoItem>) {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function startNew() {
    const item = createEmptyVideoItem();
    setDraft(item);
    setStatus("New exclusive video — add a URL or upload, then Publish");
    setError(null);
  }

  async function saveDraft(nextStatus?: VideoStatus) {
    if (!draft) return;
    if (!draft.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!draft.videoUrl.trim()) {
      setError("Add a video URL (YouTube/mp4) or upload a small clip");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload: ExclusiveVideoItem = {
        ...draft,
        title: draft.title.trim(),
        description: draft.description.trim(),
        videoUrl: draft.videoUrl.trim(),
        thumbnail: draft.thumbnail.trim(),
        status: nextStatus ?? draft.status,
        publishedAt: nextStatus === "published" ? new Date().toISOString() : draft.publishedAt,
        date:
          nextStatus === "published"
            ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : draft.date,
      };
      const nextFeed = await upsertVideoItem(payload);
      setFeed(nextFeed);
      setDraft(payload);
      setStatus(payload.status === "published" ? "Published — live in the app Videos tab" : "Draft saved");
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
    try {
      const nextFeed = await deleteVideoItem(draft.id);
      setFeed(nextFeed);
      setDraft(nextFeed.items[0] ? { ...nextFeed.items[0] } : null);
      setStatus("Deleted");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  async function onThumbUpload(file: File | null) {
    if (!file || !draft) return;
    try {
      const thumbnail = await compressImageFile(file);
      patchDraft({ thumbnail });
      setStatus("Thumbnail attached");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-white/60">
        <Loader2 className="mr-2 animate-spin" size={18} /> Loading videos…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs text-white/80 hover:bg-white/[0.04]"
        >
          <ArrowLeft size={13} /> Back to Home boxes
        </button>
        <p className="text-sm text-white/55">
          Editing <span className="text-dt-red">Exclusive Videos</span> — phone shows the app Videos tab
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>
      ) : null}
      {status ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
          {status}
        </div>
      ) : null}

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="overflow-hidden rounded-2xl border border-dt-border bg-dt-card">
          <div className="flex items-center justify-between border-b border-dt-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Film size={15} className="text-dt-red" />
              <h3 className="font-display text-sm font-semibold text-white">Exclusive video editor</h3>
            </div>
            <button
              type="button"
              onClick={startNew}
              className="inline-flex items-center gap-1 rounded-lg bg-dt-red px-3 py-1.5 text-xs font-semibold text-white"
            >
              <Plus size={13} /> New video
            </button>
          </div>

          <div className="grid gap-0 lg:grid-cols-[220px_minmax(0,1fr)]">
            <ul className="max-h-[70vh] space-y-1 overflow-y-auto border-b border-dt-border p-3 lg:border-b-0 lg:border-r">
              {items.length === 0 ? (
                <li className="px-2 py-6 text-center text-xs text-white/40">No videos yet</li>
              ) : (
                items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setDraft({ ...item });
                        setStatus(null);
                        setError(null);
                      }}
                      className={`w-full rounded-lg border px-2.5 py-2 text-left text-xs ${
                        draft?.id === item.id
                          ? "border-dt-red/50 bg-dt-red/10 text-white"
                          : "border-transparent text-white/65 hover:bg-white/[0.04]"
                      }`}
                    >
                      <p className="truncate font-medium">{item.title || "Untitled"}</p>
                      <p className="mt-0.5 text-[10px] text-white/35">{item.status}</p>
                    </button>
                  </li>
                ))
              )}
            </ul>

            <div className="space-y-3 p-4">
              {!draft ? (
                <p className="text-sm text-white/45">Create a video to get started.</p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void saveDraft("draft")}
                      className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/80 disabled:opacity-50"
                    >
                      Save draft
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void saveDraft("published")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-dt-red px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      {saving ? <Loader2 size={13} className="animate-spin" /> : null}
                      Publish to app
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void removeItem()}
                      className="ml-auto inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-200"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>

                  <label className="block space-y-1">
                    <span className="text-[11px] text-white/45">Title</span>
                    <input
                      value={draft.title}
                      onChange={(e) => patchDraft({ title: e.target.value })}
                      className={fieldClass()}
                      placeholder="Behind the scenes"
                    />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-[11px] text-white/45">Video URL</span>
                    <input
                      value={draft.videoUrl.startsWith("data:") ? "(uploaded video file)" : draft.videoUrl}
                      onChange={(e) => {
                        if (!e.target.value.startsWith("(")) patchDraft({ videoUrl: e.target.value });
                      }}
                      className={fieldClass()}
                      placeholder="https://youtube.com/watch?v=… or mp4 URL"
                    />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-[11px] text-white/45">Description</span>
                    <textarea
                      value={draft.description}
                      onChange={(e) => patchDraft({ description: e.target.value })}
                      rows={3}
                      className={fieldClass()}
                    />
                  </label>

                  <div className="rounded-xl border border-white/10 p-3">
                    <p className="mb-2 text-[11px] text-white/45">Thumbnail</p>
                    <div className="mb-2 h-28 overflow-hidden rounded-lg bg-black/40">
                      {draft.thumbnail ? (
                        <img
                          src={resolveVideoAssetUrl(draft.thumbnail)}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-white/30">
                          No thumbnail
                        </div>
                      )}
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs text-white/80">
                      <Upload size={13} /> Upload thumbnail
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => void onThumbUpload(e.target.files?.[0] ?? null)}
                      />
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <VideosPhonePreview items={items} selectedId={draft?.id ?? null} />
      </div>
    </div>
  );
}

export function ExperienceContentStudio({
  kind,
  onBack,
}: {
  kind: ExperienceContentKind;
  onBack: () => void;
}) {
  if (kind === "news") return <NewsStudio onBack={onBack} />;
  return <VideosStudio onBack={onBack} />;
}
