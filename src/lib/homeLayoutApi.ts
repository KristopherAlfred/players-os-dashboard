export type HomeWidgetType =
  | "videos"
  | "news"
  | "events"
  | "music"
  | "tickets"
  | "custom";

export type HomeWidgetSize = "standard" | "wide" | "tall" | "large";

export type HomeWidget = {
  id: string;
  type: HomeWidgetType;
  title: string;
  subtitle?: string;
  imageSrc: string;
  linkTo: string;
  enabled: boolean;
  order: number;
  /** Grid footprint: standard 1×1, wide 2×1, tall 1×2, large 2×2 */
  size?: HomeWidgetSize;
  imageFit?: "half" | "full";
  cardClassName?: string;
  showLock?: boolean;
  showPlay?: boolean;
  showMusicBars?: boolean;
  titleFontFamily?: import("./typography").TitleFontFamily;
  titleFontSize?: import("./typography").TitleFontSize;
};

export type HomeLayout = {
  version: number;
  updatedAt: string;
  heroEnabled: boolean;
  widgets: HomeWidget[];
};

function getApiBase() {
  return (import.meta.env.VITE_DAME_BIO_API_URL ?? "https://sloane-bio.vercel.app").replace(/\/$/, "");
}

function getAdminSecret() {
  return import.meta.env.VITE_ADMIN_EXPORT_SECRET?.trim() ?? "";
}

async function layoutRequest(init?: RequestInit) {
  const response = await fetch(`${getApiBase()}/api/admin/analytics?view=layout`, init);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { error?: string }).error || `Layout request failed (${response.status})`);
  }
  return data;
}

export async function fetchHomeLayout(): Promise<HomeLayout> {
  const data = (await layoutRequest()) as { layout: HomeLayout };
  return data.layout;
}

export async function publishHomeLayout(layout: HomeLayout): Promise<HomeLayout> {
  const secret = getAdminSecret();
  if (!secret) throw new Error("Set VITE_ADMIN_EXPORT_SECRET to publish home layouts");
  const data = (await layoutRequest({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret,
    },
    body: JSON.stringify({ action: "publish", layout }),
  })) as { layout: HomeLayout };
  return data.layout;
}

export async function generateHomeImage(
  prompt: string,
): Promise<{ imageSrc: string; source: string; model?: string }> {
  const secret = getAdminSecret();
  if (!secret) throw new Error("Set VITE_ADMIN_EXPORT_SECRET to generate images");
  return layoutRequest({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret,
    },
    body: JSON.stringify({ action: "generate_image", prompt }),
  }) as Promise<{ imageSrc: string; source: string; model?: string }>;
}

export const WIDGET_SIZES: { id: HomeWidgetSize; label: string; hint: string; cols: number; rows: number }[] = [
  { id: "standard", label: "Standard", hint: "1×1 — half width", cols: 1, rows: 1 },
  { id: "wide", label: "Wide", hint: "2×1 — full width", cols: 2, rows: 1 },
  { id: "tall", label: "Tall", hint: "1×2 — double height", cols: 1, rows: 2 },
  { id: "large", label: "Large", hint: "2×2 — hero box", cols: 2, rows: 2 },
];

export function widgetSpan(size?: HomeWidgetSize): { cols: number; rows: number } {
  const meta = WIDGET_SIZES.find((s) => s.id === size);
  return meta ? { cols: meta.cols, rows: meta.rows } : { cols: 1, rows: 1 };
}

export function createWidget(type: HomeWidgetType, order: number, size: HomeWidgetSize = "standard"): HomeWidget {
  const id = `${type}-${Date.now().toString(36)}`;
  if (type === "tickets") {
    return {
      id,
      type: "tickets",
      title: "DAMETIME\nTICKETS",
      imageSrc: "/images/eventsbackground.png",
      linkTo: "https://www.ticketmaster.com",
      enabled: true,
      order,
      size,
      imageFit: "half",
      cardClassName: "member-card-events-gradient",
    };
  }
  if (type === "custom") {
    return {
      id,
      type: "custom",
      title: "NEW\nDROP",
      imageSrc: "/images/damecity.png",
      linkTo: "/access",
      enabled: true,
      order,
      size,
      imageFit: "half",
      cardClassName: "member-card-ghost",
    };
  }
  const presets: Record<Exclude<HomeWidgetType, "tickets" | "custom">, HomeWidget> = presetsFor(id, order, size);
  return presets[type];
}

function presetsFor(id: string, order: number, size: HomeWidgetSize): Record<Exclude<HomeWidgetType, "tickets" | "custom">, HomeWidget> {
  return {
    videos: {
      id,
      type: "videos",
      title: "EXCLUSIVE\nVIDEOS",
      imageSrc: "/images/dameexclusive.png?v=2",
      linkTo: "/access/videos",
      enabled: true,
      order,
      size,
      imageFit: "half",
      cardClassName: "member-card-videos-gradient",
      showPlay: true,
    },
    news: {
      id,
      type: "news",
      title: "LATEST NEWS\n& UPDATES",
      imageSrc: "/images/dametimenewshome.png?v=4",
      linkTo: "/access/latest-news",
      enabled: true,
      order,
      size,
      imageFit: "half",
      cardClassName: "member-card-drops-gradient",
    },
    events: {
      id,
      type: "events",
      title: "EVENTS &\nGIVEAWAYS",
      imageSrc: "/images/eventsbackground.png",
      linkTo: "/access/events",
      enabled: true,
      order,
      size,
      imageFit: "full",
      cardClassName: "member-card-events-gradient",
      showLock: true,
    },
    music: {
      id,
      type: "music",
      title: "DOC &\nGLO",
      imageSrc: "/images/damedollamusichome.png?v=11",
      linkTo: "/access/doc-and-glo",
      enabled: true,
      order,
      size,
      imageFit: "half",
      cardClassName: "member-card-music-gradient",
      showMusicBars: false,
    },
  };
}

export function resolveAssetUrl(src: string) {
  if (!src) return "";
  if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${getApiBase()}${src.startsWith("/") ? "" : "/"}${src}`;
}
