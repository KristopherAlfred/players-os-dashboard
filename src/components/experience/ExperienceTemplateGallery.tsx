import { Check, Sparkles } from "lucide-react";
import {
  EXPERIENCE_TEMPLATES,
  type ExperienceTemplate,
} from "../../lib/experienceTemplates";

/**
 * Wix-style template gallery. Picking a template restyles the fan app
 * instantly in the live phone preview; copy and boxes are untouched.
 */
export function ExperienceTemplateGallery({
  activeId,
  onApply,
}: {
  activeId: string | null;
  onApply: (template: ExperienceTemplate) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-xl border border-dt-red/25 bg-dt-red/[0.07] p-3">
        <Sparkles size={14} className="mt-0.5 shrink-0 text-dt-red" />
        <p className="text-[11px] leading-relaxed text-white/65">
          Pick a starting look. Colors, buttons and effects update live in the preview — your text,
          logo and home boxes stay exactly as they are. Fine-tune anything after in Colors or Effects.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {EXPERIENCE_TEMPLATES.map((template) => {
          const active = template.id === activeId;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onApply(template)}
              className={`group overflow-hidden rounded-2xl border text-left transition ${
                active
                  ? "border-dt-red shadow-[0_0_0_1px_rgba(var(--theme-accent-rgb),0.35),0_10px_30px_rgba(0,0,0,0.5)]"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <div
                className="relative h-24 w-full"
                style={{
                  background: `linear-gradient(160deg, ${template.swatches[0]}, ${template.swatches[1]})`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em]"
                    style={{
                      background: template.theme.buttonBg,
                      color: template.theme.buttonText,
                      borderRadius: template.theme.buttonRadius,
                    }}
                  >
                    Join
                  </span>
                </div>
                {active ? (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-dt-red text-white">
                    <Check size={13} />
                  </span>
                ) : null}
              </div>
              <div className="space-y-2 bg-black/45 px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-white">{template.label}</p>
                  <div className="flex gap-1">
                    {template.swatches.map((c) => (
                      <span
                        key={c}
                        className="h-3 w-3 rounded-full border border-white/20"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-white/45">{template.vibe}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
