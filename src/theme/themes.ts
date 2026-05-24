export type ThemeTemplate = "default" | "team" | "athlete";

export interface ThemePalette {
  bg: string;
  panel: string;
  card: string;
  border: string;
  muted: string;
  text: string;
  accent: string;
  accentHover: string;
  chartSecondary: string;
  chartTertiary: string;
  trafficShades: string[];
}

function shades(base: string): string[] {
  return [base, lighten(base, 0.12), lighten(base, 0.24), lighten(base, 0.36), lighten(base, 0.48), lighten(base, 0.6)];
}

function lighten(hex: string, amount: number): string {
  const n = hex.replace("#", "");
  const r = Math.min(255, parseInt(n.slice(0, 2), 16) + Math.round(255 * amount));
  const g = Math.min(255, parseInt(n.slice(2, 4), 16) + Math.round(255 * amount));
  const b = Math.min(255, parseInt(n.slice(4, 6), 16) + Math.round(255 * amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const defaultPalette: ThemePalette = {
  bg: "#080808",
  panel: "#0f0f0f",
  card: "#121212",
  border: "#1e1e1e",
  muted: "#8a8a8a",
  text: "#f0f0f0",
  accent: "#e50914",
  accentHover: "#ff1a26",
  chartSecondary: "#991b1b",
  chartTertiary: "#450a0a",
  trafficShades: shades("#e50914"),
};

const teamPalette: ThemePalette = {
  bg: "#0a0a0a",
  panel: "#111111",
  card: "#141414",
  border: "#1f1f1f",
  muted: "#8a8a8a",
  text: "#f0f0f0",
  accent: "#e03a3e",
  accentHover: "#ff4d52",
  chartSecondary: "#9f2b2e",
  chartTertiary: "#5c181a",
  trafficShades: shades("#e03a3e"),
};

const athletePalette: ThemePalette = {
  bg: "#0a0b14",
  panel: "#12131f",
  card: "#161827",
  border: "#252838",
  muted: "#9498b0",
  text: "#eef0f8",
  accent: "#a855f7",
  accentHover: "#c084fc",
  chartSecondary: "#7c3aed",
  chartTertiary: "#4c1d95",
  trafficShades: shades("#a855f7"),
};

export const themeTemplates: {
  id: ThemeTemplate;
  name: string;
  description: string;
  swatches: string[];
}[] = [
  {
    id: "team",
    name: "Team Template",
    description: "Rip City red & black — Portland Trail Blazers palette",
    swatches: ["#e03a3e", "#111111", "#000000"],
  },
  {
    id: "default",
    name: "Default Template",
    description: "Classic DameTime red & black",
    swatches: ["#e50914", "#121212", "#080808"],
  },
  {
    id: "athlete",
    name: "Athlete Vibe",
    description: "Electric purple & midnight — premium athlete aesthetic",
    swatches: ["#a855f7", "#14b8a6", "#0a0b14"],
  },
];

export function getPalette(template: ThemeTemplate): ThemePalette {
  switch (template) {
    case "team":
      return teamPalette;
    case "athlete":
      return athletePalette;
    default:
      return defaultPalette;
  }
}

export function applyPalette(palette: ThemePalette) {
  const root = document.documentElement;
  root.style.setProperty("--theme-bg", palette.bg);
  root.style.setProperty("--theme-panel", palette.panel);
  root.style.setProperty("--theme-card", palette.card);
  root.style.setProperty("--theme-border", palette.border);
  root.style.setProperty("--theme-muted", palette.muted);
  root.style.setProperty("--theme-text", palette.text);
  root.style.setProperty("--theme-accent", palette.accent);
  root.style.setProperty("--theme-accent-hover", palette.accentHover);
  root.style.setProperty("--theme-chart-secondary", palette.chartSecondary);
  root.style.setProperty("--theme-chart-tertiary", palette.chartTertiary);
  palette.trafficShades.forEach((color, i) => {
    root.style.setProperty(`--theme-traffic-${i}`, color);
  });
}

export const STORAGE_KEY = "dametime-theme-template";
