import { useState, type CSSProperties } from "react";
import {
  plainFromRuns,
  syncTextRuns,
  type ExperiencePageConfig,
  type ExperienceTextRun,
} from "../../lib/experienceConfig";
import { resolveTitleFontFamily, TITLE_FONT_OPTIONS, type TitleFontFamily } from "../../lib/typography";

const NAMED_COLORS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Mint", value: "#8FE3B8" },
  { name: "Bright mint", value: "#95E4CA" },
  { name: "Gold", value: "#D4AF37" },
  { name: "Red", value: "#ED0000" },
  { name: "Pink", value: "#FF6B9D" },
  { name: "Black", value: "#000000" },
  { name: "Soft gray", value: "#A3A3A3" },
] as const;

export function runsForPageField(
  page: ExperiencePageConfig,
  field: "headline" | "subhead" | "body",
): ExperienceTextRun[] {
  const plain = page[field] || "";
  const runs = field === "headline" ? page.headlineRuns : field === "subhead" ? page.subheadRuns : page.bodyRuns;
  if (runs?.length && plainFromRuns(runs) === plain) return runs;
  return syncTextRuns(plain, runs);
}

export function textRunCss(run: ExperienceTextRun, fallbackColor?: string): CSSProperties {
  const style: CSSProperties = {};
  if (run.color || fallbackColor) style.color = run.color || fallbackColor;
  if (run.fontFamily) style.fontFamily = resolveTitleFontFamily(run.fontFamily);
  if (run.fontSize) style.fontSize = `${run.fontSize}px`;
  return style;
}

export function StyledTextRuns({
  runs,
  fallbackColor,
  className,
  style,
  as: Tag = "p",
}: {
  runs: ExperienceTextRun[];
  fallbackColor?: string;
  className?: string;
  style?: CSSProperties;
  as?: "p" | "h1" | "h2" | "span" | "div";
}) {
  return (
    <Tag className={className} style={style}>
      {runs.map((run, i) =>
        run.text === "\n" ? (
          <br key={`br-${i}`} />
        ) : (
          <span key={`${run.text}-${i}`} style={textRunCss(run, fallbackColor)}>
            {run.text}
          </span>
        ),
      )}
    </Tag>
  );
}

type WordStyleEditorProps = {
  label: string;
  plain: string;
  runs: ExperienceTextRun[];
  onChangePlain: (plain: string) => void;
  onChangeRuns: (runs: ExperienceTextRun[]) => void;
  hint?: string;
};

export function WordStyleEditor({
  label,
  plain,
  runs,
  onChangePlain,
  onChangeRuns,
  hint,
}: WordStyleEditorProps) {
  const liveRuns =
    runs?.length && plainFromRuns(runs) === plain ? runs : syncTextRuns(plain, runs);
  const editable = liveRuns
    .map((run, index) => ({ run, index }))
    .filter(({ run }) => run.text.trim().length > 0);

  const [selectedChip, setSelectedChip] = useState(0);
  const safeChip = Math.min(selectedChip, Math.max(0, editable.length - 1));
  const selectedIdx = editable[safeChip]?.index ?? -1;
  const selectedRun = selectedIdx >= 0 ? liveRuns[selectedIdx] : null;

  function patchSelected(patch: Partial<ExperienceTextRun>) {
    if (selectedIdx < 0) return;
    onChangeRuns(liveRuns.map((run, i) => (i === selectedIdx ? { ...run, ...patch } : run)));
  }

  function updatePlain(nextPlain: string) {
    onChangePlain(nextPlain);
    onChangeRuns(syncTextRuns(nextPlain, liveRuns));
  }

  return (
    <div className="space-y-2 rounded-xl border border-white/10 bg-black/30 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/55">{label}</p>
      {hint ? <p className="text-[10px] text-white/40">{hint}</p> : null}
      <textarea
        value={plain}
        onChange={(e) => updatePlain(e.target.value)}
        rows={2}
        className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none"
      />
      {editable.length ? (
        <>
          <p className="text-[10px] text-white/45">Tap a word to style it (color, font, size)</p>
          <div className="flex flex-wrap gap-1.5">
            {editable.map(({ run, index }, chip) => {
              const active = index === selectedIdx;
              return (
                <button
                  key={`${run.text}-${index}`}
                  type="button"
                  onClick={() => setSelectedChip(chip)}
                  className={`rounded-lg border px-2.5 py-1 text-xs transition ${
                    active ? "border-white/50 bg-white/15 text-white" : "border-white/10 bg-white/[0.04] text-white/70"
                  }`}
                  style={textRunCss(run)}
                >
                  {run.text}
                </button>
              );
            })}
          </div>
          {selectedRun ? (
            <div className="grid gap-2 sm:grid-cols-3">
              <label className="block space-y-1">
                <span className="text-[10px] text-white/40">Word color</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={(selectedRun.color || "#FFFFFF").slice(0, 7)}
                    onChange={(e) => patchSelected({ color: e.target.value.toUpperCase() })}
                    className="h-9 w-10 cursor-pointer rounded border border-white/15 bg-transparent"
                  />
                  <select
                    value={
                      NAMED_COLORS.find((c) => c.value.toUpperCase() === (selectedRun.color || "").toUpperCase())
                        ?.value || "__custom__"
                    }
                    onChange={(e) => {
                      if (e.target.value === "__custom__") return;
                      patchSelected({ color: e.target.value });
                    }}
                    className="w-full rounded-md border border-dt-border bg-dt-bg px-2 py-1.5 text-xs"
                  >
                    {NAMED_COLORS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.name}
                      </option>
                    ))}
                    <option value="__custom__">Custom</option>
                  </select>
                </div>
              </label>
              <label className="block space-y-1">
                <span className="text-[10px] text-white/40">Font</span>
                <select
                  value={selectedRun.fontFamily || "default"}
                  onChange={(e) =>
                    patchSelected({
                      fontFamily: e.target.value === "default" ? undefined : (e.target.value as TitleFontFamily),
                    })
                  }
                  className="w-full rounded-md border border-dt-border bg-dt-bg px-2 py-1.5 text-xs"
                >
                  {TITLE_FONT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1">
                <span className="text-[10px] text-white/40">Size {selectedRun.fontSize || 18}px</span>
                <input
                  type="range"
                  min={10}
                  max={48}
                  value={selectedRun.fontSize || 18}
                  onChange={(e) => patchSelected({ fontSize: Number(e.target.value) })}
                  className="w-full"
                />
              </label>
            </div>
          ) : null}
        </>
      ) : (
        <p className="text-[10px] text-white/35">Type some words above, then tap each word to style it.</p>
      )}
    </div>
  );
}
