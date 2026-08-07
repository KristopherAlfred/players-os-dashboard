import { supabase } from "../integrations/supabase/client";
import type { ExperienceConfig, ExperiencePageConfig } from "./experienceConfig";

/** AI design copilot client. Prompts + model calls live in the edge function. */

export type DesignerMessage = { role: "user" | "assistant"; content: string; image?: string };

export type ExperiencePatch = {
  brand?: Record<string, unknown>;
  theme?: Record<string, unknown>;
  effects?: Record<string, unknown>;
  page?: Record<string, unknown>;
};

export type DesignerResult = {
  reply: string;
  patch: ExperiencePatch;
  applyToAllPages: boolean;
  imagePrompt: string | null;
};

function aiError(error: unknown, fallback: string): Error {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  if (/429|rate/i.test(raw)) return new Error("The designer is busy — try again in a moment.");
  if (/402|credit/i.test(raw)) return new Error("AI credits are used up. Add credits to keep designing.");
  return new Error(raw || fallback);
}

/** Only the fields the model is allowed to reason about (keeps the prompt small). */
export function designerConfigSnapshot(
  experience: ExperienceConfig,
  pageKey: keyof ExperienceConfig["pages"],
) {
  const page = experience.pages[pageKey];
  return {
    brand: experience.brand,
    theme: experience.theme,
    effects: experience.effects,
    page: {
      backgroundColor: page.backgroundColor,
      backgroundGradientFrom: page.backgroundGradientFrom,
      backgroundGradientTo: page.backgroundGradientTo,
      useGradientBg: page.useGradientBg,
      headline: page.headline,
      subhead: page.subhead,
      body: page.body,
      ctaLabel: page.ctaLabel,
      ctaBg: page.ctaBg,
      ctaText: page.ctaText,
      accentColor: page.accentColor,
      effectPreset: page.effectPreset,
    },
  };
}

export async function askExperienceDesigner(input: {
  instruction: string;
  pageKey: string;
  image?: string | null;
  config: unknown;
  context: unknown;
  history: DesignerMessage[];
}): Promise<DesignerResult> {
  const { data, error } = await supabase.functions.invoke("experience-ai", {
    body: {
      action: "design",
      instruction: input.instruction,
      pageKey: input.pageKey,
      image: input.image ?? undefined,
      config: input.config,
      context: input.context,
      history: input.history.map((m) => ({ role: m.role, content: m.content })),
    },
  });
  if (error) throw aiError(error, "The designer could not respond");
  const payload = data as (DesignerResult & { error?: string }) | null;
  if (payload?.error) throw aiError(new Error(payload.error), "The designer could not respond");
  return {
    reply: payload?.reply ?? "Updated your look.",
    patch: payload?.patch ?? {},
    applyToAllPages: Boolean(payload?.applyToAllPages),
    imagePrompt: payload?.imagePrompt ?? null,
  };
}

export async function generateExperienceArt(prompt: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("experience-ai", {
    body: { action: "image", prompt },
  });
  if (error) throw aiError(error, "Could not generate the artwork");
  const payload = data as { imageSrc?: string; error?: string };
  if (payload?.error) throw aiError(new Error(payload.error), "Could not generate the artwork");
  if (!payload?.imageSrc) throw new Error("No artwork came back — try again");
  return payload.imageSrc;
}

/** Merge an AI patch into the config, optionally styling every page at once. */
export function applyExperiencePatch(
  prev: ExperienceConfig,
  patch: ExperiencePatch,
  pageKey: keyof ExperienceConfig["pages"],
  applyToAllPages: boolean,
): ExperienceConfig {
  const pagePatch = (patch.page ?? {}) as Partial<ExperiencePageConfig>;
  const pageKeys = Object.keys(prev.pages) as (keyof ExperienceConfig["pages"])[];
  const pages = { ...prev.pages };
  const targets = applyToAllPages ? pageKeys : [pageKey];
  for (const key of targets) {
    pages[key] = { ...pages[key], ...pagePatch };
  }
  return {
    ...prev,
    brand: { ...prev.brand, ...(patch.brand ?? {}) },
    theme: { ...prev.theme, ...(patch.theme ?? {}) },
    effects: { ...prev.effects, ...(patch.effects ?? {}) },
    pages,
  };
}

/** Human summary of what a patch touched, for the chat transcript. */
export function describePatch(patch: ExperiencePatch): string[] {
  const out: string[] = [];
  for (const group of ["brand", "theme", "effects", "page"] as const) {
    const entries = Object.entries(patch[group] ?? {});
    if (entries.length) {
      out.push(`${group}: ${entries.map(([k]) => k).slice(0, 8).join(", ")}`);
    }
  }
  return out;
}
