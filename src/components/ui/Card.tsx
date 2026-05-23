import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  title,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={`rounded-lg border border-dt-border bg-dt-card ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-dt-border px-4 py-3">
          {title && (
            <h3 className="text-sm font-semibold tracking-wide text-white">
              {title}
            </h3>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
