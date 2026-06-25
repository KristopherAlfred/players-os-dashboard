type BrandLogoProps = {
  compact?: boolean;
  variant?: "default" | "sidebar";
};

export function BrandLogo({ compact = false, variant = "default" }: BrandLogoProps) {
  if (variant === "sidebar") {
    return (
      <div className="flex w-full items-center px-3 py-4">
        <img
          src="/amx-dashboard-logo.png"
          alt="AMX Dashboard"
          className="h-10 w-auto max-w-full object-contain object-left"
        />
      </div>
    );
  }

  if (compact) {
    return (
      <img
        src="/amx-dashboard-logo.png"
        alt="AMX Dashboard"
        className="h-8 w-auto max-w-[160px] object-contain object-left"
      />
    );
  }

  return (
    <img
      src="/amx-dashboard-logo.png"
      alt="AMX Dashboard"
      className="h-11 w-auto max-w-[200px] object-contain object-left"
    />
  );
}
