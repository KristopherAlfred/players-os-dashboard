CREATE TABLE public.instagram_auth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ig_user_id text,
  username text,
  page_id text,
  page_name text,
  access_token text NOT NULL,
  token_expires_at timestamptz,
  connected_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.instagram_auth TO service_role;
ALTER TABLE public.instagram_auth ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER instagram_auth_set_updated_at
  BEFORE UPDATE ON public.instagram_auth
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();