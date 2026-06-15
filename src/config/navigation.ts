export type NavItem = {
  label: string;
  path: string;
  external?: boolean;
};

export type NavSection = {
  label: string;
  icon: string;
  items: NavItem[];
};

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
      { label: "All Content", path: "/content/all" },
      { label: "Content Calendar", path: "/content/calendar" },
      { label: "Media Library", path: "/content/media" },
      { label: "Playlists", path: "/content/playlists" },
    ],
  },
  {
    label: "FOR ATHLETES",
    icon: "trophy",
    items: [{ label: "Athlete Hub", path: "/athletes/hub" }],
  },
  {
    label: "FANS & DATA",
    icon: "users",
    items: [
      { label: "Audience Overview", path: "/fans/audience" },
      { label: "Fan Profiles", path: "/fans/profiles" },
      { label: "Segments", path: "/fans/segments" },
      { label: "Email/SMS List", path: "/fans/subscribers" },
      { label: "Behavior Insights", path: "/fans/behavior" },
    ],
  },
  {
    label: "PERFORMANCE",
    icon: "bar-chart-2",
    items: [
      { label: "Traffic Overview", path: "/performance/traffic" },
      { label: "Conversion Funnel", path: "/performance/funnel" },
      { label: "Campaigns", path: "/performance/campaigns" },
      { label: "Reports", path: "/performance/reports" },
    ],
  },
  {
    label: "MONETIZATION",
    icon: "dollar-sign",
    items: [
      { label: "Partners & DSPs", path: "/monetization/partners" },
      { label: "Audiences", path: "/monetization/audiences" },
      { label: "Revenue", path: "/monetization/revenue" },
    ],
  },
  {
    label: "ENGAGEMENT",
    icon: "message-circle",
    items: [
      { label: "Overview", path: "/engagement/overview" },
      { label: "Messages", path: "/engagement/messages" },
      { label: "Polls", path: "/engagement/polls" },
      {
        label: "Flash Updates",
        path: "https://amx-newsletter-copilot.vercel.app/",
        external: true,
      },
    ],
  },
  {
    label: "SETTINGS",
    icon: "settings",
    items: [
      { label: "Team Members", path: "/settings/team" },
      { label: "Roles & Permissions", path: "/settings/roles" },
      { label: "Integrations", path: "/settings/integrations" },
      { label: "Account Settings", path: "/settings/account" },
    ],
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
  "/content/all": {
    title: "All Content",
    subtitle: "Browse, filter, and manage every asset in your library.",
  },
  "/athletes/hub": {
    title: "Athlete Hub",
    subtitle: "Athletes and representatives sign in to upload and manage content.",
  },
  "/content/upload": {
    title: "Upload Content",
    subtitle: "Publish videos, images, articles, and audio to your fans.",
  },
  "/content/calendar": {
    title: "Content Calendar",
    subtitle: "Plan drops, schedule posts, and coordinate your release cadence.",
  },
  "/content/media": {
    title: "Media Library",
    subtitle: "Organized storage for raw files, exports, and brand assets.",
  },
  "/content/playlists": {
    title: "Playlists",
    subtitle: "Curate collections for tours, exclusives, and fan journeys.",
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
  "/engagement/polls": {
    title: "Polls",
    subtitle: "Create polls, track votes, and surface fan sentiment.",
  },
  "/fans/audience": {
    title: "Audience Overview",
    subtitle: "Growth, retention, and composition across your fan base.",
  },
  "/fans/profiles": {
    title: "Fan Profiles",
    subtitle: "Search and explore individual fan journeys and loyalty tiers.",
  },
  "/fans/segments": {
    title: "Segments",
    subtitle: "Build dynamic audiences for campaigns and exclusives.",
  },
  "/fans/subscribers": {
    title: "Email / SMS List",
    subtitle: "Manage opt-ins, deliverability, and subscriber health.",
  },
  "/fans/behavior": {
    title: "Behavior Insights",
    subtitle: "Paths, drop-off points, and high-intent fan actions.",
  },
  "/performance/traffic": {
    title: "Traffic Overview",
    subtitle: "Sessions, sources, and landing performance over time.",
  },
  "/performance/funnel": {
    title: "Conversion Funnel",
    subtitle: "Track visitors from first touch to Inner Circle conversion.",
  },
  "/performance/campaigns": {
    title: "Campaigns",
    subtitle: "UTM campaigns, ad spend, and attributed conversions.",
  },
  "/performance/reports": {
    title: "Reports",
    subtitle: "Exportable snapshots for stakeholders and partners.",
  },
  "/monetization/partners": {
    title: "Partners & DSPs",
    subtitle: "LiveRamp, Trade Desk, DV360, and partner sync status.",
  },
  "/monetization/audiences": {
    title: "Audiences",
    subtitle: "Monetizable segments activated across demand-side platforms.",
  },
  "/monetization/revenue": {
    title: "Revenue",
    subtitle: "MTD earnings, partner splits, and segment-level yield.",
  },
  "/settings/team": {
    title: "Team Members",
    subtitle: "Invite collaborators and manage workspace access.",
  },
  "/settings/roles": {
    title: "Roles & Permissions",
    subtitle: "Fine-grained control over who can publish, export, and monetize.",
  },
  "/settings/integrations": {
    title: "Integrations",
    subtitle: "Connect social, email, SMS, analytics, and DSP tools.",
  },
  "/settings/account": {
    title: "Account Settings",
    subtitle: "Profile, billing, security, and notification preferences.",
  },
};
