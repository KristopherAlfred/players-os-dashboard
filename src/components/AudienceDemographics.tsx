import { useEffect, useMemo, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Card } from "./ui/Card";
import {
  fetchDametimeAnalytics,
  formatMetric,
  type DametimeAnalyticsGeo,
} from "../lib/dametimeAnalyticsApi";

type CountryRow = DametimeAnalyticsGeo["countries"][number];

export function AudienceDemographics() {
  const [countries, setCountries] = useState<CountryRow[]>([]);
  const [mappedFans, setMappedFans] = useState(0);
  const [totalFans, setTotalFans] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const analytics = await fetchDametimeAnalytics();
        if (cancelled) return;
        setCountries(analytics.geo.countries ?? []);
        setMappedFans(analytics.geo.mappedFans ?? 0);
        setTotalFans(analytics.geo.totalFans ?? 0);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load country analytics");
          setCountries([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const maxCount = useMemo(() => Math.max(...countries.map((c) => c.count), 1), [countries]);

  return (
    <Card title="Audience Demographics">
      <div className="p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-dt-muted">Top Countries</p>
            <p className="mt-0.5 text-[11px] text-white/40">
              Live DameTime fan geo
              {totalFans > 0
                ? ` · ${formatMetric(mappedFans)} of ${formatMetric(totalFans)} fans mapped`
                : ""}
            </p>
          </div>
          {loading ? <Loader2 size={14} className="animate-spin text-dt-red" /> : null}
        </div>

        {error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </div>
        ) : loading && countries.length === 0 ? (
          <p className="py-8 text-center text-sm text-dt-muted">Loading country analytics…</p>
        ) : countries.length === 0 ? (
          <p className="py-8 text-center text-sm text-dt-muted">
            No country data yet — new DameTime signups will appear here.
          </p>
        ) : (
          <ul className="space-y-3">
            {countries.slice(0, 8).map((country) => (
              <li key={`${country.country}-${country.countryCode ?? ""}`}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-[13px]">
                  <span className="flex min-w-0 items-center gap-2 text-[#d4d4d4]">
                    <span className="text-base">{country.flag || <MapPin size={14} className="text-dt-red" />}</span>
                    <span className="truncate">{country.country}</span>
                  </span>
                  <span className="shrink-0 tabular-nums font-semibold text-white">
                    {country.pct}%
                    <span className="ml-2 font-normal text-white/40">{formatMetric(country.count)}</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-dt-border">
                  <div
                    className="h-full rounded-full bg-dt-red"
                    style={{ width: `${Math.max(4, (country.count / maxCount) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
