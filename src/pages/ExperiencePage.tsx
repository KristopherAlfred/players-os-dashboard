import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import {
  CalendarDays,
  Eye,
  EyeOff,
  Film,
  Gift,
  GripVertical,
  ImagePlus,
  Loader2,
  Music2,
  Newspaper,
  Plus,
  Sparkles,
  Ticket,
  Trash2,
  Undo2,
  Upload,
  LayoutTemplate,
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
import { titleTypographyStyle } from "../lib/typography";
import { TypographyControls } from "../components/TypographyControls";
import { DtSelect } from "../components/DtSelect";

const ADD_TYPES: { type: HomeWidgetType; label: string; hint: string; Icon: typeof Ticket }[] = [
  { type: "tickets", label: "DameTime Tickets", hint: "Ticket drops", Icon: Ticket },
  { type: "custom", label: "Custom box", hint: "Any link + art", Icon: LayoutTemplate },
  { type: "videos", label: "Videos", hint: "Exclusive clips", Icon: Film },
  { type: "news", label: "News", hint: "Newsletters", Icon: Newspaper },
  { type: "events", label: "Events", hint: "Giveaways", Icon: Gift },
  { type: "music", label: "Music", hint: "D.O.L.L.A", Icon: Music2 },
];

const typeMeta: Record<HomeWidgetType, { label: string; Icon: typeof Ticket }> = {
  tickets: { label: "Tickets", Icon: Ticket },
  custom: { label: "Custom", Icon: LayoutTemplate },
  videos: { label: "Videos", Icon: Film },
  news: { label: "News", Icon: Newspaper },
  events: { label: "Events", Icon: CalendarDays },
  music: { label: "Music", Icon: Music2 },
};

type TitleFilter =
  | "as_typed"
  | "uppercase"
  | "title_case"
  | "lowercase"
  | "stacked"
  | "single_line"
  | "dame_style";

const TITLE_FILTERS: { id: TitleFilter; label: string; hint: string }[] = [
  { id: "as_typed", label: "As typed", hint: "Keep your wording" },
  { id: "uppercase", label: "ALL CAPS", hint: "EXCLUSIVE VIDEOS" },
  { id: "title_case", label: "Title Case", hint: "Exclusive Videos" },
  { id: "lowercase", label: "lowercase", hint: "exclusive videos" },
  { id: "stacked", label: "Stacked words", hint: "One word per line" },
  { id: "single_line", label: "Single line", hint: "No line breaks" },
  { id: "dame_style", label: "Dame style", hint: "2–3 short caps lines" },
];

function titleLines(title: string) {
  return title.split("\n");
}

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function applyTitleFilter(title: string, filter: TitleFilter) {
  const flat = title.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
  if (!flat) return title;

  switch (filter) {
    case "as_typed":
      return title;
    case "uppercase":
      return flat.toUpperCase();
    case "title_case":
      return toTitleCase(flat);
    case "lowercase":
      return flat.toLowerCase();
    case "stacked":
      return flat
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word.toUpperCase())
        .join("\n");
    case "single_line":
      return flat.toUpperCase();
    case "dame_style": {
      const words = flat.toUpperCase().split(/\s+/).filter(Boolean);
      if (words.length <= 2) return words.join("\n");
      if (words.length === 3) return `${words[0]}\n${words[1]}\n${words[2]}`;
      const mid = Math.ceil(words.length / 2);
      return `${words.slice(0, mid).join(" ")}\n${words.slice(mid).join(" ")}`;
    }
    default:
      return title;
  }
}

function fieldClass() {
  return "w-full rounded-xl border border-dt-border bg-black/50 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-dt-red/55 focus:ring-1 focus:ring-dt-red/25";
}

