import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";

import { FanAppPageView } from "../components/experience/ExperienceAppPreview";
import type { ExperienceConfig, ExperiencePageKeyName } from "../lib/experienceConfig";
import { themeBackgroundCss } from "../lib/experienceConfig";
import { fetchPublicFanApp, registerFanAppView } from "../lib/fanAppPublish";

/**
 * Public fan-app viewer: /app/:slug renders the exact experience the athlete
 * published from the studio — real navigation, real join flow, no dashboard.
 */
export function FanAppPublicPage() {
  const { slug = "" } = useParams();
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");
  const [experience, setExperience] = useState<ExperienceConfig | null>(null);
  const [appName, setAppName] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      const record = await fetchPublicFanApp(slug);
      if (!active) return;
      if (!record || !record.is_published) {
        setState("missing");
        return;
      }
      setExperience(record.config);
      setAppName(record.app_name || record.config.brand.wordmark || "Fan app");
      setState("ready");
      void registerFanAppView(slug);
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (appName) document.title = `${appName} · Fan app`;
  }, [appName]);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white/60">
        <Loader2 className="mr-2 animate-spin" size={18} /> Loading experience…
      </div>
    );
  }

  if (state === "missing" || !experience) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black px-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/50">
          <Lock size={18} />
        </span>
        <h1 className="font-display text-xl text-white">This fan app isn&apos;t live yet</h1>
        <p className="max-w-sm text-sm text-white/50">
          The link may have changed, or the athlete hasn&apos;t published their experience yet.
        </p>
      </div>
    );
  }

  return <FanAppRuntime experience={experience} />;
}

function FanAppRuntime({ experience }: { experience: ExperienceConfig }) {
  const [pageKey, setPageKey] = useState<ExperiencePageKeyName>("landing");
  const [unlock, setUnlock] = useState(false);
  const page = experience.pages[pageKey];
  const backdrop = useMemo(() => themeBackgroundCss(experience.theme), [experience.theme]);

  const onCta = () => {
    if (pageKey === "landing") {
      setUnlock(true);
      return;
    }
    if (pageKey === "youreIn") {
      setPageKey("home");
      return;
    }
    const next = (experience.nav?.tabs ?? []).find((t) => !t.hidden && t.pageKey !== pageKey);
    if (next) setPageKey(next.pageKey);
  };

  const screen = (
    <div className="relative h-full w-full overflow-hidden">
      <FanAppPageView experience={experience} pageKey={pageKey} onNavigate={setPageKey} onCta={onCta} />
      {unlock && pageKey === "landing" ? (
        <div className="absolute inset-x-0 bottom-0 z-[160] px-3 pb-4 pt-16">
          <div
            className="relative rounded-3xl border px-4 pb-5 pt-7"
            style={{
              borderColor: page.unlockPanelBorderColor || "rgba(255,255,255,0.14)",
              background: `linear-gradient(165deg, ${page.unlockPanelBgFrom || "rgba(18,18,18,0.97)"} 0%, ${
                page.unlockPanelBgTo || "rgba(6,6,6,0.98)"
              } 100%)`,
              boxShadow: `0 -10px 40px rgba(0,0,0,0.6)`,
            }}
          >
            <span
              className="absolute left-1/2 top-0 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-black"
              style={{ borderColor: page.accentColor, color: page.accentColor }}
            >
              <Lock size={14} />
            </span>
            <p className="text-center font-display text-sm tracking-wide text-white">
              {page.unlockHeadline || page.headline}
            </p>
            <p className="mt-1.5 text-center text-[11px] leading-relaxed text-white/70">
              {page.unlockBody || page.body}
            </p>
            <div className="mt-4 space-y-2">
              {["Continue with X", "Continue with Google", "Continue with Apple"].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setUnlock(false);
                    setPageKey("youreIn");
                  }}
                  className={`flex h-10 w-full items-center justify-center rounded-xl border text-[11px] font-semibold uppercase tracking-wide transition active:scale-[0.98] ${
                    label.includes("Google")
                      ? "border-white/20 bg-white text-black"
                      : "border-white/15 bg-black text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-[9px] text-white/45">
              {page.unlockFooter || "100% Private · No Spam · You're in control"}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="min-h-screen w-full" style={{ background: backdrop || "#050505" }}>
      {/* Phone-first: the app fills the screen on mobile */}
      <div className="md:hidden h-[100dvh] w-full">{screen}</div>

      {/* Desktop: framed device on the athlete's brand backdrop */}
      <div className="hidden min-h-screen flex-col items-center justify-center gap-5 py-10 md:flex">
        <div className="rounded-[2.9rem] border border-white/12 bg-gradient-to-b from-white/[0.14] to-white/[0.02] p-[10px] shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
          <div className="relative h-[760px] w-[372px] overflow-hidden rounded-[2.4rem] bg-black">
            <span className="pointer-events-none absolute left-1/2 top-2.5 z-[200] h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
            {screen}
            <span className="pointer-events-none absolute bottom-1.5 left-1/2 z-[200] h-1 w-28 -translate-x-1/2 rounded-full bg-white/35" />
          </div>
        </div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/30">
          {experience.brand.wordmark || "Fan app"} · powered by PlayersOS
        </p>
      </div>
    </div>
  );
}

export default FanAppPublicPage;
