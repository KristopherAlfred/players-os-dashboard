import { useCallback, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import type {
  ExperienceBrand,
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
import { StyledTextRuns, WordStyleEditor, runsForPageField } from "./StyledText";

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
      <div className="exp-phone-shell relative mx-auto w-full max-w-[300px] overflow-hidden rounded-[2.35rem] border border-white/15 bg-black shadow-[0_0_48px_rgba(var(--theme-accent-rgb),0.12)]">
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
  onResize,
  onDelete,
  children,
}: {
  item: ExperienceStageItem;
  selected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onResize?: (w: number, scale: number) => void;
  onDelete?: () => void;
  children: ReactNode;
}) {
  const drag = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resize = useRef<{ startX: number; startY: number; origW: number; origScale: number } | null>(null);

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

  const onHandleDown = (e: ReactPointerEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    resize.current = {
      startX: e.clientX,
      startY: e.clientY,
      origW: item.w || 80,
      origScale: item.scale ?? 100,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onHandleMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (!resize.current || !onResize) return;
    const stage = e.currentTarget.parentElement?.parentElement;
    const rect = stage?.getBoundingClientRect();
    if (!rect) return;
    const dx = ((e.clientX - resize.current.startX) / rect.width) * 100;
    const dy = ((e.clientY - resize.current.startY) / rect.height) * 100;
    const w = Math.max(8, Math.min(100, resize.current.origW + dx));
    const scale = Math.max(40, Math.min(220, resize.current.origScale + dy * 1.6));
    onResize(Math.round(w), Math.round(scale));
  };

  const onHandleUp = (e: ReactPointerEvent<HTMLSpanElement>) => {
    resize.current = null;
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
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if ((e.key === "Delete" || e.key === "Backspace") && onDelete) {
          e.preventDefault();
          onDelete();
        }
      }}
      className={`cursor-grab touch-none active:cursor-grabbing ${
        selected
          ? "outline outline-1 outline-dashed outline-white/55 outline-offset-2"
          : "hover:outline hover:outline-1 hover:outline-dashed hover:outline-white/25"
      }`}
      style={stageItemCss(item) as CSSProperties}
    >
      {children}
      {selected ? (
        <>
          {onDelete ? (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Delete this item"
              title="Delete"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              className="absolute -right-2 -top-2 z-[200] flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-black text-[9px] leading-none text-red-300"
            >
              ×
            </span>
          ) : null}
          {onResize ? (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Resize this item"
              title="Drag to resize"
              onPointerDown={onHandleDown}
              onPointerMove={onHandleMove}
              onPointerUp={onHandleUp}
              onPointerCancel={onHandleUp}
              className="absolute -bottom-2 -right-2 z-[200] h-4 w-4 cursor-nwse-resize touch-none rounded-sm border border-white/50 bg-white/80"
            />
          ) : null}
        </>
      ) : null}
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
  onPatchBrand,
  onSaveLogo,
  onPlaceStamp,
  onRemoveStamp,
}: {
  experience: ExperienceConfig;
  page: ExperiencePageConfig;
  pageKey: ExperiencePageKey;
  label: string;
  onPatchPage?: (patch: Partial<ExperiencePageConfig>) => void;
  onPatchBrand?: (patch: Partial<ExperienceBrand>) => void;
  onSaveLogo?: () => void;
  onPlaceStamp?: (stampId: string) => void;
  onRemoveStamp?: (stampId: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wordChip, setWordChip] = useState(0);
  const [showUnlock, setShowUnlock] = useState(false);
  const selected = selectedId ? getStageItem(page, selectedId) : null;
  const scale = (page.heroScale || 100) / 100;
  const brand = experience.brand;
  const stageIds = (page.stage?.length ? page.stage : DEFAULT_LANDING_STAGE).map((item) => item.id);
  const showLandingChrome = pageKey === "landing";

  const selectStageItem = useCallback((id: string) => {
    setSelectedId((prev) => {
      if (prev !== id) setWordChip(0);
      return id;
    });
  }, []);

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
    if (!selected) return "Tap something on the phone to edit";
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
          className="font-bold leading-tight tracking-[0.16em] text-[12px]"
          style={{ color: brand.wordmarkColor, ...stageGlowStyle(item, "text") }}
        >
          {brand.wordmark || "YOUR BRAND"}
        </p>
      );
    } else if (role === "tagline") {
      body = (
        <p className="leading-tight text-[9px]" style={{ color: brand.taglineColor, ...stageGlowStyle(item, "text") }}>
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
        <StyledTextRuns
          runs={runsForPageField(page, "subhead")}
          fallbackColor={page.accentColor}
          className="text-center text-[10px] font-semibold uppercase leading-relaxed tracking-[0.12em]"
          style={stageGlowStyle(item, "text")}
          interactive
          activeIndex={selectedId === id ? wordChip : undefined}
          onWordClick={(chip) => {
            selectStageItem(id);
            setWordChip(chip);
          }}
        />
      );
    } else if (role === "headline") {
      body = (
        <StyledTextRuns
          as="p"
          runs={runsForPageField(page, "headline")}
          fallbackColor="#FFFFFF"
          className="text-center font-display text-xl text-white"
          style={stageGlowStyle(item, "text")}
          interactive
          activeIndex={selectedId === id ? wordChip : undefined}
          onWordClick={(chip) => {
            selectStageItem(id);
            setWordChip(chip);
          }}
        />
      );
    } else if (role === "body") {
      body = (
        <StyledTextRuns
          runs={runsForPageField(page, "body")}
          fallbackColor="rgba(255,255,255,0.65)"
          className="text-center text-[11px] leading-relaxed text-white/65"
          style={stageGlowStyle(item, "text")}
          interactive
          activeIndex={selectedId === id ? wordChip : undefined}
          onWordClick={(chip) => {
            selectStageItem(id);
            setWordChip(chip);
          }}
        />
      );
    } else if (role === "cta") {
      if (!showLandingChrome) return null;
      body = (
        <div className="flex w-full flex-col gap-2">
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
          {(page.extraButtons || []).map((btn) => (
            <button
              key={btn.id}
              type="button"
              className={`py-2 text-xs font-semibold ${btn.fullWidth === false ? "self-center px-5" : "w-full"}`}
              style={{
                background:
                  btn.style === "solid" ? btn.bg : btn.style === "ghost" ? "transparent" : "rgba(255,255,255,0.04)",
                color: btn.style === "solid" ? btn.text : btn.bg,
                border: btn.style === "solid" ? "none" : `1px solid ${btn.borderColor || btn.bg}`,
                borderRadius: btn.radius ?? experience.theme.buttonRadius,
                boxShadow: btn.glow ? `0 0 18px ${btn.glowColor || btn.bg}66` : "none",
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
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
        onSelect={() => selectStageItem(id)}
        onMove={(x, y) => patchItem(id, { x, y })}
      >
        {body}
      </DraggableStageItem>
    );
  };

  return (
    <PhoneFrame label={label} hint="Drag logo & words separately · tap a word to style it">
      <div
        className="relative h-[560px] w-full"
        style={{ background: pageBackgroundCss(page) || themeBackgroundCss(experience.theme) }}
        onClick={() => setSelectedId(null)}
      >
        {stageIds.map(renderItem)}
        {showLandingChrome && showUnlock ? (
          <div className="absolute inset-x-0 bottom-0 z-[120] px-2 pb-2 pt-16">
            <div
              className="relative rounded-2xl border px-3 pb-4 pt-6"
              style={{
                borderColor: page.unlockPanelBorderColor || "#8C0000",
                background: `linear-gradient(165deg, ${page.unlockPanelBgFrom || "rgba(18,18,18,0.97)"} 0%, ${page.unlockPanelBgTo || "rgba(6,6,6,0.98)"} 100%)`,
                boxShadow: `0 0 18px ${page.unlockGlowColor || "#8FE3B8"}66`,
              }}
            >
              <div
                className="absolute left-1/2 top-0 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-black text-[10px]"
                style={{ borderColor: page.accentColor || "#8FE3B8", color: page.accentColor || "#8FE3B8" }}
              >
                🔒
              </div>
              <p className="text-center font-display text-[13px] tracking-wide text-white">
                {page.unlockHeadline || page.headline || "JOIN SLOANE GLO"}
              </p>
              <p
                className="mt-1.5 text-center text-[9px] leading-relaxed text-white"
                style={{
                  textShadow: `0 0 6px ${page.unlockGlowColor || "#8FE3B8"}`,
                  WebkitTextStroke: `0.35px ${page.unlockGlowColor || "#8FE3B8"}`,
                }}
              >
                {page.unlockBody || page.body}
              </p>
              <div className="mt-3 space-y-1.5">
                {["Continue with X", "Continue with Google", "Continue with Apple"].map((label) => (
                  <div
                    key={label}
                    className={`flex h-8 items-center justify-center rounded-lg border text-[8px] font-semibold uppercase tracking-wide ${
                      label.includes("Google")
                        ? "border-white/20 bg-white text-black"
                        : "border-white/15 bg-black text-white"
                    }`}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <p
                className="mt-2.5 text-center text-[8px] text-white/90"
                style={{ textShadow: `0 0 5px ${page.unlockGlowColor || "#8FE3B8"}` }}
              >
                {page.unlockFooter || "100% Private · No Spam · You're in control"}
              </p>
            </div>
          </div>
        ) : null}
      </div>
      {showLandingChrome ? (
        <div className="border-t border-white/10 bg-black/80 px-3 py-2">
          <button
            type="button"
            onClick={() => setShowUnlock((v) => !v)}
            className={`w-full rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold ${
              showUnlock
                ? "border-dt-red/60 bg-dt-red/15 text-dt-red"
                : "border-white/15 text-white/60"
            }`}
          >
            {showUnlock ? "Hide unlock slide-in" : "Preview unlock slide-in"}
          </button>
        </div>
      ) : null}
      {onPatchPage ? (
        <div className="space-y-2 border-t border-white/10 bg-black/80 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-dt-red">
            {selected ? `Editing · ${selectedLabel}` : selectedLabel}
          </p>
          {selected && selectedId && onPatchBrand && (stageItemRole(selected) === "wordmark" || stageItemRole(selected) === "tagline") ? (
            <div className="space-y-2 rounded-lg border border-white/15 bg-white/[0.04] p-2">
              {stageItemRole(selected) === "wordmark" ? (
                <>
                  <label className="block space-y-1">
                    <span className="text-[9px] text-white/50">Wordmark text</span>
                    <input
                      value={brand.wordmark}
                      onChange={(e) => onPatchBrand({ wordmark: e.target.value })}
                      className="w-full rounded border border-white/15 bg-black px-2 py-1.5 text-[11px] text-white outline-none"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[9px] text-white/50">Wordmark color</span>
                    <input
                      type="color"
                      value={brand.wordmarkColor?.slice(0, 7) || "#FFFFFF"}
                      onChange={(e) => onPatchBrand({ wordmarkColor: e.target.value })}
                      className="h-8 w-full cursor-pointer rounded border border-white/15 bg-transparent"
                    />
                  </label>
                </>
              ) : (
                <>
                  <label className="block space-y-1">
                    <span className="text-[9px] text-white/50">Tagline text</span>
                    <input
                      value={brand.tagline}
                      onChange={(e) => onPatchBrand({ tagline: e.target.value })}
                      className="w-full rounded border border-white/15 bg-black px-2 py-1.5 text-[11px] text-white outline-none"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[9px] text-white/50">Tagline color</span>
                    <input
                      type="color"
                      value={brand.taglineColor?.slice(0, 7) || "#8FE3B8"}
                      onChange={(e) => onPatchBrand({ taglineColor: e.target.value })}
                      className="h-8 w-full cursor-pointer rounded border border-white/15 bg-transparent"
                    />
                  </label>
                </>
              )}
              <label className="block space-y-1">
                <span className="text-[9px] font-semibold text-dt-red">
                  Size on phone · {selected.scale ?? 100}%
                </span>
                <input
                  type="range"
                  min={60}
                  max={220}
                  value={selected.scale ?? 100}
                  onChange={(e) => patchItem(selectedId, { scale: Number(e.target.value) })}
                  className="w-full"
                />
              </label>
            </div>
          ) : null}
          {selected && selectedId && (stageItemRole(selected) === "headline" || stageItemRole(selected) === "subhead" || stageItemRole(selected) === "body") ? (
            <WordStyleEditor
              label={`Style ${stageItemRole(selected)} words`}
              hint="Type new words above, or rename one word below — then style color/font/size"
              selectedChip={wordChip}
              onSelectedChipChange={setWordChip}
              plain={
                stageItemRole(selected) === "headline"
                  ? page.headline
                  : stageItemRole(selected) === "subhead"
                    ? page.subhead
                    : page.body
              }
              runs={runsForPageField(
                page,
                stageItemRole(selected) === "headline"
                  ? "headline"
                  : stageItemRole(selected) === "subhead"
                    ? "subhead"
                    : "body",
              )}
              onChangeText={(value, nextRuns) => {
                const role = stageItemRole(selected);
                if (role === "headline") onPatchPage({ headline: value, headlineRuns: nextRuns });
                else if (role === "subhead") onPatchPage({ subhead: value, subheadRuns: nextRuns });
                else onPatchPage({ body: value, bodyRuns: nextRuns });
              }}
            />
          ) : null}
          {selected && selectedId ? (
            <>
          <label className="block space-y-1 rounded-lg border border-dt-red/40 bg-dt-red/10 px-2.5 py-2">
            <span className="text-[10px] font-semibold text-dt-red">
              Size on phone · {selected.scale ?? 100}%
            </span>
            <input
              type="range"
              min={60}
              max={220}
              value={selected.scale ?? 100}
              onChange={(e) => patchItem(selectedId, { scale: Number(e.target.value) })}
              className="w-full"
            />
            <span className="text-[9px] text-white/45">Drag to make this bigger or smaller on the phone</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => patchItem(selectedId, { glow: !selected.glow })}
              className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold ${
                selected.glow
                  ? "border-white/40 bg-white/10 text-white"
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
                  setSelectedId(null);
                }}
                className="rounded-lg border border-white/15 px-2.5 py-1.5 text-[10px] text-red-300/80"
              >
                Remove stamp
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="rounded-lg border border-white/15 px-2.5 py-1.5 text-[10px] text-white/50"
            >
              Done
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
            </>
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

function SettingsPreview({ experience }: { experience: ExperienceConfig }) {
  const page = experience.pages.settings;
  const logout = page.logoutLabel || "Log Out";
  const title = page.title || page.headline || "Account Settings";
  const rows = [
    { label: "Personal Information", description: "Update your name and profile photo" },
    { label: "Email Address", description: "Change the email on your account" },
    { label: "Phone Number", description: "Update your mobile number" },
    { label: logout, description: "Sign out of your account" },
  ];
  return (
    <PhoneFrame label="Account Settings" hint="Default settings layout — edit title & colors in the panel">
      <div
        className="flex h-[560px] flex-col"
        style={{ background: pageBackgroundCss(page) || themeBackgroundCss(experience.theme) }}
      >
        <div className="border-b border-white/10 px-4 pb-3 pt-8">
          <BrandMark experience={experience} />
        </div>
        <div className="flex-1 overflow-hidden px-3 pb-4 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">← Back</p>
          <div className="mt-5 text-center">
            <div
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border"
              style={{ borderColor: `${page.accentColor || experience.theme.accent}99` }}
            >
              <span className="text-lg" style={{ color: page.accentColor || experience.theme.accent }}>
                ⌘
              </span>
            </div>
            <p className="mt-3 font-display text-sm font-extrabold tracking-[0.12em] text-white">{title}</p>
            {page.body ? <p className="mt-1 text-[10px] text-white/50">{page.body}</p> : null}
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/35">
            {rows.map((row, index) => (
              <div
                key={row.label}
                className={`flex items-center gap-2 px-3 py-3 ${index > 0 ? "border-t border-white/10" : ""}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold tracking-wide text-white">{row.label}</p>
                  <p className="text-[9px] text-white/45">{row.description}</p>
                </div>
                <span className="text-white/30">›</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <StampTray experience={experience} />
    </PhoneFrame>
  );
}

function HomeHeaderPreview({
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
  return (
    <PhoneFrame
      label="Home header"
      hint="LIVE hero + home background — box grid is under Home boxes"
    >
      <div
        className="flex h-[560px] flex-col"
        style={{ background: pageBackgroundCss(page) || themeBackgroundCss(experience.theme) }}
      >
        <div className="border-b border-white/10 px-4 pb-3 pt-8">
          <BrandMark experience={experience} />
        </div>
        <div className="space-y-2 p-3">
          <div className="relative flex h-[118px] overflow-hidden rounded-2xl border border-dashed border-white/20 bg-black/35">
            {page.heroImage ? (
              <img
                src={resolveExperiencePreviewUrl(page.heroImage)}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent" />
            <div className="relative z-10 flex h-full flex-col justify-end p-3.5">
              <p className="font-display text-lg font-extrabold tracking-[0.12em] text-white">
                {(experience.brand.wordmark || "SLOANE").split(" ")[0]}{" "}
                <span style={{ color: experience.theme.accent }}>LIVE</span>
              </p>
              <p className="mt-0.5 text-[11px] text-white/55">
                {page.heroImage ? page.body || "Your hub" : "Upload hero art in this tab"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {["EXCLUSIVE\nVIDEOS", "LATEST NEWS\n& UPDATES", "EVENTS &\nGIVEAWAYS", "DOC &\nGLO"].map((title) => (
              <div
                key={title}
                className="flex min-h-[88px] rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-black/80 p-2.5"
              >
                <p className="font-display text-[10px] font-extrabold uppercase leading-tight tracking-wide text-white/80">
                  {title.split("\n").map((line, i, arr) => (
                    <span key={`${title}-${i}`}>
                      {line}
                      {i < arr.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-[9px] uppercase tracking-wide text-white/35">
            Blank starter boxes · edit images in Home boxes
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
  homePage: "Home header",
  boxes: "Home boxes",
};

export function ExperiencePhonePreview({
  experience,
  mode,
  pageKey,
  onPatchPage,
  onPatchBrand,
  onSaveLogo,
  onPlaceStamp,
  onRemoveStamp,
}: {
  experience: ExperienceConfig;
  mode: PhonePreviewMode;
  pageKey: ExperiencePageKey;
  onPatchPage?: (patch: Partial<ExperiencePageConfig>) => void;
  onPatchBrand?: (patch: Partial<ExperienceBrand>) => void;
  onSaveLogo?: () => void;
  onPlaceStamp?: (stampId: string) => void;
  onRemoveStamp?: (stampId: string) => void;
}) {
  if (mode === "settings") {
    return <SettingsPreview experience={experience} />;
  }
  if (mode === "homePage") {
    return (
      <HomeHeaderPreview
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
      onPatchBrand={onPatchBrand}
      onSaveLogo={onSaveLogo}
      onPlaceStamp={onPlaceStamp}
      onRemoveStamp={onRemoveStamp}
    />
  );
}

export { MODE_LABEL, createStampFromBrand, placeStampOnPage };
export type { ExperienceStamp };
