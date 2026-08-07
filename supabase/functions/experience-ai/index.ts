/**
 * AI design copilot for the Experience studio.
 *
 * action: "design" -> takes the current experience config (brand/theme/effects +
 *   the page being edited), a natural-language instruction and an optional
 *   reference image, and returns a JSON patch the client deep-merges into the
 *   config, plus a short human reply.
 * action: "image"  -> generates artwork (background / hero / logo) as a data URL.
 *
 * All model calls and keys stay server-side.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const TEXT_MODEL = "google/gemini-3.6-flash";
const IMAGE_MODEL = "google/gemini-3.1-flash-image";

type ContentBlock =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

const SCHEMA_DOC = `
The experience config you may patch (all fields optional — only send what changes):
{
  "brand": { "logoColor": hex, "logoTint": bool, "wordmark": string, "wordmarkColor": hex,
             "tagline": string, "taglineColor": hex, "showLogoImage": bool },
  "theme": { "bg": hex, "bgGradientFrom": hex, "bgGradientVia": hex, "bgGradientTo": hex,
             "bgGradientAngle": 0-360, "useGradientBg": bool, "surface": hex, "card": hex,
             "border": css color, "text": hex, "muted": css color, "accent": hex,
             "accentHover": hex, "buttonBg": hex, "buttonText": hex, "buttonBorder": css color,
             "buttonRadius": 0-999 },
  "effects": { "glow": bool, "glowColor": hex, "glowIntensity": 0-100, "particles": bool,
               "particleColor": hex, "noise": bool, "noiseOpacity": 0-40, "shimmer": bool,
               "blurBackdrop": bool, "vignette": bool, "animatedGradient": bool,
               "glassmorphism": bool },
  "page": { "backgroundColor": hex, "backgroundGradientFrom": hex, "backgroundGradientTo": hex,
            "useGradientBg": bool, "headline": string, "subhead": string, "body": string,
            "ctaLabel": string, "ctaBg": hex, "ctaText": hex, "accentColor": hex,
            "effectPreset": "none|glow|shimmer|glass|neon|burst|rays|soft",
            "unlockHeadline": string, "unlockBody": string, "unlockFooter": string,
            "unlockGlowColor": hex, "unlockPanelBorderColor": hex,
            "fansProofTitle": string, "fansProofBody": string, "followTitle": string,
            "footerLine": string }
}
"page" patches the page the athlete is editing. Set "applyToAllPages": true when the
request is about the whole app look (colors, vibe, theme) so every page matches.
Set "imagePrompt" to a short art-direction prompt ONLY when the athlete asked for
generated artwork/background imagery.
`;

function systemPrompt(context: unknown, config: unknown, pageKey: string) {
  return [
    "You are the design copilot inside PlayersOS, customizing an athlete's fan app front end.",
    "You translate plain-language requests into concrete design changes. Be bold and tasteful:",
    "high contrast, readable text, cohesive palettes, dark-first premium sports aesthetics.",
    "Always keep text readable against its background and keep the athlete's brand identity intact",
    "unless they explicitly ask to change it.",
    "If a reference image is attached, pull its palette and mood into the patch.",
    "Reply with JSON ONLY, no markdown fences, shaped exactly:",
    '{"reply":"one or two short sentences on what you changed","patch":{...},"applyToAllPages":false,"imagePrompt":null}',
    SCHEMA_DOC,
    `ATHLETE CONTEXT: ${JSON.stringify(context)}`,
    `PAGE BEING EDITED: ${pageKey}`,
    `CURRENT CONFIG: ${JSON.stringify(config)}`,
  ].join("\n");
}

async function callGateway(key: string, body: unknown) {
  const res = await fetch(`${GATEWAY}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 400)}`);
  return JSON.parse(text);
}

function extractJson(raw: string) {
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("AI returned an unexpected response");
  return JSON.parse(cleaned.slice(start, end + 1));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) return json({ error: "AI is not configured yet" }, 500);

  try {
    const body = (await req.json().catch(() => null)) as
      | {
          action?: string;
          instruction?: string;
          prompt?: string;
          pageKey?: string;
          image?: string;
          config?: unknown;
          context?: unknown;
          history?: { role: string; content: string }[];
        }
      | null;
    if (!body) return json({ error: "Invalid request" }, 400);

    if (body.action === "image") {
      const prompt = (body.prompt ?? "").trim().slice(0, 800);
      if (!prompt) return json({ error: "Describe the artwork first" }, 400);
      const data = await callGateway(key, {
        model: IMAGE_MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `${prompt}. Premium sports-brand art direction, dark cinematic background, no text, no watermark, mobile app friendly composition.`,
              },
            ],
          },
        ],
        modalities: ["image", "text"],
      });
      const message = data?.choices?.[0]?.message ?? {};
      const url =
        message?.images?.[0]?.image_url?.url ??
        message?.images?.[0]?.url ??
        null;
      if (!url) return json({ error: "The model did not return an image — try again" }, 502);
      return json({ imageSrc: url });
    }

    const instruction = (body.instruction ?? "").trim().slice(0, 2000);
    const hasImage = typeof body.image === "string" && body.image.startsWith("data:image");
    if (!instruction && !hasImage) return json({ error: "Tell the designer what you want" }, 400);

    const pageKey = String(body.pageKey || "landing");
    const history = (body.history ?? [])
      .slice(-8)
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: String(m.content).slice(0, 1500) }));

    const content: ContentBlock[] = [
      {
        type: "text",
        text: instruction || "Use this reference image to restyle the app.",
      },
    ];
    if (hasImage) content.push({ type: "image_url", image_url: { url: body.image as string } });

    const data = await callGateway(key, {
      model: TEXT_MODEL,
      messages: [
        { role: "system", content: systemPrompt(body.context ?? {}, body.config ?? {}, pageKey) },
        ...history,
        { role: "user", content },
      ],
    });

    const raw = String(data?.choices?.[0]?.message?.content ?? "");
    const parsed = extractJson(raw) as {
      reply?: string;
      patch?: Record<string, unknown>;
      applyToAllPages?: boolean;
      imagePrompt?: string | null;
    };

    return json({
      reply: parsed.reply || "Updated your look.",
      patch: parsed.patch ?? {},
      applyToAllPages: Boolean(parsed.applyToAllPages),
      imagePrompt: parsed.imagePrompt || null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed";
    const status = /429|rate/i.test(message) ? 429 : /402|credit/i.test(message) ? 402 : 500;
    return json({ error: message }, status);
  }
});
