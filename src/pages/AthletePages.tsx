import { useState, type FormEvent } from "react";
import {
  BarChart3,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock3,
  Eye,
  FileEdit,
  Film,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Play,
  Shield,
  Sparkles,
  Trophy,
  Upload,
  User,
  UserCircle2,
  Users,
} from "lucide-react";
import { AthleteUploadPanel } from "../components/AthleteUploadPanel";
import { ContentThumb } from "../components/ContentThumb";
import { Panel } from "../components/PageShell";
import { contentThumbs } from "../data/contentThumbs";
import { recentContent } from "../data/mockData";

type AthleteRole = "athlete" | "agent" | "representative";

type AthleteSession = {
  name: string;
  email: string;
  role: AthleteRole;
  athleteName: string;
};

const SESSION_KEY = "dametime_athlete_hub_session";
const HUB_ATHLETE_NAME = "Damian Lillard";

const roleLabels: Record<AthleteRole, string> = {
  athlete: "Athlete",
  agent: "Agent",
  representative: "Representative",
};

const upcomingDrops = [
  { title: "Tour teaser — 15s cut", date: "Jun 12", type: "Video" },
  { title: "Practice facility BTS", date: "Jun 18", type: "Image set" },
  { title: "Inner Circle voice note", date: "Jun 22", type: "Audio" },
];

const hubActivity = [
  { label: "Studio Session BTS approved", time: "2h ago", tone: "success" as const },
  { label: "Fan Q&A clip reached 120K views", time: "Yesterday", tone: "neutral" as const },
  { label: "Draft review requested on tour teaser", time: "2 days ago", tone: "pending" as const },
];

function loadSession(): AthleteSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AthleteSession) : null;
  } catch {
    return null;
  }
}

function saveSession(session: AthleteSession | null) {
  if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else sessionStorage.removeItem(SESSION_KEY);
}

const loginRoles: {
  id: AthleteRole;
  label: string;
  icon: typeof Trophy;
  hint: string;
}[] = [
  { id: "athlete", label: "Athlete", icon: Trophy, hint: "Your own content" },
  { id: "agent", label: "Agent", icon: Briefcase, hint: "Dame's team" },
  { id: "representative", label: "Rep", icon: Users, hint: "Dame's team" },
];

const loginPerks = [
  "Upload video, images, and audio",
  "Schedule drops before they go live",
  "Track views and engagement per post",
];

