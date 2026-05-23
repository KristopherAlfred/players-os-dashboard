import { Lock, Star, Crown } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-4 grid grid-cols-3 gap-4 border-t border-dt-border px-2 py-5">
      <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-dt-muted">
        <Lock size={14} className="text-dt-red" />
        SECURE. PRIVATE. COMPLIANT.
      </div>
      <div className="flex items-center justify-center gap-2 text-[11px] font-bold tracking-widest text-dt-muted">
        <Star size={14} className="text-dt-red" />
        OWNED BY DAME.
      </div>
      <div className="flex items-center justify-end gap-2 text-[11px] font-bold tracking-widest text-dt-muted">
        REAL FANS. REAL DATA. REAL VALUE.
        <Crown size={14} className="text-dt-red" />
      </div>
    </footer>
  );
}
