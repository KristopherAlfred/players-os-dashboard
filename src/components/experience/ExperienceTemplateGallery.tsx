import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import {
  EXPERIENCE_TEMPLATES,
  type ExperienceTemplate,
} from "../../lib/experienceTemplates";
import { TemplateMiniPreview } from "./TemplateMiniPreview";

const FILTERS = [
  "all",
  "dark",
  "light",
  "bold",
  "minimal",
  "nature",
  "sport",
  "neon",
  "urban",
  "tech",
  "vibrant",
  "pastel",
];

/**
 * "Choose a template. Make it yours." — every card is a live miniature of the
 * real landing page it applies (header, hero photo, headline, feature strip,
 * arrow CTA, members row). Tapping one loads the whole layout into the editor.
 */
export function ExperienceTemplateGallery({
  activeId,
  onApply,
}: {
  activeId: string | null;
  onApply: (template: ExperienceTemplate) => void;
}) {
  const [filter, setFilter] = useState("all");

  const templates = useMemo(() => {
    const full = EXPERIENCE_TEMPLATES.filter((t) => t.landing);
    const looks = EXPERIENCE_TEMPLATES.filter((t) => !t.landing);
    const ordered = [...full, ...looks];
    if (filter === "all") return ordered;
    return ordered.filter((t) => (t.tags ?? []).includes(filter));
  }, [filter]);

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h3 className="text-lg font-extrabold uppercase tracking-tight text-white sm:text-2xl">
          Choose a template.{" "}
          <span style={{ color: "rgb(var(--theme-accent-rgb))" }}>Make it yours.</span>
        </h3>
        <p className="mt-1 text-[11px] text-white/50">
          Fully customizable. Built to stand out. Tap a card to load its full layout — then edit
          every headline, color, icon and button.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {FILTERS.map((f) => {
          const on = f === filter;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] transition ${
                on
                  ? "border-transparent text-black"
                  : "border-white/15 text-white/60 hover:border-white/35 hover:text-white"
              }`}
              style={on ? { background: "rgb(var(--theme-accent-rgb))" } : undefined}
            >
              {f}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {templates.map((template) => {
          const active = template.id === activeId;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onApply(template)}
              className={`group relative overflow-hidden rounded-[18px] border text-left transition ${
                active
                  ? "border-[rgb(var(--theme-accent-rgb))] shadow-[0_0_0_1px_rgba(var(--theme-accent-rgb),0.45),0_14px_40px_rgba(0,0,0,0.55)]"
                  : "border-white/10 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_18px_45px_rgba(0,0,0,0.55)]"
              }`}
            >
              <div className="relative aspect-[9/16] w-full overflow-hidden">
                {template.landing ? (
                  <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
                    <TemplateMiniPreview template={template} />
                  </div>
                ) : (
                  <div
                    className="flex h-full w-full flex-col items-center justify-center gap-3 transition-transform duration-500 group-hover:scale-[1.04]"
                    style={{
                      background: `linear-gradient(160deg, ${template.swatches[0]}, ${template.swatches[1]})`,
                    }}
                  >
                    <span
                      className="rounded-full px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em]"
                      style={{
                        background: template.theme.buttonBg,
                        color: template.theme.buttonText,
                        borderRadius: template.theme.buttonRadius,
                      }}
                    >
                      Join
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.2em] text-white/40">
                      Colors only
                    </span>
                  </div>
                )}
                {active ? (
                  <span
                    className="absolute right-2 top-2 z-30 flex h-5 w-5 items-center justify-center rounded-full text-black"
                    style={{ background: "rgb(var(--theme-accent-rgb))" }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                ) : null}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center pb-2 opacity-0 transition group-hover:opacity-100">
                  <span className="rounded-full bg-black/75 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                    Use & edit
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 bg-black/55 px-2.5 py-2">
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                    {template.label}
                  </p>
                  <p className="truncate text-[8px] text-white/40">{template.vibe}</p>
                </div>
                <div className="flex shrink-0 gap-0.5">
                  {template.swatches.map((c) => (
                    <span
                      key={c}
                      className="h-2.5 w-2.5 rounded-full border border-white/20"
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
