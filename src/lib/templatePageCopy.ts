import type { ExperiencePageKeyName, ExperienceNavTab } from "./experienceConfig";

/**
 * Per-template page copy overrides.
 *
 * `buildTemplatePages` generates a designed page for every fan-app page of a
 * template. These overrides let an athlete template ship its *own* wording,
 * feature strip and card grid on each page (Kelce's "Ventures", Monique's
 * "Move / Mind / Manifest", Kyrie's "Vision" pages …) instead of the generic
 * defaults. Everything stays fully editable in the studio and by the AI.
 */
export type TemplatePageCopy = {
  subhead?: string;
  headline?: string;
  body?: string;
  cta?: string;
  features?: [string, string, string, string];
  icons?: [string, string, string, string];
  /** 2x2 card grid: [title, subtitle] */
  cards?: [string, string][];
};

type PageCopyMap = Partial<Record<Exclude<ExperiencePageKeyName, "landing">, TemplatePageCopy>>;

const kelce: PageCopyMap = {
  youreIn: {
    subhead: "WELCOME TO THE INNER CIRCLE",
    headline: "YOU'RE IN",
    body: "Podcast drops, locker-room access and the ventures side of the business — all unlocked.",
    cta: "ENTER THE CIRCLE",
    features: ["PODCAST", "LOCKER ROOM", "VENTURES", "MEMBERS"],
    icons: ["music", "video", "trophy", "crown"],
  },
  home: {
    subhead: "LIFESTYLE. LEGACY. IMPACT.",
    headline: "WELCOME BACK",
    body: "New episodes, drops and behind-the-helmet moments since you were last here.",
    cta: "SEE WHAT'S NEW",
    features: ["NEW EPISODE", "LATEST DROP", "GAME WEEK", "MEMBERS ONLY"],
    icons: ["music", "shop", "calendar", "lock"],
    cards: [
      ["Podcast", "New episode weekly"],
      ["Latest Drop", "Shop the collection"],
      ["Game Week", "Schedule & tickets"],
      ["Inner Circle", "Members only"],
    ],
  },
  videos: {
    subhead: "PRESS PLAY",
    headline: "THE FILM ROOM",
    body: "Mic'd up moments, training days and full-length sit-downs you won't see on broadcast.",
    cta: "PLAY LATEST",
    features: ["MIC'D UP", "TRAINING", "SIT-DOWNS", "ARCHIVE"],
    icons: ["video", "bolt", "users", "clock"],
  },
  news: {
    subhead: "STRAIGHT FROM THE SOURCE",
    headline: "NEWS & NOTES",
    body: "Announcements, features and long-form notes — members read it first.",
    cta: "READ THE LATEST",
    features: ["ANNOUNCEMENTS", "FEATURES", "PRESS", "ARCHIVE"],
    icons: ["news", "star", "sparkle", "clock"],
  },
  events: {
    subhead: "SHOW UP. WIN BIG.",
    headline: "EVENTS & TICKETS",
    body: "Game-week meetups, watch parties and member-only ticket drops.",
    cta: "GET TICKETS",
    features: ["MEETUPS", "TICKETS", "WATCH PARTY", "GIVEAWAYS"],
    icons: ["users", "ticket", "video", "gift"],
  },
  docAndGlo: {
    subhead: "OFFICIAL MERCH",
    headline: "THE COLLECTION",
    body: "Seasonal drops, member pricing and pieces that never hit the public store.",
    cta: "SHOP THE DROP",
    features: ["NEW DROPS", "MEMBER PRICING", "LIMITED", "BUNDLES"],
    icons: ["shop", "crown", "flame", "gift"],
  },
  foundation: {
    subhead: "OFF THE FIELD",
    headline: "THE IMPACT",
    body: "Youth programs, community partners and the work that outlasts the game.",
    cta: "GET INVOLVED",
    features: ["YOUTH PROGRAMS", "PARTNERS", "DONATE", "VOLUNTEER"],
    icons: ["heart", "users", "gift", "check"],
  },
  profile: {
    subhead: "YOUR MEMBERSHIP",
    headline: "YOUR CIRCLE",
    body: "Your badge, your perks and everything you've unlocked so far.",
    cta: "MANAGE MEMBERSHIP",
    features: ["MEMBER BADGE", "PERKS", "SAVED", "ACTIVITY"],
    icons: ["crown", "gift", "heart", "bolt"],
  },
};

