export type CountryViewId = "world" | "USA" | "Canada" | "UK" | "Australia" | "Other";

export type HeatmapPaletteId = "ocean" | "inferno" | "emerald" | "sunset" | "slate";

export type HeatmapPalette = {
  id: HeatmapPaletteId;
  label: string;
  steps: { label: string; color: string }[];
  colors: [string, string, string, string, string];
};

export type CountryOverview = {
  id: CountryViewId;
  label: string;
  flag: string;
  pct: number;
};

export type MapViewConfig = {
  url: string;
  projection: string;
  scale: number;
  center?: [number, number];
  width: number;
  height: number;
};

export const countryOverview: CountryOverview[] = [
  { id: "USA", label: "USA", flag: "🇺🇸", pct: 52.4 },
  { id: "Canada", label: "Canada", flag: "🇨🇦", pct: 12.8 },
  { id: "UK", label: "UK", flag: "🇬🇧", pct: 9.6 },
  { id: "Australia", label: "Australia", flag: "🇦🇺", pct: 6.2 },
  { id: "Other", label: "Other", flag: "🌍", pct: 19.0 },
];

const legendLabels = [
  "Fewest signups",
  "Below average",
  "Average",
  "Above average",
  "Most signups",
] as const;

export const heatmapPalettes: Record<HeatmapPaletteId, HeatmapPalette> = {
  ocean: {
    id: "ocean",
    label: "Ocean",
    colors: ["#3288bd", "#66c2a5", "#fee08b", "#fc8d59", "#d73027"],
    steps: [
      { label: legendLabels[0], color: "#3288bd" },
      { label: legendLabels[1], color: "#66c2a5" },
      { label: legendLabels[2], color: "#fee08b" },
      { label: legendLabels[3], color: "#fc8d59" },
      { label: legendLabels[4], color: "#d73027" },
    ],
  },
  inferno: {
    id: "inferno",
    label: "Inferno",
    colors: ["#2c115f", "#b73779", "#fb8861", "#fec287", "#fcffa4"],
    steps: [
      { label: legendLabels[0], color: "#2c115f" },
      { label: legendLabels[1], color: "#b73779" },
      { label: legendLabels[2], color: "#fb8861" },
      { label: legendLabels[3], color: "#fec287" },
      { label: legendLabels[4], color: "#fcffa4" },
    ],
  },
  emerald: {
    id: "emerald",
    label: "Emerald",
    colors: ["#084081", "#2b8cbe", "#4eb3d3", "#7bccc4", "#a8ddb5"],
    steps: [
      { label: legendLabels[0], color: "#084081" },
      { label: legendLabels[1], color: "#2b8cbe" },
      { label: legendLabels[2], color: "#4eb3d3" },
      { label: legendLabels[3], color: "#7bccc4" },
      { label: legendLabels[4], color: "#a8ddb5" },
    ],
  },
  sunset: {
    id: "sunset",
    label: "Sunset",
    colors: ["#4a1486", "#9c27b0", "#e91e63", "#ff7043", "#ffca28"],
    steps: [
      { label: legendLabels[0], color: "#4a1486" },
      { label: legendLabels[1], color: "#9c27b0" },
      { label: legendLabels[2], color: "#e91e63" },
      { label: legendLabels[3], color: "#ff7043" },
      { label: legendLabels[4], color: "#ffca28" },
    ],
  },
  slate: {
    id: "slate",
    label: "Slate",
    colors: ["#1e293b", "#334155", "#64748b", "#94a3b8", "#e2e8f0"],
    steps: [
      { label: legendLabels[0], color: "#1e293b" },
      { label: legendLabels[1], color: "#334155" },
      { label: legendLabels[2], color: "#64748b" },
      { label: legendLabels[3], color: "#94a3b8" },
      { label: legendLabels[4], color: "#e2e8f0" },
    ],
  },
};

export const heatmapPaletteList = Object.values(heatmapPalettes);

/** @deprecated Use heatmapPalettes[paletteId].steps */
export const legendSteps = heatmapPalettes.ocean.steps;

const GEO_URLS = {
  world: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  usa: "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json",
  canada: "https://code.highcharts.com/mapdata/countries/ca/ca-all.topo.json",
  uk: "https://code.highcharts.com/mapdata/countries/gb/gb-all.topo.json",
  australia: "https://code.highcharts.com/mapdata/countries/au/au-all.topo.json",
} as const;

