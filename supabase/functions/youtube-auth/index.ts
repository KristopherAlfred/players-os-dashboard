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

/**
 * Google OAuth for YouTube.
 * - readonly + analytics scopes power the dashboard metrics
 * - youtube.upload lets the athlete publish videos from Content Studio
 */
const SCOPES = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/yt-analytics.readonly",
  "https://www.googleapis.com/auth/youtube.upload",
].join(" ");

function redirectUri(req: Request) {
  const url = new URL(req.url);
  return `https://${url.host}/functions/v1/youtube-auth/callback`;
}

function htmlClose(message: string, ok: boolean) {
  return new Response(
    `<!doctype html><html><body style="background:#0b0f0d;color:#fff;font-family:system-ui;display:grid;place-items:center;height:100vh;margin:0">
      <div style="text-align:center;max-width:520px;padding:24px">
        <h1 style="color:${ok ? "#8FE3B8" : "#ff8484"};font-size:20px">${ok ? "YouTube connected" : "Connection failed"}</h1>
        <p style="opacity:.7;font-size:14px">${message}</p>
        <p style="opacity:.5;font-size:12px">You can close this window.</p>
      </div>
      <script>try{window.opener&&window.opener.postMessage({type:"youtube-auth",ok:${ok}},"*")}catch(e){}<\/script>
    </body></html>`,
    { headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } },
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const clientId = Deno.env.get("GOOGLE_CLIENT_ID") ?? "";
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET") ?? "";
  const url = new URL(req.url);
  const isCallback = url.pathname.endsWith("/callback");

  if (!clientId || !clientSecret) {
    const msg = "Google OAuth credentials are not configured.";
    return isCallback ? htmlClose(msg, false) : json({ error: msg }, 400);
  }

  try {
    if (!isCallback) {
      let athleteId: string | null = null;
      try {
        const body = (await req.json()) as { athlete_id?: string };
        athleteId = body?.athlete_id ?? null;
      } catch {
        // no body is fine
      }

      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.set("client_id", clientId);
      authUrl.searchParams.set("redirect_uri", redirectUri(req));
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("scope", SCOPES);
      authUrl.searchParams.set("access_type", "offline");
      authUrl.searchParams.set("include_granted_scopes", "true");
      authUrl.searchParams.set("prompt", "consent");
      authUrl.searchParams.set("state", athleteId ?? crypto.randomUUID());
      return json({ url: authUrl.toString() });
    }

    const oauthError = url.searchParams.get("error");
    if (oauthError) return htmlClose(oauthError, false);

    const code = url.searchParams.get("code");
    if (!code) return htmlClose("Missing authorization code.", false);

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri(req),
        grant_type: "authorization_code",
      }),
    });
    const token = (await tokenRes.json()) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      error_description?: string;
      error?: string;
    };
    if (!tokenRes.ok || !token.access_token) {
      return htmlClose(token.error_description ?? token.error ?? "Token exchange failed.", false);
    }

    const channelRes = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
      { headers: { Authorization: `Bearer ${token.access_token}` } },
    );
    const channelBody = (await channelRes.json()) as {
      items?: Array<{
        id: string;
        snippet?: { title?: string; customUrl?: string };
        statistics?: { subscriberCount?: string };
      }>;
      error?: { message?: string };
    };
    if (!channelRes.ok) {
      return htmlClose(channelBody.error?.message ?? "Could not read your channel.", false);
    }
    const channel = channelBody.items?.[0];
    if (!channel) {
      return htmlClose("No YouTube channel is attached to that Google account.", false);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const state = url.searchParams.get("state") ?? "";
    const athleteId = /^[0-9a-f-]{36}$/i.test(state) ? state : null;
    const handle = channel.snippet?.customUrl ?? null;

    const { error: upsertError } = await supabase.from("youtube_auth").upsert(
      {
        athlete_id: athleteId,
        channel_id: channel.id,
        channel_title: channel.snippet?.title ?? null,
        handle,
        access_token: token.access_token,
        refresh_token: token.refresh_token ?? null,
        token_expires_at: token.expires_in
          ? new Date(Date.now() + token.expires_in * 1000).toISOString()
          : null,
        connected_at: new Date().toISOString(),
      },
      { onConflict: "channel_id" },
    );
    if (upsertError) throw upsertError;

    await supabase
      .from("platform_connections")
      .update({
        connected: true,
        handle: handle ?? channel.snippet?.title ?? null,
        follower_count: Number(channel.statistics?.subscriberCount ?? 0),
        last_synced_at: new Date().toISOString(),
      })
      .eq("platform", "youtube");

    return htmlClose(
      `${channel.snippet?.title ?? "Your channel"} is now linked. Head back to the dashboard and hit Sync now.`,
      true,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("youtube-auth failed:", message);
    return isCallback ? htmlClose(message, false) : json({ error: message }, 500);
  }
});
