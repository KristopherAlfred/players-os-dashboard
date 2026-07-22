/** Curated assets selectable in the Experience studio. Paths resolve on the fan app. */

export type ExperienceAsset = {
  id: string;
  label: string;
  src: string;
};

export const EXPERIENCE_LOGOS: ExperienceAsset[] = [
  {
    id: "ai-crown",
    label: "AI crown",
    src: "/experience/logos/logo-ai-crown.png",
  },
  {
    id: "ai-racquet",
    label: "AI racquet",
    src: "/experience/logos/logo-ai-racquet.png",
  },
  {
    id: "ai-letter-s",
    label: "AI letter S",
    src: "/experience/logos/logo-ai-letter-s.png",
  },
  {
    id: "ai-sg",
    label: "AI SG mark",
    src: "/experience/logos/logo-ai-sg.png",
  },
  {
    id: "ai-ball",
    label: "AI tennis ball",
    src: "/experience/logos/logo-ai-ball.png",
  },
  {
    id: "ai-glow",
    label: "AI glow orb",
    src: "/experience/logos/logo-ai-glow.png",
  },
];

export const EXPERIENCE_HEROES: ExperienceAsset[] = [
  { id: "wins", label: "Wins", src: "/experience/heroes/sloanewins.png" },
  { id: "fistpump", label: "Fist pump", src: "/experience/heroes/sloanefistpump.png" },
  { id: "trophy", label: "Trophy", src: "/experience/heroes/sloanetrophy.png" },
  { id: "match-ready", label: "Match ready", src: "/experience/heroes/sloanematchready.png" },
  { id: "doc-and-glo", label: "Doc & Glo", src: "/experience/heroes/docandglo.png" },
];

export const EXPERIENCE_BACKGROUNDS: ExperienceAsset[] = [
  { id: "app", label: "App wash", src: "/experience/backgrounds/app-background.png" },
  { id: "landing", label: "Landing", src: "/experience/backgrounds/landing.png" },
  { id: "yourein", label: "You're in", src: "/experience/backgrounds/yourein.png" },
  { id: "dashboard", label: "Home chrome", src: "/experience/backgrounds/dashboard.png" },
  { id: "wins-bg", label: "Wins photo", src: "/experience/heroes/sloanewins.png" },
  { id: "match-bg", label: "Match photo", src: "/experience/heroes/sloanematchready.png" },
];

export type BackgroundColorPreset = {
  id: string;
  label: string;
  backgroundColor: string;
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  useGradientBg: boolean;
};

export const BACKGROUND_COLOR_PRESETS: BackgroundColorPreset[] = [
  {
    id: "mint-night",
    label: "Mint night",
    backgroundColor: "#050505",
    backgroundGradientFrom: "#050505",
    backgroundGradientTo: "#0a1a12",
    useGradientBg: true,
  },
  {
    id: "deep-black",
    label: "Deep black",
    backgroundColor: "#000000",
    backgroundGradientFrom: "#000000",
    backgroundGradientTo: "#111111",
    useGradientBg: true,
  },
  {
    id: "court-green",
    label: "Court green",
    backgroundColor: "#04140c",
    backgroundGradientFrom: "#04140c",
    backgroundGradientTo: "#0f3d28",
    useGradientBg: true,
  },
  {
    id: "soft-glow",
    label: "Soft glow",
    backgroundColor: "#0b1210",
    backgroundGradientFrom: "#122018",
    backgroundGradientTo: "#050505",
    useGradientBg: true,
  },
  {
    id: "solid-mint",
    label: "Solid mint tint",
    backgroundColor: "#0a1610",
    backgroundGradientFrom: "#0a1610",
    backgroundGradientTo: "#0a1610",
    useGradientBg: false,
  },
];
