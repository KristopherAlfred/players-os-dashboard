import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  Film,
  Link2,
  Loader2,
  Music2,
  Plus,
  RefreshCw,
  Sparkles,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import {
  createEmptyMusicItem,
  deleteMusicItem,
  extractSpotifyTrackId,
  fetchMusicFeed,
  fetchSpotifyCatalog,
  musicItemFromSpotify,
  publishMusicFeed,
  resolveMusicAssetUrl,
  upsertMusicItem,
  type AppMusicItem,
  type MusicFeed,
  type MusicStatus,
  type SpotifyCatalogTrack,
} from "../lib/musicApi";
import { TypographyControls } from "../components/TypographyControls";
import { titleTypographyStyle } from "../lib/typography";

function fieldClass() {
  return "w-full rounded-xl border border-dt-border bg-black/50 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-dt-red/55 focus:ring-1 focus:ring-dt-red/25";
}

function findFeedItem(feed: MusicFeed | null, trackId: string) {
  if (!feed) return null;
  return (
    feed.items.find(
      (item) => item.id === trackId || item.spotifyTrackId === trackId,
    ) ?? null
  );
}

export function MusicContentPage() {
  const [feed, setFeed] = useState<MusicFeed | null>(null);
  const [spotifyTracks, setSpotifyTracks] = useState<SpotifyCatalogTrack[]>([]);
  const [catalogSource, setCatalogSource] = useState<"spotify" | "dame-dolla-catalog" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AppMusicItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "spotify" | "custom" | "featured">("all");

  function applyCatalog(
    tracks: SpotifyCatalogTrack[],
    source: "spotify" | "dame-dolla-catalog",
    nextFeed?: MusicFeed | null,
  ) {
    const feedRef = nextFeed ?? feed;
    setSpotifyTracks(tracks);
    setCatalogSource(source);
    if (source === "spotify") {
      setStatus(`Synced ${tracks.length} live tracks from Sloane Stephens on Spotify`);
    } else {
      setStatus(`Loaded ${tracks.length} Sloane Stephens tracks (built-in catalog)`);
    }

    if (!draft && tracks[0]) {
      const item = musicItemFromSpotify(tracks[0], findFeedItem(feedRef, tracks[0].id));
      setSelectedId(item.id);
      setDraft(item);
    }
  }

  useEffect(() => {
    void (async () => {
      try {
        const [nextFeed, catalog] = await Promise.all([
          fetchMusicFeed(),
          fetchSpotifyCatalog().catch(() => null),
        ]);
        setFeed(nextFeed);

        if (catalog?.tracks.length) {
          applyCatalog(catalog.tracks, catalog.source, nextFeed);
        } else {
          const first = nextFeed.items[0] ?? null;
          if (first) {
            setSelectedId(first.id);
            setDraft({ ...first });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load music");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const library = useMemo(() => {
    const spotifyIds = new Set(spotifyTracks.map((track) => track.id));
    const fromSpotify = spotifyTracks.map((track) =>
      musicItemFromSpotify(track, findFeedItem(feed, track.id)),
    );
    const customs = (feed?.items ?? []).filter(
      (item) => item.source === "manual" && !spotifyIds.has(item.spotifyTrackId || item.id),
    );
    let list = [...fromSpotify, ...customs];

    if (filter === "spotify") list = list.filter((item) => item.source === "spotify");
    if (filter === "custom") list = list.filter((item) => item.source === "manual");
    if (filter === "featured") list = list.filter((item) => item.featured);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.artist.toLowerCase().includes(q) ||
          item.albumName.toLowerCase().includes(q),
      );
    }
    return list;
  }, [feed, spotifyTracks, filter, query]);

  const previewTracks = useMemo(() => {
    const featured = library.filter((item) => item.featured && item.enabled);
    const base = (featured.length ? featured : library.filter((item) => item.enabled)).slice(0, 8);
    return base;
  }, [library]);

  const stats = useMemo(() => {
    const all = library;
    const saved = feed?.items ?? [];
    return {
      spotify: spotifyTracks.length,
      custom: all.filter((item) => item.source === "manual").length,
      featured: all.filter((item) => item.featured).length,
      published: saved.filter((item) => item.status === "published" && item.enabled).length,
    };
  }, [library, feed, spotifyTracks]);

  function selectItem(item: AppMusicItem) {
    setSelectedId(item.id);
    setDraft({ ...item });
    setStatus(null);
    setError(null);
  }

  function startNew() {
    const item = createEmptyMusicItem();
    setSelectedId(item.id);
    setDraft(item);
    setStatus("New track — add thumbnail, Spotify or video link, then Publish");
    setError(null);
  }

  function patchDraft(patch: Partial<AppMusicItem>) {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      if (patch.spotifyUrl != null) {
        const id = extractSpotifyTrackId(patch.spotifyUrl);
        if (id) {
          next.spotifyTrackId = id;
          if (prev.source === "manual" && !prev.spotifyTrackId) {
            next.id = id;
          }
          next.source = "spotify";
        }
      }
      return next;
    });
  }

  async function syncSpotify() {
    setSyncing(true);
    setError(null);
    try {
      const catalog = await fetchSpotifyCatalog(true);
      applyCatalog(catalog.tracks, catalog.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sloane Stephens sync failed");
    } finally {
      setSyncing(false);
    }
  }

  async function importAllSpotify() {
    if (!spotifyTracks.length) {
      setError("No Spotify tracks loaded — sync first");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const items = spotifyTracks.map((track, index) => ({
        ...musicItemFromSpotify(track, findFeedItem(feed, track.id)),
        order: index,
        status: "published" as MusicStatus,
        enabled: true,
      }));
      const customs = (feed?.items ?? []).filter(
        (item) => item.source === "manual" && !item.spotifyTrackId,
      );
      const next = await publishMusicFeed({
        version: (feed?.version || 1) + 1,
        updatedAt: new Date().toISOString(),
        items: [...items, ...customs],
      });
      setFeed(next);
      setStatus(`Imported ${items.length} Spotify tracks into the app music feed`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setSaving(false);
    }
  }

  async function saveDraft(nextStatus?: MusicStatus) {
    if (!draft) return;
    if (!draft.title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload: AppMusicItem = {
        ...draft,
        title: draft.title.trim(),
        artist: draft.artist.trim() || "Sloane Stephens",
        duration: draft.duration.trim(),
        thumbnail: draft.thumbnail.trim(),
        spotifyUrl: draft.spotifyUrl.trim(),
        videoUrl: draft.videoUrl.trim(),
        spotifyTrackId: draft.spotifyTrackId || extractSpotifyTrackId(draft.spotifyUrl),
        albumName: draft.albumName.trim(),
        status: nextStatus ?? draft.status,
        publishedAt: nextStatus === "published" ? new Date().toISOString() : draft.publishedAt,
        source: draft.spotifyTrackId || extractSpotifyTrackId(draft.spotifyUrl) ? "spotify" : "manual",
      };
      const nextFeed = await upsertMusicItem(payload);
      setFeed(nextFeed);
      setDraft(payload);
      setSelectedId(payload.id);
      setStatus(
        payload.status === "published"
          ? "Published — thumbnail & links live on Sloane Glo Music"
          : "Draft saved",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function removeItem() {
    if (!draft) return;
    const saved = findFeedItem(feed, draft.id) || findFeedItem(feed, draft.spotifyTrackId);
    if (!saved) {
      setStatus("Not in published feed yet — nothing to delete");
      return;
    }
    if (!window.confirm(`Remove overrides for “${draft.title || "this track"}”?`)) return;
    setSaving(true);
    setError(null);
    try {
      const nextFeed = await deleteMusicItem(saved.id);
      setFeed(nextFeed);
      const spotify = spotifyTracks.find((track) => track.id === draft.spotifyTrackId || track.id === draft.id);
      const next = spotify
        ? musicItemFromSpotify(spotify, null)
        : nextFeed.items[0]
          ? { ...nextFeed.items[0] }
          : null;
      setSelectedId(next?.id ?? null);
      setDraft(next);
      setStatus("Removed from music feed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  async function republishAll() {
    if (!feed) return;
    setSaving(true);
    setError(null);
    try {
      const next = await publishMusicFeed({
        ...feed,
        version: (feed.version || 1) + 1,
        updatedAt: new Date().toISOString(),
      });
      setFeed(next);
      setStatus("Music feed republished to app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setSaving(false);
    }
  }

  function onUploadThumbnail(file: File | null) {
    if (!file || !draft) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") patchDraft({ thumbnail: reader.result });
    };
    reader.readAsDataURL(file);
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-white/70">
        <Loader2 className="mr-2 animate-spin" size={18} /> Loading Sloane Stephens catalog…
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <style>{`
        @keyframes music-phone-glow {
          0%, 100% { box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.55); }
          50% { box-shadow: 0 0 0 1px rgba(143,227,184,0.28), 0 28px 70px rgba(143,227,184,0.14); }
        }
        .music-phone-shell { animation: music-phone-glow 4.5s ease-in-out infinite; }
      `}</style>

      <div className="overflow-hidden rounded-2xl border border-dt-border bg-dt-card">
        <div className="relative border-b border-dt-border bg-gradient-to-br from-black via-[#0c0c0c] to-[#051a12] px-5 py-5 sm:px-7 sm:py-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(143,227,184,0.22),transparent_52%)]" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-dt-red/30 bg-dt-red/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-dt-red">
                <Music2 size={12} />
                Sloane Stephens Music
              </div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Curate Spotify tracks fans hear in the app
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                Sync the Sloane Stephens catalog, swap thumbnails, add song or video links, feature cuts for Top songs, then publish. Connect Spotify later — for now manage tracks manually for Sloane Glo.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-[96px] rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Tracks</p>
                <p className="mt-1 text-lg font-bold text-white">{stats.spotify}</p>
              </div>
              <div className="min-w-[96px] rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Featured</p>
                <p className="mt-1 text-lg font-bold text-white">{stats.featured}</p>
              </div>
              <div className="min-w-[96px] rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Source</p>
                <p className="mt-1 text-sm font-bold text-white">
                  {catalogSource === "spotify" ? "Live" : catalogSource ? "Catalog" : "—"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void (draft ? saveDraft("published") : startNew())}
                disabled={saving}
                className="inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-dt-red px-5 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(143,227,184,0.35)] transition hover:brightness-110 disabled:opacity-60"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {draft ? "Publish to app" : "Add track"}
              </button>
            </div>
          </div>
        </div>

        {(error || status) && (
          <div className="space-y-2 border-b border-dt-border px-5 py-3">
            {error ? (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>
            ) : null}
            {status ? (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                {status}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px] xl:items-stretch">
        <section className="flex min-h-[640px] flex-col overflow-hidden rounded-2xl border border-dt-border bg-dt-card xl:min-h-0">
          <div className="shrink-0 border-b border-dt-border px-4 py-3">
            <h3 className="font-display text-sm font-semibold tracking-wide text-white">Library</h3>
            <p className="text-[11px] text-white/40">Sloane Stephens catalog + custom uploads</p>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
            <div className="grid shrink-0 grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => void syncSpotify()}
                disabled={syncing}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-white/85 hover:border-dt-red/40 disabled:opacity-60"
              >
                {syncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                Sync Sloane Stephens
              </button>
              <button
                type="button"
                onClick={startNew}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-dt-red px-3 py-2.5 text-xs font-semibold text-white"
              >
                <Plus size={13} /> Custom
              </button>
            </div>

            <button
              type="button"
              onClick={() => void importAllSpotify()}
              disabled={saving || !spotifyTracks.length}
              className="w-full shrink-0 rounded-xl border border-dt-red/35 bg-dt-red/10 px-3 py-2 text-[11px] font-semibold text-dt-red transition hover:bg-dt-red/15 disabled:opacity-50"
            >
              Import all Spotify tracks to feed
            </button>

            <div className="flex shrink-0 gap-1 rounded-xl border border-white/10 bg-black/30 p-1">
              {(
                [
                  ["all", "All"],
                  ["spotify", "Spotify"],
                  ["custom", "Custom"],
                  ["featured", "★"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  className={`flex-1 rounded-lg px-1.5 py-1.5 text-[11px] font-semibold transition ${
                    filter === id ? "bg-dt-red text-white" : "text-white/55 hover:text-white/80"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tracks…"
              className={`${fieldClass()} shrink-0`}
            />

            <ul className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
              {library.map((item) => {
                const selected = selectedId === item.id;
                const thumb = resolveMusicAssetUrl(item.thumbnail);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => selectItem(item)}
                      className={`flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition ${
                        selected
                          ? "border-dt-red/50 bg-dt-red/10"
                          : "border-transparent bg-white/[0.03] hover:border-white/10"
                      }`}
                    >
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md bg-black/50">
                        {thumb ? (
                          <img src={thumb} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-white/30">
                            <Music2 size={16} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{item.title || "Untitled"}</p>
                        <p className="truncate text-[11px] text-white/45">
                          {item.albumName || item.artist}
                          {item.duration ? ` · ${item.duration}` : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        {item.featured ? <Star size={11} className="text-amber-300" fill="currentColor" /> : null}
                        {item.videoUrl ? <Film size={11} className="text-white/50" /> : null}
                        {!item.enabled ? <EyeOff size={11} className="text-white/35" /> : null}
                      </div>
                    </button>
                  </li>
                );
              })}
              {!library.length ? (
                <li className="rounded-xl border border-dashed border-white/10 px-3 py-8 text-center text-xs text-white/40">
                  Click Sync Sloane Stephens or add a custom track
                </li>
              ) : null}
            </ul>
          </div>
        </section>

        <section className="flex flex-col items-center justify-start rounded-2xl border border-dt-border bg-dt-card px-4 py-6">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">App preview</p>
          <div className="music-phone-shell w-full max-w-[320px] overflow-hidden rounded-[2rem] border border-white/10 bg-black">
            <div className="relative min-h-[560px] bg-gradient-to-b from-[#2a0a0a] via-black to-black px-4 pb-6 pt-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(143,227,184,0.35),transparent_55%)]" />
              <div className="relative">
                <p className="font-display text-[0.7rem] font-extrabold tracking-[0.18em] text-white/55">DAME D.O.L.L.A</p>
                <h3 className="mt-1 font-display text-2xl font-extrabold tracking-[0.06em] text-white">MUSIC</h3>
                <p className="mt-5 font-display text-[0.78rem] font-extrabold tracking-[0.1em] text-white">Top songs</p>
                <div className="mt-2 space-y-1.5">
                  {previewTracks.map((item, index) => {
                    const thumb = resolveMusicAssetUrl(item.thumbnail);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectItem(item)}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition ${
                          selectedId === item.id ? "bg-white/10" : "bg-white/[0.04] hover:bg-white/[0.07]"
                        }`}
                      >
                        <span className="w-4 shrink-0 text-center text-xs font-bold text-white/50">{index + 1}</span>
                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-black/50">
                          {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-semibold text-white">{item.title}</p>
                          <p className="truncate text-[10px] text-white/45">{item.albumName || item.artist}</p>
                        </div>
                        {item.videoUrl ? <Film size={12} className="shrink-0 text-white/45" /> : null}
                      </button>
                    );
                  })}
                  {!previewTracks.length ? (
                    <p className="py-8 text-center text-xs text-white/40">No tracks yet</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void republishAll()}
            disabled={saving || !feed}
            className="mt-4 text-xs font-semibold text-white/45 underline-offset-2 hover:text-white/70 hover:underline disabled:opacity-40"
          >
            Republish full music feed
          </button>
        </section>

        <section className="overflow-hidden rounded-2xl border border-dt-border bg-dt-card">
          <div className="border-b border-dt-border px-4 py-3">
            <h3 className="font-display text-sm font-semibold tracking-wide text-white">Editor</h3>
            <p className="text-[11px] text-white/40">Thumbnail, song link, or video</p>
          </div>

          {draft ? (
            <div className="space-y-4 p-4">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
                <div className="aspect-square w-full bg-black/60">
                  {draft.thumbnail ? (
                    <img
                      src={resolveMusicAssetUrl(draft.thumbnail)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/25">
                      <Music2 size={36} />
                    </div>
                  )}
                </div>
                <label className="flex cursor-pointer items-center justify-center gap-2 border-t border-white/10 px-3 py-2.5 text-xs font-semibold text-white/80 hover:bg-white/[0.04]">
                  <Upload size={13} />
                  Upload thumbnail
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onUploadThumbnail(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-white/45">Title</span>
                <input
                  value={draft.title}
                  onChange={(e) => patchDraft({ title: e.target.value })}
                  className={fieldClass()}
                  placeholder="Track title"
                  style={titleTypographyStyle(draft)}
                />
              </label>

              <TypographyControls
                fontFamily={draft.titleFontFamily || "default"}
                fontSize={draft.titleFontSize || "md"}
                onFontFamilyChange={(titleFontFamily) => patchDraft({ titleFontFamily })}
                onFontSizeChange={(titleFontSize) => patchDraft({ titleFontSize })}
              />

              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-white/45">Artist</span>
                <input
                  value={draft.artist}
                  onChange={(e) => patchDraft({ artist: e.target.value })}
                  className={fieldClass()}
                  placeholder="Sloane Stephens"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-white/45">Album</span>
                <input
                  value={draft.albumName}
                  onChange={(e) => patchDraft({ albumName: e.target.value })}
                  className={fieldClass()}
                  placeholder="Album or single name"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-white/45">Duration</span>
                  <input
                    value={draft.duration}
                    onChange={(e) => patchDraft({ duration: e.target.value })}
                    className={fieldClass()}
                    placeholder="3:21"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-white/45">Thumbnail URL</span>
                  <input
                    value={draft.thumbnail.startsWith("data:") ? "" : draft.thumbnail}
                    onChange={(e) => patchDraft({ thumbnail: e.target.value })}
                    className={fieldClass()}
                    placeholder="https://…"
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/45">
                  <Link2 size={11} /> Song link (Spotify)
                </span>
                <input
                  value={draft.spotifyUrl}
                  onChange={(e) => patchDraft({ spotifyUrl: e.target.value })}
                  className={fieldClass()}
                  placeholder="https://open.spotify.com/track/…"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/45">
                  <Film size={11} /> Video link (optional)
                </span>
                <input
                  value={draft.videoUrl}
                  onChange={(e) => patchDraft({ videoUrl: e.target.value })}
                  className={fieldClass()}
                  placeholder="https://youtube.com/watch?v=… or any video URL"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => patchDraft({ featured: !draft.featured })}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
                    draft.featured
                      ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
                      : "border-white/15 text-white/60"
                  }`}
                >
                  <Star size={12} fill={draft.featured ? "currentColor" : "none"} />
                  Featured in Top songs
                </button>
                <button
                  type="button"
                  onClick={() => patchDraft({ enabled: !draft.enabled })}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
                    draft.enabled
                      ? "border-emerald-400/35 bg-emerald-400/10 text-emerald-200"
                      : "border-white/15 text-white/60"
                  }`}
                >
                  {draft.enabled ? <Eye size={12} /> : <EyeOff size={12} />}
                  {draft.enabled ? "Visible" : "Hidden"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => void saveDraft("draft")}
                  disabled={saving}
                  className="rounded-xl border border-white/15 px-3 py-2.5 text-xs font-semibold text-white/80 disabled:opacity-60"
                >
                  Save draft
                </button>
                <button
                  type="button"
                  onClick={() => void saveDraft("published")}
                  disabled={saving}
                  className="rounded-xl bg-dt-red px-3 py-2.5 text-xs font-semibold text-white disabled:opacity-60"
                >
                  Publish
                </button>
              </div>

              <button
                type="button"
                onClick={() => void removeItem()}
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/10 disabled:opacity-60"
              >
                <Trash2 size={13} /> Remove feed override
              </button>
            </div>
          ) : (
            <div className="px-4 py-16 text-center text-sm text-white/40">Select a track to edit</div>
          )}
        </section>
      </div>
    </div>
  );
}