const billings: PageCopyMap = {
  youreIn: {
    subhead: "WELCOME IN",
    headline: "YOU'RE IN",
    body: "Movement, mindset and manifestation — your full practice starts now.",
    cta: "START THE PRACTICE",
    features: ["MOVE", "MIND", "MANIFEST", "COMMUNITY"],
    icons: ["bolt", "sparkle", "star", "users"],
  },
  home: {
    subhead: "MOVE. MIND. MANIFEST.",
    headline: "WELCOME BACK",
    body: "Today's session, this week's intention and everything new in the practice.",
    cta: "TODAY'S SESSION",
    features: ["TODAY'S MOVE", "MINDSET", "JOURNAL", "COMMUNITY"],
    icons: ["bolt", "sparkle", "star", "users"],
    cards: [
      ["Move", "Training library"],
      ["Mind", "Mindset sessions"],
      ["Manifest", "Journals & goals"],
      ["Community", "Members circle"],
    ],
  },
  videos: {
    subhead: "PRESS PLAY",
    headline: "THE LIBRARY",
    body: "Guided workouts, recovery flows and full-length mindset sessions.",
    cta: "PLAY A SESSION",
    features: ["WORKOUTS", "RECOVERY", "MINDSET", "BREATHWORK"],
    icons: ["bolt", "heart", "sparkle", "star"],
  },
  news: {
    subhead: "THE JOURNAL",
    headline: "NOTES & LETTERS",
    body: "Letters from the road, wellness notes and what I'm learning this season.",
    cta: "READ THE LETTER",
    features: ["LETTERS", "WELLNESS", "RECIPES", "ARCHIVE"],
    icons: ["news", "heart", "star", "clock"],
  },
  events: {
    subhead: "GATHER WITH US",
    headline: "EVENTS & RETREATS",
    body: "Retreats, live classes and member-only gatherings.",
    cta: "SAVE MY SPOT",
    features: ["RETREATS", "LIVE CLASSES", "MEETUPS", "GIVEAWAYS"],
    icons: ["sparkle", "users", "calendar", "gift"],
  },
  docAndGlo: {
    subhead: "THE SHOP",
    headline: "WEAR THE MANTRA",
    body: "Considered pieces, small drops and member pricing.",
    cta: "SHOP THE DROP",
    features: ["NEW DROPS", "MEMBER PRICING", "LIMITED", "BUNDLES"],
    icons: ["shop", "crown", "flame", "gift"],
  },
  foundation: {
    subhead: "GIVING BACK",
    headline: "THE MISSION",
    body: "Programs for young women in sport, plus the partners making it happen.",
    cta: "GET INVOLVED",
    features: ["PROGRAMS", "PARTNERS", "DONATE", "MENTOR"],
    icons: ["heart", "users", "gift", "check"],
  },
};

const powers: PageCopyMap = {
  youreIn: {
    subhead: "WELCOME, POWER PLAYER",
    headline: "YOU'RE IN",
    body: "Streams, squad nights and behind-the-scenes hoops — all unlocked.",
    cta: "ENTER THE ARENA",
    features: ["LIVE STREAMS", "SQUAD NIGHTS", "EXCLUSIVES", "DROPS"],
    icons: ["live", "users", "video", "gift"],
  },
  home: {
    subhead: "ELITE ATHLETE. CREATOR. GAMER.",
    headline: "WELCOME BACK",
    body: "New clips, stream schedule and what the squad is playing tonight.",
    cta: "SEE WHAT'S NEW",
    features: ["NEW CLIPS", "STREAM TIMES", "DROPS", "SQUAD"],
    icons: ["video", "live", "shop", "users"],
    cards: [
      ["Exclusive Videos", "Behind the scenes"],
      ["News & Events", "Latest updates"],
      ["Gaming", "Live streams"],
      ["Squad", "Members only"],
    ],
  },
  live: {
    subhead: "WE'RE ON AIR",
    headline: "GAME NIGHT",
    body: "Streams, co-op nights and Q&As. Members get pinged first.",
    cta: "JOIN THE STREAM",
    features: ["LIVE NOW", "CO-OP", "Q&A", "REPLAYS"],
    icons: ["live", "users", "sparkle", "clock"],
  },
  videos: {
    subhead: "PRESS PLAY",
    headline: "THE VAULT",
    body: "Hoops highlights, gaming clips and full-length streams.",
    cta: "PLAY LATEST",
    features: ["HIGHLIGHTS", "GAMING", "TRAINING", "REPLAYS"],
    icons: ["video", "bolt", "flame", "clock"],
  },
  events: {
    subhead: "SHOW UP. WIN STUFF.",
    headline: "EVENTS & GIVEAWAYS",
    body: "Tournaments, watch parties and member-only giveaways.",
    cta: "ENTER THE GIVEAWAY",
    features: ["TOURNAMENTS", "WATCH PARTY", "GIVEAWAYS", "CALENDAR"],
    icons: ["trophy", "video", "gift", "calendar"],
  },
};

