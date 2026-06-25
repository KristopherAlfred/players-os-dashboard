import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LogIn, Mail, Shield, Trophy, User } from "lucide-react";
import { saveDashboardSession, type DashboardRole } from "../lib/dashboardAuth";

const nbaTeams = [
  "Lakers", "Celtics", "Warriors", "Heat", "Knicks", "Bulls", "Nets", "Suns",
  "Bucks", "Nuggets", "Mavericks", "Clippers", "Sixers", "Raptors", "Spurs", "Thunder",
];

const nflTeams = [
  "Chiefs", "Cowboys", "Eagles", "49ers", "Ravens", "Bills", "Dolphins", "Lions",
  "Packers", "Steelers", "Bengals", "Vikings", "Jets", "Giants", "Broncos", "Seahawks",
];

const wnbaTeams = [
  "Liberty", "Aces", "Storm", "Lynx", "Fever", "Sun", "Sky", "Wings",
  "Mercury", "Sparks", "Dream", "Mystics",
];

function MarqueeRow({
  items,
  reverse = false,
  className = "",
}: {
  items: string[];
  reverse?: boolean;
  className?: string;
}) {
  const track = [...items, ...items];
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={`flex w-max gap-3 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
      >
        {track.map((team, i) => (
          <span
            key={`${team}-${i}`}
            className="shrink-0 rounded-full border border-white/10 bg-black/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/70 backdrop-blur-sm"
          >
            {team}
          </span>
        ))}
      </div>
    </div>
  );
}

function LeagueBadge({
  label,
  sublabel,
  colors,
}: {
  label: string;
  sublabel: string;
  colors: string;
}) {
  return (
    <div
      className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br ${colors} shadow-lg`}
    >
      <span className="font-display text-sm font-bold leading-none text-white">{label}</span>
      <span className="mt-0.5 text-[7px] font-semibold uppercase tracking-wider text-white/80">{sublabel}</span>
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<DashboardRole>("athlete");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    saveDashboardSession({
      name: name.trim() || (role === "admin" ? "AMX Admin" : "Athlete"),
      email: email.trim(),
      role,
    });
    navigate("/", { replace: true });
  }

  const inputClass =
    "w-full rounded-lg border border-white/15 bg-black/40 py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-dt-red/60 focus:ring-1 focus:ring-dt-red/40";

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8b0000] via-[#1a0000] to-black" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(229,9,20,0.35),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.9),transparent_50%)]" />

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-5 opacity-40">
        <MarqueeRow items={nbaTeams} className="mt-8" />
        <MarqueeRow items={nflTeams} reverse />
        <MarqueeRow items={wnbaTeams} className="mb-8" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="mb-6 w-full max-w-md text-center">
          <img
            src="/amx-dashboard-logo.png"
            alt="AMX Dashboard"
            className="mx-auto h-16 w-auto max-w-[280px] object-contain sm:h-20"
          />
          <p className="mt-4 text-sm text-white/75">
            The athlete &amp; admin platform for DameTime — built for the pros.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <LeagueBadge label="NBA" sublabel="League" colors="from-[#1d428a] to-[#c8102e]" />
            <LeagueBadge label="NFL" sublabel="League" colors="from-[#013369] to-[#d50a0a]" />
            <LeagueBadge label="WNBA" sublabel="League" colors="from-[#fa4b00] to-[#c4002b]" />
          </div>
        </div>

        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-2xl shadow-black/60 backdrop-blur-md">
          <div className="border-b border-white/10 bg-gradient-to-r from-dt-red/20 to-transparent px-6 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dt-red">Members only</p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-wide text-white">Sign in</h1>
            <p className="mt-1 text-xs text-white/60">Athletes and admins — demo login, any email works.</p>
          </div>

          <form className="space-y-4 p-6" onSubmit={handleSubmit}>
            <div>
              <p className="mb-2 text-xs font-medium text-white/60">Signing in as</p>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: "athlete" as const, label: "Athlete", icon: Trophy },
                    { id: "admin" as const, label: "Admin", icon: Shield },
                  ] as const
                ).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setRole(id)}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      role === id
                        ? "border-dt-red bg-dt-red/20 text-white"
                        : "border-white/15 text-white/70 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-medium text-white/60">Name</span>
              <div className="relative">
                <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder={role === "admin" ? "Admin name" : "Athlete name"}
                />
              </div>
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-medium text-white/60">Email</span>
              <div className="relative">
                <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@team.com"
                  required
                />
              </div>
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-medium text-white/60">Password</span>
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
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
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-dt-red py-3 text-sm font-semibold text-white shadow-lg shadow-dt-red/30 transition hover:bg-dt-red-hover"
            >
              <LogIn size={16} />
              Enter AMX Dashboard
            </button>
          </form>
        </div>

        <p className="mt-6 max-w-sm text-center text-[11px] text-white/45">
          NBA · NFL · WNBA athletes and authorized team staff only.
        </p>
      </div>
    </div>
  );
}
