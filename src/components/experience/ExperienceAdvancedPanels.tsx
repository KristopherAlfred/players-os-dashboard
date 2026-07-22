import type { ReactNode } from "react";
import { TITLE_FONT_OPTIONS, type TitleFontFamily } from "../../lib/typography";
import type {
  ExperienceBrand,
  ExperienceEffects,
  ExperiencePageConfig,
  ExperiencePages,
  ExperienceTheme,
  ExperienceEffectPreset,
} from "../../lib/experienceConfig";
import {
  GRADIENT_BACKGROUND_PRESETS,
  EXPERIENCE_HEROES,
  EXPERIENCE_LOGOS,
  type ExperienceAsset,
  type GradientBackgroundPreset,
} from "../../lib/experienceAssets";
import { resolveExperiencePreviewUrl } from "../../lib/resolveExperiencePreviewUrl";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-white/55">{label}</span>
      {children}
      {hint ? <span className="block text-[10px] text-white/35">{hint}</span> : null}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none focus:border-dt-red/50 ${className}`}
    />
  );
}

function ColorInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value?.startsWith("#") && value.length >= 7 ? value.slice(0, 7) : "#8FE3B8"}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-12 cursor-pointer rounded border border-dt-border bg-transparent"
      />
      <TextInput value={value} onChange={onChange} className="font-mono text-xs" />
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition ${
        checked ? "border-dt-red/50 bg-dt-red/10 text-white" : "border-dt-border bg-dt-bg/40 text-white/70"
      }`}
    >
      <span>{label}</span>
      <span className={`text-[10px] font-bold uppercase tracking-wide ${checked ? "text-dt-red" : "text-white/35"}`}>
        {checked ? "On" : "Off"}
      </span>
    </button>
  );
}

