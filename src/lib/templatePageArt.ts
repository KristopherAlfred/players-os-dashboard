import type { ExperiencePageKeyName } from "./experienceConfig";

import curryHero from "../assets/templates/curry/hero-rings.jpg";
import curryLookingUp from "../assets/templates/curry/looking-up.jpg";
import curryCourtside from "../assets/templates/curry/courtside.jpg";
import curryFamily from "../assets/templates/curry/family.jpg";
import curryDribble from "../assets/templates/curry/dribble.jpg";
import curryTrophy from "../assets/templates/curry/trophy.jpg";
import curryJerseyBack from "../assets/templates/curry/jersey-back.jpg";
import currySuit from "../assets/templates/curry/suit.jpg";

/**
 * Per-page hero artwork for a template. Each fan-app page can ship its own
 * background photo instead of reusing the landing hero. Everything stays
 * editable in the studio (replace / crop / delete the hero layer).
 */
export const TEMPLATE_PAGE_ART: Record<
  string,
  Partial<Record<ExperiencePageKeyName, string>>
> = {
  "built-different": {
    landing: curryHero,
    youreIn: curryTrophy,
    home: curryHero,
    social: currySuit,
    videos: curryCourtside,
    news: curryLookingUp,
    events: curryDribble,
    live: curryDribble,
    docAndGlo: curryJerseyBack,
    foundation: curryFamily,
    profile: curryTrophy,
  },
};
