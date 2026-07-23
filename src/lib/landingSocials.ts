export type LandingSocialIcon =
  | "instagram"
  | "x"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "docandglo";

export type LandingSocialStat = {
  id: string;
  count: string;
  unit: string;
  url: string;
  icon: LandingSocialIcon;
};

export const HOT_PINK = "#FF2D95";
export const MINT = "#8FE3B8";

export const DEFAULT_LANDING_SOCIALS: LandingSocialStat[] = [
  {
    id: "instagram",
    count: "572K",
    unit: "Followers",
    icon: "instagram",
    url: "https://www.instagram.com/sloanestephens/",
  },
  {
    id: "x",
    count: "238K",
    unit: "Followers",
    icon: "x",
    url: "https://x.com/SloaneStephens",
  },
  {
    id: "docandglo",
    count: "Doc & Glo",
    unit: "Monthly Buyers",
    icon: "docandglo",
    url: "https://docandglo.com/",
  },
  {
    id: "tiktok",
    count: "12.9K",
    unit: "Followers",
    icon: "tiktok",
    url: "https://www.tiktok.com/@sloanestephens",
  },
  {
    id: "youtube",
    count: "84K",
    unit: "Subscribers",
    icon: "youtube",
    url: "https://www.youtube.com/@sloanestephens",
  },
];

export const DEFAULT_FANS_PROOF_TITLE = "100K+ Fans Already Joined";
export const DEFAULT_FANS_PROOF_BODY = "Real fans. Real community. Real connection.";
export const DEFAULT_FOLLOW_TITLE = "Follow Sloane";
export const DEFAULT_FOOTER_LINE = 'Sloane "GLO" Stephens.';

export function normalizeLandingSocials(raw: unknown): LandingSocialStat[] {
  if (!Array.isArray(raw) || !raw.length) return DEFAULT_LANDING_SOCIALS.map((s) => ({ ...s }));
  const out: LandingSocialStat[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const r = row as Partial<LandingSocialStat>;
    const id = String(r.id || "").trim();
    const icon = String(r.icon || id || "").toLowerCase() as LandingSocialIcon;
    if (!id || !r.url) continue;
    out.push({
      id,
      count: String(r.count || "").trim() || id,
      unit: String(r.unit || "").trim() || "Followers",
      url: String(r.url).trim(),
      icon: (["instagram", "x", "tiktok", "youtube", "facebook", "docandglo"] as const).includes(icon)
        ? icon
        : "instagram",
    });
  }
  return out.length ? out : DEFAULT_LANDING_SOCIALS.map((s) => ({ ...s }));
}
