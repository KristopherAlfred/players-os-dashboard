import { useState, type FormEvent } from "react";
import { LogIn, LogOut, Shield, Upload, UserCircle2 } from "lucide-react";
import { AthleteUploadPanel } from "../components/AthleteUploadPanel";
import { Panel, StatCard } from "../components/PageShell";
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

function AthleteHubDashboard({
  session,
  onSignOut,
}: {
  session: AthleteSession;
  onSignOut: () => void;
}) {
  const [tab, setTab] = useState<"upload" | "library">("upload");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dt-border bg-dt-card px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">
            Welcome, {session.name}
          </p>
          <p className="mt-0.5 text-xs text-dt-muted">
            {roleLabels[session.role]} · Managing content for {session.athleteName}
          </p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="flex items-center gap-1.5 rounded-md border border-dt-border px-3 py-1.5 text-xs text-dt-muted hover:text-white"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Published" value="12" hint="Live on DameTime" />
        <StatCard label="Drafts" value="3" hint="Ready to review" />
        <StatCard label="Scheduled" value="2" hint="Upcoming drops" />
      </div>

      <div className="flex gap-2 border-b border-dt-border">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition ${
            tab === "upload"
              ? "border-dt-red text-white"
              : "border-transparent text-dt-muted hover:text-white"
          }`}
        >
          <Upload size={14} />
          Upload Content
        </button>
        <button
          type="button"
          onClick={() => setTab("library")}
          className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition ${
            tab === "library"
              ? "border-dt-red text-white"
              : "border-transparent text-dt-muted hover:text-white"
          }`}
        >
          <UserCircle2 size={14} />
          My Uploads
        </button>
      </div>

      {tab === "upload" ? (
        <AthleteUploadPanel />
      ) : (
        <Panel title="Recent Uploads">
          <ul className="space-y-2">
            {recentContent.slice(0, 5).map((item) => (
              <li
                key={item.title}
                className="flex items-center justify-between rounded-md border border-dt-border bg-dt-bg/50 px-3 py-2 text-sm"
              >
                <span className="text-white">{item.title}</span>
                <span className="text-xs text-dt-muted">{item.type} · {item.views} views</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <div className="flex items-start gap-2 rounded-lg border border-dt-border/80 bg-dt-bg/40 px-3 py-2 text-xs text-dt-muted">
        <Shield size={14} className="mt-0.5 shrink-0 text-dt-red" />
        <p>Uploads from Athlete Hub are reviewed before going live on the main dashboard.</p>
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
