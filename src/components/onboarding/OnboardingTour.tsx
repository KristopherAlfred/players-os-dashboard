import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react";

export type TourStep = {
  id: string;
  title: string;
  body: string;
  /** CSS selector of the element to spotlight. Omit for a centered step. */
  target?: string;
  /** Route the tour should be on for this step. */
  route?: string;
  ctaLabel?: string;
};

/** Preview sequence — welcome + the Platforms step, for visual sign-off. */
export const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to your AMX Dashboard, Sloane",
    body: "This is your home base for performance, content and audience data across every platform — all in one place.",
  },
  {
    id: "platforms",
    title: "Platforms",
    body: "Drill into any single platform for Social Blade–style analytics: growth charts, recent posts and engagement.",
    target: '[data-tour="nav-platforms"]',
  },
];

type OnboardingContextValue = {
  start: () => void;
  active: boolean;
};

const OnboardingContext = createContext<OnboardingContextValue>({
  start: () => {},
  active: false,
});

export function useOnboarding() {
  return useContext(OnboardingContext);
}

type Rect = { top: number; left: number; width: number; height: number };

function useTargetRect(selector: string | undefined, stepIndex: number) {
  const [rect, setRect] = useState<Rect | null>(null);

  useLayoutEffect(() => {
    if (!selector) {
      setRect(null);
      return;
    }
    let frame = 0;
    const measure = () => {
      const el = document.querySelector(selector);
      if (!el) {
        setRect(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    measure();
    frame = window.setInterval(measure, 200);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.clearInterval(frame);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [selector, stepIndex]);

  return rect;
}

function TourOverlay({
  steps,
  index,
  onNext,
  onBack,
  onSkip,
}: {
  steps: TourStep[];
  index: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}) {
  const step = steps[index];
  const rect = useTargetRect(step.target, index);
  const isLast = index === steps.length - 1;

  const pad = 8;
  const spotlight = rect
    ? {
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : null;

  const cardStyle: React.CSSProperties = spotlight
    ? {
        top: Math.min(
          Math.max(spotlight.top, 16),
          Math.max(window.innerHeight - 260, 16),
        ),
        left: Math.min(
          spotlight.left + spotlight.width + 18,
          Math.max(window.innerWidth - 380, 16),
        ),
      }
    : {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };

  return createPortal(
    <div className="fixed inset-0 z-[200]">
      {/* Dimmer + spotlight */}
      {spotlight ? (
        <div
          className="pointer-events-none absolute rounded-xl transition-all duration-300 ease-out"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            boxShadow:
              "0 0 0 9999px rgba(0,0,0,0.74), 0 0 0 2px var(--theme-accent), 0 0 28px 4px color-mix(in srgb, var(--theme-accent) 45%, transparent)",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />
      )}

      <div
        key={step.id}
        className="absolute w-[min(360px,calc(100vw-32px))] animate-fade-in rounded-2xl border border-dt-border bg-dt-card p-5 shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
        style={{
          ...cardStyle,
          borderColor: "color-mix(in srgb, var(--theme-accent) 40%, transparent)",
        }}
      >
        <button
          type="button"
          onClick={onSkip}
          className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-white/45 transition hover:bg-white/5 hover:text-white"
        >
          <X size={12} /> Skip tutorial
        </button>

        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-dt-red/30 bg-dt-red/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-dt-red">
          <Sparkles size={11} />
          Step {index + 1} of {steps.length}
        </div>

        <h3 className="font-display text-lg font-semibold leading-tight tracking-tight text-white">
          {step.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60">{step.body}</p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {steps.map((s, i) => (
              <span
                key={s.id}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-dt-red" : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {index > 0 ? (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 rounded-xl border border-dt-border px-3 py-2 text-xs font-semibold text-white/70 transition hover:border-white/25 hover:text-white"
              >
                <ArrowLeft size={13} /> Back
              </button>
            ) : null}
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-1.5 rounded-xl bg-dt-red px-3.5 py-2 text-xs font-semibold text-white shadow-[0_8px_24px_rgba(143,227,184,0.28)] transition hover:brightness-110"
            >
              {step.ctaLabel ?? (isLast ? "Finish" : "Next")}
              {!isLast ? <ArrowRight size={13} /> : null}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

const STORAGE_KEY = "amx_onboarding_complete";

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const steps = TOUR_STEPS;

  const start = useCallback(() => {
    setIndex(0);
    setActive(true);
  }, []);

  const finish = useCallback(() => {
    setActive(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  // First-login auto-trigger (completion flag moves to the backend next).
  useEffect(() => {
    let done = "1";
    try {
      done = window.localStorage.getItem(STORAGE_KEY) ?? "";
    } catch {
      /* ignore */
    }
    if (!done) setActive(true);
  }, []);

  // Keep the app on the route a step points at.
  useEffect(() => {
    if (!active) return;
    const route = steps[index]?.route;
    if (route && location.pathname !== route) navigate(route);
  }, [active, index, steps, location.pathname, navigate]);

  const value = useMemo(() => ({ start, active }), [start, active]);

  return (
    <OnboardingContext.Provider value={value}>
      {children}
      {active ? (
        <TourOverlay
          steps={steps}
          index={index}
          onSkip={finish}
          onBack={() => setIndex((i) => Math.max(0, i - 1))}
          onNext={() =>
            setIndex((i) => {
              if (i >= steps.length - 1) {
                finish();
                return i;
              }
              return i + 1;
            })
          }
        />
      ) : null}
    </OnboardingContext.Provider>
  );
}
