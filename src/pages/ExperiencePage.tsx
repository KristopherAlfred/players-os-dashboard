import { useEffect, useMemo, useState, type DragEvent } from "react";
import {
  GripVertical,
  ImagePlus,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import {
  createWidget,
  fetchHomeLayout,
  generateHomeImage,
  publishHomeLayout,
  resolveAssetUrl,
  type HomeLayout,
  type HomeWidget,
  type HomeWidgetType,
} from "../lib/homeLayoutApi";

const ADD_TYPES: { type: HomeWidgetType; label: string }[] = [
  { type: "tickets", label: "DameTime Tickets" },
  { type: "custom", label: "Custom box" },
  { type: "videos", label: "Videos" },
  { type: "news", label: "News" },
  { type: "events", label: "Events" },
  { type: "music", label: "Music" },
];

function titleLines(title: string) {
  return title.split("\n");
}

function PreviewCard({ widget }: { widget: HomeWidget }) {
  const lines = titleLines(widget.title);
  const fit = widget.imageFit || "half";
  return (
    <div className="relative flex h-full min-h-[88px] overflow-hidden rounded-xl border border-white/10 bg-black/60">
      {fit === "full" ? (
        <>
          <img
            src={resolveAssetUrl(widget.imageSrc)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-between p-2.5">
            <p className="text-[11px] font-black leading-tight text-white uppercase">
              {lines.map((line, i) => (
                <span key={`${widget.id}-t-${i}`}>
                  {line}
                  {i < lines.length - 1 ? <br /> : null}
                </span>
              ))}
            </p>
          </div>
        </>
      ) : (
        <div className="flex h-full w-full">
          <div className="flex min-w-0 flex-1 flex-col justify-between p-2.5">
            <p className="text-[11px] font-black leading-tight text-white uppercase">
              {lines.map((line, i) => (
                <span key={`${widget.id}-t-${i}`}>
                  {line}
                  {i < lines.length - 1 ? <br /> : null}
                </span>
              ))}
            </p>
          </div>
          <div className="relative h-full w-[48%] shrink-0">
            <img
              src={resolveAssetUrl(widget.imageSrc)}
              alt=""
              className="h-full w-full object-contain object-bottom object-right"
            />
          </div>
        </div>
      )}
      {!widget.enabled ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/55 text-[10px] font-semibold uppercase tracking-wide text-white/80">
          Hidden
        </div>
      ) : null}
    </div>
  );
}

export function ExperiencePage() {
  const [layout, setLayout] = useState<HomeLayout | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("Damian Lillard red jersey cutout transparent background");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    void fetchHomeLayout()
      .then((next) => {
        setLayout(next);
        setSelectedId(next.widgets[0]?.id ?? null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load layout"))
      .finally(() => setLoading(false));
  }, []);

  const selected = useMemo(
    () => layout?.widgets.find((w) => w.id === selectedId) ?? null,
    [layout, selectedId],
  );

  const ordered = useMemo(
    () => (layout ? [...layout.widgets].sort((a, b) => a.order - b.order) : []),
    [layout],
  );

  function updateWidgets(updater: (widgets: HomeWidget[]) => HomeWidget[]) {
    setLayout((prev) => {
      if (!prev) return prev;
      const widgets = updater([...prev.widgets]).map((w, index) => ({ ...w, order: index }));
      return { ...prev, widgets };
    });
  }

  function patchSelected(patch: Partial<HomeWidget>) {
    if (!selectedId) return;
    updateWidgets((widgets) => widgets.map((w) => (w.id === selectedId ? { ...w, ...patch } : w)));
  }

  function onDragStart(id: string) {
    setDragId(id);
  }

  function onDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    updateWidgets((widgets) => {
      const sorted = [...widgets].sort((a, b) => a.order - b.order);
      const from = sorted.findIndex((w) => w.id === dragId);
      const to = sorted.findIndex((w) => w.id === targetId);
      if (from < 0 || to < 0) return widgets;
      const [item] = sorted.splice(from, 1);
      sorted.splice(to, 0, item);
      return sorted;
    });
    setDragId(null);
  }

  function addWidget(type: HomeWidgetType) {
    updateWidgets((widgets) => {
      const next = createWidget(type, widgets.length);
      setSelectedId(next.id);
      return [...widgets, next];
    });
    setStatus(`Added ${type} box`);
  }

  function removeSelected() {
    if (!selectedId) return;
    updateWidgets((widgets) => widgets.filter((w) => w.id !== selectedId));
    setSelectedId(null);
  }

  async function onPublish() {
    if (!layout) return;
    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      const published = await publishHomeLayout({
        ...layout,
        version: (layout.version || 1) + 1,
        updatedAt: new Date().toISOString(),
        widgets: layout.widgets.map((w, index) => ({ ...w, order: index })),
      });
      setLayout(published);
      setStatus("Published to DameTime app home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setSaving(false);
    }
  }

  async function onGenerate() {
    if (!selectedId) return;
    setGenerating(true);
    setError(null);
    try {
      const result = await generateHomeImage(aiPrompt);
      patchSelected({ imageSrc: result.imageSrc });
      setStatus(result.source === "openai" ? "AI image applied" : "Placeholder art applied (set OPENAI_API_KEY for real gens)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generate failed");
    } finally {
      setGenerating(false);
    }
  }

  function onUpload(file: File | null) {
    if (!file || !selectedId) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        patchSelected({ imageSrc: reader.result });
        setStatus("Image uploaded to this box");
      }
    };
    reader.readAsDataURL(file);
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-white/70">
        <Loader2 className="mr-2 animate-spin" size={18} /> Loading experience…
      </div>
    );
  }

  if (!layout) {
    return <div className="p-6 text-red-300">{error || "No layout found"}</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-white/60">
          Drag home tiles, swap art, add Tickets or custom boxes, then publish to the DameTime app.
        </p>
        <button
          type="button"
          onClick={() => void onPublish()}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-dt-red px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : null}
          Publish to app
        </button>
      </div>

      {error ? <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div> : null}
      {status ? <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">{status}</div> : null}

      <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
        {/* Widget list */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/80">Home boxes</h2>
            <label className="flex items-center gap-2 text-xs text-white/55">
              <input
                type="checkbox"
                checked={layout.heroEnabled}
                onChange={(e) => setLayout({ ...layout, heroEnabled: e.target.checked })}
              />
              Hero carousel
            </label>
          </div>

          <ul className="space-y-2">
            {ordered.map((widget) => (
              <li
                key={widget.id}
                draggable
                onDragStart={() => onDragStart(widget.id)}
                onDragOver={(e: DragEvent) => e.preventDefault()}
                onDrop={() => onDrop(widget.id)}
                onClick={() => setSelectedId(widget.id)}
                className={`flex cursor-grab items-center gap-2 rounded-xl border px-2.5 py-2 transition active:cursor-grabbing ${
                  selectedId === widget.id
                    ? "border-dt-red/70 bg-dt-red/15"
                    : "border-white/10 bg-black/20 hover:border-white/25"
                }`}
              >
                <GripVertical size={16} className="shrink-0 text-white/35" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{widget.title.replace(/\n/g, " / ")}</p>
                  <p className="truncate text-[11px] uppercase tracking-wide text-white/40">{widget.type}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/45">Add box</p>
            <div className="flex flex-wrap gap-2">
              {ADD_TYPES.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => addWidget(item.type)}
                  className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/[0.04] px-2.5 py-1.5 text-xs text-white/80 hover:bg-white/[0.08]"
                >
                  <Plus size={12} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Phone preview */}
        <section className="flex justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a1a1a] to-[#0b0b0b] p-4 md:p-6">
          <div className="w-full max-w-[320px] overflow-hidden rounded-[2rem] border border-white/20 bg-black shadow-2xl shadow-black/50">
            <div className="bg-[#111] px-4 py-3 text-center text-[11px] font-semibold tracking-[0.2em] text-white/70">
              DAMETIME HOME
            </div>
            <div className="space-y-2 bg-[radial-gradient(circle_at_top,_#2a1518_0%,_#0a0a0a_55%)] p-3 pb-5">
              {layout.heroEnabled ? (
                <div className="flex h-28 items-end rounded-xl border border-white/10 bg-black/50 p-3">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.18em] text-white">
                      DAME <span className="text-emerald-400">LIVE</span>
                    </p>
                    <p className="mt-1 text-[11px] text-white/55">Hero carousel stays live-aware</p>
                  </div>
                </div>
              ) : null}
              <div className="grid grid-cols-2 gap-1.5" style={{ minHeight: 280 }}>
                {ordered.map((widget) => (
                  <button
                    key={widget.id}
                    type="button"
                    onClick={() => setSelectedId(widget.id)}
                    className={`min-h-[120px] text-left transition ${
                      selectedId === widget.id ? "ring-2 ring-dt-red" : "ring-0"
                    }`}
                  >
                    <PreviewCard widget={widget} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Inspector */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          {!selected ? (
            <p className="text-sm text-white/50">Select a box to edit.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-white/80">Edit box</h2>
                <button
                  type="button"
                  onClick={removeSelected}
                  className="inline-flex items-center gap-1 rounded-md border border-red-500/30 px-2 py-1 text-xs text-red-200 hover:bg-red-500/10"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs text-white/50">Title (use new lines)</span>
                <textarea
                  value={selected.title}
                  onChange={(e) => patchSelected({ title: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-dt-red/60"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs text-white/50">Link (path or URL)</span>
                <input
                  value={selected.linkTo}
                  onChange={(e) => patchSelected({ linkTo: e.target.value })}
                  className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-dt-red/60"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1.5">
                  <span className="text-xs text-white/50">Image fit</span>
                  <select
                    value={selected.imageFit || "half"}
                    onChange={(e) => patchSelected({ imageFit: e.target.value as "half" | "full" })}
                    className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="half">Half</option>
                    <option value="full">Full bleed</option>
                  </select>
                </label>
                <label className="flex items-end gap-2 pb-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={selected.enabled}
                    onChange={(e) => patchSelected({ enabled: e.target.checked })}
                  />
                  Visible
                </label>
              </div>

              <div className="space-y-2 rounded-xl border border-white/10 bg-black/25 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/45">Image</p>
                <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40">
                  <img
                    src={resolveAssetUrl(selected.imageSrc)}
                    alt=""
                    className="mx-auto h-36 w-full object-contain"
                  />
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-xs text-white/80 hover:bg-white/[0.08]">
                  <Upload size={14} />
                  Upload image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs text-white/50">Or image URL / path</span>
                  <input
                    value={selected.imageSrc.startsWith("data:") ? "(uploaded data URL)" : selected.imageSrc}
                    onChange={(e) => {
                      if (!e.target.value.startsWith("(")) patchSelected({ imageSrc: e.target.value });
                    }}
                    className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-dt-red/60"
                  />
                </label>
              </div>

              <div className="space-y-2 rounded-xl border border-white/10 bg-black/25 p-3">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/45">
                  <Sparkles size={12} /> AI art helper
                </p>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-dt-red/60"
                  placeholder="Transparent cutout of Dame for Tickets box…"
                />
                <button
                  type="button"
                  onClick={() => void onGenerate()}
                  disabled={generating}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dt-red/40 bg-dt-red/20 px-3 py-2 text-sm font-medium text-white hover:bg-dt-red/30 disabled:opacity-60"
                >
                  {generating ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                  Generate for this box
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