export const mapViewConfig: Record<CountryViewId, MapViewConfig> = {
  world: {
    url: GEO_URLS.world,
    projection: "geoEqualEarth",
    scale: 130,
    center: [0, 4],
    width: 800,
    height: 420,
  },
  USA: {
    url: GEO_URLS.usa,
    projection: "geoAlbersUsa",
    scale: 680,
    width: 800,
    height: 420,
  },
  Canada: {
    url: GEO_URLS.canada,
    projection: "geoMercator",
    scale: 310,
    center: [-96, 60],
    width: 800,
    height: 420,
  },
  UK: {
    url: GEO_URLS.uk,
    projection: "geoMercator",
    scale: 780,
    center: [-2, 54.5],
    width: 800,
    height: 420,
  },
  Australia: {
    url: GEO_URLS.australia,
    projection: "geoMercator",
    scale: 520,
    center: [134, -27],
    width: 800,
    height: 420,
  },
  Other: {
    url: GEO_URLS.world,
    projection: "geoEqualEarth",
    scale: 130,
    center: [0, 4],
    width: 800,
    height: 420,
  },
};

export function geoUrlFor(view: CountryViewId) {
  return mapViewConfig[view].url;
}

export function intensityToColor(value: number, paletteId: HeatmapPaletteId = "ocean") {
  const colors = heatmapPalettes[paletteId].colors;
  const v = Math.max(0, Math.min(1, value));
  if (v < 0.25) return colors[0];
  if (v < 0.45) return colors[1];
  if (v < 0.6) return colors[2];
  if (v < 0.78) return colors[3];
  return colors[4];
}

const usStateIntensity: Record<string, number> = {
  "06": 0.92, "41": 0.9, "53": 0.82, "16": 0.78, "32": 0.85, "04": 0.8, "49": 0.76,
  "30": 0.7, "56": 0.68, "08": 0.72, "35": 0.74, "48": 0.7, "40": 0.65,
  "17": 0.42, "18": 0.38, "39": 0.4, "26": 0.35, "55": 0.32,
  "13": 0.22, "01": 0.18, "12": 0.28, "37": 0.36, "45": 0.25, "47": 0.3,
  "36": 0.55, "25": 0.58, "42": 0.48, "34": 0.52, "09": 0.5, "10": 0.45,
  "24": 0.5, "51": 0.48, "54": 0.4, "29": 0.38, "05": 0.35, "22": 0.32,
  "28": 0.3, "21": 0.28, "11": 0.62, "50": 0.55, "33": 0.5, "44": 0.48,
  "23": 0.42, "19": 0.36, "31": 0.34, "20": 0.32, "46": 0.3, "38": 0.28,
  "02": 0.25, "15": 0.4,
};

const canadaByName: Record<string, number> = {
  Ontario: 0.72, "British Columbia": 0.68, Quebec: 0.58, Alberta: 0.62, Manitoba: 0.42,
  Saskatchewan: 0.4, "Nova Scotia": 0.45, "New Brunswick": 0.38, Newfoundland: 0.35,
  "Prince Edward Island": 0.32, Yukon: 0.28, "Northwest Territories": 0.25, Nunavut: 0.22,
};

const australiaByName: Record<string, number> = {
  "New South Wales": 0.72, Victoria: 0.68, Queensland: 0.55, "Western Australia": 0.48,
  "South Australia": 0.42, Tasmania: 0.35, "Northern Territory": 0.28, "Australian Capital Territory": 0.65,
};

const ukByName: Record<string, number> = {
  England: 0.78, Scotland: 0.52, Wales: 0.45, "Northern Ireland": 0.4,
  "East Midlands": 0.62, "West Midlands": 0.58, London: 0.85, "South East": 0.7,
  "North West": 0.55, "North East": 0.48, "South West": 0.5, Yorkshire: 0.52,
};

const worldCountryMap: Record<string, CountryViewId> = {
  "United States of America": "USA",
  Canada: "Canada",
  "United Kingdom": "UK",
  Australia: "Australia",
};

const mainCountries = new Set(["United States of America", "Canada", "United Kingdom", "Australia"]);

function hashName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i) * (i + 1)) % 97;
  return h;
}

export function getRegionIntensity(view: CountryViewId, geoId: string, geoName?: string): number {
  const name = geoName ?? "";

  if (view === "USA") return usStateIntensity[geoId] ?? 0.35 + (Number(geoId) % 7) * 0.08;
  if (view === "Canada") return canadaByName[name] ?? 0.38;
  if (view === "Australia") return australiaByName[name] ?? 0.38;
  if (view === "UK") return ukByName[name] ?? 0.45;

  if (view === "world") {
    const mapped = worldCountryMap[name];
    if (mapped === "USA") return 0.85;
    if (mapped === "Canada") return 0.55;
    if (mapped === "UK") return 0.48;
    if (mapped === "Australia") return 0.42;
    return 0.12 + (hashName(name) % 6) * 0.04;
  }

  if (view === "Other") {
    if (mainCountries.has(name)) return 0.1;
    return 0.35 + (hashName(name) % 8) * 0.07;
  }

  return 0.3;
}

export function worldCountryFromName(name: string): CountryViewId | null {
  return worldCountryMap[name] ?? null;
}
