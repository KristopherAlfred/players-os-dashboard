import { useRef, useState } from "react";
import { Check, ImagePlus, Link2, Palette, RotateCcw, Upload, UserRound } from "lucide-react";
import {
  DEFAULT_AVATAR_URL,
  getDashboardAvatar,
  getDashboardAvatarRing,
  isDefaultAvatar,
  resetDashboardAvatar,
  RING_COLORS,
  setDashboardAvatar,
  setDashboardAvatarRing,
} from "../lib/adminProfile";

const MAX_UPLOAD_BYTES = 2.5 * 1024 * 1024;

function fieldClass() {
  return "w-full rounded-xl border border-dt-border bg-black/50 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-dt-red/55 focus:ring-1 focus:ring-dt-red/25";
}

export function ProfilePage() {
  const [avatar, setAvatar] = useState<string>(() => getDashboardAvatar());
  const [ringColor, setRingColor] = useState<string>(() => getDashboardAvatarRing());
  const [urlDraft, setUrlDraft] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function applyAvatar(src: string, message: string) {
    setDashboardAvatar(src);
    setAvatar(getDashboardAvatar());
    setStatus(message);
    setError(null);
  }

  function applyRingColor(color: string, label?: string) {
    setDashboardAvatarRing(color);
    setRingColor(color);
    setStatus(label ? `Ring color set to ${label}` : `Ring color set to ${color.toUpperCase()}`);
    setError(null);
  }

  function onUpload(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Pick an image file (PNG, JPG, WEBP…)");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError("Image is too big — keep it under 2.5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        applyAvatar(reader.result, "Profile photo updated");
      }
    };
    reader.readAsDataURL(file);
  }

  function onApplyUrl() {
    const url = urlDraft.trim();
    if (!/^https?:\/\//i.test(url)) {
      setError("Paste a full image URL starting with http(s)://");
      return;
    }
    applyAvatar(url, "Profile photo updated from URL");
    setUrlDraft("");
  }

  const usingDefault = isDefaultAvatar(avatar);

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="overflow-hidden rounded-2xl border border-dt-border bg-dt-card">
        <div className="relative border-b border-dt-border bg-gradient-to-br from-black via-[#0c0c0c] to-[#1a0505] px-5 py-5 sm:px-7 sm:py-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(229,9,20,0.22),transparent_52%)]" />
          <div className="relative flex items-center gap-4">
            <div className="mb-0 inline-flex items-center gap-2 rounded-full border border-dt-red/30 bg-dt-red/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-dt-red">
              <UserRound size={12} />
              Profile
            </div>
          </div>
          <h2 className="relative mt-3 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Your profile photo
          </h2>
          <p className="relative mt-2 max-w-2xl text-sm leading-relaxed text-white/65">
            This photo shows in the top-right corner of the dashboard. By default it uses Dame’s
            ESPN headshot — upload your own or paste an image link to change it.
          </p>
        </div>

        {(error || status) && (
          <div className="space-y-2 border-b border-dt-border px-5 py-3">
            {error ? (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>
            ) : null}
            {status && !error ? (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                <Check size={14} /> {status}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
        {/* Current photo */}
        <section className="overflow-hidden rounded-2xl border border-dt-border bg-dt-card">
          <div className="border-b border-dt-border px-4 py-3">
            <h3 className="font-display text-sm font-semibold tracking-wide text-white">Current photo</h3>
            <p className="text-[11px] text-white/40">
              {usingDefault ? "Default — ESPN headshot" : "Custom photo"}
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 p-6">
            <div className="relative">
              <img
                src={avatar}
                alt="Profile"
                className="h-44 w-44 rounded-full border-4 object-cover object-top shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
                style={{ borderColor: ringColor }}
              />
              <span className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/80 text-dt-red">
                <ImagePlus size={16} />
              </span>
            </div>
            <div className="text-center">
              <p className="font-display text-lg font-bold text-white">Damian Lillard</p>
              <p className="text-xs uppercase tracking-[0.16em] text-white/40">DameTime Admin</p>
            </div>
            {!usingDefault ? (
              <button
                type="button"
                onClick={() => {
                  resetDashboardAvatar();
                  setAvatar(getDashboardAvatar());
                  setStatus("Back to the default ESPN headshot");
                  setError(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-white/80 transition hover:bg-white/[0.08]"
              >
                <RotateCcw size={13} /> Reset to ESPN headshot
              </button>
            ) : null}
          </div>
        </section>

        {/* Change photo */}
        <section className="overflow-hidden rounded-2xl border border-dt-border bg-dt-card">
          <div className="border-b border-dt-border px-4 py-3">
            <h3 className="font-display text-sm font-semibold tracking-wide text-white">Change photo</h3>
            <p className="text-[11px] text-white/40">Upload a file or paste an image link</p>
          </div>
          <div className="space-y-5 p-5">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">Upload</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-black/25 px-4 py-8 text-center transition hover:border-dt-red/50 hover:bg-dt-red/5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/50 text-dt-red">
                  <Upload size={18} />
                </span>
                <span className="text-sm font-semibold text-white">Click to upload an image</span>
                <span className="text-[11px] text-white/40">PNG, JPG, or WEBP — up to 2.5 MB. Square photos look best.</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  onUpload(e.target.files?.[0] ?? null);
                  e.target.value = "";
                }}
              />
            </div>

            <div className="space-y-2.5">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                <Palette size={12} /> Ring color
              </p>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-3">
                <label className="relative shrink-0 cursor-pointer" title="Open color wheel">
                  <span
                    className="block h-14 w-14 rounded-full border-2 border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                    style={{ backgroundColor: ringColor }}
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-black/85 text-dt-red">
                    <Palette size={12} />
                  </span>
                  <input
                    type="color"
                    value={ringColor}
                    onChange={(e) => applyRingColor(e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label="Ring color wheel"
                  />
                </label>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-white">Pick any color</p>
                  <p className="text-[11px] text-white/40">
                    Tap the circle for the full color wheel, or type a hex code.
                  </p>
                  <input
                    value={ringColor.toUpperCase()}
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      setRingColor(v.startsWith("#") ? v : `#${v}`);
                    }}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      const hex = v.startsWith("#") ? v : `#${v}`;
                      if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) {
                        applyRingColor(hex);
                      } else {
                        setError("Enter a valid hex color like #E31837");
                      }
                    }}
                    className={`${fieldClass()} mt-1.5 font-mono uppercase`}
                    placeholder="#E31837"
                    maxLength={7}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {RING_COLORS.map((color) => {
                  const active = ringColor.toLowerCase() === color.value.toLowerCase();
                  return (
                    <button
                      key={color.id}
                      type="button"
                      title={color.label}
                      aria-label={`${color.label} ring`}
                      aria-pressed={active}
                      onClick={() => applyRingColor(color.value, color.label)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
                        active
                          ? "scale-110 border-white shadow-[0_0_0_3px_rgba(255,255,255,0.15)]"
                          : "border-white/20 hover:scale-105 hover:border-white/50"
                      }`}
                      style={{ backgroundColor: color.value }}
                    >
                      {active ? (
                        <Check size={13} className={color.id === "white" || color.id === "gold" ? "text-black" : "text-white"} />
                      ) : null}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-white/35">
                Changes the circle around the photo here and in the top-right corner.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">Or use a link</p>
              <div className="flex gap-2">
                <input
                  value={urlDraft}
                  onChange={(e) => setUrlDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onApplyUrl();
                  }}
                  className={fieldClass()}
                  placeholder="https://example.com/photo.png"
                />
                <button
                  type="button"
                  onClick={onApplyUrl}
                  disabled={!urlDraft.trim()}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-dt-red px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
                >
                  <Link2 size={14} /> Use link
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 px-3.5 py-3 text-[12px] leading-relaxed text-white/50">
              The default photo is Dame’s ESPN headshot ({DEFAULT_AVATAR_URL.replace("https://", "")}).
              Changes apply instantly to the top-right avatar and are saved on this browser.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
