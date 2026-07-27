-- Historical follower tracking per platform
CREATE TABLE public.platform_follower_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  captured_on date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  follower_count bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (platform, captured_on)
);

GRANT SELECT ON public.platform_follower_snapshots TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.platform_follower_snapshots TO authenticated;
GRANT ALL ON public.platform_follower_snapshots TO service_role;

ALTER TABLE public.platform_follower_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Snapshots are readable by everyone"
  ON public.platform_follower_snapshots FOR SELECT USING (true);

CREATE POLICY "Snapshots are writable by app"
  ON public.platform_follower_snapshots FOR ALL
  USING (true) WITH CHECK (true);

CREATE INDEX idx_platform_snapshots_platform_date
  ON public.platform_follower_snapshots (platform, captured_on DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_platform_snapshots_updated_at
  BEFORE UPDATE ON public.platform_follower_snapshots
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();