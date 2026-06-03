export type CountryViewId = "world" | "USA" | "Canada" | "UK" | "Australia" | "Other";

export type CountryOverview = {
  id: CountryViewId;
  label: string;
  flag: string;
  pct: number;
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
  canada: "https://cdn.jsdelivr.net/npm/canada-atlas@1/provinces-10m.json",
  australia: "https://cdn.jsdelivr.net/npm/australia-atlas@0.1.0/states-10m.json",
} as const;

export function geoUrlFor(view: CountryViewId) {
  if (view === "USA") return GEO_URLS.usa;
  if (view === "Canada") return GEO_URLS.canada;
  if (view === "Australia") return GEO_URLS.australia;
  return GEO_URLS.world;
}

/** 0 = low (blue), 1 = high (red) */
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
  "17": 0.42, "18": 0.38, "39": 0.4, "26": 0.35, "55": 0.32, "27": 0.3,
  "13": 0.22, "01": 0.18, "12": 0.28, "37": 0.36, "45": 0.25, "47": 0.3,
  "36": 0.55, "25": 0.58, "42": 0.48, "34": 0.52, "09": 0.5, "10": 0.45,
  "24": 0.5, "51": 0.48, "54": 0.4, "29": 0.38, "05": 0.35, "22": 0.32,
  "28": 0.3, "21": 0.28, "11": 0.62, "50": 0.55, "33": 0.5, "44": 0.48,
  "23": 0.42, "19": 0.36, "31": 0.34, "20": 0.32, "46": 0.3, "38": 0.28,
  "02": 0.25, "15": 0.4,
};

const canadaProvinceIntensity: Record<string, number> = {
  "10": 0.55, "59": 0.72, "48": 0.68, "35": 0.5, "24": 0.42, "46": 0.38,
  "12": 0.45, "13": 0.52, "47": 0.48, "62": 0.35, "61": 0.4,
};

const australiaStateIntensity: Record<string, number> = {
  "NSW": 0.72, "VIC": 0.68, "QLD": 0.55, "WA": 0.48, "SA": 0.42, "TAS": 0.35, "NT": 0.28, "ACT": 0.65,
};

const ukRegionIntensity: Record<string, number> = {
  England: 0.78, Scotland: 0.52, Wales: 0.45, "Northern Ireland": 0.4,
};

const worldCountryMap: Record<string, CountryViewId | "other"> = {
  "United States of America": "USA",
  Canada: "Canada",
  "United Kingdom": "UK",
  Australia: "Australia",
};

export function getRegionIntensity(view: CountryViewId, geoId: string, geoName?: string): number {
  if (view === "USA") return usStateIntensity[geoId] ?? 0.35 + (Number(geoId) % 7) * 0.08;
  if (view === "Canada") return canadaProvinceIntensity[geoId] ?? 0.4;
  if (view === "Australia") return australiaStateIntensity[geoId] ?? 0.4;
  if (view === "UK") return ukRegionIntensity[geoName ?? ""] ?? 0.5;
  if (view === "world") {
    const mapped = worldCountryMap[geoName ?? ""];
    if (mapped === "USA") return 0.85;
    if (mapped === "Canada") return 0.55;
    if (mapped === "UK") return 0.48;
    if (mapped === "Australia") return 0.42;
    return 0.15;
  }
  return 0.3;
}

export function worldCountryFromName(name: string): CountryViewId | null {
  return worldCountryMap[name] ?? null;
}
