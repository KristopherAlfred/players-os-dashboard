import { useCallback, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import type {
  ExperienceConfig,
  ExperiencePageConfig,
  ExperienceStageItem,
  ExperienceStageItemId,
} from "../../lib/experienceConfig";
import {
  DEFAULT_LANDING_STAGE,
  getStageItem,
  pageBackgroundCss,
  stageGlowStyle,
  stageItemCss,
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

const STAGE_LABELS: Record<ExperienceStageItemId, string> = {
  brand: "Brand",
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

function LandingFreeformPreview({
  experience,
  onPatchPage,
}: {
  experience: ExperienceConfig;
  onPatchPage?: (patch: Partial<ExperiencePageConfig>) => void;
}) {
  const page = experience.pages.landing;
  const [selectedId, setSelectedId] = useState<ExperienceStageItemId>("headline");
  const selected = getStageItem(page, selectedId);
  const lines = (page.subhead || "THE OFFICIAL\nCOMMUNITY").split("\n");
  const scale = (page.heroScale || 100) / 100;

  const patchItem = useCallback(
    (id: ExperienceStageItemId, patch: Partial<ExperienceStageItem>) => {
      if (!onPatchPage) return;
      onPatchPage({
        layoutMode: "freeform",
        stage: upsertStageItem(page, { id, ...patch }),
      });
    },
    [onPatchPage, page],
  );

  const renderItem = (id: ExperienceStageItemId) => {
    const item = getStageItem(page, id);
    let body: ReactNode = null;
    if (id === "brand") {
      body = (
        <div style={stageGlowStyle(item, "box")}>
          <BrandMark experience={experience} />
        </div>
      );
    } else if (id === "hero") {
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
    } else if (id === "titleArt") {
      if (!page.titleImage) return null;
      body = (
        <img
          src={resolveExperiencePreviewUrl(page.titleImage)}
          alt=""
          className="w-full object-contain"
          draggable={false}
          style={stageGlowStyle(item, "image")}
        />
      );
    } else if (id === "subhead") {
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
    } else if (id === "headline") {
      body = (
        <p className="text-center font-display text-xl text-white" style={stageGlowStyle(item, "text")}>
          {page.headline || "Join the circle"}
        </p>
      );
    } else if (id === "body") {
      body = (
        <p className="text-center text-[11px] leading-relaxed text-white/65" style={stageGlowStyle(item, "text")}>
          {page.body}
        </p>
      );
    } else if (id === "cta") {
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
    <PhoneFrame label="Landing" hint="Drag anything · tap to select · edit glow below">
      <div
        className="relative h-[560px] w-full"
        style={{ background: pageBackgroundCss(page) }}
        onPointerDown={() => setSelectedId(selectedId)}
      >
        {(["hero", "titleArt", "subhead", "headline", "body", "cta", "brand"] as ExperienceStageItemId[]).map(
          renderItem,
        )}
      </div>
      {onPatchPage ? (
        <div className="space-y-2 border-t border-white/10 bg-black/80 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-dt-red">
            Selected · {STAGE_LABELS[selectedId]}
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
                stage: DEFAULT_LANDING_STAGE.map((item) => ({ ...item })),
              })
            }
            className="text-[10px] text-white/40 underline hover:text-white/70"
          >
            Reset layout
          </button>
        </div>
      ) : null}
    </PhoneFrame>
  );
}

function YoureInPreview({ experience }: { experience: ExperienceConfig }) {
  const page = experience.pages.youreIn;
  return (
    <PhoneFrame label="You're In">
      <div className="flex h-full min-h-[560px] flex-col" style={{ background: pageBackgroundCss(page) }}>
        <div className="border-b border-white/10 px-4 pb-3 pt-8">
          <BrandMark experience={experience} />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="font-display text-3xl text-white">{page.headline || "You're in"}</p>
          <p className="mt-2 text-sm" style={{ color: page.accentColor }}>
            {page.subhead || "Welcome"}
          </p>
          <p className="mt-4 text-[12px] text-white/55">{page.body}</p>
        </div>
      </div>
    </PhoneFrame>
  );
}

function SettingsPreview({ experience }: { experience: ExperienceConfig }) {
  const page = experience.pages.settings;
  return (
    <PhoneFrame label="Settings">
      <div className="flex h-full min-h-[560px] flex-col" style={{ background: pageBackgroundCss(page) }}>
        <div className="border-b border-white/10 px-4 pb-3 pt-8">
          <BrandMark experience={experience} />
        </div>
        <div className="space-y-3 px-4 py-5">
          <p className="font-display text-lg text-white">{page.title || page.headline || "Account Settings"}</p>
          <p className="text-[11px] text-white/50">{page.body}</p>
        </div>
      </div>
    </PhoneFrame>
  );
}

function HomeChromePreview({ experience }: { experience: ExperienceConfig }) {
  const { theme, effects, pages } = experience;
  const page = pages.home;
  const bg = pageBackgroundCss({ ...page, backgroundImage: "" }) || themeBackgroundCss({ ...theme, backgroundImage: "" });
  return (
    <PhoneFrame label="Home">
      <div className="relative flex h-full min-h-[560px] flex-col" style={{ background: bg, color: theme.text }}>
        {effects.vignette ? (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55))]" />
        ) : null}
        <div className="border-b border-white/10 px-4 pb-3 pt-8">
          <BrandMark experience={experience} />
        </div>
        <div className="relative space-y-2 p-3">
          <div className="rounded-2xl border border-white/10 p-3" style={{ background: theme.card }}>
            <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: theme.muted }}>
              Home
            </p>
            <p className="mt-1 font-display text-base">{page.headline || "Your hub"}</p>
          </div>
        </div>
      </div>
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
  onPatchPage,
}: {
  experience: ExperienceConfig;
  mode: PhonePreviewMode;
  onPatchPage?: (patch: Partial<ExperiencePageConfig>) => void;
}) {
  if (mode === "landing" || mode === "brand" || mode === "theme" || mode === "effects") {
    return <LandingFreeformPreview experience={experience} onPatchPage={onPatchPage} />;
  }
  if (mode === "youreIn") return <YoureInPreview experience={experience} />;
  if (mode === "settings") return <SettingsPreview experience={experience} />;
  return <HomeChromePreview experience={experience} />;
}

export { MODE_LABEL };
