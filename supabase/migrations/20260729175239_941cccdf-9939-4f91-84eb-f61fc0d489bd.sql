-- onboarding_state
DROP POLICY IF EXISTS "Dashboard can insert onboarding state" ON public.onboarding_state;
DROP POLICY IF EXISTS "Dashboard can update onboarding state" ON public.onboarding_state;
DROP POLICY IF EXISTS "Dashboard can read onboarding state" ON public.onboarding_state;
CREATE POLICY "Onboarding state is readable" ON public.onboarding_state FOR SELECT USING (true);
REVOKE INSERT, UPDATE, DELETE ON public.onboarding_state FROM anon, authenticated;
GRANT SELECT ON public.onboarding_state TO anon, authenticated;
GRANT ALL ON public.onboarding_state TO service_role;

-- platform_connections
DROP POLICY IF EXISTS "Dashboard can insert platform connections" ON public.platform_connections;
DROP POLICY IF EXISTS "Dashboard can update platform connections" ON public.platform_connections;
DROP POLICY IF EXISTS "Dashboard can delete platform connections" ON public.platform_connections;
DROP POLICY IF EXISTS "Dashboard can read platform connections" ON public.platform_connections;
CREATE POLICY "Platform connections are readable" ON public.platform_connections FOR SELECT USING (true);
REVOKE INSERT, UPDATE, DELETE ON public.platform_connections FROM anon, authenticated;
GRANT SELECT ON public.platform_connections TO anon, authenticated;
GRANT ALL ON public.platform_connections TO service_role;

-- platform_follower_snapshots
DROP POLICY IF EXISTS "Snapshots are writable by app" ON public.platform_follower_snapshots;
DROP POLICY IF EXISTS "Snapshots are readable by everyone" ON public.platform_follower_snapshots;
CREATE POLICY "Snapshots are readable" ON public.platform_follower_snapshots FOR SELECT USING (true);
REVOKE INSERT, UPDATE, DELETE ON public.platform_follower_snapshots FROM anon, authenticated;
GRANT SELECT ON public.platform_follower_snapshots TO anon, authenticated;
GRANT ALL ON public.platform_follower_snapshots TO service_role;