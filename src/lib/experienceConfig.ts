import type { TitleFontFamily } from "./typography";
import { normalizeTitleFontFamily } from "./typography";

export type ExperienceEffectPreset = "none" | "glow" | "shimmer" | "glass" | "neon" | "burst" | "rays" | "soft";

export type ExperienceBrand = {
  logoSrc: string;
  logoColor: string;
  /** Recolor illustrated logos with logoColor (mask tint). */
  logoTint: boolean;
  wordmark: string;
  wordmarkColor: string;
  wordmarkFontFamily?: TitleFontFamily;
  tagline: string;
  taglineColor: string;
  showLogoImage: boolean;
};

export type ExperienceTheme = {
  bg: string;
  bgGradientFrom: string;
  bgGradientVia: string;
  bgGradientTo: string;
  bgGradientAngle: number;
  useGradientBg: boolean;
  /** Optional full-bleed image behind the whole app chrome */
  backgroundImage: string;
  surface: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  accentHover: string;
  buttonBg: string;
  buttonText: string;
  buttonBorder: string;
  buttonRadius: number;
  fontDisplay?: TitleFontFamily;
  fontBody?: TitleFontFamily;
};

export type ExperienceEffects = {
  glow: boolean;
  glowColor: string;
  glowIntensity: number;
  particles: boolean;
  particleColor: string;
  noise: boolean;
  noiseOpacity: number;
  shimmer: boolean;
  blurBackdrop: boolean;
  vignette: boolean;
  animatedGradient: boolean;
  glassmorphism: boolean;
};

export type ExperienceBuiltinStageId =
  | "logo"
  | "wordmark"
  | "tagline"
  | "hero"
  | "subhead"
  | "headline"
  | "body"
  | "cta"
  | "titleArt";

/** Built-in stage ids, or stamp instance ids like `stamp_…`. */
export type ExperienceStageItemId = ExperienceBuiltinStageId | (string & {});

export type ExperienceStageItem = {
  id: string;
  /** Built-in role, or "stamp" for reusable logo placements. Defaults to id when builtin. */
  role?: ExperienceBuiltinStageId | "stamp";
  /** When role is stamp, points at ExperienceStamp.id */
  stampId?: string;
  /** Percent of stage width (0–100) */
  x: number;
  /** Percent of stage height (0–100) */
  y: number;
  /** Optional width percent */
  w: number;
  z: number;
  glow: boolean;
  glowColor: string;
  glowIntensity: number;
  /** Display scale percent (40–200), default 100 */
  scale?: number;
  hidden?: boolean;
  fillFrom?: string;
  fillTo?: string;
  borderColor?: string;
};

/** Saved reusable logos you can drop on any page. */
export type ExperienceStamp = {
  id: string;
  label: string;
  src: string;
};

export type ExperiencePageConfig = {
  backgroundColor: string;
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  useGradientBg: boolean;
  backgroundImage: string;
  headline: string;
  subhead: string;
  body: string;
  ctaLabel: string;
  ctaBg: string;
  ctaText: string;
  accentColor: string;
  heroImage: string;
  titleImage: string;
  /** Hero art scale percent (40–180). */
  heroScale: number;
  heroFit: "contain" | "cover";
  heroPosition: string;
  /** stack = classic flow; freeform = drag/overlap on phone canvas */
  layoutMode: "stack" | "freeform";
  stage: ExperienceStageItem[];
  effectPreset: ExperienceEffectPreset;
  loaderLabel?: string;
  title?: string;
  logoutLabel?: string;
};

export type ExperiencePages = {
  landing: ExperiencePageConfig;
  youreIn: ExperiencePageConfig;
  settings: ExperiencePageConfig;
  home: ExperiencePageConfig;
  videos: ExperiencePageConfig;
  news: ExperiencePageConfig;
  docAndGlo: ExperiencePageConfig;
};

export type WidgetVisualStyle = {
  backgroundColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  textColor?: string;
  accentColor?: string;
  borderColor?: string;
  effect?: ExperienceEffectPreset;
  overlayOpacity?: number;
};

export type ExperienceConfig = {
  brand: ExperienceBrand;
  theme: ExperienceTheme;
  effects: ExperienceEffects;
  pages: ExperiencePages;
  /** Reusable logo stamps — click to place on the current page */
  stamps: ExperienceStamp[];
};