const curry: PageCopyMap = {
  youreIn: {
    subhead: "WELCOME TO THE CIRCLE",
    headline: "YOU'RE IN",
    body: "Training, film and the work beyond the game — unlocked for members.",
    cta: "ENTER THE CIRCLE",
    features: ["TRAINING", "FILM ROOM", "IMPACT", "MEMBERS"],
    icons: ["bolt", "video", "heart", "crown"],
  },
  home: {
    subhead: "BEYOND THE GAME. ALWAYS THE IMPACT.",
    headline: "WELCOME BACK",
    body: "New drills, film sessions and everything added since your last visit.",
    cta: "SEE WHAT'S NEW",
    features: ["NEW DRILLS", "FILM ROOM", "UPCOMING", "MEMBERS ONLY"],
    icons: ["bolt", "video", "calendar", "lock"],
    cards: [
      ["Exclusive Videos", "Behind the scenes"],
      ["News & Events", "Latest updates"],
      ["Training", "Drills & plans"],
      ["Impact", "The foundation"],
    ],
  },
  videos: {
    subhead: "PRESS PLAY",
    headline: "THE FILM ROOM",
    body: "Shooting mechanics, workout breakdowns and long-form sessions.",
    cta: "PLAY LATEST",
    features: ["SHOOTING", "WORKOUTS", "FILM", "ARCHIVE"],
    icons: ["bolt", "video", "star", "clock"],
  },
  foundation: {
    subhead: "OFF THE COURT",
    headline: "THE IMPACT",
    body: "Education, access and the programs putting kids in a better position.",
    cta: "GET INVOLVED",
    features: ["EDUCATION", "PARTNERS", "DONATE", "VOLUNTEER"],
    icons: ["heart", "users", "gift", "check"],
  },
  docAndGlo: {
    subhead: "OFFICIAL MERCH",
    headline: "THE COLLECTION",
    body: "Limited drops, member pricing and gear built for the work.",
    cta: "SHOP THE DROP",
    features: ["NEW DROPS", "MEMBER PRICING", "LIMITED", "BUNDLES"],
    icons: ["shop", "crown", "flame", "gift"],
  },
};

const cp3: PageCopyMap = {
  youreIn: {
    subhead: "WELCOME, LEADER",
    headline: "YOU'RE IN",
    body: "Film breakdowns, VIP experiences and the academy — all unlocked.",
    cta: "ENTER THE CIRCLE",
    features: ["FILM ROOM", "EXPERIENCES", "ACADEMY", "MEMBERS"],
    icons: ["video", "ticket", "trophy", "crown"],
  },
  home: {
    subhead: "ELITE EXPERIENCES. EXCLUSIVE CONTENT.",
    headline: "WELCOME BACK",
    body: "This week's film, upcoming experiences and academy updates.",
    cta: "SEE WHAT'S NEW",
    features: ["THIS WEEK'S FILM", "EXPERIENCES", "ACADEMY", "MEMBERS ONLY"],
    icons: ["video", "ticket", "trophy", "lock"],
    cards: [
      ["Film Room", "Breakdowns"],
      ["Experiences", "VIP access"],
      ["Academy", "Youth programs"],
      ["Business", "Ventures & deals"],
    ],
  },
  videos: {
    subhead: "PRESS PLAY",
    headline: "THE FILM ROOM",
    body: "Point-guard reads, pick-and-roll clinics and full-game breakdowns.",
    cta: "PLAY LATEST",
    features: ["READS", "CLINICS", "BREAKDOWNS", "ARCHIVE"],
    icons: ["video", "bolt", "star", "clock"],
  },
  events: {
    subhead: "VIP ACCESS",
    headline: "EXPERIENCES",
    body: "Camps, courtside nights and member-only experiences.",
    cta: "CLAIM ACCESS",
    features: ["CAMPS", "COURTSIDE", "MEETUPS", "GIVEAWAYS"],
    icons: ["trophy", "ticket", "users", "gift"],
  },
  foundation: {
    subhead: "OFF THE COURT",
    headline: "THE ACADEMY",
    body: "Youth basketball, mentorship and scholarship programs.",
    cta: "GET INVOLVED",
    features: ["YOUTH HOOPS", "MENTORSHIP", "SCHOLARSHIPS", "PARTNERS"],
    icons: ["trophy", "users", "gift", "check"],
  },
};

