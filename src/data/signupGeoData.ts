export type CountryViewId = "world" | "USA" | "Canada" | "UK" | "Australia" | "Other";

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
  center: [number, number];
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

export const legendSteps = [
  { label: "Fewest signups", color: "#3288bd" },
  { label: "Below average", color: "#abdda4" },
  { label: "Average", color: "#fee08b" },
  { label: "Above average", color: "#fdae61" },
  { label: "Most signups", color: "#d73027" },
];

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
    scale: 150,
    center: [0, 0],
    width: 760,
    height: 380,
  },
  USA: {
    url: GEO_URLS.usa,
    projection: "geoAlbersUsa",
    scale: 1000,
    center: [0, 0],
    width: 760,
    height: 380,
  },
  Canada: {
    url: GEO_URLS.canada,
    projection: "geoAzimuthalEqualArea",
    scale: 520,
    center: [-96, 62],
    width: 760,
    height: 380,
  },
  UK: {
    url: GEO_URLS.uk,
    projection: "geoMercator",
    scale: 2200,
    center: [-2, 54],
    width: 760,
    height: 380,
  },
  Australia: {
    url: GEO_URLS.australia,
    projection: "geoMercator",
    scale: 700,
    center: [134, -26],
    width: 760,
    height: 380,
  },
  Other: {
    url: GEO_URLS.world,
    projection: "geoEqualEarth",
    scale: 150,
    center: [0, 0],
    width: 760,
    height: 380,
  },
};

export function geoUrlFor(view: CountryViewId) {
  return mapViewConfig[view].url;
}

export function intensityToColor(value: number) {
  const v = Math.max(0, Math.min(1, value));
  if (v < 0.25) return "#3288bd";
  if (v < 0.45) return "#66c2a5";
  if (v < 0.6) return "#fee08b";
  if (v < 0.78) return "#fc8d59";
  return "#d73027";
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
