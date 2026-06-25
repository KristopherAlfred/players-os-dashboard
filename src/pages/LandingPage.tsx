import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LogIn, Mail, Shield, Trophy, User } from "lucide-react";
import { saveDashboardSession, type DashboardRole } from "../lib/dashboardAuth";

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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-[#0a0000] to-black" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black via-black to-[#1a0000]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(229,9,20,0.18),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.95),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.85),transparent_70%)]" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="mb-8 w-full max-w-md text-center">
          <img
            src="/amx-dashboard-logo.png"
            alt="AMX Dashboard"
            className="mx-auto h-16 w-auto max-w-[280px] object-contain sm:h-20"
          />
          <p className="mt-4 text-sm text-white/70">
            The athlete &amp; admin platform for DameTime — built for the pros.
          </p>
        </div>

        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-2xl shadow-black/80 backdrop-blur-md">
          <div className="border-b border-white/10 bg-gradient-to-r from-dt-red/15 to-transparent px-6 py-4">
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

        <p className="mt-6 max-w-sm text-center text-[11px] text-white/40">
          Authorized athletes and team staff only.
        </p>
      </div>
    </div>
  );
}