const kyrie: PageCopyMap = {
  youreIn: {
    subhead: "WELCOME TO THE VISION",
    headline: "YOU'RE IN",
    body: "Skill work, culture drops and the conversations that go deeper.",
    cta: "ENTER THE VISION",
    features: ["SKILL WORK", "CULTURE", "EVENTS", "MEMBERS"],
    icons: ["bolt", "sparkle", "calendar", "crown"],
  },
  home: {
    subhead: "CULTURE. VISION. LEGACY.",
    headline: "WELCOME BACK",
    body: "New handles work, culture pieces and what's coming next.",
    cta: "SEE WHAT'S NEW",
    features: ["HANDLES", "FILM ROOM", "CULTURE", "MEMBERS ONLY"],
    icons: ["bolt", "video", "sparkle", "lock"],
    cards: [
      ["Training", "Skill work"],
      ["Film Room", "Breakdowns"],
      ["Events", "Live & IRL"],
      ["Culture", "Art & stories"],
    ],
  },
  videos: {
    subhead: "PRESS PLAY",
    headline: "THE VAULT",
    body: "Handle sessions, footwork clinics and long-form conversations.",
    cta: "PLAY LATEST",
    features: ["HANDLES", "FOOTWORK", "TALKS", "ARCHIVE"],
    icons: ["bolt", "star", "users", "clock"],
  },
  news: {
    subhead: "THE STORIES",
    headline: "CULTURE NOTES",
    body: "Art, community and the stories behind the work.",
    cta: "READ THE LATEST",
    features: ["STORIES", "ART", "COMMUNITY", "ARCHIVE"],
    icons: ["news", "sparkle", "users", "clock"],
  },
};

const speedster: PageCopyMap = {
  youreIn: {
    subhead: "WELCOME TO THE SQUAD",
    headline: "YOU'RE IN",
    body: "Speed sessions, split plans and power blocks — unlocked.",
    cta: "START TRAINING",
    features: ["WORKOUTS", "RACE PLANS", "STRENGTH", "SQUAD"],
    icons: ["bolt", "trophy", "flame", "users"],
  },
  home: {
    subhead: "TRAIN SMART. RACE FAST.",
    headline: "WELCOME BACK",
    body: "This week's block, race calendar and everything new in the squad.",
    cta: "TODAY'S SESSION",
    features: ["THIS WEEK", "RACE CALENDAR", "STRENGTH", "SQUAD"],
    icons: ["bolt", "calendar", "flame", "users"],
    cards: [
      ["Workouts", "Speed sessions"],
      ["Race Strategy", "Split plans"],
      ["Strength", "Power blocks"],
      ["Squad", "Members only"],
    ],
  },
  videos: {
    subhead: "PRESS PLAY",
    headline: "THE SESSIONS",
    body: "Block starts, drill breakdowns and full training days.",
    cta: "PLAY LATEST",
    features: ["STARTS", "DRILLS", "MEETS", "ARCHIVE"],
    icons: ["bolt", "star", "trophy", "clock"],
  },
};

const champ: PageCopyMap = {
  youreIn: {
    subhead: "WELCOME TO THE CLUB",
    headline: "YOU'RE IN",
    body: "Playbook, drops and the fan club — all unlocked.",
    cta: "ENTER THE CLUB",
    features: ["PLAYBOOK", "DROPS", "FAN CLUB", "EVENTS"],
    icons: ["trophy", "shop", "crown", "calendar"],
  },
  home: {
    subhead: "LEVEL UP. HOOP ON.",
    headline: "WELCOME BACK",
    body: "New film, fresh gear and what's next on the calendar.",
    cta: "SEE WHAT'S NEW",
    features: ["NEW FILM", "LATEST DROP", "UPCOMING", "FAN CLUB"],
    icons: ["video", "shop", "calendar", "crown"],
    cards: [
      ["Playbook", "Film & drills"],
      ["Latest Drop", "Shop the gear"],
      ["Fan Club", "Members only"],
      ["Events", "Games & meetups"],
    ],
  },
};