function PreviewCard({ widget, selected }: { widget: HomeWidget; selected: boolean }) {
  const lines = titleLines(widget.title);
  const fit = widget.imageFit || "half";
  const titleStyle = titleTypographyStyle(widget);
  return (
    <div
      className={`relative flex h-full min-h-[112px] overflow-hidden rounded-2xl border transition ${
        selected
          ? "border-dt-red shadow-[0_0_0_1px_rgba(229,9,20,0.45),0_8px_24px_rgba(229,9,20,0.18)]"
          : "border-white/10 hover:border-white/25"
      } bg-gradient-to-br from-white/[0.06] to-black/80`}
    >
      {fit === "full" ? (
        <>
          <img
            src={resolveAssetUrl(widget.imageSrc)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/50 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-between p-3">
            <p
              className="font-display text-[12px] font-extrabold uppercase leading-[1.05] tracking-[0.06em] text-white"
              style={titleStyle}
            >
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
          <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
            <p
              className="font-display text-[12px] font-extrabold uppercase leading-[1.05] tracking-[0.06em] text-white"
              style={titleStyle}
            >
              {lines.map((line, i) => (
                <span key={`${widget.id}-t-${i}`}>
                  {line}
                  {i < lines.length - 1 ? <br /> : null}
                </span>
              ))}
            </p>
          </div>
          <div className="relative h-full w-[52%] shrink-0">
            <img
              src={resolveAssetUrl(widget.imageSrc)}
              alt=""
              className="h-full w-full object-contain object-bottom object-right drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]"
            />
          </div>
        </div>
      )}
      {!widget.enabled ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/65 backdrop-blur-[1px]">
          <span className="rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/80">
            Hidden
          </span>
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
  const [aiPrompt, setAiPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [titleFilter, setTitleFilter] = useState<TitleFilter>("as_typed");
  const [history, setHistory] = useState<HomeLayout[]>([]);
  const skippingHistory = useRef(false);

  useEffect(() => {
    void fetchHomeLayout()
      .then((next) => {
        setLayout(next);
        setSelectedId(next.widgets[0]?.id ?? null);
        setHistory([]);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load layout"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setTitleFilter("as_typed");
  }, [selectedId]);

  const selected = useMemo(
    () => layout?.widgets.find((w) => w.id === selectedId) ?? null,
    [layout, selectedId],
  );

  const ordered = useMemo(
    () => (layout ? [...layout.widgets].sort((a, b) => a.order - b.order) : []),
    [layout],
  );

  const visibleCount = ordered.filter((w) => w.enabled).length;
  const canUndo = history.length > 0;

  function updateWidgets(updater: (widgets: HomeWidget[]) => HomeWidget[]) {
    if (!layout) return;
    if (!skippingHistory.current) {
      setHistory((prev) => [...prev.slice(-29), structuredClone(layout)]);
    }
    skippingHistory.current = false;
    setDirty(true);
    const widgets = updater([...layout.widgets]).map((w, index) => ({ ...w, order: index }));
    setLayout({ ...layout, widgets });
  }

  function undoChange() {
    setHistory((prev) => {
      if (!prev.length) return prev;
      const nextHistory = [...prev];
      const snapshot = nextHistory.pop()!;
      skippingHistory.current = true;
      setLayout(snapshot);
      setDirty(true);
      setStatus("Reverted last change");
      if (selectedId && !snapshot.widgets.some((w) => w.id === selectedId)) {
        setSelectedId(snapshot.widgets[0]?.id ?? null);
      }
      return nextHistory;
    });
  }

  function patchSelected(patch: Partial<HomeWidget>) {
    if (!selectedId) return;
    updateWidgets((widgets) => widgets.map((w) => (w.id === selectedId ? { ...w, ...patch } : w)));
  }

  function applyFilter(filter: TitleFilter) {
    setTitleFilter(filter);
    if (!selected || filter === "as_typed") return;
    const nextTitle = applyTitleFilter(selected.title, filter);
    if (nextTitle !== selected.title) {
      patchSelected({ title: nextTitle });
      setStatus(`Applied “${TITLE_FILTERS.find((item) => item.id === filter)?.label}” to title`);
    }
  }

  function onDragStart(id: string) {
    setDragId(id);
  }

  function onDragOver(e: DragEvent, targetId: string) {
    e.preventDefault();
    if (dragId && dragId !== targetId) setDropTargetId(targetId);
  }

  function onDrop(targetId: string) {
    if (!dragId || dragId === targetId) {
      setDragId(null);
      setDropTargetId(null);
      return;
    }
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
    setDropTargetId(null);
    setStatus("Order updated — publish when ready");
  }

  function addWidget(type: HomeWidgetType) {
    updateWidgets((widgets) => {
      const next = createWidget(type, widgets.length);
      setSelectedId(next.id);
      return [...widgets, next];
    });
    setStatus(`Added ${typeMeta[type].label} box`);
  }

  function removeSelected() {
    if (!selectedId) return;
    updateWidgets((widgets) => widgets.filter((w) => w.id !== selectedId));
    setSelectedId(null);
    setStatus("Box removed");
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
      setDirty(false);
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
      setStatus(
        result.source === "openai"
          ? `AI image applied${result.model ? ` (${result.model})` : ""}`
          : "Image applied",
      );
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

  const SelectedIcon = selected ? typeMeta[selected.type].Icon : LayoutTemplate;

  return (
    <div className="space-y-5">
      <style>{`
        @keyframes exp-phone-glow {
          0%, 100% { box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.55); }
          50% { box-shadow: 0 0 0 1px rgba(229,9,20,0.25), 0 28px 70px rgba(229,9,20,0.12); }
        }
        .exp-phone-shell { animation: exp-phone-glow 4.5s ease-in-out infinite; }
        @keyframes exp-spark {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        .exp-ai-spark { animation: exp-spark 2.2s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <div className="overflow-hidden rounded-2xl border border-dt-border bg-dt-card">
        <div className="relative border-b border-dt-border bg-gradient-to-br from-black via-[#0c0c0c] to-[#1a0505] px-5 py-5 sm:px-7 sm:py-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(229,9,20,0.22),transparent_52%)]" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-dt-red/30 bg-dt-red/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-dt-red">
                <Sparkles size={12} />
                Experience builder
              </div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Design the DameTime home experience
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                Drag tiles, swap art, drop in Tickets or custom boxes, generate AI cutouts, then publish straight to the fan app.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-[96px] rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Boxes</p>
                <p className="mt-1 text-lg font-bold text-white">{ordered.length}</p>
              </div>
              <div className="min-w-[96px] rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Visible</p>
                <p className="mt-1 text-lg font-bold text-white">{visibleCount}</p>
              </div>
              <div className="min-w-[96px] rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Status</p>
                <p className={`mt-1 text-lg font-bold ${dirty ? "text-dt-orange" : "text-dt-green"}`}>
                  {dirty ? "Unsaved" : "Synced"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void onPublish()}
                disabled={saving}
                className="inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-dt-red px-5 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(229,9,20,0.35)] transition hover:brightness-110 disabled:opacity-60"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                Publish to app
              </button>
            </div>
          </div>
        </div>

        {(error || status) && (
          <div className="space-y-2 border-b border-dt-border px-5 py-3">
            {error ? (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>
            ) : null}
            {status ? (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                {status}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_minmax(400px,440px)]">
        {/* Left: Home boxes + AI studio */}
        <div className="flex min-w-0 flex-col gap-4">
        <section className="overflow-hidden rounded-2xl border border-dt-border bg-dt-card">
          <div className="flex items-center justify-between border-b border-dt-border px-4 py-3">
            <div>
              <h3 className="font-display text-sm font-semibold tracking-wide text-white">Home boxes</h3>
              <p className="text-[11px] text-white/40">Drag to reorder fan home</p>
            </div>
            <label className="flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[11px] text-white/70">
              <input
                type="checkbox"
                checked={layout.heroEnabled}
                onChange={(e) => {
                  setHistory((prev) => [...prev.slice(-29), structuredClone(layout)]);
                  setDirty(true);
                  setLayout({ ...layout, heroEnabled: e.target.checked });
                }}
                className="accent-dt-red"
              />
              Hero
            </label>
          </div>

          <ul className="space-y-2 p-3">
            {ordered.map((widget, index) => {
              const Meta = typeMeta[widget.type];
              const isSelected = selectedId === widget.id;
              const isDragging = dragId === widget.id;
              const isDrop = dropTargetId === widget.id && dragId !== widget.id;
              return (
                <li
                  key={widget.id}
                  draggable
                  onDragStart={() => onDragStart(widget.id)}
                  onDragOver={(e) => onDragOver(e, widget.id)}
                  onDragLeave={() => setDropTargetId((id) => (id === widget.id ? null : id))}
                  onDrop={() => onDrop(widget.id)}
                  onDragEnd={() => {
                    setDragId(null);
                    setDropTargetId(null);
                  }}
                  onClick={() => setSelectedId(widget.id)}
                  className={`group flex cursor-grab items-center gap-2.5 rounded-xl border px-2.5 py-2.5 transition active:cursor-grabbing ${
                    isSelected
                      ? "border-dt-red/70 bg-dt-red/15 shadow-[inset_0_0_0_1px_rgba(229,9,20,0.2)]"
                      : isDrop
                        ? "border-dt-red/50 bg-dt-red/10"
                        : "border-white/10 bg-black/25 hover:border-white/20 hover:bg-white/[0.04]"
                  } ${isDragging ? "opacity-45" : ""}`}
                >
                  <div className="flex h-9 w-6 shrink-0 items-center justify-center rounded-md text-white/35 group-hover:text-white/55">
                    <GripVertical size={16} />
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white/70">
                    <Meta.Icon size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {widget.title.replace(/\n/g, " / ")}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-white/40">
                      <span>{Meta.label}</span>
                      <span className="text-white/20">·</span>
                      <span>#{index + 1}</span>
                      {!widget.enabled ? (
                        <>
                          <span className="text-white/20">·</span>
                          <span className="text-dt-orange">Hidden</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-dt-border p-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
              Add fan experience
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ADD_TYPES.map(({ type, label, hint, Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addWidget(type)}
                  className="group flex items-start gap-2 rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent px-2.5 py-2.5 text-left transition hover:border-dt-red/40 hover:from-dt-red/10"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white/70 group-hover:border-dt-red/40 group-hover:text-dt-red">
                    <Icon size={14} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] font-semibold text-white">{label}</span>
                    <span className="block truncate text-[10px] text-white/40">{hint}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

          <section className="overflow-hidden rounded-2xl border border-dt-red/30 bg-dt-card shadow-[0_0_40px_rgba(229,9,20,0.06)]">
            <div className="flex items-center gap-2.5 border-b border-white/10 bg-gradient-to-r from-dt-red/15 to-transparent px-4 py-3.5">
              <span className="exp-ai-spark flex h-9 w-9 items-center justify-center rounded-xl bg-dt-red/20 text-dt-red">
                <Sparkles size={16} />
              </span>
              <div>
                <h3 className="font-display text-sm font-semibold tracking-wide text-white">AI image studio</h3>
                <p className="text-[11px] text-white/45">
                  Needs OPENAI_API_KEY on dame-bio — otherwise Generate shows an error
                </p>
              </div>
            </div>
            <div className="space-y-3 p-4">
              <div className="rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 text-[12px] leading-relaxed text-white/55">
                {selected
                  ? `Generating for “${selected.title.replace(/\n/g, " ")}”. Transparent backgrounds work best for home tiles.`
                  : "Select a home box first, then describe the art you want."}
              </div>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={3}
                className={fieldClass()}
                placeholder="Example: Damian Lillard red jersey cutout, transparent background, mobile app tile"
              />
              <button
                type="button"
                onClick={() => void onGenerate()}
                disabled={generating || !aiPrompt.trim() || !selectedId}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-dt-red px-3 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-55"
              >
                {generating ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
                {generating ? "Generating…" : "Generate for this box"}
              </button>
            </div>
          </section>
        </div>

        {/* Center: phone */}
        <section className="relative flex min-h-[640px] items-center justify-center overflow-hidden rounded-2xl border border-dt-border bg-[radial-gradient(ellipse_at_50%_0%,rgba(229,9,20,0.14),transparent_45%),linear-gradient(180deg,#121212_0%,#070707_55%,#050505_100%)] px-4 py-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-dt-red/10 to-transparent" />
          <div className="exp-phone-shell relative w-full max-w-[340px] overflow-hidden rounded-[2.35rem] border border-white/15 bg-black">
            <div className="absolute left-1/2 top-2 z-20 h-5 w-28 -translate-x-1/2 rounded-full bg-black/90" />
            <div className="border-b border-white/10 bg-[#0d0d0d] px-4 pb-3 pt-8 text-center">
              <p className="text-[10px] font-semibold tracking-[0.28em] text-white/55">DAMETIME HOME</p>
            </div>
            <div className="space-y-2 bg-[radial-gradient(circle_at_top,_#321018_0%,_#0a0a0a_52%)] p-3 pb-6">
              {layout.heroEnabled ? (
                <div className="relative flex h-[118px] overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src={resolveAssetUrl("/images/damecity.png")}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent" />
                  <div className="relative z-10 flex h-full flex-col justify-end p-3.5">
                    <p className="font-display text-lg font-extrabold tracking-[0.12em] text-white">
                      DAME <span className="text-dt-green">LIVE</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/60">Hero carousel stays live-aware</p>
                  </div>
                </div>
              ) : null}

              <div
                className="grid grid-cols-2 gap-2"
                style={{ minHeight: ordered.length > 4 ? 300 : 268 }}
              >
                {ordered.map((widget) => (
                  <button
                    key={widget.id}
                    type="button"
                    onClick={() => setSelectedId(widget.id)}
                    className="min-h-[128px] text-left"
                  >
                    <PreviewCard widget={widget} selected={selectedId === widget.id} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right: edit box (larger) */}
        <section className="flex min-h-[640px] flex-col overflow-hidden rounded-2xl border border-dt-border bg-dt-card">
            {!selected ? (
              <div className="flex min-h-[420px] flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/40">
                  <Plus size={22} />
                </div>
                <p className="text-sm text-white/55">Select a box to edit copy, art, and links.</p>
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex items-center justify-between gap-2 border-b border-dt-border px-4 py-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-dt-red/30 bg-dt-red/15 text-dt-red">
                      <SelectedIcon size={16} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-semibold tracking-wide text-white">Edit box</h3>
                      <p className="truncate text-[11px] uppercase tracking-[0.12em] text-white/40">
                        {typeMeta[selected.type].label}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={undoChange}
                      disabled={!canUndo}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1.5 text-xs text-white/80 transition hover:border-white/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-35"
                      title={canUndo ? "Undo last change" : "Nothing to undo"}
                    >
                      <Undo2 size={12} /> Undo
                    </button>
                    <button
                      type="button"
                      onClick={removeSelected}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs text-red-200 transition hover:bg-red-500/10"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>

                <div className="space-y-4 overflow-y-auto p-5">
                  <label className="block space-y-1.5">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-white/45">
                      Title <span className="normal-case tracking-normal text-white/30">(new lines OK)</span>
                    </span>
                    <textarea
                      value={selected.title}
                      onChange={(e) => {
                        setTitleFilter("as_typed");
                        patchSelected({ title: e.target.value });
                      }}
                      rows={5}
                      className={`${fieldClass()} min-h-[120px]`}
                      style={titleTypographyStyle(selected)}
                    />
                  </label>

                  <TypographyControls
                    fontFamily={selected.titleFontFamily || "default"}
                    fontSize={selected.titleFontSize || "md"}
                    onFontFamilyChange={(titleFontFamily) => patchSelected({ titleFontFamily })}
                    onFontSizeChange={(titleFontSize) => patchSelected({ titleFontSize })}
                  />

                  <label className="block space-y-1.5">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-white/45">
                      Title filter
                    </span>
                    <DtSelect
                      value={titleFilter}
                      aria-label="Title filter"
                      onChange={(value) => applyFilter(value as TitleFilter)}
                      options={TITLE_FILTERS.map((filter) => ({
                        value: filter.id,
                        label: `${filter.label} — ${filter.hint}`,
                      }))}
                    />
                    <p className="text-[11px] text-white/35">
                      Instantly restyle the title wording. Use Undo if you want the previous version back.
                    </p>
                  </label>

                  <label className="block space-y-1.5">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-white/45">
                      Link (path or URL)
                    </span>
                    <input
                      value={selected.linkTo}
                      onChange={(e) => patchSelected({ linkTo: e.target.value })}
                      className={fieldClass()}
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block space-y-1.5">
                      <span className="text-[11px] font-medium uppercase tracking-wide text-white/45">Image fit</span>
                      <DtSelect
                        value={selected.imageFit || "half"}
                        aria-label="Image fit"
                        onChange={(value) => patchSelected({ imageFit: value as "half" | "full" })}
                        options={[
                          { value: "half", label: "Half" },
                          { value: "full", label: "Full bleed" },
                        ]}
                      />
                    </label>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => patchSelected({ enabled: !selected.enabled })}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${
                          selected.enabled
                            ? "border-dt-green/35 bg-dt-green/10 text-dt-green"
                            : "border-white/15 bg-black/40 text-white/60"
                        }`}
                      >
                        {selected.enabled ? <Eye size={15} /> : <EyeOff size={15} />}
                        {selected.enabled ? "Visible" : "Hidden"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-3.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">Image</p>
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(135deg,#141414,#0a0a0a)]">
                      <img
                        src={resolveAssetUrl(selected.imageSrc)}
                        alt=""
                        className="mx-auto h-48 w-full object-contain"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/85 transition hover:bg-white/[0.08]">
                        <Upload size={14} />
                        Upload image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
                        />
                      </label>
                    </div>
                    <label className="block space-y-1.5">
                      <span className="text-[11px] text-white/40">Or image URL / path</span>
                      <input
                        value={selected.imageSrc.startsWith("data:") ? "(uploaded data URL)" : selected.imageSrc}
                        onChange={(e) => {
                          if (!e.target.value.startsWith("(")) patchSelected({ imageSrc: e.target.value });
                        }}
                        className={fieldClass()}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </section>
      </div>
    </div>
  );
}