function FontSelect({
  value,
  onChange,
}: {
  value?: TitleFontFamily;
  onChange: (value: TitleFontFamily) => void;
}) {
  return (
    <select
      value={value || "default"}
      onChange={(e) => onChange(e.target.value as TitleFontFamily)}
      className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none"
    >
      {TITLE_FONT_OPTIONS.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function AssetPicker({
  label,
  assets,
  value,
  onSelect,
  allowClear = true,
  aspect = "square",
}: {
  label: string;
  assets: ExperienceAsset[];
  value: string;
  onSelect: (src: string) => void;
  allowClear?: boolean;
  aspect?: "square" | "wide";
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-white/55">{label}</p>
        {allowClear ? (
          <button
            type="button"
            onClick={() => onSelect("")}
            className="text-[10px] font-semibold uppercase tracking-wide text-white/40 hover:text-white"
          >
            Clear
          </button>
        ) : null}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {assets.map((asset) => {
          const active = value === asset.src;
          return (
            <button
              key={asset.id}
              type="button"
              onClick={() => onSelect(asset.src)}
              className={`overflow-hidden rounded-xl border text-left transition ${
                active
                  ? "border-dt-red ring-2 ring-dt-red/40"
                  : "border-dt-border hover:border-white/30"
              }`}
            >
              <div
                className={`bg-black/50 ${aspect === "wide" ? "aspect-[16/10]" : "aspect-square"}`}
              >
                <img
                  src={resolveExperiencePreviewUrl(asset.src)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="truncate px-2 py-1.5 text-[10px] text-white/70">{asset.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GradientBackgroundPicker({
  label,
  onSelect,
  selectedId,
}: {
  label: string;
  onSelect: (preset: GradientBackgroundPreset) => void;
  selectedId?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/55">{label}</p>
      <p className="text-[11px] text-white/40">
        CSS gradients — responsive on every phone size, no upload needed.
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {GRADIENT_BACKGROUND_PRESETS.map((preset) => {
          const active = selectedId === preset.id;
          const swatch = preset.useGradientBg
            ? `linear-gradient(${preset.angle}deg, ${preset.backgroundGradientFrom}, ${preset.backgroundGradientVia}, ${preset.backgroundGradientTo})`
            : preset.backgroundColor;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelect(preset)}
              className={`overflow-hidden rounded-xl border text-left transition ${
                active ? "border-dt-red ring-2 ring-dt-red/40" : "border-dt-border hover:border-white/30"
              }`}
            >
              <div className="aspect-[4/5] w-full" style={{ background: swatch }} />
              <p className="truncate px-2 py-1.5 text-[10px] text-white/75">{preset.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const EFFECT_OPTIONS: { id: ExperienceEffectPreset; label: string }[] = [
  { id: "none", label: "None" },
  { id: "soft", label: "Soft wash" },
  { id: "glow", label: "Glow" },
  { id: "neon", label: "Neon" },
  { id: "glass", label: "Glass" },
  { id: "shimmer", label: "Shimmer" },
  { id: "burst", label: "Burst" },
  { id: "rays", label: "Rays" },
];

export function ExperienceBrandPanel({
  brand,
  onChange,
  onUploadLogo,
}: {
  brand: ExperienceBrand;
  onChange: (patch: Partial<ExperienceBrand>) => void;
  onUploadLogo: (file: File | null) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-dt-border bg-black/30 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dt-red">Live logo preview</p>
        <div className="flex items-center gap-3">
          {brand.showLogoImage && brand.logoSrc ? (
            <img
              src={resolveExperiencePreviewUrl(brand.logoSrc)}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
              style={{
                filter: "drop-shadow(0 0 10px var(--preview-logo, #8FE3B8))",
              }}
            />
          ) : null}
          <div>
            <p className="font-display text-xl tracking-wide" style={{ color: brand.wordmarkColor }}>
              {brand.wordmark || "WORDMARK"}
            </p>
            <p className="text-xs" style={{ color: brand.taglineColor }}>
              {brand.tagline || "Tagline under logo"}
            </p>
          </div>
        </div>
      </div>

      <Toggle
        checked={brand.showLogoImage}
        onChange={(showLogoImage) => onChange({ showLogoImage })}
        label="Show logo image"
      />

      <AssetPicker
        label="Pick an AI logo"
        assets={EXPERIENCE_LOGOS}
        value={brand.logoSrc}
        onSelect={(logoSrc) => onChange({ logoSrc, showLogoImage: Boolean(logoSrc) })}
      />

      <Field label="Logo image URL" hint="Custom AI / illustrated mark only — no photo headshots">
        <TextInput value={brand.logoSrc} onChange={(logoSrc) => onChange({ logoSrc })} />
      </Field>
      <Field label="Upload custom AI logo">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onUploadLogo(e.target.files?.[0] ?? null)}
          className="block w-full text-xs text-white/70"
        />
      </Field>
      <Field label="Logo accent color" hint="Used for glow / accent around the mark">
        <ColorInput value={brand.logoColor} onChange={(logoColor) => onChange({ logoColor })} />
      </Field>
      <Field label="Wordmark text (under / beside logo)">
        <TextInput value={brand.wordmark} onChange={(wordmark) => onChange({ wordmark })} />
      </Field>
      <Field label="Wordmark color">
        <ColorInput value={brand.wordmarkColor} onChange={(wordmarkColor) => onChange({ wordmarkColor })} />
      </Field>
      <Field label="Wordmark font">
        <FontSelect
          value={brand.wordmarkFontFamily}
          onChange={(wordmarkFontFamily) => onChange({ wordmarkFontFamily })}
        />
      </Field>
      <Field label="Tagline under logo">
        <TextInput value={brand.tagline} onChange={(tagline) => onChange({ tagline })} />
      </Field>
      <Field label="Tagline color">
        <ColorInput value={brand.taglineColor} onChange={(taglineColor) => onChange({ taglineColor })} />
      </Field>
    </div>
  );
}

export function ExperienceThemePanel({
  theme,
  onChange,
}: {
  theme: ExperienceTheme;
  onChange: (patch: Partial<ExperienceTheme>) => void;
}) {
  return (
    <div className="space-y-5">
      <GradientBackgroundPicker
        label="App background gradients"
        onSelect={(preset) =>
          onChange({
            bg: preset.backgroundColor,
            bgGradientFrom: preset.backgroundGradientFrom,
            bgGradientVia: preset.backgroundGradientVia,
            bgGradientTo: preset.backgroundGradientTo,
            useGradientBg: preset.useGradientBg,
            bgGradientAngle: preset.angle,
            backgroundImage: "",
          })
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Toggle
          checked={theme.useGradientBg}
          onChange={(useGradientBg) => onChange({ useGradientBg, ...(useGradientBg ? { backgroundImage: "" } : {}) })}
          label="Gradient background"
        />
        <Field label="Gradient angle">
          <input
            type="range"
            min={0}
            max={360}
            value={theme.bgGradientAngle}
            onChange={(e) => onChange({ bgGradientAngle: Number(e.target.value) })}
            className="w-full"
          />
        </Field>
        <Field label="BG solid">
          <ColorInput value={theme.bg} onChange={(bg) => onChange({ bg })} />
        </Field>
        <Field label="Gradient from">
          <ColorInput value={theme.bgGradientFrom} onChange={(bgGradientFrom) => onChange({ bgGradientFrom })} />
        </Field>
        <Field label="Gradient via">
          <ColorInput value={theme.bgGradientVia} onChange={(bgGradientVia) => onChange({ bgGradientVia })} />
        </Field>
        <Field label="Gradient to">
          <ColorInput value={theme.bgGradientTo} onChange={(bgGradientTo) => onChange({ bgGradientTo })} />
        </Field>
        <Field label="Accent">
          <ColorInput value={theme.accent} onChange={(accent) => onChange({ accent })} />
        </Field>
        <Field label="Accent hover">
          <ColorInput value={theme.accentHover} onChange={(accentHover) => onChange({ accentHover })} />
        </Field>
        <Field label="Button background">
          <ColorInput value={theme.buttonBg} onChange={(buttonBg) => onChange({ buttonBg })} />
        </Field>
        <Field label="Button text">
          <ColorInput value={theme.buttonText} onChange={(buttonText) => onChange({ buttonText })} />
        </Field>
        <Field label="Button border">
          <ColorInput value={theme.buttonBorder} onChange={(buttonBorder) => onChange({ buttonBorder })} />
        </Field>
        <Field label="Button radius">
          <input
            type="range"
            min={0}
            max={40}
            value={theme.buttonRadius}
            onChange={(e) => onChange({ buttonRadius: Number(e.target.value) })}
            className="w-full"
          />
        </Field>
        <Field label="Text">
          <ColorInput value={theme.text} onChange={(text) => onChange({ text })} />
        </Field>
        <Field label="Muted text">
          <ColorInput value={theme.muted} onChange={(muted) => onChange({ muted })} />
        </Field>
        <Field label="Card">
          <ColorInput value={theme.card} onChange={(card) => onChange({ card })} />
        </Field>
        <Field label="Surface">
          <ColorInput value={theme.surface} onChange={(surface) => onChange({ surface })} />
        </Field>
        <Field label="Display font">
          <FontSelect value={theme.fontDisplay} onChange={(fontDisplay) => onChange({ fontDisplay })} />
        </Field>
        <Field label="Body font">
          <FontSelect value={theme.fontBody} onChange={(fontBody) => onChange({ fontBody })} />
        </Field>
      </div>
    </div>
  );
}

export function ExperienceEffectsPanel({
  effects,
  onChange,
}: {
  effects: ExperienceEffects;
  onChange: (patch: Partial<ExperienceEffects>) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <Toggle checked={effects.glow} onChange={(glow) => onChange({ glow })} label="Glow" />
        <Toggle checked={effects.particles} onChange={(particles) => onChange({ particles })} label="Particles" />
        <Toggle checked={effects.noise} onChange={(noise) => onChange({ noise })} label="Film noise" />
        <Toggle checked={effects.shimmer} onChange={(shimmer) => onChange({ shimmer })} label="Shimmer" />
        <Toggle checked={effects.blurBackdrop} onChange={(blurBackdrop) => onChange({ blurBackdrop })} label="Blur backdrop" />
        <Toggle checked={effects.vignette} onChange={(vignette) => onChange({ vignette })} label="Vignette" />
        <Toggle
          checked={effects.animatedGradient}
          onChange={(animatedGradient) => onChange({ animatedGradient })}
          label="Animated gradient"
        />
        <Toggle
          checked={effects.glassmorphism}
          onChange={(glassmorphism) => onChange({ glassmorphism })}
          label="Glassmorphism"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Glow color">
          <ColorInput value={effects.glowColor} onChange={(glowColor) => onChange({ glowColor })} />
        </Field>
        <Field label={`Glow intensity (${effects.glowIntensity})`}>
          <input
            type="range"
            min={0}
            max={100}
            value={effects.glowIntensity}
            onChange={(e) => onChange({ glowIntensity: Number(e.target.value) })}
            className="w-full"
          />
        </Field>
        <Field label="Particle color">
          <ColorInput value={effects.particleColor} onChange={(particleColor) => onChange({ particleColor })} />
        </Field>
        <Field label={`Noise opacity (${effects.noiseOpacity})`}>
          <input
            type="range"
            min={0}
            max={40}
            value={effects.noiseOpacity}
            onChange={(e) => onChange({ noiseOpacity: Number(e.target.value) })}
            className="w-full"
          />
        </Field>
      </div>
    </div>
  );
}

export function ExperiencePagePanel({
  pageKey,
  page,
  onChange,
  onUpload,
}: {
  pageKey: keyof ExperiencePages;
  page: ExperiencePageConfig;
  onChange: (patch: Partial<ExperiencePageConfig>) => void;
  onUpload: (field: "backgroundImage" | "heroImage" | "titleImage", file: File | null) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-white/45">
        Editing <span className="text-dt-red">{pageKey}</span> — publish to push live into Sloane Glo.
      </p>

      <GradientBackgroundPicker
        label="Page background gradients"
        onSelect={(preset) =>
          onChange({
            backgroundColor: preset.backgroundColor,
            backgroundGradientFrom: preset.backgroundGradientFrom,
            backgroundGradientTo: preset.backgroundGradientTo,
            useGradientBg: preset.useGradientBg,
            backgroundImage: "",
          })
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Toggle
          checked={page.useGradientBg}
          onChange={(useGradientBg) => onChange({ useGradientBg, backgroundImage: useGradientBg ? "" : page.backgroundImage })}
          label="Page gradient background"
        />
        <Field label="Effect preset">
          <select
            value={page.effectPreset}
            onChange={(e) => onChange({ effectPreset: e.target.value as ExperienceEffectPreset })}
            className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm"
          >
            {EFFECT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Background">
          <ColorInput value={page.backgroundColor} onChange={(backgroundColor) => onChange({ backgroundColor })} />
        </Field>
        <Field label="Accent">
          <ColorInput value={page.accentColor} onChange={(accentColor) => onChange({ accentColor })} />
        </Field>
        <Field label="Gradient from">
          <ColorInput
            value={page.backgroundGradientFrom}
            onChange={(backgroundGradientFrom) => onChange({ backgroundGradientFrom })}
          />
        </Field>
        <Field label="Gradient to">
          <ColorInput
            value={page.backgroundGradientTo}
            onChange={(backgroundGradientTo) => onChange({ backgroundGradientTo })}
          />
        </Field>
        <Field label="CTA background">
          <ColorInput value={page.ctaBg} onChange={(ctaBg) => onChange({ ctaBg })} />
        </Field>
        <Field label="CTA text color">
          <ColorInput value={page.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
        </Field>
      </div>

      <Field label="Headline">
        <TextInput value={page.headline} onChange={(headline) => onChange({ headline })} />
      </Field>
      <Field label="Subhead" hint="Use \\n for line breaks">
        <textarea
          value={page.subhead}
          onChange={(e) => onChange({ subhead: e.target.value })}
          rows={3}
          className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none"
        />
      </Field>
      <Field label="Body copy">
        <textarea
          value={page.body}
          onChange={(e) => onChange({ body: e.target.value })}
          rows={3}
          className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm outline-none"
        />
      </Field>
      <Field label="CTA label">
        <TextInput value={page.ctaLabel} onChange={(ctaLabel) => onChange({ ctaLabel })} />
      </Field>

      {pageKey === "youreIn" ? (
        <Field label="Loader label">
          <TextInput value={page.loaderLabel || ""} onChange={(loaderLabel) => onChange({ loaderLabel })} />
        </Field>
      ) : null}
      {pageKey === "settings" ? (
        <>
          <Field label="Settings title">
            <TextInput value={page.title || ""} onChange={(title) => onChange({ title })} />
          </Field>
          <Field label="Logout label">
            <TextInput value={page.logoutLabel || ""} onChange={(logoutLabel) => onChange({ logoutLabel })} />
          </Field>
        </>
      ) : null}

      <AssetPicker
        label="Hero / player image"
        assets={EXPERIENCE_HEROES}
        value={page.heroImage}
        onSelect={(heroImage) => onChange({ heroImage })}
      />
      <AssetPicker
        label="Title art image"
        assets={EXPERIENCE_LOGOS}
        value={page.titleImage}
        onSelect={(titleImage) => onChange({ titleImage })}
        aspect="wide"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            ["heroImage", "Hero / player image"],
            ["titleImage", "Title art image"],
          ] as const
        ).map(([field, label]) => (
          <div key={field} className="space-y-2 rounded-lg border border-dt-border p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/50">{label}</p>
            {page[field] ? (
              <img src={resolveExperiencePreviewUrl(page[field])} alt="" className="h-24 w-full rounded object-cover" />
            ) : (
              <div className="flex h-24 items-center justify-center rounded border border-dashed border-white/15 text-[11px] text-white/35">
                No image
              </div>
            )}
            <TextInput value={page[field]} onChange={(value) => onChange({ [field]: value })} />
            <input
              type="file"
              accept="image/*"
              className="block w-full text-[10px] text-white/60"
              onChange={(e) => onUpload(field, e.target.files?.[0] ?? null)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
