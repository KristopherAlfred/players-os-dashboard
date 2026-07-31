import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart2,
  Crown,
  LineChart,
  LogIn,
  MessageCircle,
  Shield,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Trophy,
    title: "Athlete Hub",
    body: "Upload drops, manage content, and run your brand from one command center built for pros.",
  },
  {
    icon: Users,
    title: "Fans & Data",
    body: "See who your audience is, where they live, and how they engage — in real time.",
  },
  {
    icon: LineChart,
    title: "Performance",
    body: "Track traffic, conversions, and campaign lift without digging through five different tools.",
  },
  {
    icon: Crown,
    title: "Monetization",
    body: "Activate audience segments, DSP partnerships, and revenue insights on your terms.",
  },
  {
    icon: MessageCircle,
    title: "Engagement",
    body: "Messages, comments, and fan touchpoints — handled in one place, on your schedule.",
  },
  {
    icon: Shield,
    title: "Secure by design",
    body: "Authorized athletes and team staff only. Your data stays private and compliant.",
  },
];

const stats = [
  { value: "512K+", label: "Fans tracked" },
  { value: "75K+", label: "Email & SMS captures" },
  { value: "28", label: "Audience segments" },
  { value: "14", label: "Active DSP partners" },
];

function PageBackground() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black via-[#120202] to-black" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-black via-[#1a0303] to-black" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(226,35,26,0.26),transparent_52%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(226,35,26,0.1),transparent_45%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.95),transparent_55%)]" />
    </>
  );
}

export function MarketingLandingPage() {
  return (
    <div className="marketing-theme relative min-h-[100dvh] overflow-x-hidden bg-black text-white">
      <PageBackground />

      <header className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/welcome" className="shrink-0">
            <img
              src="/players-os-logo.png"
              alt="Players OS"
              className="brand-logo-blend h-14 w-auto max-w-[280px] object-contain sm:h-16"
            />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login?mode=signup"
              className="hidden items-center gap-2 rounded-lg border border-dt-red/40 bg-dt-red/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-dt-red/60 hover:bg-dt-red/20 sm:inline-flex"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
            >
              <LogIn size={16} />
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:pb-24 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-dt-red/40 bg-dt-red/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
              <Sparkles size={14} />
              Built for athletes &amp; their teams
            </div>
            <img
              src="/players-os-logo.png"
              alt="Players OS"
              className="brand-logo-blend mx-auto mb-8 h-32 w-auto max-w-[560px] object-contain sm:h-40 lg:h-48"
            />
            <h1 className="font-display text-4xl font-bold leading-tight tracking-wide text-white sm:text-5xl lg:text-6xl">
              Your brand. Your fans.{" "}
              <span className="text-dt-red">Your command center.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              Players OS is the athlete &amp; admin platform for the culture — content, audience
              intelligence, monetization, and engagement in one place, built for the pros.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/login?mode=signup"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-dt-red px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-dt-red/30 transition hover:bg-dt-red-hover sm:w-auto"
              >
                Edit My Players OS Experience
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-black/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/5 sm:w-auto"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:mt-20">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-black/80 px-4 py-5 text-center backdrop-blur-sm"
              >
                <p className="font-display text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="relative mx-auto mt-14 max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#120000]/90 via-black to-black p-1 shadow-2xl shadow-dt-red/10 sm:mt-16">
            <div className="flex items-center gap-2 border-b border-white/10 bg-black/80 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-dt-red/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="ml-2 text-[10px] font-medium uppercase tracking-widest text-white/40">
                Players OS Preview
              </span>
            </div>
            <div className="grid gap-px bg-white/5 p-4 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-black/60 p-4 sm:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-dt-red">Traffic</p>
                <p className="mt-1 font-display text-2xl font-bold text-white">1.2M</p>
                <p className="mt-1 text-xs text-white/50">Visitors this month</p>
                <div className="mt-4 flex h-16 items-end gap-1">
                  {[40, 55, 48, 70, 62, 85, 78, 92].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-dt-red to-dt-red/40"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg border border-white/10 bg-black/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-white/50">Fans</p>
                  <p className="mt-1 text-xl font-bold text-white">512K</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-white/50">Revenue MTD</p>
                  <p className="mt-1 text-xl font-bold text-dt-red">$96K</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-black/50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-dt-red">Platform</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-wide text-white sm:text-4xl">
                Everything your team needs to win
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
                From first upload to fan monetization — Players OS gives athletes, agents, and reps the same
                playbook the biggest brands use.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-black/60 p-6 transition hover:border-dt-red/30 hover:from-dt-red/[0.06]"
                >
                  <div className="mb-4 inline-flex rounded-lg border border-dt-red/30 bg-dt-red/10 p-2.5 text-dt-red">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a0000]/80 via-black to-black p-8 sm:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-dt-red">Why Players OS</p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-wide text-white sm:text-4xl">
                  Real fans. Real data. Real value.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
                  Stop guessing who your audience is or what content hits. Players OS turns fan behavior into
                  actionable insight — so you can grow the brand, deepen loyalty, and unlock new revenue.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-white/80">
                  <li className="flex items-start gap-2">
                    <BarChart2 size={16} className="mt-0.5 shrink-0 text-dt-red" />
                    Live dashboards for traffic, engagement, and conversions
                  </li>
                  <li className="flex items-start gap-2">
                    <Users size={16} className="mt-0.5 shrink-0 text-dt-red" />
                    Geo heatmaps, fan profiles, and subscriber lists
                  </li>
                  <li className="flex items-start gap-2">
                    <Crown size={16} className="mt-0.5 shrink-0 text-dt-red" />
                    Monetization tools wired for partners and DSPs
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-dt-red/20 bg-black/60 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-dt-red">Members only</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Request access as an agent or representative for a roster athlete.
                </p>
                <p className="mt-2 text-sm text-white/60">
                  Pick your athlete, submit verification, and get approved before you enter the dashboard.
                </p>
                <Link
                  to="/login?mode=signup"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-dt-red py-3 text-sm font-semibold text-white shadow-lg shadow-dt-red/25 transition hover:bg-dt-red-hover"
                >
                  Request Access
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-black/70 px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-wide text-white sm:text-4xl">
              Ready to run your Players OS experience?
            </h2>
            <p className="mt-4 text-sm text-white/70 sm:text-base">
              Join the platform built for athletes, agents, and reps who move at pro speed.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <Link
                to="/login?mode=signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-dt-red px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-dt-red/30 transition hover:bg-dt-red-hover"
              >
                Edit My Players OS Experience
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login?mode=signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/10"
              >
                Request Team Access
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-8 py-3.5 text-sm font-semibold text-white/90 transition hover:border-white/30 hover:text-white"
              >
                <LogIn size={16} />
                Sign In
              </Link>
            </div>
            <p className="mt-8 text-sm font-semibold text-white/80">
              Authorized athletes and team staff only.
            </p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-4 py-6 text-center text-[11px] font-bold uppercase tracking-widest text-white/50 sm:px-6">
        <p>Secure · Private · Compliant · Owned by athletes</p>
      </footer>
    </div>
  );
}
