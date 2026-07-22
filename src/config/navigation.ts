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
      { label: "Doc & Glo", path: "/content/doc-and-glo" },
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
      { label: "Fan Locations", path: "/fans/audience" },
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
    subtitle: "Real-time performance of the Sloane Glo ecosystem.",
  },
  "/content/social": {
    title: "Social",
    subtitle: "Live Instagram, X, and Facebook analytics from Sloane Glo.",
  },
  "/content/news": {
    title: "News",
    subtitle: "Write newsletters and insights that publish straight to the Sloane Glo app.",
  },
  "/content/videos": {
    title: "Videos",
    subtitle: "YouTube analytics plus Exclusive uploads — same tabs fans use in Sloane Glo.",
  },
  "/content/doc-and-glo": {
    title: "Doc & Glo",
    subtitle: "Sloane’s skincare line — sync products from the shop and publish them to the app.",
  },
  "/content/music": {
    title: "Doc & Glo",
    subtitle: "Sloane’s skincare line — sync products from the shop and publish them to the app.",
  },
  "/content/events": {
    title: "Events & Giveaways",
    subtitle: "Create and publish events and giveaways fans see in the Sloane Glo app.",
  },
  "/content/calendar": {
    title: "Content Calendar",
    subtitle: "Live posts from Sloane Glo and social — exact date, time, and what went live.",
  },
  "/live": {
    title: "Live",
    subtitle: "Go live on Sloane Glo for fans watching in the app and on the site.",
  },
  "/experience": {
    title: "Experience",
    subtitle: "Drag, style, and publish the Sloane Glo app home screen.",
  },
  "/notifications": {
    title: "Notifications",
    subtitle: "Schedule in-app toasts with the same look as the points earned popup.",
  },
  "/profile": {
    title: "Profile",
    subtitle: "View and change the photo shown in the top-right corner.",
  },
  "/engagement/activity": {
    title: "Fan Activity",
    subtitle: "Live Sloane Glo app clicks, page views, and fan interactions from Supabase.",
  },
  "/engagement/support": {
    title: "Support Inbox",
    subtitle: "Help & Support reports submitted by fans in the Sloane Glo app.",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Themes, account preferences, integrations, and access roles.",
  },
  "/fans/audience": {
    title: "Fan Locations",
    subtitle: "Live Sloane Glo fan composition, geo, and engagement from Supabase.",
  },
  "/fans/subscribers": {
    title: "Email / SMS List",
    subtitle: "Live Sloane Glo fan emails, phones, and SMS opt-ins from Supabase.",
  },
  "/performance/traffic": {
    title: "Traffic Overview",
    subtitle: "Live Sloane Glo page views, clicks, and navigation from Supabase fan_events.",
  },
};
