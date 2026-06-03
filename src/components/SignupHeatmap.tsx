import { useId, useMemo } from "react";
import { signupHeatmapMock } from "../data/mockData";

const WIDTH = 960;
const HEIGHT = 320;

function project(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * WIDTH;
  const latRad = (lat * Math.PI) / 180;
  const merc = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = HEIGHT / 2 - (merc * WIDTH) / (2 * Math.PI);
  return { x, y: Math.max(20, Math.min(HEIGHT - 20, y)) };
}

type SignupHeatmapProps = {
  className?: string;
  compact?: boolean;
};

export function SignupHeatmap({ className = "", compact = false }: SignupHeatmapProps) {
  const gradientId = useId().replace(/:/g, "");
  const points = signupHeatmapMock.points;
  const peak = useMemo(() => Math.max(1, ...points.map((p) => p.count)), [points]);
  const height = compact ? 240 : HEIGHT;

  return (
    <div className={className}>
      {!compact ? (
        <p className="mb-2 text-xs text-dt-muted">Where fans are signing in from</p>
      ) : null}

      <div className="relative overflow-hidden rounded-lg border border-dt-border bg-[#060608]">
        <svg
          viewBox={`0 0 ${WIDTH} ${height}`}
          className="block h-auto w-full min-h-[200px]"
          role="img"
          aria-label="Signup location heatmap"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e50914" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#e50914" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#e50914" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width={WIDTH} height={height} fill="#060608" />
          <g opacity="0.15" stroke="#404040" strokeWidth="0.5" fill="none">
            {Array.from({ length: 9 }, (_, i) => (
              <line key={`h-${i}`} x1={0} y1={(i * height) / 8} x2={WIDTH} y2={(i * height) / 8} />
            ))}
            {Array.from({ length: 17 }, (_, i) => (
              <line key={`v-${i}`} x1={(i * WIDTH) / 16} y1={0} x2={(i * WIDTH) / 16} y2={height} />
            ))}
          </g>

          <ellipse
            cx={WIDTH / 2}
            cy={height / 2}
            rx={WIDTH * 0.47}
            ry={height * 0.4}
            fill="#0a0a0c"
            stroke="#252525"
            strokeWidth="1"
          />

          {points.map((point) => {
            const projected = project(point.lat, point.lng);
            const y = (projected.y / HEIGHT) * height;
            const intensity = 0.4 + (point.count / peak) * 0.6;
            const r = 8 + (point.count / peak) * 24;
            return (
              <g key={`${point.lat}-${point.lng}`}>
                <circle
                  cx={projected.x}
                  cy={y}
                  r={r * 2}
                  fill={`url(#${gradientId})`}
                  opacity={intensity * 0.6}
                />
                <circle cx={projected.x} cy={y} r={r * 0.5} fill="#e50914" opacity={intensity} />
                <title>{`${point.label} — ${point.count.toLocaleString()} signups`}</title>
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded border border-dt-border bg-black/80 px-2 py-0.5 text-[10px] text-dt-muted">
          <span className="h-2 w-2 rounded-full bg-dt-red/50" />
          Low
          <span className="ml-1 h-3 w-3 rounded-full bg-dt-red" />
          High
        </div>
      </div>
    </div>
  );
}