const circle: PageCopyMap = {
  youreIn: {
    subhead: "WELCOME TO THE CIRCLE",
    headline: "YOU'RE IN",
    body: "Drops, early access and behind-the-scenes are officially unlocked.",
    cta: "ENTER THE CIRCLE",
    features: ["EXCLUSIVE DROPS", "EARLY ACCESS", "GIVEAWAYS", "THE CIRCLE"],
    icons: ["star", "clock", "gift", "users"],
  },
  home: {
    subhead: "TODAY IN THE CIRCLE",
    headline: "WELCOME BACK",
    body: "Everything new since your last visit — clips, drops and what's coming.",
    cta: "SEE WHAT'S NEW",
    features: ["LATEST CLIPS", "NEW DROPS", "UPCOMING", "MEMBERS ONLY"],
    icons: ["video", "shop", "calendar", "lock"],
  },
};

/** Page copy per template id. */
export const TEMPLATE_PAGE_COPY: Record<string, PageCopyMap> = {
  "inner-circle": kelce,
  "move-mind": billings,
  "own-your-power": powers,
  "built-different": curry,
  "built-to-lead": cp3,
  "trust-the-vision": kyrie,
  speedster,
  champ23: champ,
  "join-the-circle": circle,
};

const tab = (
  id: string,
  label: string,
  icon: string,
  pageKey: ExperiencePageKeyName,
): ExperienceNavTab => ({ id, label, icon, pageKey });

/** Bottom tab bar per template — reorderable / renameable in the studio. */
export const TEMPLATE_NAV_TABS: Record<string, ExperienceNavTab[]> = {
  "inner-circle": [
    tab("home", "Home", "home", "home"),
    tab("videos", "Videos", "video", "videos"),
    tab("news", "News", "news", "news"),
    tab("shop", "Shop", "shop", "docAndGlo"),
    tab("profile", "Circle", "crown", "profile"),
  ],
  "move-mind": [
    tab("home", "Today", "home", "home"),
    tab("videos", "Move", "bolt", "videos"),
    tab("news", "Mind", "sparkle", "news"),
    tab("events", "Gather", "calendar", "events"),
    tab("profile", "Me", "user", "profile"),
  ],
  "own-your-power": [
    tab("home", "Home", "home", "home"),
    tab("live", "Live", "live", "live"),
    tab("videos", "Clips", "video", "videos"),
    tab("events", "Events", "calendar", "events"),
    tab("profile", "Squad", "users", "profile"),
  ],
  "built-different": [
    tab("home", "Home", "home", "home"),
    tab("videos", "Film", "video", "videos"),
    tab("news", "News", "news", "news"),
    tab("foundation", "Impact", "heart", "foundation"),
    tab("profile", "Profile", "user", "profile"),
  ],
  "built-to-lead": [
    tab("home", "Home", "home", "home"),
    tab("videos", "Film", "video", "videos"),
    tab("events", "Access", "ticket", "events"),
    tab("foundation", "Academy", "trophy", "foundation"),
    tab("profile", "Profile", "user", "profile"),
  ],
  "trust-the-vision": [
    tab("home", "Home", "home", "home"),
    tab("videos", "Vault", "video", "videos"),
    tab("news", "Culture", "sparkle", "news"),
    tab("events", "Events", "calendar", "events"),
    tab("profile", "Profile", "user", "profile"),
  ],
  speedster: [
    tab("home", "Today", "home", "home"),
    tab("videos", "Sessions", "video", "videos"),
    tab("events", "Meets", "calendar", "events"),
    tab("shop", "Gear", "shop", "docAndGlo"),
    tab("profile", "Squad", "users", "profile"),
  ],
  champ23: [
    tab("home", "Home", "home", "home"),
    tab("videos", "Playbook", "video", "videos"),
    tab("shop", "Shop", "shop", "docAndGlo"),
    tab("events", "Events", "calendar", "events"),
    tab("profile", "Club", "crown", "profile"),
  ],
};
