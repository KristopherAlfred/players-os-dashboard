import { supabase } from "../integrations/supabase/client";
import { loadDashboardSession } from "./dashboardAuth";

/** Fallback key when no session email is available. */
export const ONBOARDING_PROFILE_KEY = "sloane";

/** Onboarding is tracked per login email, so every new email sees the tour once. */
export function getOnboardingProfileKey(): string {
  const email = loadDashboardSession()?.email?.trim().toLowerCase();
  return email && email.length > 0 ? email.slice(0, 64) : ONBOARDING_PROFILE_KEY;
}

export async function fetchOnboardingComplete(): Promise<boolean> {
  const { data, error } = await supabase
    .from("onboarding_state")
    .select("has_completed_onboarding")
    .eq("profile_key", getOnboardingProfileKey())
    .maybeSingle();

  if (error) return true; // fail closed: never spam the tour on a backend hiccup
  return Boolean(data?.has_completed_onboarding);
}

export async function setOnboardingComplete(complete: boolean): Promise<void> {
  await supabase.functions.invoke("dashboard-state", {
    body: {
      action: "set_onboarding_complete",
      profile_key: getOnboardingProfileKey(),
      complete,
    },
  });
}
