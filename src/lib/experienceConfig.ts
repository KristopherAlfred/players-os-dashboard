import type { TitleFontFamily } from "./typography";
import { normalizeTitleFontFamily } from "./typography";

export type ExperienceEffectPreset = "none" | "glow" | "shimmer" | "glass" | "neon" | "burst" | "rays" | "soft";

export type ExperienceBrand = {
  logoSrc: string;
  logoColor: string;
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
};

export const DEFAULT_EXPERIENCE_BRAND: ExperienceBrand = {
  logoSrc: "/experience/logos/logo-ai-crown.png",
  logoColor: "#8FE3B8",
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
    effectPreset: "soft",
    ...partial,
  };
}

export const DEFAULT_EXPERIENCE_PAGES: ExperiencePages = {
  landing: pageDefaults({
    headline: "Join Sloane Glo",
    subhead: "THE OFFICIAL\nSLOANE GLO\nCOMMUNITY",
    body: "Exclusive drops, early access, giveaways, content, and real connection with Sloane and fans.",
    ctaLabel: "Join My Circle →",
    heroImage: "",
    titleImage: "",
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
    body: "Manage your Sloane Glo account",
    logoutLabel: "Log Out",
    effectPreset: "glass",
  }),
  home: pageDefaults({
    headline: "Home",
    body: "Your Sloane Glo hub",
    effectPreset: "soft",
  }),
};

export const DEFAULT_EXPERIENCE_CONFIG: ExperienceConfig = {
  brand: DEFAULT_EXPERIENCE_BRAND,
  theme: DEFAULT_EXPERIENCE_THEME,
  effects: DEFAULT_EXPERIENCE_EFFECTS,
  pages: DEFAULT_EXPERIENCE_PAGES,
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
    effectPreset: normalizeEffectPreset(p.effectPreset, fallback.effectPreset),
    loaderLabel: asString(p.loaderLabel, fallback.loaderLabel || ""),
    title: asString(p.title, fallback.title || ""),
    logoutLabel: asString(p.logoutLabel, fallback.logoutLabel || ""),
  };
}

export function normalizeExperiencePages(raw: unknown): ExperiencePages {
  const p = (raw ?? {}) as Partial<ExperiencePages>;
  return {
    landing: normalizeExperiencePage(p.landing, DEFAULT_EXPERIENCE_PAGES.landing),
    youreIn: normalizeExperiencePage(p.youreIn, DEFAULT_EXPERIENCE_PAGES.youreIn),
    settings: normalizeExperiencePage(p.settings, DEFAULT_EXPERIENCE_PAGES.settings),
    home: normalizeExperiencePage(p.home, DEFAULT_EXPERIENCE_PAGES.home),
  };
}

export function normalizeExperienceConfig(raw: unknown): ExperienceConfig {
  const c = (raw ?? {}) as Partial<ExperienceConfig>;
  return {
    brand: normalizeExperienceBrand(c.brand),
    theme: normalizeExperienceTheme(c.theme),
    effects: normalizeExperienceEffects(c.effects),
    pages: normalizeExperiencePages(c.pages),
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
