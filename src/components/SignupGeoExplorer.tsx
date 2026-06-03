import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {
  countryOverview,
  geoUrlFor,
  getRegionIntensity,
  intensityToColor,
  legendSteps,
  type CountryViewId,
  worldCountryFromName,
} from "../data/signupGeoData";

const UK_REGIONS = [
  { name: "England", intensity: 0.78 },
  { name: "Scotland", intensity: 0.52 },
  { name: "Wales", intensity: 0.45 },
  { name: "Northern Ireland", intensity: 0.4 },
];

type SignupGeoExplorerProps = {
  className?: string;
};

function MapLegend() {
  return (
    <div className="flex w-[132px] shrink-0 flex-col gap-2 border-r border-dt-border pr-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-dt-muted">Signup density</p>
      {legendSteps.map((step) => (
        <div key={step.label} className="flex items-center gap-2">
          <span className="h-3 w-5 shrink-0 rounded-sm border border-white/10" style={{ backgroundColor: step.color }} />
          <span className="text-[10px] leading-tight text-dt-muted">{step.label}</span>
        </div>
      ))}
    </div>
  );
}

function ChoroplethMap({
  view,
  onSelectCountry,
}: {
  view: CountryViewId;
  onSelectCountry?: (id: CountryViewId) => void;
}) {
  const url = geoUrlFor(view);
  const projection = view === "USA" ? "geoAlbersUsa" : view === "Australia" ? "geoMercator" : "geoMercator";
  const scale = view === "USA" ? 1000 : view === "world" ? 140 : view === "Canada" ? 520 : 600;
  const center: [number, number] =
    view === "USA" ? [-96, 38] : view === "Canada" ? [-96, 62] : view === "Australia" ? [134, -28] : [0, 20];

  return (
    <ComposableMap
      projection={projection}
      projectionConfig={{ scale, center }}
      className="h-full w-full"
      style={{ background: "#060608" }}
    >
      <Geographies geography={url}>
        {({ geographies }: { geographies: { rsmKey: string; id?: string; properties?: { name?: string } }[] }) =>
          geographies.map((geo) => {
            const name = (geo.properties as { name?: string }).name ?? "";
            const id = String(geo.id ?? "");
            const intensity = getRegionIntensity(view, id, name);
            const fill = intensityToColor(intensity);
            const clickable = view === "world";
            const target = worldCountryFromName(name);

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={fill}
                stroke="#1a1a1a"
                strokeWidth={view === "world" ? 0.4 : 0.6}
                style={{
                  default: { outline: "none", opacity: 1 },
                  hover: { fill: clickable && target ? "#e50914" : fill, outline: "none", cursor: clickable && target ? "pointer" : "default" },
                  pressed: { outline: "none" },
                }}
                onClick={() => {
                  if (view === "world" && target && onSelectCountry) onSelectCountry(target);
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}

function UKRegionsView() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
      <p className="text-xs text-dt-muted">Regional signup share — United Kingdom</p>
      <div className="grid w-full max-w-md grid-cols-2 gap-2">
        {UK_REGIONS.map((r) => (
          <div
            key={r.name}
            className="rounded-lg border border-dt-border px-4 py-6 text-center transition hover:brightness-110"
            style={{ backgroundColor: intensityToColor(r.intensity) }}
          >
            <p className="text-sm font-semibold text-black/80">{r.name}</p>
            <p className="mt-1 text-xs text-black/60">{Math.round(r.intensity * 100)}% intensity</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OtherWorldNote() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <Globe className="mb-3 text-dt-red" size={40} />
      <p className="text-sm font-medium text-white">All other regions</p>
      <p className="mt-2 max-w-sm text-xs text-dt-muted">
        19% of signups come from outside USA, Canada, UK, and Australia. Use world view and click a country to drill in.
      </p>
    </div>
  );
}

export function SignupGeoExplorer({ className = "" }: SignupGeoExplorerProps) {
  const [view, setView] = useState<CountryViewId>("world");

  const countryIndex = useMemo(
    () => countryOverview.findIndex((c) => c.id === view),
    [view],
  );

  function goPrev() {
    if (view === "world") setView(countryOverview[countryOverview.length - 1].id);
    else if (countryIndex <= 0) setView("world");
    else setView(countryOverview[countryIndex - 1].id);
  }

  function goNext() {
    if (view === "world") setView(countryOverview[0].id);
    else if (countryIndex >= countryOverview.length - 1) setView("world");
    else setView(countryOverview[countryIndex + 1].id);
  }

  const title =
    view === "world"
      ? "World — fan signups by country"
      : view === "Other"
        ? "Other regions"
        : `${countryOverview.find((c) => c.id === view)?.flag ?? ""} ${view} — regional signup heatmap`;

  return (
    <div className={className}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-dt-muted">{title}</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrev}
            className="rounded-md border border-dt-border p-1.5 text-dt-muted hover:bg-white/5 hover:text-white"
            aria-label="Previous country"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => setView("world")}
            className={`rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
              view === "world" ? "bg-dt-red text-white" : "border border-dt-border text-dt-muted hover:text-white"
            }`}
          >
            World
          </button>
          <button
            type="button"
            onClick={goNext}
            className="rounded-md border border-dt-border p-1.5 text-dt-muted hover:bg-white/5 hover:text-white"
            aria-label="Next country"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex min-h-[340px] overflow-hidden rounded-lg border border-dt-border bg-[#060608]">
        <div className="hidden p-4 sm:flex">
          <MapLegend />
        </div>

        <div className="relative min-h-[280px] flex-1 sm:min-h-[340px]">
          {view === "UK" ? (
            <UKRegionsView />
          ) : view === "Other" ? (
            <OtherWorldNote />
          ) : (
            <ChoroplethMap view={view} onSelectCountry={setView} />
          )}
        </div>

        <div className="flex w-[148px] shrink-0 flex-col border-l border-dt-border bg-dt-bg/40 p-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-dt-muted">Countries</p>
          {countryOverview.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setView(c.id)}
              className={`mb-1 flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-xs transition ${
                view === c.id ? "bg-dt-red/20 text-white ring-1 ring-dt-red/50" : "text-dt-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>
                {c.flag} {c.label}
              </span>
              <span className="font-semibold tabular-nums">{c.pct}%</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setView("world")}
            className={`mt-2 flex w-full items-center gap-1.5 rounded-md px-2 py-2 text-xs ${
              view === "world" ? "bg-dt-red/20 text-white" : "text-dt-muted hover:bg-white/5"
            }`}
          >
            <Globe size={14} />
            All continents
          </button>
        </div>
      </div>

      <p className="mt-2 text-[10px] text-dt-muted sm:hidden">
        Legend: blue = fewer signups → red = most signups. Tap a country on the map or use the list.
      </p>
    </div>
  );
}
