CREATE TABLE public.instagram_account_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ig_user_id text NOT NULL UNIQUE,
  username text,
  name text,
  biography text,
  profile_picture_url text,
  website text,
  followers_count bigint NOT NULL DEFAULT 0,
  follows_count bigint NOT NULL DEFAULT 0,
  media_count bigint NOT NULL DEFAULT 0,
  reach bigint NOT NULL DEFAULT 0,
  impressions bigint NOT NULL DEFAULT 0,
  profile_views bigint NOT NULL DEFAULT 0,
  last_synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.instagram_account_stats TO anon, authenticated;
GRANT ALL ON public.instagram_account_stats TO service_role;
ALTER TABLE public.instagram_account_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Instagram account stats are readable"
  ON public.instagram_account_stats FOR SELECT USING (true);

CREATE TRIGGER instagram_account_stats_set_updated_at
  BEFORE UPDATE ON public.instagram_account_stats
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.instagram_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ig_user_id text NOT NULL,
  media_id text NOT NULL UNIQUE,
  caption text,
  media_type text,
  media_product_type text,
  media_url text,
  thumbnail_url text,
  permalink text,
  like_count bigint NOT NULL DEFAULT 0,
  comments_count bigint NOT NULL DEFAULT 0,
  saved bigint NOT NULL DEFAULT 0,
  reach bigint NOT NULL DEFAULT 0,
  impressions bigint NOT NULL DEFAULT 0,
  timestamp timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.instagram_media TO anon, authenticated;
GRANT ALL ON public.instagram_media TO service_role;
ALTER TABLE public.instagram_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Instagram media is readable"
  ON public.instagram_media FOR SELECT USING (true);

CREATE INDEX instagram_media_timestamp_idx ON public.instagram_media (timestamp DESC);

CREATE TRIGGER instagram_media_set_updated_at
  BEFORE UPDATE ON public.instagram_media
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();