export const DEFAULT_EXPERIENCE_BRAND: ExperienceBrand = {
  logoSrc: "/experience/logos/logo-ai-crown.png",
  logoColor: "#8FE3B8",
  logoTint: true,
  wordmark: "SLOANE GLO",
  wordmarkColor: "#FFFFFF",
  wordmarkFontFamily: "default",
  tagline: "One Circle. One Glow.",
  taglineColor: "#8FE3B8",
  showLogoImage: true,
};

export const DEFAULT_EXPERIENCE_THEME: ExperienceTheme = {
  bg: "#050505",
  bgGradientFrom: "#050505",
  bgGradientVia: "#0a1a12",
  bgGradientTo: "#05140e",
  bgGradientAngle: 160,
  useGradientBg: true,
  backgroundImage: "",
  surface: "#0c0c0c",
  card: "#121212",
  border: "rgba(255,255,255,0.12)",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.55)",
  accent: "#8FE3B8",
  accentHover: "#A8F0CC",
  buttonBg: "#8FE3B8",
  buttonText: "#04140c",
  buttonBorder: "transparent",
  buttonRadius: 999,
  fontDisplay: "default",
  fontBody: "source_sans",
};

export const DEFAULT_EXPERIENCE_EFFECTS: ExperienceEffects = {
  glow: true,
  glowColor: "#8FE3B8",
  glowIntensity: 45,
  particles: false,
  particleColor: "#8FE3B8",
  noise: true,
  noiseOpacity: 8,
  shimmer: false,
  blurBackdrop: true,
  vignette: true,
  animatedGradient: false,
  glassmorphism: true,
};

export const STAGE_ITEM_IDS: ExperienceBuiltinStageId[] = [
  "logo",
  "wordmark",
  "tagline",
  "hero",
  "titleArt",
  "subhead",
  "headline",
  "body",
  "cta",
];

export const DEFAULT_CONTENT_STAGE: ExperienceStageItem[] = [
  { id: "titleArt", x: 55, y: 8, w: 42, z: 8, scale: 100, glow: true, glowColor: "#8FE3B8", glowIntensity: 40 },
  {
    id: "headline",
    x: 4,
    y: 6,
    w: 50,
    z: 12,
    glow: false,
    glowColor: "#FFFFFF",
    glowIntensity: 30,
    fillFrom: "rgba(0,0,0,0.55)",
    fillTo: "rgba(0,0,0,0.2)",
    borderColor: "rgba(143,227,184,0.45)",
  },
  {
    id: "subhead",
    x: 4,
    y: 16,
    w: 50,
    z: 11,
    glow: false,
    glowColor: "#8FE3B8",
    glowIntensity: 30,
    fillFrom: "rgba(0,0,0,0.5)",
    fillTo: "rgba(0,0,0,0.15)",
    borderColor: "rgba(143,227,184,0.35)",
  },
  {
    id: "body",
    x: 4,
    y: 22,
    w: 55,
    z: 10,
    glow: false,
    glowColor: "#8FE3B8",
    glowIntensity: 30,
    fillFrom: "rgba(0,0,0,0.45)",
    fillTo: "rgba(0,0,0,0.12)",
    borderColor: "rgba(255,255,255,0.12)",
  },
];

export const DEFAULT_LANDING_STAGE: ExperienceStageItem[] = [
  { id: "logo", x: 4, y: 4, w: 14, z: 22, glow: true, glowColor: "#8FE3B8", glowIntensity: 40 },
  { id: "wordmark", x: 20, y: 5, w: 55, z: 21, glow: false, glowColor: "#FFFFFF", glowIntensity: 30 },
  { id: "tagline", x: 20, y: 9.5, w: 55, z: 20, glow: false, glowColor: "#8FE3B8", glowIntensity: 30 },
  { id: "hero", x: 8, y: 16, w: 84, z: 5, glow: true, glowColor: "#8FE3B8", glowIntensity: 35 },
  { id: "titleArt", x: 10, y: 48, w: 70, z: 12, glow: false, glowColor: "#8FE3B8", glowIntensity: 40 },
  { id: "subhead", x: 8, y: 52, w: 84, z: 14, glow: false, glowColor: "#8FE3B8", glowIntensity: 40 },
  { id: "headline", x: 8, y: 60, w: 84, z: 15, glow: true, glowColor: "#FFFFFF", glowIntensity: 25 },
  { id: "body", x: 8, y: 70, w: 84, z: 13, glow: false, glowColor: "#8FE3B8", glowIntensity: 30 },
  { id: "cta", x: 8, y: 84, w: 84, z: 18, glow: true, glowColor: "#8FE3B8", glowIntensity: 45 },
];

