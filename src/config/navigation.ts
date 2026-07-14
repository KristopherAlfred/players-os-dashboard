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
    label: "CONTENT",
    icon: "film",
    items: [
      { label: "Social", path: "/content/social" },
      { label: "News", path: "/content/news" },
      { label: "Videos", path: "/content/videos" },
      { label: "Music", path: "/content/music" },
      { label: "Events & Giveaways", path: "/content/events" },
      { label: "Content Calendar", path: "/content/calendar" },
    ],
  },
  {
    label: "LIVE",
    icon: "radio",
    items: [],
    directPath: "/live",
  },
  {
    label: "EXPERIENCE",
    icon: "sparkles",
    items: [],
    directPath: "/experience",
  },
  {
    label: "NOTIFICATIONS",
    icon: "bell",
    items: [],
    directPath: "/notifications",
  },
  {
    label: "FANS & DATA",
    icon: "users",
    items: [
      { label: "Audience Overview", path: "/fans/audience" },
      { label: "Email/SMS List", path: "/fans/subscribers" },
    ],
  },
  {
    label: "PERFORMANCE",
    icon: "bar-chart-2",
    items: [{ label: "Traffic Overview", path: "/performance/traffic" }],
  },
  {
    label: "ENGAGEMENT",
    icon: "message-circle",
    items: [
      { label: "Fan Activity", path: "/engagement/activity" },
      { label: "Support Inbox", path: "/engagement/support" },
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
    subtitle: "Write newsletters and insights that publish straight to the DameTime app.",
  },
  "/content/videos": {
    title: "Videos",
    subtitle: "Upload exclusive videos with title, thumbnail, and link — they appear in the DameTime app.",
  },
  "/content/music": {
    title: "Music",
    subtitle: "Dame D.O.L.L.A Spotify catalog — thumbnails, song links, and videos for the app.",
  },
  "/content/events": {
    title: "Events & Giveaways",
    subtitle: "Create and publish events and giveaways fans see in the DameTime app.",
  },
  "/content/calendar": {
    title: "Content Calendar",
    subtitle: "Plan drops, schedule posts, and coordinate your release cadence.",
  },
  "/live": {
    title: "Live",
    subtitle: "Go live on DameTime for fans watching in the app and on the site.",
  },
  "/experience": {
    title: "Experience",
    subtitle: "Drag, style, and publish the DameTime app home screen.",
  },
  "/notifications": {
    title: "Notifications",
    subtitle: "Schedule in-app toasts with the same look as the points earned popup.",
  },
  "/engagement/activity": {
    title: "Fan Activity",
    subtitle: "Live DameTime app clicks, page views, and fan interactions from Supabase.",
  },
  "/engagement/support": {
    title: "Support Inbox",
    subtitle: "Help & Support reports submitted by fans in the DameTime app.",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Integrations, account preferences, and dashboard appearance.",
  },
  "/fans/audience": {
    title: "Audience Overview",
    subtitle: "Growth, retention, and composition across your fan base.",
  },
  "/fans/subscribers": {
    title: "Email / SMS List",
    subtitle: "Live DameTime fan emails, phones, and SMS opt-ins from Supabase.",
  },
  "/performance/traffic": {
    title: "Traffic Overview",
    subtitle: "Live DameTime page views, clicks, and navigation from Supabase fan_events.",
  },
};
