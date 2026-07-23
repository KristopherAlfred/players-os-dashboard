type BrandLogoProps = {
  compact?: boolean;
  variant?: "default" | "sidebar";
};

function SloaneMark({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-8 w-8 text-base" : "h-10 w-10 text-lg";
  return (
    <div
      className={`flex ${box} shrink-0 items-center justify-center rounded-xl bg-[#8FE3B8] font-black text-[#04140c]`}
    >
      S
    </div>
  );
}

export function BrandLogo({ compact = false, variant = "default" }: BrandLogoProps) {
  if (variant === "sidebar") {
    return (
      <div className="flex h-[72px] w-full items-center gap-3 bg-transparent px-4 py-3">
        <SloaneMark />
        <div className="min-w-0 leading-tight">
          <p className="font-display text-sm font-semibold tracking-wide text-white">SLOANE</p>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">Dashboard</p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <SloaneMark size="sm" />
        <span className="font-display text-xs font-semibold tracking-wide text-white">Sloane</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <SloaneMark />
      <span className="font-display text-sm font-semibold tracking-wide text-white">Sloane Dashboard</span>
    </div>
  );
}
