import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {
  countryOverview,
  getRegionIntensity,
  intensityToColor,
  legendSteps,
  mapViewConfig,
  type CountryViewId,
  worldCountryFromName,
} from "../data/signupGeoData";

type GeoFeature = {
  rsmKey: string;
  id?: string;
  properties?: { name?: string };
};

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
  const config = mapViewConfig[view];
  const clickable = view === "world" || view === "Other";

  return (
    <div className="flex h-full w-full items-center justify-center p-1">
      <ComposableMap
        projection={config.projection}
        width={config.width}
        height={config.height}
        projectionConfig={{ scale: config.scale, center: config.center }}
        style={{ width: "100%", height: "auto", maxHeight: "100%" }}
      >
        <Geographies geography={config.url}>
          {({ geographies }: { geographies: GeoFeature[] }) =>
            geographies.map((geo) => {
              const name = geo.properties?.name ?? "";
              const id = String(geo.id ?? "");
              const intensity = getRegionIntensity(view, id, name);
              const fill = intensityToColor(intensity);
              const target = worldCountryFromName(name);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="#1a1a1a"
                  strokeWidth={view === "world" || view === "Other" ? 0.35 : 0.55}
                  style={{
                    default: { outline: "none", opacity: 1 },
                    hover: {
                      fill: clickable && target ? "#e50914" : fill,
                      outline: "none",
                      cursor: clickable && target ? "pointer" : "default",
                      opacity: 1,
                    },
                    pressed: { outline: "none" },
                  }}
                  onClick={() => {
                    if (clickable && target && onSelectCountry) onSelectCountry(target);
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
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
        ? "Other regions — rest of world"
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

      <div className="flex flex-col overflow-hidden rounded-lg border border-dt-border bg-[#060608] lg:flex-row lg:min-h-[400px]">
        <div className="hidden border-b border-dt-border p-4 lg:flex lg:border-b-0 lg:border-r">
          <MapLegend />
        </div>

        <div className="relative h-[360px] w-full min-w-0 flex-1 sm:h-[400px]">
          <ChoroplethMap view={view} onSelectCountry={setView} />
        </div>

        <div className="flex w-full shrink-0 flex-row gap-1 overflow-x-auto border-t border-dt-border bg-dt-bg/40 p-2 lg:w-[148px] lg:flex-col lg:overflow-x-visible lg:border-l lg:border-t-0 lg:p-3">
          <p className="mb-0 hidden text-[10px] font-semibold uppercase tracking-wide text-dt-muted lg:mb-2 lg:block">
            Countries
          </p>
          {countryOverview.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setView(c.id)}
              className={`shrink-0 rounded-md px-2 py-2 text-left text-xs transition lg:mb-1 lg:flex lg:w-full lg:items-center lg:justify-between ${
                view === c.id ? "bg-dt-red/20 text-white ring-1 ring-dt-red/50" : "text-dt-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>
                {c.flag} {c.label}
              </span>
              <span className="ml-2 font-semibold tabular-nums lg:ml-0">{c.pct}%</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setView("world")}
            className={`shrink-0 rounded-md px-2 py-2 text-xs lg:mt-2 lg:flex lg:w-full lg:items-center lg:gap-1.5 ${
              view === "world" ? "bg-dt-red/20 text-white" : "text-dt-muted hover:bg-white/5"
            }`}
          >
            <Globe size={14} className="inline lg:mr-0" />
            <span className="ml-1 lg:ml-0">All continents</span>
          </button>
        </div>
      </div>

      <p className="mt-2 text-[10px] text-dt-muted lg:hidden">
        Legend: blue = fewer signups → red = most signups. Tap a country or use the list.
      </p>
    </div>
  );
}
