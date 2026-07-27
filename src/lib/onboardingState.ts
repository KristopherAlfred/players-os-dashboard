import { supabase } from "../integrations/supabase/client";

/** Single-profile dashboard for now — one row keyed by this value. */
export const ONBOARDING_PROFILE_KEY = "sloane";

export async function fetchOnboardingComplete(): Promise<boolean> {
  const { data, error } = await supabase
    .from("onboarding_state")
    .select("has_completed_onboarding")
    .eq("profile_key", ONBOARDING_PROFILE_KEY)
    .maybeSingle();

  if (error) return true; // fail closed: never spam the tour on a backend hiccup
  return Boolean(data?.has_completed_onboarding);
}

export async function setOnboardingComplete(complete: boolean): Promise<void> {
  await supabase.from("onboarding_state").upsert(
    {
      profile_key: ONBOARDING_PROFILE_KEY,
      has_completed_onboarding: complete,
      completed_at: complete ? new Date().toISOString() : null,
    },
    { onConflict: "profile_key" },
  );
}
