import { useState, type FormEvent } from "react";
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock3,
  Eye,
  FileEdit,
  Film,
  LogIn,
  LogOut,
  Play,
  Shield,
  Sparkles,
  Trophy,
  Upload,
  UserCircle2,
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

function AthleteLogin({ onLogin }: { onLogin: (session: AthleteSession) => void }) {
  const [role, setRole] = useState<AthleteRole>("athlete");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [athleteName, setAthleteName] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    if (role !== "athlete" && !athleteName.trim()) return;

    onLogin({
      name: name.trim(),
      email: email.trim(),
      role,
      athleteName: role === "athlete" ? name.trim() : athleteName.trim(),
    });
  }

  return (
    <div className="mx-auto max-w-lg">
      <Panel title="Athlete Hub Sign In">
        <p className="mb-5 text-sm text-dt-muted">
          Athletes, agents, and representatives can sign in here to upload content, manage drafts, and publish to DameTime.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm">
            <span className="text-dt-muted">Signing in as</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AthleteRole)}
              className="mt-1 w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-white"
            >
              <option value="athlete">Athlete</option>
              <option value="agent">Agent</option>
              <option value="representative">Representative</option>
            </select>
          </label>

          {role !== "athlete" && (
            <label className="block text-sm">
              <span className="text-dt-muted">Athlete name</span>
              <input
                value={athleteName}
                onChange={(e) => setAthleteName(e.target.value)}
                className="mt-1 w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-white outline-none"
                placeholder="Athlete you're representing"
                required
              />
            </label>
          )}

          <label className="block text-sm">
            <span className="text-dt-muted">Your name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-white outline-none"
              placeholder="Full name"
              required
            />
          </label>

          <label className="block text-sm">
            <span className="text-dt-muted">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-white outline-none"
              placeholder="you@agency.com"
              required
            />
          </label>

          <label className="block text-sm">
            <span className="text-dt-muted">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-white outline-none"
              placeholder="••••••••"
              required
            />
          </label>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-dt-red py-2.5 text-sm font-semibold text-white hover:bg-dt-red-hover"
          >
            <LogIn size={16} />
            Sign in to Athlete Hub
          </button>
        </form>
      </Panel>
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
                Signed in as <span className="text-white">{session.name}</span> · {roleLabels[session.role]}
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