export function isBuiltinStageId(id: string): id is ExperienceBuiltinStageId {
  return (STAGE_ITEM_IDS as string[]).includes(id);
}

export function stageItemRole(item: ExperienceStageItem): ExperienceBuiltinStageId | "stamp" {
  if (item.role === "stamp" || item.stampId || String(item.id).startsWith("stamp_")) return "stamp";
  if (item.role && isBuiltinStageId(item.role)) return item.role;
  if (isBuiltinStageId(item.id)) return item.id;
  return "stamp";
}

export function createStampId() {
  return `stamp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function createStampFromBrand(brand: ExperienceBrand): ExperienceStamp | null {
  if (!brand.logoSrc) return null;
  return {
    id: createStampId(),
    label: brand.wordmark?.trim() || "Logo",
    src: brand.logoSrc,
  };
}

export function placeStampOnPage(
  page: ExperiencePageConfig,
  stamp: ExperienceStamp,
  spot?: { x?: number; y?: number },
): ExperienceStageItem[] {
  const base = (page.stage?.length ? page.stage : DEFAULT_LANDING_STAGE).map((item) => ({ ...item }));
  const count = base.filter((item) => stageItemRole(item) === "stamp").length;
  base.push({
    id: createStampId(),
    role: "stamp",
    stampId: stamp.id,
    x: Math.min(80, spot?.x ?? 8 + (count % 4) * 6),
    y: Math.min(80, spot?.y ?? 14 + Math.floor(count / 4) * 8),
    w: 16,
    z: 28 + count,
    glow: true,
    glowColor: "#8FE3B8",
    glowIntensity: 40,
  });
  return base;
}

function pageDefaults(partial: Partial<ExperiencePageConfig> = {}): ExperiencePageConfig {
  return {
    backgroundColor: "#050505",
    backgroundGradientFrom: "#050505",
    backgroundGradientTo: "#0a1a12",
    useGradientBg: true,
    backgroundImage: "",
    headline: "",
    subhead: "",
    body: "",
    ctaLabel: "Continue",
    ctaBg: "#8FE3B8",
    ctaText: "#04140c",
    accentColor: "#8FE3B8",
    heroImage: "",
    titleImage: "",
    heroScale: 100,
    heroFit: "contain",
    heroPosition: "right center",
    layoutMode: "freeform",
    stage: DEFAULT_LANDING_STAGE.map((item) => ({ ...item })),
    effectPreset: "soft",
    ...partial,
  };
}

export function getStageItem(
  page: ExperiencePageConfig,
  id: string,
): ExperienceStageItem {
  const found = (page.stage || []).find((item) => item.id === id);
  if (found) {
    const fallback = isBuiltinStageId(id)
      ? DEFAULT_CONTENT_STAGE.find((item) => item.id === id) ||
        DEFAULT_LANDING_STAGE.find((item) => item.id === id)
      : undefined;
    return fallback ? { ...fallback, ...found } : { ...found };
  }
  const fallback =
    DEFAULT_CONTENT_STAGE.find((item) => item.id === id) ||
    DEFAULT_LANDING_STAGE.find((item) => item.id === id);
  if (fallback) return { ...fallback };
  return {
    id,
    role: "stamp",
    x: 10,
    y: 10,
    w: 16,
    z: 20,
    glow: false,
    glowColor: "#8FE3B8",
    glowIntensity: 40,
  };
}

export function upsertStageItem(
  page: ExperiencePageConfig,
  patch: Partial<ExperienceStageItem> & { id: string },
): ExperienceStageItem[] {
  const base = (page.stage?.length ? page.stage : DEFAULT_LANDING_STAGE).map((item) => ({ ...item }));
  const idx = base.findIndex((item) => item.id === patch.id);
  if (idx >= 0) base[idx] = { ...base[idx], ...patch };
  else base.push({ ...getStageItem(page, patch.id), ...patch });
  return base;
}

export function removeStageItem(page: ExperiencePageConfig, id: string): ExperienceStageItem[] {
  const base = (page.stage?.length ? page.stage : DEFAULT_LANDING_STAGE).map((item) => ({ ...item }));
  return base.filter((item) => item.id !== id);
}

export function stageGlowStyle(item: ExperienceStageItem, kind: "text" | "image" | "box" = "text") {
  if (!item.glow) return {};
  const color = item.glowColor || "#8FE3B8";
  const intensity = Math.max(0, Math.min(100, item.glowIntensity ?? 40));
  if (kind === "text") {
    return {
      textShadow: `0 0 ${6 + intensity / 8}px ${color}, 0 0 ${14 + intensity / 4}px ${color}99`,
    };
  }
  return {
    filter: `drop-shadow(0 0 ${4 + intensity / 10}px ${color}) drop-shadow(0 0 ${12 + intensity / 5}px ${color}88)`,
  };
}

export function stageItemCss(item: ExperienceStageItem): Record<string, string | number> {
  const scalePct = item.scale != null ? Math.max(40, Math.min(200, item.scale)) : 100;
  const css: Record<string, string | number> = {
    position: "absolute",
    left: `${item.x}%`,
    top: `${item.y}%`,
    width: `${item.w || 80}%`,
    zIndex: item.z,
  };
  if (scalePct !== 100) {
    css.transform = `scale(${scalePct / 100})`;
    css.transformOrigin = "top left";
  }
  return css;
}

export const DEFAULT_EXPERIENCE_PAGES: ExperiencePages = {
  landing: pageDefaults({
    headline: "Join Sloane Glo",
    subhead: "THE OFFICIAL\nSLOANE GLO\nCOMMUNITY",
    body: "Exclusive drops, early access, giveaways, content, and real connection with Sloane and fans.",
    ctaLabel: "Join My Circle →",
    heroImage: "",
    titleImage: "",
    backgroundImage: "",
    effectPreset: "glow",
  }),
  youreIn: pageDefaults({
    headline: "You're in",
    subhead: "Welcome to Sloane Glo",
    body: "We're preparing your experience…",
    loaderLabel: "Preparing your experience...",
    effectPreset: "burst",
    ctaLabel: "Enter",
  }),
    settings: pageDefaults({
      title: "Account Settings",
      headline: "Account Settings",
      body: "Manage your account details, contact info, and sign out.",
      logoutLabel: "Log Out",
      effectPreset: "glass",
    }),
  home: pageDefaults({
    headline: "Home",
    body: "Your Sloane Glo hub",
    effectPreset: "soft",
  }),
  videos: pageDefaults({
    headline: "Exclusive Videos",
    subhead: "YOUTUBE · EXCLUSIVE",
    body: "Clips, YouTube uploads, and members-only video.",
    accentColor: "#8FE3B8",
    effectPreset: "glow",
    stage: DEFAULT_CONTENT_STAGE.map((item) => ({ ...item })),
    layoutMode: "freeform",
  }),
  news: pageDefaults({
    headline: "Latest News",
    subhead: "NEWSLETTERS · INSIGHTS",
    body: "Newsletters and insights for the circle.",
    accentColor: "#8FE3B8",
    effectPreset: "soft",
    stage: DEFAULT_CONTENT_STAGE.map((item) => ({ ...item })),
    layoutMode: "freeform",
  }),
  docAndGlo: pageDefaults({
    headline: "Clean body care for bodies in motion",
    subhead: "DOC & GLO",
    body: "Sloane Stephens' vegan, cruelty-free skincare — curated for Sloane Glo fans.",
    accentColor: "#8FE3B8",
    ctaLabel: "Shop Doc & Glo",
    effectPreset: "glass",
    stage: DEFAULT_CONTENT_STAGE.map((item) => ({ ...item })),
    layoutMode: "freeform",
  }),
};

export const DEFAULT_EXPERIENCE_CONFIG: ExperienceConfig = {
  brand: DEFAULT_EXPERIENCE_BRAND,
  theme: DEFAULT_EXPERIENCE_THEME,
  effects: DEFAULT_EXPERIENCE_EFFECTS,
  pages: DEFAULT_EXPERIENCE_PAGES,
  stamps: [],
};

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asBool(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

const EFFECT_PRESETS: ExperienceEffectPreset[] = [
  "none",
  "glow",
  "shimmer",
  "glass",
  "neon",
  "burst",
  "rays",
  "soft",
];

function normalizeEffectPreset(value: unknown, fallback: ExperienceEffectPreset = "none"): ExperienceEffectPreset {
  const raw = String(value || "").toLowerCase();
  return EFFECT_PRESETS.includes(raw as ExperienceEffectPreset)
    ? (raw as ExperienceEffectPreset)
    : fallback;
}

export function normalizeExperienceBrand(raw: unknown): ExperienceBrand {
  const b = (raw ?? {}) as Partial<ExperienceBrand>;
  return {
    logoSrc: asString(b.logoSrc, DEFAULT_EXPERIENCE_BRAND.logoSrc),
    logoColor: asString(b.logoColor, DEFAULT_EXPERIENCE_BRAND.logoColor),
    logoTint: asBool(b.logoTint, DEFAULT_EXPERIENCE_BRAND.logoTint),
    wordmark: asString(b.wordmark, DEFAULT_EXPERIENCE_BRAND.wordmark),
    wordmarkColor: asString(b.wordmarkColor, DEFAULT_EXPERIENCE_BRAND.wordmarkColor),
    wordmarkFontFamily: normalizeTitleFontFamily(b.wordmarkFontFamily) ?? DEFAULT_EXPERIENCE_BRAND.wordmarkFontFamily,
    tagline: asString(b.tagline, DEFAULT_EXPERIENCE_BRAND.tagline),
    taglineColor: asString(b.taglineColor, DEFAULT_EXPERIENCE_BRAND.taglineColor),
    showLogoImage: asBool(b.showLogoImage, true),
  };
}

export function normalizeExperienceTheme(raw: unknown): ExperienceTheme {
  const t = (raw ?? {}) as Partial<ExperienceTheme>;
  return {
    bg: asString(t.bg, DEFAULT_EXPERIENCE_THEME.bg),
    bgGradientFrom: asString(t.bgGradientFrom, DEFAULT_EXPERIENCE_THEME.bgGradientFrom),
    bgGradientVia: asString(t.bgGradientVia, DEFAULT_EXPERIENCE_THEME.bgGradientVia),
    bgGradientTo: asString(t.bgGradientTo, DEFAULT_EXPERIENCE_THEME.bgGradientTo),
    bgGradientAngle: asNumber(t.bgGradientAngle, DEFAULT_EXPERIENCE_THEME.bgGradientAngle),
    useGradientBg: asBool(t.useGradientBg, true),
    backgroundImage: asString(t.backgroundImage, DEFAULT_EXPERIENCE_THEME.backgroundImage),
    surface: asString(t.surface, DEFAULT_EXPERIENCE_THEME.surface),
    card: asString(t.card, DEFAULT_EXPERIENCE_THEME.card),
    border: asString(t.border, DEFAULT_EXPERIENCE_THEME.border),
    text: asString(t.text, DEFAULT_EXPERIENCE_THEME.text),
    muted: asString(t.muted, DEFAULT_EXPERIENCE_THEME.muted),
    accent: asString(t.accent, DEFAULT_EXPERIENCE_THEME.accent),
    accentHover: asString(t.accentHover, DEFAULT_EXPERIENCE_THEME.accentHover),
    buttonBg: asString(t.buttonBg, DEFAULT_EXPERIENCE_THEME.buttonBg),
    buttonText: asString(t.buttonText, DEFAULT_EXPERIENCE_THEME.buttonText),
    buttonBorder: asString(t.buttonBorder, DEFAULT_EXPERIENCE_THEME.buttonBorder),
    buttonRadius: asNumber(t.buttonRadius, DEFAULT_EXPERIENCE_THEME.buttonRadius),
    fontDisplay: normalizeTitleFontFamily(t.fontDisplay) ?? DEFAULT_EXPERIENCE_THEME.fontDisplay,
    fontBody: normalizeTitleFontFamily(t.fontBody) ?? DEFAULT_EXPERIENCE_THEME.fontBody,
  };
}

export function normalizeExperienceEffects(raw: unknown): ExperienceEffects {
  const e = (raw ?? {}) as Partial<ExperienceEffects>;
  return {
    glow: asBool(e.glow, DEFAULT_EXPERIENCE_EFFECTS.glow),
    glowColor: asString(e.glowColor, DEFAULT_EXPERIENCE_EFFECTS.glowColor),
    glowIntensity: Math.max(0, Math.min(100, asNumber(e.glowIntensity, DEFAULT_EXPERIENCE_EFFECTS.glowIntensity))),
    particles: asBool(e.particles, DEFAULT_EXPERIENCE_EFFECTS.particles),
    particleColor: asString(e.particleColor, DEFAULT_EXPERIENCE_EFFECTS.particleColor),
    noise: asBool(e.noise, DEFAULT_EXPERIENCE_EFFECTS.noise),
    noiseOpacity: Math.max(0, Math.min(40, asNumber(e.noiseOpacity, DEFAULT_EXPERIENCE_EFFECTS.noiseOpacity))),
    shimmer: asBool(e.shimmer, DEFAULT_EXPERIENCE_EFFECTS.shimmer),
    blurBackdrop: asBool(e.blurBackdrop, DEFAULT_EXPERIENCE_EFFECTS.blurBackdrop),
    vignette: asBool(e.vignette, DEFAULT_EXPERIENCE_EFFECTS.vignette),
    animatedGradient: asBool(e.animatedGradient, DEFAULT_EXPERIENCE_EFFECTS.animatedGradient),
    glassmorphism: asBool(e.glassmorphism, DEFAULT_EXPERIENCE_EFFECTS.glassmorphism),
  };
}

export function normalizeExperiencePage(
  raw: unknown,
  fallback: ExperiencePageConfig,
): ExperiencePageConfig {
  const p = (raw ?? {}) as Partial<ExperiencePageConfig>;
  return {
    backgroundColor: asString(p.backgroundColor, fallback.backgroundColor),
    backgroundGradientFrom: asString(p.backgroundGradientFrom, fallback.backgroundGradientFrom),
    backgroundGradientTo: asString(p.backgroundGradientTo, fallback.backgroundGradientTo),
    useGradientBg: asBool(p.useGradientBg, fallback.useGradientBg),
    backgroundImage: asString(p.backgroundImage, fallback.backgroundImage),
    headline: asString(p.headline, fallback.headline),
    subhead: asString(p.subhead, fallback.subhead),
    body: asString(p.body, fallback.body),
    ctaLabel: asString(p.ctaLabel, fallback.ctaLabel),
    ctaBg: asString(p.ctaBg, fallback.ctaBg),
    ctaText: asString(p.ctaText, fallback.ctaText),
    accentColor: asString(p.accentColor, fallback.accentColor),
    heroImage: asString(p.heroImage, fallback.heroImage),
    titleImage: asString(p.titleImage, fallback.titleImage),
    heroScale: Math.max(40, Math.min(180, asNumber(p.heroScale, fallback.heroScale ?? 100))),
    heroFit: p.heroFit === "cover" ? "cover" : "contain",
    heroPosition: asString(p.heroPosition, fallback.heroPosition || "right center"),
    layoutMode: p.layoutMode === "stack" ? "stack" : "freeform",
    stage: normalizeStage(p.stage, fallback.stage),
    effectPreset: normalizeEffectPreset(p.effectPreset, fallback.effectPreset),
    loaderLabel: asString(p.loaderLabel, fallback.loaderLabel || ""),
    title: asString(p.title, fallback.title || ""),
    logoutLabel: asString(p.logoutLabel, fallback.logoutLabel || ""),
  };
}

function normalizeStageItem(row: Partial<ExperienceStageItem>, prev: ExperienceStageItem): ExperienceStageItem {
  const role = stageItemRole({ ...prev, ...row, id: String(row.id || prev.id) });
  return {
    id: String(row.id || prev.id),
    role,
    stampId: role === "stamp" ? asString(row.stampId, prev.stampId || "") || undefined : undefined,
    x: Math.max(0, Math.min(95, asNumber(row.x, prev.x))),
    y: Math.max(0, Math.min(95, asNumber(row.y, prev.y))),
    w: Math.max(8, Math.min(100, asNumber(row.w, prev.w))),
    z: Math.max(0, Math.min(100, asNumber(row.z, prev.z))),
    glow: asBool(row.glow, prev.glow),
    glowColor: asString(row.glowColor, prev.glowColor),
    glowIntensity: Math.max(0, Math.min(100, asNumber(row.glowIntensity, prev.glowIntensity))),
    scale: Math.max(40, Math.min(200, asNumber(row.scale, prev.scale ?? 100))),
    hidden: asBool(row.hidden, prev.hidden ?? false),
    fillFrom: asString(row.fillFrom, prev.fillFrom ?? ""),
    fillTo: asString(row.fillTo, prev.fillTo ?? ""),
    borderColor: asString(row.borderColor, prev.borderColor ?? ""),
  };
}

function migrateLegacyBrandStage(list: unknown[]): ExperienceStageItem[] {
  const rows = list.filter((item) => item && typeof item === "object") as Partial<ExperienceStageItem>[];
  const brand = rows.find((item) => String(item.id) === "brand");
  if (!brand) return [];
  const hasLogo = rows.some((item) => String(item.id) === "logo");
  if (hasLogo) return [];
  const x = asNumber(brand.x, 4);
  const y = asNumber(brand.y, 4);
  const glow = asBool(brand.glow, true);
  const glowColor = asString(brand.glowColor, "#8FE3B8");
  const glowIntensity = asNumber(brand.glowIntensity, 40);
  const z = asNumber(brand.z, 20);
  return [
    { id: "logo", x, y, w: 14, z: z + 2, glow, glowColor, glowIntensity },
    { id: "wordmark", x: Math.min(80, x + 16), y: y + 1, w: 55, z: z + 1, glow: false, glowColor: "#FFFFFF", glowIntensity: 30 },
    { id: "tagline", x: Math.min(80, x + 16), y: y + 5.5, w: 55, z, glow: false, glowColor, glowIntensity: 30 },
  ];
}

function normalizeStage(raw: unknown, fallback: ExperienceStageItem[]): ExperienceStageItem[] {
  const list = Array.isArray(raw) ? raw : fallback;
  const byId = new Map<string, ExperienceStageItem>();
  for (const item of DEFAULT_LANDING_STAGE) byId.set(item.id, { ...item });
  for (const item of fallback || []) {
    if (item?.id && isBuiltinStageId(item.id)) {
      byId.set(item.id, { ...byId.get(item.id)!, ...item });
    }
  }
  for (const migrated of migrateLegacyBrandStage(list)) {
    byId.set(migrated.id, migrated);
  }
  const stamps: ExperienceStageItem[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const row = item as Partial<ExperienceStageItem>;
    const id = String(row.id || "");
    if (!id || id === "brand") continue;
    if (isBuiltinStageId(id)) {
      const prev = byId.get(id) || DEFAULT_LANDING_STAGE.find((d) => d.id === id)!;
      byId.set(id, normalizeStageItem(row, prev));
      continue;
    }
    if (stageItemRole({ ...(row as ExperienceStageItem), id }) === "stamp") {
      stamps.push(
        normalizeStageItem(row, {
          id,
          role: "stamp",
          stampId: asString(row.stampId, ""),
          x: 10,
          y: 10,
          w: 16,
          z: 28,
          glow: true,
          glowColor: "#8FE3B8",
          glowIntensity: 40,
        }),
      );
    }
  }
  return [...STAGE_ITEM_IDS.map((id) => byId.get(id)!).filter(Boolean), ...stamps];
}

export function normalizeExperienceStamps(raw: unknown): ExperienceStamp[] {
  if (!Array.isArray(raw)) return [];
  const out: ExperienceStamp[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Partial<ExperienceStamp>;
    const src = asString(row.src, "");
    if (!src) continue;
    out.push({
      id: asString(row.id, createStampId()),
      label: asString(row.label, "Logo"),
      src,
    });
  }
  return out;
}

export function normalizeExperiencePages(raw: unknown): ExperiencePages {
  const p = (raw ?? {}) as Partial<ExperiencePages>;
  return {
    landing: normalizeExperiencePage(p.landing, DEFAULT_EXPERIENCE_PAGES.landing),
    youreIn: normalizeExperiencePage(p.youreIn, DEFAULT_EXPERIENCE_PAGES.youreIn),
    settings: normalizeExperiencePage(p.settings, DEFAULT_EXPERIENCE_PAGES.settings),
    home: normalizeExperiencePage(p.home, DEFAULT_EXPERIENCE_PAGES.home),
    videos: normalizeExperiencePage(p.videos, DEFAULT_EXPERIENCE_PAGES.videos),
    news: normalizeExperiencePage(p.news, DEFAULT_EXPERIENCE_PAGES.news),
    docAndGlo: normalizeExperiencePage(p.docAndGlo, DEFAULT_EXPERIENCE_PAGES.docAndGlo),
  };
}

export function normalizeExperienceConfig(raw: unknown): ExperienceConfig {
  const c = (raw ?? {}) as Partial<ExperienceConfig>;
  return {
    brand: normalizeExperienceBrand(c.brand),
    theme: normalizeExperienceTheme(c.theme),
    effects: normalizeExperienceEffects(c.effects),
    pages: normalizeExperiencePages(c.pages),
    stamps: normalizeExperienceStamps(c.stamps),
  };
}

export function normalizeWidgetVisualStyle(raw: unknown): WidgetVisualStyle | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const s = raw as WidgetVisualStyle;
  return {
    backgroundColor: s.backgroundColor ? String(s.backgroundColor) : undefined,
    gradientFrom: s.gradientFrom ? String(s.gradientFrom) : undefined,
    gradientTo: s.gradientTo ? String(s.gradientTo) : undefined,
    textColor: s.textColor ? String(s.textColor) : undefined,
    accentColor: s.accentColor ? String(s.accentColor) : undefined,
    borderColor: s.borderColor ? String(s.borderColor) : undefined,
    effect: s.effect ? normalizeEffectPreset(s.effect) : undefined,
    overlayOpacity:
      typeof s.overlayOpacity === "number" ? Math.max(0, Math.min(1, s.overlayOpacity)) : undefined,
  };
}

export function themeBackgroundCss(theme: ExperienceTheme) {
  if (theme.backgroundImage) {
    const wash = theme.useGradientBg
      ? `linear-gradient(${theme.bgGradientAngle}deg, ${theme.bgGradientFrom}cc, ${theme.bgGradientTo}ee)`
      : `linear-gradient(180deg, ${theme.bg}99, ${theme.bg})`;
    return `${wash}, center / cover no-repeat url(${theme.backgroundImage})`;
  }
  if (!theme.useGradientBg) return theme.bg;
  return `linear-gradient(${theme.bgGradientAngle}deg, ${theme.bgGradientFrom}, ${theme.bgGradientVia}, ${theme.bgGradientTo})`;
}

export function pageBackgroundCss(page: ExperiencePageConfig) {
  if (page.backgroundImage) {
    return `center / cover no-repeat url(${page.backgroundImage})`;
  }
  if (page.useGradientBg) {
    return `linear-gradient(160deg, ${page.backgroundGradientFrom}, ${page.backgroundGradientTo})`;
  }
  return page.backgroundColor;
}

export function applyExperienceCssVars(
  root: HTMLElement,
  config: ExperienceConfig,
) {
  const { brand, theme, effects } = config;
  root.style.setProperty("--xp-bg", theme.bg);
  root.style.setProperty("--xp-bg-image", themeBackgroundCss(theme));
  root.style.setProperty("--xp-surface", theme.surface);
  root.style.setProperty("--xp-card", theme.card);
  root.style.setProperty("--xp-border", theme.border);
  root.style.setProperty("--xp-text", theme.text);
  root.style.setProperty("--xp-muted", theme.muted);
  root.style.setProperty("--xp-accent", theme.accent);
  root.style.setProperty("--xp-accent-hover", theme.accentHover);
  root.style.setProperty("--xp-button-bg", theme.buttonBg);
  root.style.setProperty("--xp-button-text", theme.buttonText);
  root.style.setProperty("--xp-button-border", theme.buttonBorder);
  root.style.setProperty("--xp-button-radius", `${theme.buttonRadius}px`);
  root.style.setProperty("--xp-logo-color", brand.logoColor);
  root.style.setProperty("--xp-wordmark-color", brand.wordmarkColor);
  root.style.setProperty("--xp-tagline-color", brand.taglineColor);
  root.style.setProperty("--xp-glow-color", effects.glowColor);
  root.style.setProperty("--xp-glow-intensity", String(effects.glowIntensity / 100));
  root.style.setProperty("--xp-noise-opacity", String(effects.noiseOpacity / 100));
  root.style.setProperty("--xp-particle-color", effects.particleColor);
  root.dataset.xpGlow = effects.glow ? "1" : "0";
  root.dataset.xpParticles = effects.particles ? "1" : "0";
  root.dataset.xpNoise = effects.noise ? "1" : "0";
  root.dataset.xpShimmer = effects.shimmer ? "1" : "0";
  root.dataset.xpBlur = effects.blurBackdrop ? "1" : "0";
  root.dataset.xpVignette = effects.vignette ? "1" : "0";
  root.dataset.xpAnimatedGradient = effects.animatedGradient ? "1" : "0";
  root.dataset.xpGlass = effects.glassmorphism ? "1" : "0";
}

export function widgetStyleCss(style?: WidgetVisualStyle): Record<string, string> {
  if (!style) return {};
  const css: Record<string, string> = {};
  if (style.gradientFrom && style.gradientTo) {
    css.backgroundImage = `linear-gradient(135deg, ${style.gradientFrom}, ${style.gradientTo})`;
  } else if (style.backgroundColor) {
    css.backgroundColor = style.backgroundColor;
  }
  if (style.textColor) css.color = style.textColor;
  if (style.borderColor) css.borderColor = style.borderColor;
  if (style.effect === "glow" && style.accentColor) {
    css.boxShadow = `0 0 24px ${style.accentColor}66, inset 0 0 20px ${style.accentColor}22`;
  }
  if (style.effect === "neon" && style.accentColor) {
    css.boxShadow = `0 0 8px ${style.accentColor}, 0 0 24px ${style.accentColor}`;
  }
  if (style.effect === "glass") {
    css.backdropFilter = "blur(12px)";
    css.backgroundColor = style.backgroundColor || "rgba(255,255,255,0.06)";
  }
  return css;
}
