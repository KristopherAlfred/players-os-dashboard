export function BrandLogo({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex flex-col gap-0.5">
        <img
          src="/dame-brand.png"
          alt="DAME TIME"
          className="h-8 w-auto max-w-[160px] object-contain object-left"
        />
        <p className="text-[7px] font-medium uppercase tracking-[0.16em] text-dt-muted">
          Powered by <span className="text-dt-red">AMX</span>
        </p>
      </div>
    );
  }

  return (
    <img
      src="/dame-brand.png"
      alt="DAME TIME — Powered by AMX"
      className="h-11 w-auto max-w-[200px] object-contain object-left"
    />
  );
}