function AthleteLogin({ onLogin }: { onLogin: (session: AthleteSession) => void }) {
  const [role, setRole] = useState<AthleteRole>("athlete");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;

    onLogin({
      name: name.trim(),
      email: email.trim(),
      role,
      athleteName: HUB_ATHLETE_NAME,
    });
  }

  const inputClass =
    "w-full rounded-lg border border-dt-border bg-dt-bg/80 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-dt-muted/70 focus:border-dt-red/50 focus:ring-1 focus:ring-dt-red/30";

  return (
    <div className="mx-auto flex w-full max-w-5xl items-center justify-center py-4 sm:py-8">
      <div className="grid w-full overflow-hidden rounded-2xl border border-dt-border bg-dt-card shadow-2xl shadow-black/40 lg:grid-cols-5">
        <div className="relative overflow-hidden lg:col-span-2">
          <img
            src="/content/studio.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/55 to-dt-red/40" />
          <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-dt-red/30 blur-3xl" />

          <div className="relative flex h-full min-h-[220px] flex-col justify-between p-6 sm:min-h-[480px] sm:p-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-dt-red/40 bg-dt-red/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-dt-red">
                <Trophy size={12} />
                Athlete Hub
              </div>
              <h2 className="font-display text-3xl font-semibold leading-tight tracking-wide text-white sm:text-4xl">
                Your stage.
                <br />
                Your uploads.
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/75">
                The creator portal for athletes and the people who represent them — built for DameTime.
              </p>
            </div>

            <ul className="mt-6 hidden space-y-2.5 sm:block">
              {loginPerks.map((perk) => (
                <li key={perk} className="flex items-center gap-2.5 text-sm text-white/85">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-dt-red/20 text-dt-red">
                    <Sparkles size={11} />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>

            <div className="mt-6 hidden rounded-xl border border-white/10 bg-black/30 p-3 backdrop-blur-sm sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-white/50">Trusted by</p>
              <p className="mt-1 text-sm font-medium text-white">Athletes · Agents · Reps</p>
            </div>
          </div>
        </div>

        <div className="relative border-t border-dt-border bg-dt-card p-6 sm:p-8 lg:col-span-3 lg:border-l lg:border-t-0">
          <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 bg-[radial-gradient(circle,rgba(229,9,20,0.15),transparent_70%)]" />

          <div className="relative mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dt-red">Welcome back</p>
            <h3 className="mt-1 font-display text-2xl font-semibold tracking-wide text-white">Sign in</h3>
            <p className="mt-1 text-sm text-dt-muted">
              {role === "athlete"
                ? "Sign in to upload and manage your DameTime content."
                : `Sign in to manage ${HUB_ATHLETE_NAME}'s DameTime content.`}
            </p>
          </div>

          <form className="relative space-y-4" onSubmit={handleSubmit}>
            <div>
              <p className="mb-2 text-xs font-medium text-dt-muted">Signing in as</p>
              <div className="grid grid-cols-3 gap-2">
                {loginRoles.map(({ id, label, icon: Icon, hint }) => {
                  const active = role === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setRole(id)}
                      className={`rounded-xl border px-2 py-3 text-center transition ${
                        active
                          ? "border-dt-red bg-dt-red/15 text-white shadow-md shadow-dt-red/15"
                          : "border-dt-border bg-dt-bg/50 text-dt-muted hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <Icon size={16} className={`mx-auto ${active ? "text-dt-red" : ""}`} />
                      <p className="mt-1.5 text-xs font-semibold">{label}</p>
                      <p className="mt-0.5 hidden text-[10px] opacity-70 sm:block">{hint}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {role !== "athlete" && (
              <div className="flex items-center gap-3 rounded-xl border border-dt-red/25 bg-dt-red/10 px-3 py-2.5">
                <img
                  src="/dame-headshot.png"
                  alt=""
                  className="h-9 w-9 rounded-lg border border-dt-red/30 object-cover object-top"
                />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-dt-red">This dashboard</p>
                  <p className="text-sm font-medium text-white">{HUB_ATHLETE_NAME}</p>
                </div>
              </div>
            )}

            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-medium text-dt-muted">Your name</span>
              <div className="relative">
                <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dt-muted" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Full name"
                  required
                />
              </div>
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-medium text-dt-muted">Email</span>
              <div className="relative">
                <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dt-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@agency.com"
                  required
                />
              </div>
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-medium text-dt-muted">Password</span>
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dt-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                  required
                />
              </div>
            </label>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-dt-red py-3 text-sm font-semibold text-white shadow-lg shadow-dt-red/25 transition hover:bg-dt-red-hover hover:shadow-dt-red/35"
            >
              <LogIn size={16} />
              Enter Athlete Hub
            </button>

            <p className="text-center text-[11px] text-dt-muted">
              Demo login — any email and password will work for now.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function HubStatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof CheckCircle2;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-dt-border bg-dt-card p-4">
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: accent }}
      />
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-dt-muted">{label}</p>
          <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-white">{value}</p>
          <p className="mt-1 text-xs text-dt-muted">{hint}</p>
        </div>
        <div className="rounded-lg border border-white/10 p-2" style={{ color: accent, backgroundColor: `${accent}18` }}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function statusStyle(status: string) {
  if (status === "Published") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  if (status === "Scheduled") return "border-sky-500/30 bg-sky-500/10 text-sky-400";
  return "border-amber-500/30 bg-amber-500/10 text-amber-400";
}

function AthleteHubDashboard({
  session,
  onSignOut,
}: {
  session: AthleteSession;
  onSignOut: () => void;
}) {
  const [tab, setTab] = useState<"upload" | "library">("upload");
  const initials = session.athleteName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-2xl border border-dt-border bg-dt-card">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(229,9,20,0.22),transparent_50%)]" />
        <div className="pointer-events-none absolute -left-16 top-0 h-48 w-48 rounded-full bg-dt-red/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="/dame-headshot.png"
                alt=""
                className="h-16 w-16 rounded-2xl border-2 border-dt-red/50 object-cover object-top shadow-lg shadow-dt-red/20 sm:h-20 sm:w-20"
              />
              <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-dt-border bg-dt-bg text-dt-red">
                <Trophy size={14} />
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dt-red">Athlete Hub</p>
              <h2 className="font-display text-2xl font-semibold tracking-wide text-white sm:text-3xl">
                {session.athleteName}
              </h2>
              <p className="mt-1 text-sm text-dt-muted">
                {session.role === "athlete" ? (
                  <>
                    Signed in as <span className="text-white">{session.name}</span> · Athlete
                  </>
                ) : (
                  <>
                    <span className="text-white">{session.name}</span> · {roleLabels[session.role]} for{" "}
                    <span className="text-white">{session.athleteName}</span>
                  </>
                )}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full border border-dt-red/30 bg-dt-red/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-dt-red">
                  Content creator
                </span>
                <span className="rounded-full border border-dt-border bg-dt-bg/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-dt-muted">
                  {initials} workspace
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setTab("upload")}
              className="flex items-center gap-1.5 rounded-md bg-dt-red px-3 py-2 text-xs font-semibold text-white hover:bg-dt-red-hover"
            >
              <Sparkles size={14} />
              New upload
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-dt-border bg-dt-bg/60 px-3 py-2 text-xs text-dt-muted hover:text-white"
            >
              <Calendar size={14} />
              Schedule drop
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="flex items-center gap-1.5 rounded-md border border-dt-border px-3 py-2 text-xs text-dt-muted hover:text-white"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <HubStatCard label="Published" value="12" hint="Live on DameTime" icon={CheckCircle2} accent="#22c55e" />
        <HubStatCard label="Drafts" value="3" hint="Ready to review" icon={FileEdit} accent="#f59e0b" />
        <HubStatCard label="Scheduled" value="2" hint="Upcoming drops" icon={Clock3} accent="#38bdf8" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <div className="flex flex-wrap gap-2 rounded-xl border border-dt-border bg-dt-card p-2">
            {(
              [
                { id: "upload" as const, label: "Upload Content", icon: Upload },
                { id: "library" as const, label: "My Uploads", icon: UserCircle2 },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition sm:flex-none ${
                  tab === id
                    ? "bg-dt-red text-white shadow-md shadow-dt-red/20"
                    : "text-dt-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {tab === "upload" ? (
            <AthleteUploadPanel />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {recentContent.slice(0, 6).map((item) => {
                const thumb = contentThumbs[item.thumb];
                return (
                <div
                  key={item.title}
                  className="group overflow-hidden rounded-xl border border-dt-border bg-dt-card transition hover:border-dt-red/40"
                >
                  <div className="relative h-32 overflow-hidden bg-dt-bg">
                    {thumb ? (
                      <img src={thumb.src} alt="" className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ContentThumb id={item.thumb} size="md" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                      <Play size={28} className="fill-white text-white" />
                    </div>
                  </div>
                  <div className="space-y-2 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-medium text-white">{item.title}</p>
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusStyle(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-dt-muted">
                      <span className="flex items-center gap-1">
                        <Film size={11} />
                        {item.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={11} />
                        {item.views}
                      </span>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4 xl:col-span-4">
          <Panel title="Upcoming Drops">
            <ul className="space-y-3">
              {upcomingDrops.map((drop) => (
                <li key={drop.title} className="rounded-lg border border-dt-border bg-dt-bg/50 p-3">
                  <p className="text-sm font-medium text-white">{drop.title}</p>
                  <div className="mt-1 flex items-center justify-between text-xs text-dt-muted">
                    <span>{drop.type}</span>
                    <span className="flex items-center gap-1 text-dt-red">
                      <Calendar size={11} />
                      {drop.date}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Recent Activity">
            <ul className="space-y-3">
              {hubActivity.map((item) => (
                <li key={item.label} className="flex gap-3 border-b border-dt-border/50 pb-3 last:border-0 last:pb-0">
                  <div
                    className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                      item.tone === "success"
                        ? "bg-emerald-400"
                        : item.tone === "pending"
                          ? "bg-amber-400"
                          : "bg-dt-red"
                    }`}
                  />
                  <div>
                    <p className="text-sm text-white">{item.label}</p>
                    <p className="text-xs text-dt-muted">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <div className="rounded-xl border border-dt-red/20 bg-gradient-to-br from-dt-red/10 to-transparent p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-dt-red/15 p-2 text-dt-red">
                <BarChart3 size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Performance snapshot</p>
                <p className="mt-1 text-xs leading-relaxed text-dt-muted">
                  Your last 3 uploads averaged <span className="text-white">186K views</span> and{" "}
                  <span className="text-white">38% engagement</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-dt-border/80 bg-dt-bg/40 px-3 py-3 text-xs text-dt-muted">
            <Shield size={14} className="mt-0.5 shrink-0 text-dt-red" />
            <p>Uploads from Athlete Hub are reviewed before going live on the main dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AthleteHubPage() {
  const [session, setSession] = useState<AthleteSession | null>(loadSession);

  function handleLogin(next: AthleteSession) {
    setSession(next);
    saveSession(next);
  }

  function handleSignOut() {
    setSession(null);
    saveSession(null);
  }

  if (!session) return <AthleteLogin onLogin={handleLogin} />;
  return <AthleteHubDashboard session={session} onSignOut={handleSignOut} />;
}
