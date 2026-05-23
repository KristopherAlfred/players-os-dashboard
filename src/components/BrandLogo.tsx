export function BrandLogo({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <img
        src="/dame-brand.png"
        alt="DAME TIME — Powered by AMX"
        className="h-8 w-auto object-contain object-left"
      />
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
