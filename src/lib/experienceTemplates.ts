import type { ExperienceBrand, ExperienceConfig, ExperienceEffects, ExperienceTheme } from "./experienceConfig";

/**
 * Wix-style starter templates for the fan app. Each template is a themed
 * "look" (colors, buttons, fonts, effects) that can be applied on top of the
 * athlete's existing content without touching their copy or boxes.
 */
export type ExperienceTemplate = {
  id: string;
  label: string;
  vibe: string;
  /** Swatches shown in the gallery card, dark → accent. */
  swatches: string[];
  theme: Partial<ExperienceTheme>;
  effects: Partial<ExperienceEffects>;
  brand: Partial<ExperienceBrand>;
};

export const EXPERIENCE_TEMPLATES: ExperienceTemplate[] = [
  {
    id: "mint-night",
    label: "Mint Night",
    vibe: "Dark, clean, tennis-court calm",
    swatches: ["#050505", "#0A1A12", "#7CE7B0", "#A8F0CC"],
    theme: {
      bg: "#050505",
      bgGradientFrom: "#050505",
      bgGradientVia: "#0A1A12",
      bgGradientTo: "#05140E",
      bgGradientAngle: 160,
      useGradientBg: true,
      accent: "#7CE7B0",
      accentHover: "#A8F0CC",
      buttonBg: "#7CE7B0",
      buttonText: "#04231A",
      buttonBorder: "#7CE7B0",
      buttonRadius: 999,
      text: "#FFFFFF",
      muted: "#A3B3AA",
    },
    effects: { glow: true, glowColor: "#7CE7B0", glowIntensity: 45, particles: false, vignette: true },
    brand: { wordmarkColor: "#7CE7B0", taglineColor: "#A8F0CC" },
  },
  {
    id: "court-crimson",
    label: "Court Crimson",
    vibe: "Bold game-day energy",
    swatches: ["#080404", "#240A0C", "#ED2B3A", "#FF7A85"],
    theme: {
      bg: "#080404",
      bgGradientFrom: "#080404",
      bgGradientVia: "#240A0C",
      bgGradientTo: "#120506",
      bgGradientAngle: 155,
      useGradientBg: true,
      accent: "#ED2B3A",
      accentHover: "#FF7A85",
      buttonBg: "#ED2B3A",
      buttonText: "#FFFFFF",
      buttonBorder: "#ED2B3A",
      buttonRadius: 14,
      text: "#FFFFFF",
      muted: "#C6A9AC",
    },
    effects: { glow: true, glowColor: "#ED2B3A", glowIntensity: 55, particles: false, vignette: true },
    brand: { wordmarkColor: "#FFFFFF", taglineColor: "#FF7A85" },
  },
  {
    id: "gold-standard",
    label: "Gold Standard",
    vibe: "Luxury, championship, editorial",
    swatches: ["#0A0803", "#1C1608", "#D4AF37", "#F3DC96"],
    theme: {
      bg: "#0A0803",
      bgGradientFrom: "#0A0803",
      bgGradientVia: "#1C1608",
      bgGradientTo: "#0A0803",
      bgGradientAngle: 170,
      useGradientBg: true,
      accent: "#D4AF37",
      accentHover: "#F3DC96",
      buttonBg: "#D4AF37",
      buttonText: "#1A1204",
      buttonBorder: "#D4AF37",
      buttonRadius: 4,
      text: "#FFF8E7",
      muted: "#B9AC8B",
    },
    effects: { glow: true, glowColor: "#D4AF37", glowIntensity: 35, shimmer: true, vignette: true },
    brand: { wordmarkColor: "#D4AF37", taglineColor: "#F3DC96" },
  },
  {
    id: "electric-pop",
    label: "Electric Pop",
    vibe: "Hot pink, loud, gen-z",
    swatches: ["#07040A", "#1B0722", "#FF2D95", "#8B5CF6"],
    theme: {
      bg: "#07040A",
      bgGradientFrom: "#07040A",
      bgGradientVia: "#1B0722",
      bgGradientTo: "#0B0416",
      bgGradientAngle: 145,
      useGradientBg: true,
      accent: "#FF2D95",
      accentHover: "#FF6FB8",
      buttonBg: "#FF2D95",
      buttonText: "#FFFFFF",
      buttonBorder: "#FF2D95",
      buttonRadius: 999,
      text: "#FFFFFF",
      muted: "#C3A8D2",
    },
    effects: {
      glow: true,
      glowColor: "#FF2D95",
      glowIntensity: 65,
      particles: true,
      particleColor: "#8B5CF6",
      animatedGradient: true,
    },
    brand: { wordmarkColor: "#FF2D95", taglineColor: "#FFFFFF" },
  },
  {
    id: "ice-blue",
    label: "Ice Blue",
    vibe: "Cool, technical, performance",
    swatches: ["#03060B", "#08182A", "#38BDF8", "#BAE6FD"],
    theme: {
      bg: "#03060B",
      bgGradientFrom: "#03060B",
      bgGradientVia: "#08182A",
      bgGradientTo: "#040A14",
      bgGradientAngle: 165,
      useGradientBg: true,
      accent: "#38BDF8",
      accentHover: "#BAE6FD",
      buttonBg: "#38BDF8",
      buttonText: "#04121D",
      buttonBorder: "#38BDF8",
      buttonRadius: 12,
      text: "#F2FAFF",
      muted: "#9CB3C4",
    },
    effects: { glow: true, glowColor: "#38BDF8", glowIntensity: 40, blurBackdrop: true, glassmorphism: true },
    brand: { wordmarkColor: "#FFFFFF", taglineColor: "#BAE6FD" },
  },
  {
    id: "chalk-white",
    label: "Chalk",
    vibe: "Minimal light mode, print-clean",
    swatches: ["#F7F7F5", "#E8E8E4", "#111111", "#5B5B57"],
    theme: {
      bg: "#F7F7F5",
      bgGradientFrom: "#FFFFFF",
      bgGradientVia: "#F1F1EE",
      bgGradientTo: "#E8E8E4",
      bgGradientAngle: 180,
      useGradientBg: true,
      accent: "#111111",
      accentHover: "#333333",
      buttonBg: "#111111",
      buttonText: "#FFFFFF",
      buttonBorder: "#111111",
      buttonRadius: 8,
      text: "#111111",
      muted: "#5B5B57",
    },
    effects: {
      glow: false,
      particles: false,
      noise: false,
      shimmer: false,
      vignette: false,
      animatedGradient: false,
      glassmorphism: false,
    },
    brand: { wordmarkColor: "#111111", taglineColor: "#5B5B57" },
  },
];

/** Apply a template's look on top of an existing experience config. */
export function applyExperienceTemplate(
  config: ExperienceConfig,
  template: ExperienceTemplate,
): ExperienceConfig {
  const ctaBg = template.theme.buttonBg;
  const ctaText = template.theme.buttonText;
  const pages = Object.fromEntries(
    Object.entries(config.pages).map(([key, page]) => [
      key,
      ctaBg && ctaText ? { ...page, ctaBg, ctaText } : page,
    ]),
  ) as ExperienceConfig["pages"];

  return {
    ...config,
    brand: { ...config.brand, ...template.brand },
    theme: { ...config.theme, ...template.theme },
    effects: { ...config.effects, ...template.effects },
    pages,
  };
}

/** Best-guess of which template the current theme came from (accent match). */
export function detectExperienceTemplate(config: ExperienceConfig): string | null {
  const accent = config.theme.accent?.toUpperCase();
  return (
    EXPERIENCE_TEMPLATES.find((t) => t.theme.accent?.toUpperCase() === accent)?.id ?? null
  );
}
