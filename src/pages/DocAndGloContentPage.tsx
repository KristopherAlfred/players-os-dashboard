import { useAthlete } from "../contexts/AthleteContext";
import { useEffect, useMemo, useState } from "react";
import {
  EyeOff,
  ExternalLink,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import {
  createEmptyDocAndGloProduct,
  deleteDocAndGloProduct,
  fetchDocAndGloCatalog,
  fetchDocAndGloFeed,
  formatDocAndGloPrice,
  productFromCatalog,
  publishDocAndGloFeed,
  resolveDocAndGloAssetUrl,
  upsertDocAndGloProduct,
  type DocAndGloCatalogProduct,
  type DocAndGloFeed,
  type DocAndGloProduct,
  type DocAndGloStatus,
} from "../lib/docAndGloApi";

function fieldClass() {
  return "w-full rounded-xl border border-dt-border bg-black/50 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-dt-red/55 focus:ring-1 focus:ring-dt-red/25";
}

function findFeedItem(feed: DocAndGloFeed | null, productId: string) {
  if (!feed) return null;
  return (
    feed.items.find(
      (item) => item.id === productId || item.shopifyProductId === productId,
    ) ?? null
  );
}

export function DocAndGloContentPage() {
  const { fanAppName } = useAthlete();
  const [feed, setFeed] = useState<DocAndGloFeed | null>(null);
  const [catalog, setCatalog] = useState<DocAndGloCatalogProduct[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DocAndGloProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "shopify" | "custom" | "featured">("all");

  function applyCatalog(products: DocAndGloCatalogProduct[], nextFeed?: DocAndGloFeed | null) {
    const feedRef = nextFeed ?? feed;
    setCatalog(products);
    setStatus(`Synced ${products.length} Doc & Glo products from shop`);
    if (!draft && products[0]) {
      const item = productFromCatalog(products[0], findFeedItem(feedRef, products[0].id));
      setSelectedId(item.id);
      setDraft(item);
    }
  }

  useEffect(() => {
    void (async () => {
      try {
        const [nextFeed, catalogResult] = await Promise.all([
          fetchDocAndGloFeed(),
          fetchDocAndGloCatalog().catch(() => null),
        ]);
        setFeed(nextFeed);
        if (catalogResult?.products.length) {
          applyCatalog(catalogResult.products, nextFeed);
        } else {
          const first = nextFeed.items[0] ?? null;
          if (first) {
            setSelectedId(first.id);
            setDraft({ ...first });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load Doc & Glo");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const library = useMemo(() => {
    const catalogIds = new Set(catalog.map((product) => product.id));
    const fromShop = catalog.map((product) =>
      productFromCatalog(product, findFeedItem(feed, product.id)),
    );
    const customs = (feed?.items ?? []).filter(
      (item) => item.source === "manual" && !catalogIds.has(item.shopifyProductId || item.id),
    );
    let list = [...fromShop, ...customs];

    if (filter === "shopify") list = list.filter((item) => item.source === "shopify");
    if (filter === "custom") list = list.filter((item) => item.source === "manual");
    if (filter === "featured") list = list.filter((item) => item.featured);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.productType.toLowerCase().includes(q),
      );
    }
    return list;
  }, [feed, catalog, filter, query]);

  const stats = useMemo(
    () => ({
      shopify: catalog.length,
      featured: library.filter((item) => item.featured).length,
      published: (feed?.items ?? []).filter((item) => item.status === "published").length,
    }),
    [catalog, library, feed],
  );

  function selectItem(item: DocAndGloProduct) {
    setSelectedId(item.id);
    setDraft({ ...item });
    setError(null);
    setStatus(null);
  }

  function startNew() {
    const item = createEmptyDocAndGloProduct();
    setSelectedId(item.id);
    setDraft(item);
  }

  function patchDraft(patch: Partial<DocAndGloProduct>) {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  async function syncCatalog() {
    setSyncing(true);
    setError(null);
    try {
      const result = await fetchDocAndGloCatalog(true);
      applyCatalog(result.products, feed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  async function importAll() {
    if (!catalog.length) return;
    setSaving(true);
    setError(null);
    try {
      const items = catalog.map((product, index) => ({
        ...productFromCatalog(product, findFeedItem(feed, product.id)),
        order: index,
        status: "published" as DocAndGloStatus,
      }));
      const customs = (feed?.items ?? []).filter(
        (item) => item.source === "manual" && !item.shopifyProductId,
      );
      const next = await publishDocAndGloFeed({
        version: (feed?.version ?? 1) + 1,
        updatedAt: new Date().toISOString(),
        items: [...items, ...customs],
      });
      setFeed(next);
      setStatus(`Imported ${items.length} Doc & Glo products into the app feed`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setSaving(false);
    }
  }

  async function saveDraft(nextStatus?: DocAndGloStatus) {
    if (!draft) return;
    if (!draft.title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload: DocAndGloProduct = {
        ...draft,
        title: draft.title.trim(),
        status: nextStatus ?? draft.status,
        publishedAt: draft.publishedAt || new Date().toISOString(),
      };
      const nextFeed = await upsertDocAndGloProduct(payload);
      setFeed(nextFeed);
      setDraft(payload);
      setSelectedId(payload.id);
      setStatus(
        payload.status === "published"
          ? `Published — product is live on ${fanAppName} Doc & Glo`
          : "Saved as draft",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function removeDraft() {
    if (!draft) return;
    const saved = findFeedItem(feed, draft.id) || findFeedItem(feed, draft.shopifyProductId);
    if (!saved) {
      setDraft(null);
      setSelectedId(null);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const nextFeed = await deleteDocAndGloProduct(saved.id);
      setFeed(nextFeed);
      const shop = catalog.find(
        (product) => product.id === draft.shopifyProductId || product.id === draft.id,
      );
      const next = shop ? productFromCatalog(shop, null) : null;
      setDraft(next);
      setSelectedId(next?.id ?? null);
      setStatus("Removed from Doc & Glo feed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  async function republish() {
    if (!feed) return;
    setSaving(true);
    setError(null);
    try {
      const next = await publishDocAndGloFeed({
        ...feed,
        updatedAt: new Date().toISOString(),
      });
      setFeed(next);
      setStatus("Doc & Glo feed republished to app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Republish failed");
    } finally {
      setSaving(false);
    }
  }

  function onThumbUpload(file: File | null) {
    if (!file || !draft) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (result) patchDraft({ thumbnail: result });
    };
    reader.readAsDataURL(file);
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-white/70">
        <Loader2 className="mr-2 animate-spin" size={18} /> Loading Doc & Glo catalog…
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-dt-border bg-dt-card">
        <div className="relative border-b border-dt-border bg-gradient-to-br from-black via-[#0c0c0c] to-[#051a12] px-5 py-5 sm:px-7 sm:py-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(143,227,184,0.22),transparent_52%)]" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-dt-red/30 bg-dt-red/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-dt-red">
                Doc & Glo
              </div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Curate the product line for the app
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                Sync products from docandglo.com, feature bestsellers, edit copy and images, then
                publish what fans see in {fanAppName}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-[96px] rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Products</p>
                <p className="mt-1 text-lg font-bold text-white">{stats.shopify}</p>
              </div>
              <div className="min-w-[96px] rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Featured</p>
                <p className="mt-1 text-lg font-bold text-white">{stats.featured}</p>
              </div>
              <div className="min-w-[96px] rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Published</p>
                <p className="mt-1 text-lg font-bold text-white">{stats.published}</p>
              </div>
              <button
                type="button"
                onClick={() => void (draft ? saveDraft("published") : startNew())}
                disabled={saving}
                className="inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-dt-red px-5 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(143,227,184,0.35)] transition hover:brightness-110 disabled:opacity-60"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {draft ? "Publish to app" : "Add product"}
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
            <h3 className="font-display text-sm font-semibold tracking-wide text-white">Catalog</h3>
            <p className="text-[11px] text-white/40">Live Shopify products + custom cards</p>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
            <div className="grid shrink-0 grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => void syncCatalog()}
                disabled={syncing}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-white/85 hover:border-dt-red/40 disabled:opacity-60"
              >
                {syncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                Sync shop
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
              onClick={() => void importAll()}
              disabled={saving || !catalog.length}
              className="w-full shrink-0 rounded-xl border border-dt-red/35 bg-dt-red/10 px-3 py-2 text-[11px] font-semibold text-dt-red transition hover:bg-dt-red/15 disabled:opacity-50"
            >
              Import all products to feed
            </button>

            <div className="flex shrink-0 gap-1 rounded-xl border border-white/10 bg-black/30 p-1">
              {(
                [
                  ["all", "All"],
                  ["shopify", "Shop"],
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
              placeholder="Search products…"
              className={`${fieldClass()} shrink-0`}
            />

            <ul className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
              {library.map((item) => {
                const selected = selectedId === item.id;
                const thumb = resolveDocAndGloAssetUrl(item.thumbnail);
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
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-white/30">
                            D&G
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{item.title || "Untitled"}</p>
                        <p className="truncate text-[11px] text-white/45">
                          {item.productType || item.subtitle || "Doc & Glo"}
                          {item.price ? ` · ${formatDocAndGloPrice(item.price, item.currency)}` : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        {item.featured ? <Star size={11} className="text-amber-300" fill="currentColor" /> : null}
                        {!item.enabled ? <EyeOff size={11} className="text-white/35" /> : null}
                      </div>
                    </button>
                  </li>
                );
              })}
              {!library.length ? (
                <li className="rounded-xl border border-dashed border-white/10 px-3 py-8 text-center text-xs text-white/40">
                  Sync the Doc & Glo shop or add a custom product
                </li>
              ) : null}
            </ul>
          </div>
        </section>

        <section className="flex flex-col items-center justify-start rounded-2xl border border-dt-border bg-dt-card px-4 py-6">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">App preview</p>
          <div className="w-full max-w-[320px] overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
            <div className="relative min-h-[560px] bg-gradient-to-b from-[#051a12] via-black to-black px-4 pb-6 pt-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(143,227,184,0.28),transparent_55%)]" />
              <div className="relative">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-dt-red">Doc & Glo</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-white">Clean body care</h3>
                <p className="mt-1 text-xs text-white/55">Bodies in motion · vegan · cruelty-free</p>
                <div className="mt-5 space-y-3">
                  {library.filter((item) => item.enabled).slice(0, 4).map((item) => {
                    const thumb = resolveDocAndGloAssetUrl(item.thumbnail);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-2.5"
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/50">
                          {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : null}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                          <p className="text-[11px] text-white/50">
                            {formatDocAndGloPrice(item.price, item.currency) || "Shop"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {!library.length ? (
                    <p className="rounded-xl border border-dashed border-white/10 px-3 py-10 text-center text-xs text-white/40">
                      Products appear here after sync
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void republish()}
            disabled={saving || !feed}
            className="mt-4 text-xs font-semibold text-white/55 underline-offset-2 hover:text-white hover:underline disabled:opacity-50"
          >
            Republish full Doc & Glo feed
          </button>
        </section>

        <section className="overflow-hidden rounded-2xl border border-dt-border bg-dt-card">
          <div className="border-b border-dt-border px-4 py-3">
            <h3 className="font-display text-sm font-semibold tracking-wide text-white">Edit product</h3>
            <p className="text-[11px] text-white/40">Title, price, shop link, and thumbnail</p>
          </div>
          {draft ? (
            <div className="space-y-4 p-4">
              <div className="flex items-start gap-3">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-black/50">
                  {draft.thumbnail ? (
                    <img
                      src={resolveDocAndGloAssetUrl(draft.thumbnail)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-white/30">No image</div>
                  )}
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/80 hover:border-dt-red/40">
                  <Upload size={13} />
                  Upload image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onThumbUpload(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <label className="block text-sm">
                <span className="mb-1.5 block text-xs text-white/55">Title</span>
                <input
                  value={draft.title}
                  onChange={(e) => patchDraft({ title: e.target.value })}
                  className={fieldClass()}
                  placeholder="Product name"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1.5 block text-xs text-white/55">Subtitle / type</span>
                <input
                  value={draft.subtitle || draft.productType}
                  onChange={(e) => patchDraft({ subtitle: e.target.value, productType: e.target.value })}
                  className={fieldClass()}
                  placeholder="Deodorant"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm">
                  <span className="mb-1.5 block text-xs text-white/55">Price</span>
                  <input
                    value={draft.price}
                    onChange={(e) => patchDraft({ price: e.target.value })}
                    className={fieldClass()}
                    placeholder="18.00"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block text-xs text-white/55">Shop URL</span>
                  <input
                    value={draft.shopUrl}
                    onChange={(e) => patchDraft({ shopUrl: e.target.value })}
                    className={fieldClass()}
                    placeholder="https://docandglo.com/products/..."
                  />
                </label>
              </div>

              <label className="block text-sm">
                <span className="mb-1.5 block text-xs text-white/55">Description</span>
                <textarea
                  value={draft.description}
                  onChange={(e) => patchDraft({ description: e.target.value })}
                  className={`${fieldClass()} min-h-[96px] resize-y`}
                  placeholder="Short product story"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => patchDraft({ featured: !draft.featured })}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold ${
                    draft.featured
                      ? "border-amber-300/40 bg-amber-300/10 text-amber-200"
                      : "border-white/15 text-white/70"
                  }`}
                >
                  <Star size={13} /> Featured
                </button>
                <button
                  type="button"
                  onClick={() => patchDraft({ enabled: !draft.enabled })}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold ${
                    draft.enabled
                      ? "border-dt-red/40 bg-dt-red/10 text-dt-red"
                      : "border-white/15 text-white/70"
                  }`}
                >
                  {draft.enabled ? "Visible" : "Hidden"}
                </button>
                {draft.shopUrl ? (
                  <a
                    href={draft.shopUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-white/70 hover:text-white"
                  >
                    <ExternalLink size={13} /> Open shop
                  </a>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2 border-t border-dt-border pt-4">
                <button
                  type="button"
                  onClick={() => void saveDraft("published")}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-dt-red px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  Publish
                </button>
                <button
                  type="button"
                  onClick={() => void saveDraft("draft")}
                  disabled={saving}
                  className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/80 disabled:opacity-60"
                >
                  Save draft
                </button>
                <button
                  type="button"
                  onClick={() => void removeDraft()}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-200 disabled:opacity-60"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-16 text-center text-sm text-white/40">Select a product to edit</div>
          )}
        </section>
      </div>
    </div>
  );
}
