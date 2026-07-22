import type { CSSProperties, ReactNode } from "react";
import type { ExperienceConfig, ExperiencePageConfig } from "../../lib/experienceConfig";
import { pageBackgroundCss, themeBackgroundCss } from "../../lib/experienceConfig";
import { resolveExperiencePreviewUrl } from "../../lib/resolveExperiencePreviewUrl";

export type PhonePreviewMode =
  | "brand"
  | "theme"
  | "effects"
  | "landing"
  | "youreIn"
  | "settings"
  | "homePage"
  | "boxes";

function PhoneFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="sticky top-4 self-start">
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
        Live phone · {label}
      </p>
      <div className="exp-phone-shell relative mx-auto w-full max-w-[300px] overflow-hidden rounded-[2.35rem] border border-white/15 bg-black shadow-[0_0_48px_rgba(143,227,184,0.12)]">
        <div className="absolute left-1/2 top-2 z-20 h-5 w-28 -translate-x-1/2 rounded-full bg-black/90" />
        <div className="relative min-h-[560px] overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function BrandBar({ experience }: { experience: ExperienceConfig }) {
  const { brand } = experience;
  return (
    <div className="flex items-center gap-2.5 border-b border-white/10 px-4 pb-3 pt-8">
      {brand.showLogoImage && brand.logoSrc ? (
        <img
          src={resolveExperiencePreviewUrl(brand.logoSrc)}
          alt=""
          className="h-9 w-9 rounded-full object-cover"
          style={{ boxShadow: `0 0 14px ${brand.logoColor}88` }}
        />
      ) : null}
      <div className="min-w-0">
        <p className="truncate text-[11px] font-bold tracking-[0.18em]" style={{ color: brand.wordmarkColor }}>
          {brand.wordmark || "SLOANE GLO"}
        </p>
        {brand.tagline ? (
          <p className="truncate text-[9px]" style={{ color: brand.taglineColor }}>
            {brand.tagline}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function LandingPreview({ experience }: { experience: ExperienceConfig }) {
  const page = experience.pages.landing;
  const lines = (page.subhead || "THE OFFICIAL\nSLOANE GLO\nCOMMUNITY").split("\n");
  return (
    <div className="flex h-full min-h-[560px] flex-col" style={{ background: pageBackgroundCss(page) }}>
      <BrandBar experience={experience} />
      <div className="relative flex flex-1 flex-col px-4 pb-6 pt-4">
        {page.heroImage ? (
          <img
            src={resolveExperiencePreviewUrl(page.heroImage)}
            alt=""
            className="mb-4 h-44 w-full rounded-2xl object-cover object-top opacity-90"
          />
        ) : (
          <div className="mb-4 flex h-44 items-end rounded-2xl border border-white/10 bg-black/30 p-3">
            <p className="text-[10px] text-white/35">Hero image optional</p>
          </div>
        )}
        <p className="text-center text-[10px] font-semibold leading-relaxed tracking-[0.14em]" style={{ color: page.accentColor }}>
          {lines.map((line, i) => (
            <span key={`${line}-${i}`}>
              {line}
              {i < lines.length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
        <p className="mt-3 text-center font-display text-xl text-white">{page.headline || "Join Sloane Glo"}</p>
        <p className="mt-2 text-center text-[11px] leading-relaxed text-white/60">{page.body}</p>
        <button
          type="button"
          className="mt-auto w-full py-3 text-sm font-bold"
          style={{
            background: page.ctaBg,
            color: page.ctaText,
            borderRadius: experience.theme.buttonRadius,
          }}
        >
          {page.ctaLabel || "Join My Circle →"}
        </button>
      </div>
    </div>
  );
}

function YoureInPreview({ experience }: { experience: ExperienceConfig }) {
  const page = experience.pages.youreIn;
  return (
    <div className="flex h-full min-h-[560px] flex-col" style={{ background: pageBackgroundCss(page) }}>
      <BrandBar experience={experience} />
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-3xl text-white">{page.headline || "You're in"}</p>
        <p className="mt-2 text-sm" style={{ color: page.accentColor }}>
          {page.subhead || "Welcome to Sloane Glo"}
        </p>
        <p className="mt-4 text-[12px] text-white/55">{page.body}</p>
        <div
          className="mt-8 h-10 w-10 animate-spin rounded-full border-2 border-white/15"
          style={{ borderTopColor: page.accentColor }}
        />
        <p className="mt-4 text-[11px] text-white/45">{page.loaderLabel || "Preparing your experience..."}</p>
      </div>
    </div>
  );
}

function SettingsPreview({ experience }: { experience: ExperienceConfig }) {
  const page = experience.pages.settings;
  return (
    <div className="flex h-full min-h-[560px] flex-col" style={{ background: pageBackgroundCss(page) }}>
      <BrandBar experience={experience} />
      <div className="space-y-3 px-4 py-5">
        <p className="font-display text-lg text-white">{page.title || page.headline || "Account Settings"}</p>
        <p className="text-[11px] text-white/50">{page.body}</p>
        {["Profile", "Notifications", "Privacy"].map((row) => (
          <div
            key={row}
            className="rounded-xl border border-white/10 px-3 py-3 text-sm text-white/80"
            style={{ background: experience.theme.card }}
          >
            {row}
          </div>
        ))}
        <button
          type="button"
          className="mt-4 w-full py-3 text-sm font-bold"
          style={{
            background: page.ctaBg,
            color: page.ctaText,
            borderRadius: experience.theme.buttonRadius,
          }}
        >
          {page.logoutLabel || "Log Out"}
        </button>
      </div>
    </div>
  );
}

function HomeChromePreview({ experience }: { experience: ExperienceConfig }) {
  const { theme, effects, pages } = experience;
  const page = pages.home;
  const bg =
    page.useGradientBg || page.backgroundColor
      ? pageBackgroundCss({ ...page, backgroundImage: "" })
      : themeBackgroundCss({ ...theme, backgroundImage: "" });

  return (
    <div className="relative flex h-full min-h-[560px] flex-col" style={{ background: bg, color: theme.text }}>
      {effects.vignette ? (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55))]" />
      ) : null}
      <BrandBar experience={experience} />
      <div className="relative space-y-2 p-3">
        <div
          className="rounded-2xl border border-white/10 p-3"
          style={{ background: theme.card, boxShadow: effects.glow ? `0 0 20px ${effects.glowColor}33` : undefined }}
        >
          <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: theme.muted }}>
            Home
          </p>
          <p className="mt-1 font-display text-base">{page.headline || "Your hub"}</p>
          <p className="mt-1 text-[11px]" style={{ color: theme.muted }}>
            {page.body || "Preview with live theme colors"}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {["Exclusive", "News", "Events", "Doc & Glo"].map((label, i) => (
            <div
              key={label}
              className={`rounded-xl border border-white/10 p-3 ${i === 0 ? "col-span-2" : ""}`}
              style={{
                background: theme.useGradientBg
                  ? `linear-gradient(145deg, ${theme.bgGradientVia}, ${theme.card})`
                  : theme.card,
                minHeight: i === 0 ? 88 : 72,
              }}
            >
              <p className="text-[10px] font-semibold tracking-wide text-white/80">{label}</p>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-2 w-full py-2.5 text-sm font-semibold"
          style={{
            background: theme.buttonBg,
            color: theme.buttonText,
            borderRadius: theme.buttonRadius,
            border: `1px solid ${theme.buttonBorder}`,
          }}
        >
          Preview CTA
        </button>
      </div>
    </div>
  );
}

const MODE_LABEL: Record<PhonePreviewMode, string> = {
  brand: "Brand",
  theme: "Colors",
  effects: "Effects",
  landing: "Landing",
  youreIn: "You're In",
  settings: "Settings",
  homePage: "Home",
  boxes: "Home boxes",
};

export function ExperiencePhonePreview({
  experience,
  mode,
}: {
  experience: ExperienceConfig;
  mode: PhonePreviewMode;
}) {
  let body: ReactNode;
  if (mode === "landing") body = <LandingPreview experience={experience} />;
  else if (mode === "youreIn") body = <YoureInPreview experience={experience} />;
  else if (mode === "settings") body = <SettingsPreview experience={experience} />;
  else body = <HomeChromePreview experience={experience} />;

  return (
    <PhoneFrame label={MODE_LABEL[mode]}>
      <div
        className="relative h-full"
        style={
          {
            ["--xp-accent" as string]: experience.theme.accent,
          } as CSSProperties
        }
      >
        {body}
      </div>
    </PhoneFrame>
  );
}

export function pagePreviewBackground(page: ExperiencePageConfig) {
  return pageBackgroundCss(page);
}
