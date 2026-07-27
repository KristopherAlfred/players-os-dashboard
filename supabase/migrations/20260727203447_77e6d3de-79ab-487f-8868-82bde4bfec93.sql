CREATE TABLE public.onboarding_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_key text NOT NULL UNIQUE,
  has_completed_onboarding boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.onboarding_state TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.onboarding_state TO authenticated;
GRANT ALL ON public.onboarding_state TO service_role;

ALTER TABLE public.onboarding_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dashboard can read onboarding state" ON public.onboarding_state FOR SELECT USING (true);
CREATE POLICY "Dashboard can insert onboarding state" ON public.onboarding_state FOR INSERT WITH CHECK (true);
CREATE POLICY "Dashboard can update onboarding state" ON public.onboarding_state FOR UPDATE USING (true) WITH CHECK (true);

CREATE TRIGGER set_onboarding_state_updated_at
BEFORE UPDATE ON public.onboarding_state
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();