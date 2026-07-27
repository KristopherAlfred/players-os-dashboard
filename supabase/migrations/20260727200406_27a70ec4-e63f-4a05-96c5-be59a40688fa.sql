CREATE TABLE public.platform_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  handle TEXT,
  connected BOOLEAN NOT NULL DEFAULT false,
  last_synced_at TIMESTAMPTZ,
  follower_count BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.platform_connections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.platform_connections TO authenticated;
GRANT ALL ON public.platform_connections TO service_role;

ALTER TABLE public.platform_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dashboard can read platform connections"
  ON public.platform_connections FOR SELECT USING (true);
CREATE POLICY "Dashboard can insert platform connections"
  ON public.platform_connections FOR INSERT WITH CHECK (true);
CREATE POLICY "Dashboard can update platform connections"
  ON public.platform_connections FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Dashboard can delete platform connections"
  ON public.platform_connections FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_platform_connections_updated_at
BEFORE UPDATE ON public.platform_connections
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();