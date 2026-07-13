export type NavItem = {
  label: string;
  path: string;
  external?: boolean;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export type NavSection = {
  label: string;
  icon: string;
  items: NavItem[];
  groups?: NavGroup[];
  /** Header navigates directly — no dropdown */
  directPath?: string;
};

function sectionPaths(section: NavSection): string[] {
  const paths = section.directPath ? [section.directPath] : [];
  paths.push(...section.items.filter((i) => !i.external).map((i) => i.path));
  for (const group of section.groups ?? []) {
    paths.push(...group.items.filter((i) => !i.external).map((i) => i.path));
  }
  return paths;
}

export function isNavPathActive(pathname: string, path: string) {
  return path === "/" ? pathname === "/" : pathname.startsWith(path);
}

export function isSectionActive(pathname: string, section: NavSection) {
  return sectionPaths(section).some((path) => isNavPathActive(pathname, path));
}

export const navSections: NavSection[] = [
  {
    label: "DASHBOARD",
    icon: "layout-dashboard",
    items: [{ label: "Dashboard", path: "/" }],
  },
  {
    label: "ATHLETE HUB",
    icon: "trophy",
    items: [{ label: "Athlete Hub", path: "/athletes/hub" }],
    groups: [
      {
        label: "Content",
        items: [
          { label: "Social", path: "/content/social" },
          { label: "News", path: "/content/news" },
          { label: "Videos", path: "/content/videos" },
          { label: "Music", path: "/content/music" },
          { label: "Events & Giveaways", path: "/content/events" },
          { label: "Content Calendar", path: "/content/calendar" },
        ],
      },
    ],
  },
  {
    label: "LIVE",
    icon: "radio",
    items: [],
    directPath: "/live",
  },
  {
    label: "FANS & DATA",
    icon: "users",
    items: [
      { label: "Audience Overview", path: "/fans/audience" },
      { label: "Fan Profiles", path: "/fans/profiles" },
      { label: "Email/SMS List", path: "/fans/subscribers" },
    ],
  },
  {
    label: "PERFORMANCE",
    icon: "bar-chart-2",
    items: [{ label: "Traffic Overview", path: "/performance/traffic" }],
  },
  {
    label: "MONETIZATION",
    icon: "dollar-sign",
    items: [
      { label: "Partners & DSPs", path: "/monetization/partners" },
      { label: "Revenue", path: "/monetization/revenue" },
    ],
  },
  {
    label: "ENGAGEMENT",
    icon: "message-circle",
    items: [
      { label: "Overview", path: "/engagement/overview" },
      { label: "Messages", path: "/engagement/messages" },
    ],
  },
  {
    label: "SETTINGS",
    icon: "settings",
    items: [],
    directPath: "/settings",
  },
];

export type RouteMeta = {
  title: string;
  subtitle: string;
};

export const routeMeta: Record<string, RouteMeta> = {
  "/": {
    title: "Dashboard Overview",
    subtitle: "Real-time performance of the DameTime ecosystem.",
  },
  "/content/social": {
    title: "Social",
    subtitle: "Posts, stories, and reels across Instagram, TikTok, and X.",
  },
  "/content/news": {
    title: "News",
    subtitle: "Articles, press releases, and features for fans and media.",
  },
  "/content/videos": {
    title: "Videos",
    subtitle: "Exclusive drops, BTS footage, and long-form video content.",
  },
  "/content/music": {
    title: "Music",
    subtitle: "Tracks, playlists, snippets, and audio exclusives.",
  },
  "/content/events": {
    title: "Events & Giveaways",
    subtitle: "Meet & greets, listening parties, merch drops, and fan contests.",
  },
  "/content/calendar": {
    title: "Content Calendar",
    subtitle: "Plan drops, schedule posts, and coordinate your release cadence.",
  },
  "/athletes/hub": {
    title: "Athlete Hub",
    subtitle: "Athletes and representatives sign in to upload and manage content.",
  },
  "/live": {
    title: "Live",
    subtitle: "Go live from Dame’s studio to Instagram, Facebook, YouTube, and X.",
  },
  "/content/upload": {
    title: "Upload Content",
    subtitle: "Publish videos, images, articles, and audio to your fans.",
  },
  "/engagement/overview": {
    title: "Engagement Overview",
    subtitle: "Comments, reactions, shares, and fan interaction at a glance.",
  },
  "/engagement/comments": {
    title: "Comments",
    subtitle: "Moderate fan conversations across every channel.",
  },
  "/engagement/messages": {
    title: "Messages",
    subtitle: "Direct fan messages and Inner Circle conversations.",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Team, integrations, account preferences, and dashboard appearance.",
  },
  "/fans/audience": {
    title: "Audience Overview",
    subtitle: "Growth, retention, and composition across your fan base.",
  },
  "/fans/profiles": {
    title: "Fan Profiles",
    subtitle: "Search and explore individual fan journeys and loyalty tiers.",
  },
  "/fans/subscribers": {
    title: "Email / SMS List",
    subtitle: "Manage opt-ins, deliverability, and subscriber health.",
  },
  "/performance/traffic": {
    title: "Traffic Overview",
    subtitle: "Sessions, sources, and landing performance over time.",
  },
  "/monetization/partners": {
    title: "Partners & DSPs",
    subtitle: "LiveRamp, Trade Desk, DV360, and partner sync status.",
  },
  "/monetization/revenue": {
    title: "Revenue",
    subtitle: "MTD earnings, partner splits, and segment-level yield.",
  },
};
