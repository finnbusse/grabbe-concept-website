-- ============================================================================
-- Migration: P0 Security hardening (invitations + action rate limiting + RLS)
-- Idempotent: Safe to run multiple times
-- ============================================================================

-- 1) Invitations: store token hash (no plaintext tokens in DB)
ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS token_hash TEXT;

-- Backfill token_hash from legacy token if present
UPDATE public.invitations
SET token_hash = encode(digest(token, 'sha256'), 'hex')
WHERE token_hash IS NULL
  AND token IS NOT NULL;

-- Ensure token_hash uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_invitations_token_hash
  ON public.invitations(token_hash);

-- Keep legacy token column nullable for backward compatibility,
-- but stop requiring it for new inserts.
ALTER TABLE public.invitations
  ALTER COLUMN token DROP NOT NULL;

-- 2) Invitations RLS: remove broad anon/authenticated access, keep service-role only
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'invitations' AND policyname = 'invitations_select_anon'
  ) THEN
    DROP POLICY invitations_select_anon ON public.invitations;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'invitations' AND policyname = 'invitations_select_authenticated'
  ) THEN
    DROP POLICY invitations_select_authenticated ON public.invitations;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'invitations' AND policyname = 'invitations_insert_authenticated'
  ) THEN
    DROP POLICY invitations_insert_authenticated ON public.invitations;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'invitations' AND policyname = 'invitations_update_authenticated'
  ) THEN
    DROP POLICY invitations_update_authenticated ON public.invitations;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'invitations' AND policyname = 'invitations_delete_authenticated'
  ) THEN
    DROP POLICY invitations_delete_authenticated ON public.invitations;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'invitations' AND policyname = 'invitations_select_service'
  ) THEN
    CREATE POLICY invitations_select_service ON public.invitations
      FOR SELECT TO service_role USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'invitations' AND policyname = 'invitations_insert_service'
  ) THEN
    CREATE POLICY invitations_insert_service ON public.invitations
      FOR INSERT TO service_role WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'invitations' AND policyname = 'invitations_delete_service'
  ) THEN
    CREATE POLICY invitations_delete_service ON public.invitations
      FOR DELETE TO service_role USING (true);
  END IF;
END $$;

-- 3) Action rate limiting table (persistent abuse protection for contact/anmeldung/password-reset)
CREATE TABLE IF NOT EXISTS public.rate_limit_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  identifier_hash TEXT NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_actions_lookup
  ON public.rate_limit_actions(action, identifier_hash, attempted_at DESC);

ALTER TABLE public.rate_limit_actions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'rate_limit_actions' AND policyname = 'rate_limit_actions_service_select'
  ) THEN
    CREATE POLICY rate_limit_actions_service_select ON public.rate_limit_actions
      FOR SELECT TO service_role USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'rate_limit_actions' AND policyname = 'rate_limit_actions_service_insert'
  ) THEN
    CREATE POLICY rate_limit_actions_service_insert ON public.rate_limit_actions
      FOR INSERT TO service_role WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'rate_limit_actions' AND policyname = 'rate_limit_actions_service_delete'
  ) THEN
    CREATE POLICY rate_limit_actions_service_delete ON public.rate_limit_actions
      FOR DELETE TO service_role USING (true);
  END IF;
END $$;

-- 4) Tighten high-sensitivity table read access to service role only
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'site_settings_select_all'
  ) THEN
    DROP POLICY site_settings_select_all ON public.site_settings;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'site_settings_select_service'
  ) THEN
    CREATE POLICY site_settings_select_service ON public.site_settings
      FOR SELECT TO service_role USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'site_settings_insert_auth'
  ) THEN
    DROP POLICY site_settings_insert_auth ON public.site_settings;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'site_settings_update_auth'
  ) THEN
    DROP POLICY site_settings_update_auth ON public.site_settings;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'site_settings_delete_auth'
  ) THEN
    DROP POLICY site_settings_delete_auth ON public.site_settings;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'site_settings_insert_service'
  ) THEN
    CREATE POLICY site_settings_insert_service ON public.site_settings
      FOR INSERT TO service_role WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'site_settings_update_service'
  ) THEN
    CREATE POLICY site_settings_update_service ON public.site_settings
      FOR UPDATE TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'site_settings_delete_service'
  ) THEN
    CREATE POLICY site_settings_delete_service ON public.site_settings
      FOR DELETE TO service_role USING (true);
  END IF;
END $$;
