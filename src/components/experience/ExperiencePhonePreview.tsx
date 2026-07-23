import { useCallback, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import type {
  ExperienceBuiltinStageId,
  ExperienceConfig,
  ExperiencePageConfig,
  ExperienceStageItem,
  ExperienceStamp,
} from "../../lib/experienceConfig";
import {
  DEFAULT_LANDING_STAGE,
  createStampFromBrand,
  getStageItem,
  pageBackgroundCss,
  placeStampOnPage,
  removeStageItem,
  stageGlowStyle,
  stageItemCss,
  stageItemRole,
  themeBackgroundCss,
  upsertStageItem,
} from "../../lib/experienceConfig";
import { resolveExperiencePreviewUrl } from "../../lib/resolveExperiencePreviewUrl";
import { TintedBrandLogo } from "./TintedBrandLogo";

export type PhonePreviewMode =
  | "brand"
  | "theme"
  | "effects"
  | "landing"
  | "youreIn"
  | "settings"
  | "homePage"
  | "boxes";

export type ExperiencePageKey = keyof ExperienceConfig["pages"];

const STAGE_LABELS: Record<ExperienceBuiltinStageId, string> = {
  logo: "Logo",
  wordmark: "Wordmark",
  tagline: "Tagline",
  hero: "Hero image",
  titleArt: "Title art",
  subhead: "Subhead",
  headline: "Headline",
  body: "Body",
  cta: "CTA button",
};

function PhoneFrame({ children, label, hint }: { children: ReactNode; label: string; hint?: string }) {
  return (
    <div className="sticky top-4 self-start">
      <p className="mb-1 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
        Live phone · {label}
      </p>
      {hint ? <p className="mb-2 text-center text-[10px] text-white/35">{hint}</p> : null}
      <div className="exp-phone-shell relative mx-auto w-full max-w-[300px] overflow-hidden rounded-[2.35rem] border border-white/15 bg-black shadow-[0_0_48px_rgba(143,227,184,0.12)]">
        <div className="pointer-events-none absolute left-1/2 top-2 z-50 h-5 w-28 -translate-x-1/2 rounded-full bg-black/90" />
        <div className="relative min-h-[560px] overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function BrandMark({ experience }: { experience: ExperienceConfig }) {
  const { brand } = experience;
  return (
    <div className="flex items-center gap-2">
      {brand.showLogoImage && brand.logoSrc ? (
        <TintedBrandLogo
          src={resolveExperiencePreviewUrl(brand.logoSrc)}
          color={brand.logoColor}
          tint={brand.logoTint !== false}
          size={32}
        />
      ) : null}
      <div className="min-w-0">
        <p className="truncate text-[11px] font-bold tracking-[0.16em]" style={{ color: brand.wordmarkColor }}>
          {brand.wordmark || "YOUR BRAND"}
        </p>
        {brand.tagline ? (
          <p className="truncate text-[9px]" style={{ color: brand.taglineColor }}>
            {brand.tagline}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function DraggableStageItem({
  item,
  selected,
  onSelect,
  onMove,
  children,
}: {
  item: ExperienceStageItem;
  selected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  children: ReactNode;
}) {
  const drag = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
    const parent = e.currentTarget.parentElement;
    if (!parent) return;
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: item.x,
      origY: item.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const parent = e.currentTarget.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const dx = ((e.clientX - drag.current.startX) / rect.width) * 100;
    const dy = ((e.clientY - drag.current.startY) / rect.height) * 100;
    onMove(
      Math.max(0, Math.min(90, drag.current.origX + dx)),
      Math.max(0, Math.min(92, drag.current.origY + dy)),
    );
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={`cursor-grab touch-none active:cursor-grabbing ${
        selected ? "outline outline-2 outline-dt-red outline-offset-2" : "hover:outline hover:outline-1 hover:outline-white/30"
      }`}
      style={stageItemCss(item) as CSSProperties}
    >
      {children}
    </div>
  );
}

function StampTray({
  experience,
  onSaveLogo,
  onPlaceStamp,
  onRemoveStamp,
}: {
  experience: ExperienceConfig;
  onSaveLogo?: () => void;
  onPlaceStamp?: (stampId: string) => void;
  onRemoveStamp?: (stampId: string) => void;
}) {
  const stamps = experience.stamps || [];
  return (
    <div className="space-y-2 border-t border-white/10 bg-black/85 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-dt-red">Logo stamps</p>
        {onSaveLogo ? (
          <button
            type="button"
            onClick={onSaveLogo}
            disabled={!experience.brand.logoSrc}
            className="rounded-lg border border-dt-red/50 bg-dt-red/15 px-2 py-1 text-[10px] font-semibold text-dt-red disabled:opacity-40"
          >
            Save current logo
          </button>
        ) : null}
      </div>
      <p className="text-[9px] text-white/40">Click a stamp to drop it on this page — works from any section.</p>
      {stamps.length === 0 ? (
        <p className="text-[10px] text-white/35">No saved logos yet. Save the brand logo to reuse it anywhere.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {stamps.map((stamp) => (
            <div key={stamp.id} className="relative">
              <button
                type="button"
                title={`Place ${stamp.label}`}
                onClick={() => onPlaceStamp?.(stamp.id)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/50 hover:border-dt-red/60"
              >
                <TintedBrandLogo
                  src={resolveExperiencePreviewUrl(stamp.src)}
                  color={experience.brand.logoColor}
                  tint={experience.brand.logoTint !== false}
                  size={36}
                />
              </button>
              {onRemoveStamp ? (
                <button
                  type="button"
                  aria-label={`Remove ${stamp.label}`}
                  onClick={() => onRemoveStamp(stamp.id)}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] text-white/70 ring-1 ring-white/20"
                >
                  ×
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PageFreeformPreview({
  experience,
  page,
  pageKey,
  label,
  onPatchPage,
  onSaveLogo,
  onPlaceStamp,
  onRemoveStamp,
}: {
  experience: ExperienceConfig;
  page: ExperiencePageConfig;
  pageKey: ExperiencePageKey;
  label: string;
  onPatchPage?: (patch: Partial<ExperiencePageConfig>) => void;
  onSaveLogo?: () => void;
  onPlaceStamp?: (stampId: string) => void;
  onRemoveStamp?: (stampId: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string>("logo");
  const selected = getStageItem(page, selectedId);
  const lines = (page.subhead || "THE OFFICIAL\nCOMMUNITY").split("\n");
  const scale = (page.heroScale || 100) / 100;
  const brand = experience.brand;
  const stageIds = (page.stage?.length ? page.stage : DEFAULT_LANDING_STAGE).map((item) => item.id);
  const showLandingChrome = pageKey === "landing";

  const patchItem = useCallback(
    (id: string, patch: Partial<ExperienceStageItem>) => {
      if (!onPatchPage) return;
      onPatchPage({
        layoutMode: "freeform",
        stage: upsertStageItem(page, { id, ...patch }),
      });
    },
    [onPatchPage, page],
  );

  const selectedLabel = (() => {
    const role = stageItemRole(selected);
    if (role === "stamp") {
      const stamp = (experience.stamps || []).find((s) => s.id === selected.stampId);
      return stamp?.label ? `Stamp · ${stamp.label}` : "Stamp";
    }
    return STAGE_LABELS[role];
  })();

  const renderItem = (id: string) => {
    const item = getStageItem(page, id);
    const role = stageItemRole(item);
    let body: ReactNode = null;

    if (role === "logo") {
      if (!brand.showLogoImage || !brand.logoSrc) {
        body = (
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-white/30 text-[8px] text-white/35">
            Logo
          </div>
        );
      } else {
        body = (
          <div style={stageGlowStyle(item, "box")}>
            <TintedBrandLogo
              src={resolveExperiencePreviewUrl(brand.logoSrc)}
              color={brand.logoColor}
              tint={brand.logoTint !== false}
              size={40}
            />
          </div>
        );
      }
    } else if (role === "wordmark") {
      body = (
        <p
          className="truncate text-[12px] font-bold tracking-[0.16em]"
          style={{ color: brand.wordmarkColor, ...stageGlowStyle(item, "text") }}
        >
          {brand.wordmark || "YOUR BRAND"}
        </p>
      );
    } else if (role === "tagline") {
      body = (
        <p className="truncate text-[9px]" style={{ color: brand.taglineColor, ...stageGlowStyle(item, "text") }}>
          {brand.tagline || "Tagline"}
        </p>
      );
    } else if (role === "hero") {
      if (!showLandingChrome) return null;
      body = page.heroImage ? (
        <img
          src={resolveExperiencePreviewUrl(page.heroImage)}
          alt=""
          className="w-full rounded-xl"
          draggable={false}
          style={{
            objectFit: page.heroFit || "contain",
            objectPosition: page.heroPosition || "right center",
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            ...stageGlowStyle(item, "image"),
          }}
        />
      ) : (
        <div className="flex h-28 items-end justify-end rounded-xl border border-dashed border-white/25 bg-black/30 p-2">
          <span className="text-[9px] text-white/35">Hero placement</span>
        </div>
      );
    } else if (role === "titleArt") {
      if (!showLandingChrome || !page.titleImage) return null;
      body = (
        <img
          src={resolveExperiencePreviewUrl(page.titleImage)}
          alt=""
          className="w-full object-contain"
          draggable={false}
          style={stageGlowStyle(item, "image")}
        />
      );
    } else if (role === "subhead") {
      body = (
        <p
          className="text-center text-[10px] font-semibold uppercase leading-relaxed tracking-[0.12em]"
          style={{ color: page.accentColor, ...stageGlowStyle(item, "text") }}
        >
          {lines.map((line, i) => (
            <span key={`${line}-${i}`}>
              {line}
              {i < lines.length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
      );
    } else if (role === "headline") {
      body = (
        <p className="text-center font-display text-xl text-white" style={stageGlowStyle(item, "text")}>
          {page.headline || page.title || "Headline"}
        </p>
      );
    } else if (role === "body") {
      body = (
        <p className="text-center text-[11px] leading-relaxed text-white/65" style={stageGlowStyle(item, "text")}>
          {page.body}
        </p>
      );
    } else if (role === "cta") {
      if (!showLandingChrome) return null;
      body = (
        <button
          type="button"
          className="w-full py-2.5 text-sm font-bold"
          style={{
            background: page.ctaBg,
            color: page.ctaText,
            borderRadius: experience.theme.buttonRadius,
            ...stageGlowStyle(item, "box"),
          }}
        >
          {page.ctaLabel || "Join My Circle →"}
        </button>
      );
    } else if (role === "stamp") {
      const stamp = (experience.stamps || []).find((s) => s.id === item.stampId);
      if (!stamp?.src) return null;
      body = (
        <div style={stageGlowStyle(item, "box")}>
          <TintedBrandLogo
            src={resolveExperiencePreviewUrl(stamp.src)}
            color={brand.logoColor}
            tint={brand.logoTint !== false}
            size={44}
          />
        </div>
      );
    }

    return (
      <DraggableStageItem
        key={id}
        item={item}
        selected={selectedId === id}
        onSelect={() => setSelectedId(id)}
        onMove={(x, y) => patchItem(id, { x, y })}
      >
        {body}
      </DraggableStageItem>
    );
  };

  return (
    <PhoneFrame label={label} hint="Drag logo & words separately · tap stamp tray to place logos">
      <div
        className="relative h-[560px] w-full"
        style={{ background: pageBackgroundCss(page) || themeBackgroundCss(experience.theme) }}
      >
        {stageIds.map(renderItem)}
      </div>
      {onPatchPage ? (
        <div className="space-y-2 border-t border-white/10 bg-black/80 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-dt-red">
            Selected · {selectedLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => patchItem(selectedId, { glow: !selected.glow })}
              className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold ${
                selected.glow
                  ? "border-dt-red/60 bg-dt-red/15 text-dt-red"
                  : "border-white/15 text-white/60"
              }`}
            >
              {selected.glow ? "Glow on" : "Glow off"}
            </button>
            <button
              type="button"
              onClick={() => patchItem(selectedId, { z: Math.min(100, selected.z + 1) })}
              className="rounded-lg border border-white/15 px-2.5 py-1.5 text-[10px] text-white/70"
            >
              Bring forward
            </button>
            <button
              type="button"
              onClick={() => patchItem(selectedId, { z: Math.max(0, selected.z - 1) })}
              className="rounded-lg border border-white/15 px-2.5 py-1.5 text-[10px] text-white/70"
            >
              Send back
            </button>
            {stageItemRole(selected) === "stamp" ? (
              <button
                type="button"
                onClick={() => {
                  onPatchPage({ stage: removeStageItem(page, selectedId) });
                  setSelectedId("logo");
                }}
                className="rounded-lg border border-white/15 px-2.5 py-1.5 text-[10px] text-red-300/80"
              >
                Remove stamp
              </button>
            ) : null}
          </div>
          {selected.glow ? (
            <div className="grid grid-cols-2 gap-2">
              <label className="block space-y-1">
                <span className="text-[9px] text-white/40">Glow color</span>
                <input
                  type="color"
                  value={selected.glowColor?.slice(0, 7) || "#8FE3B8"}
                  onChange={(e) => patchItem(selectedId, { glowColor: e.target.value })}
                  className="h-8 w-full cursor-pointer rounded border border-white/15 bg-transparent"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-[9px] text-white/40">Intensity {selected.glowIntensity}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={selected.glowIntensity}
                  onChange={(e) => patchItem(selectedId, { glowIntensity: Number(e.target.value) })}
                  className="w-full"
                />
              </label>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() =>
              onPatchPage({
                layoutMode: "freeform",
                stage: [
                  ...DEFAULT_LANDING_STAGE.map((item) => ({ ...item })),
                  ...(page.stage || []).filter((item) => stageItemRole(item) === "stamp"),
                ],
              })
            }
            className="text-[10px] text-white/40 underline hover:text-white/70"
          >
            Reset layout
          </button>
        </div>
      ) : null}
      <StampTray
        experience={experience}
        onSaveLogo={onSaveLogo}
        onPlaceStamp={onPlaceStamp}
        onRemoveStamp={onRemoveStamp}
      />
    </PhoneFrame>
  );
}

function BoxesStampOnlyPreview({
  experience,
  onSaveLogo,
  onPlaceStamp,
  onRemoveStamp,
}: {
  experience: ExperienceConfig;
  onSaveLogo?: () => void;
  onPlaceStamp?: (stampId: string) => void;
  onRemoveStamp?: (stampId: string) => void;
}) {
  const page = experience.pages.home;
  const bg = pageBackgroundCss({ ...page, backgroundImage: "" }) || themeBackgroundCss({ ...experience.theme, backgroundImage: "" });
  return (
    <PhoneFrame label="Home boxes" hint="Save / place logo stamps here too — they land on Home">
      <div className="relative flex h-[560px] flex-col" style={{ background: bg, color: experience.theme.text }}>
        <div className="border-b border-white/10 px-4 pb-3 pt-8">
          <BrandMark experience={experience} />
        </div>
        <div className="relative space-y-2 p-3">
          <div className="rounded-2xl border border-white/10 p-3" style={{ background: experience.theme.card }}>
            <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: experience.theme.muted }}>
              Home
            </p>
            <p className="mt-1 font-display text-base">{page.headline || "Your hub"}</p>
          </div>
          <p className="px-1 text-[10px] text-white/40">
            Switch to Home chrome to drag stamps on the page canvas. Tray below still saves logos.
          </p>
        </div>
      </div>
      <StampTray
        experience={experience}
        onSaveLogo={onSaveLogo}
        onPlaceStamp={onPlaceStamp}
        onRemoveStamp={onRemoveStamp}
      />
    </PhoneFrame>
  );
}

const MODE_LABEL: Record<PhonePreviewMode, string> = {
  brand: "Brand",
  theme: "Colors",
  effects: "Effects",
  landing: "Landing",
  youreIn: "You're In",
  settings: "Settings",
  homePage: "Home",
  boxes: "Home boxes",
};

export function ExperiencePhonePreview({
  experience,
  mode,
  pageKey,
  onPatchPage,
  onSaveLogo,
  onPlaceStamp,
  onRemoveStamp,
}: {
  experience: ExperienceConfig;
  mode: PhonePreviewMode;
  pageKey: ExperiencePageKey;
  onPatchPage?: (patch: Partial<ExperiencePageConfig>) => void;
  onSaveLogo?: () => void;
  onPlaceStamp?: (stampId: string) => void;
  onRemoveStamp?: (stampId: string) => void;
}) {
  if (mode === "boxes") {
    return (
      <BoxesStampOnlyPreview
        experience={experience}
        onSaveLogo={onSaveLogo}
        onPlaceStamp={onPlaceStamp}
        onRemoveStamp={onRemoveStamp}
      />
    );
  }

  return (
    <PageFreeformPreview
      experience={experience}
      page={experience.pages[pageKey]}
      pageKey={pageKey}
      label={MODE_LABEL[mode]}
      onPatchPage={onPatchPage}
      onSaveLogo={onSaveLogo}
      onPlaceStamp={onPlaceStamp}
      onRemoveStamp={onRemoveStamp}
    />
  );
}

export { MODE_LABEL, createStampFromBrand, placeStampOnPage };
export type { ExperienceStamp };
