import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/;

const str = (v: unknown, max = 500): string | null =>
  typeof v === "string" && v.trim().length > 0 ? v.trim().slice(0, max) : null;

/** Fields an athlete may write on their own athlete row. */
const ATHLETE_FIELDS = [
  "full_name",
  "display_name",
  "sport",
  "sport_icon",
  "gender",
  "team_or_league",
  "bio_short",
  "profile_photo_url",
] as const;

/** Fields an athlete may write on their theme row. */
const THEME_FIELDS = [
  "template_id",
  "bg_solid",
  "gradient_from",
  "gradient_via",
  "gradient_to",
  "accent_color",
  "accent_hover",
  "button_bg",
  "button_text",
  "background_image",
  "logo_url",
  "tagline",
  "headline",
  "subheadline",
] as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return json({ error: "Invalid request" }, 400);
    const { action } = body as { action?: string };

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // ---- Create or update an athlete profile (onboarding + settings edits) ----
    if (action === "upsert_athlete") {
      const profileKey = str((body as Record<string, unknown>).profile_key, 64);
      const fullName = str((body as Record<string, unknown>).full_name, 120);
      if (!profileKey) return json({ error: "Invalid profile_key" }, 400);
      if (!fullName) return json({ error: "Invalid full_name" }, 400);

      const patch: Record<string, unknown> = { profile_key: profileKey };
      for (const key of ATHLETE_FIELDS) {
        const value = (body as Record<string, unknown>)[key];
        if (value !== undefined) patch[key] = str(value, 600);
      }
      patch.full_name = fullName;
      if (typeof (body as Record<string, unknown>).onboarding_completed === "boolean") {
        patch.onboarding_completed = (body as Record<string, unknown>).onboarding_completed;
      }

      const { data, error } = await supabase
        .from("athletes")
        .upsert(patch, { onConflict: "profile_key" })
        .select("id")
        .single();
      if (error) throw error;
      return json({ ok: true, athlete_id: data.id });
    }

    // ---- Save the athlete's Experience theme ----
    if (action === "save_theme") {
      const athleteId = str((body as Record<string, unknown>).athlete_id, 36);
      if (!athleteId || !UUID.test(athleteId)) return json({ error: "Invalid athlete_id" }, 400);

      const patch: Record<string, unknown> = { athlete_id: athleteId };
      for (const key of THEME_FIELDS) {
        const value = (body as Record<string, unknown>)[key];
        if (value !== undefined) patch[key] = str(value, 2000);
      }
      const radius = (body as Record<string, unknown>).button_border_radius;
      if (typeof radius === "number" && Number.isFinite(radius)) {
        patch.button_border_radius = Math.max(0, Math.min(999, Math.round(radius)));
      }
      if (typeof (body as Record<string, unknown>).is_published === "boolean") {
        patch.is_published = (body as Record<string, unknown>).is_published;
      }

      const { error } = await supabase
        .from("athlete_theme")
        .upsert(patch, { onConflict: "athlete_id" });
      if (error) throw error;
      return json({ ok: true });
    }

    // ---- Claim / update the athlete's [slug].bio link ----
    if (action === "claim_slug") {
      const athleteId = str((body as Record<string, unknown>).athlete_id, 36);
      const slug = str((body as Record<string, unknown>).slug, 40)?.toLowerCase() ?? "";
      if (!athleteId || !UUID.test(athleteId)) return json({ error: "Invalid athlete_id" }, 400);
      if (!SLUG.test(slug)) return json({ error: "Invalid slug" }, 400);

      const { data: taken } = await supabase
        .from("athlete_bio_links")
        .select("athlete_id")
        .eq("slug", slug)
        .maybeSingle();
      if (taken && taken.athlete_id !== athleteId) return json({ error: "Slug taken" }, 409);

      const destination =
        str((body as Record<string, unknown>).destination_app_url, 500) ?? "/experience";
      const isPublished = (body as Record<string, unknown>).is_published;

      const { data: existing } = await supabase
        .from("athlete_bio_links")
        .select("id")
        .eq("athlete_id", athleteId)
        .maybeSingle();

      const patch: Record<string, unknown> = {
        athlete_id: athleteId,
        slug,
        destination_app_url: destination,
      };
      if (typeof isPublished === "boolean") patch.is_published = isPublished;

      const { error } = existing
        ? await supabase.from("athlete_bio_links").update(patch).eq("id", existing.id)
        : await supabase.from("athlete_bio_links").insert(patch);
      if (error) throw error;
      return json({ ok: true, slug });
    }

    // ---- Count a bio-link visit ----
    if (action === "register_click") {
      const slug = str((body as Record<string, unknown>).slug, 40)?.toLowerCase() ?? "";
      if (!SLUG.test(slug)) return json({ error: "Invalid slug" }, 400);

      const { data: link } = await supabase
        .from("athlete_bio_links")
        .select("id, click_count, destination_app_url, athlete_id, is_published")
        .eq("slug", slug)
        .maybeSingle();
      if (!link) return json({ error: "Not found" }, 404);

      await supabase
        .from("athlete_bio_links")
        .update({ click_count: Number(link.click_count ?? 0) + 1 })
        .eq("id", link.id);

      return json({
        ok: true,
        destination_app_url: link.destination_app_url,
        athlete_id: link.athlete_id,
        is_published: link.is_published,
      });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    console.error("athlete-state failed:", err instanceof Error ? err.message : String(err));
    return json({ error: "Request failed" }, 500);
  }
});
