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

-- Remove legacy plaintext token values after backfill.
UPDATE public.invitations
SET token = NULL
WHERE token IS NOT NULL;

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

-- 5) Audit logging for critical operations
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  actor_user_id UUID NULL,
  target_type TEXT NULL,
  target_id TEXT NULL,
  metadata JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action_created_at
  ON public.audit_logs(action, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_created_at
  ON public.audit_logs(actor_user_id, created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'audit_logs' AND policyname = 'audit_logs_service_select'
  ) THEN
    CREATE POLICY audit_logs_service_select ON public.audit_logs
      FOR SELECT TO service_role USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'audit_logs' AND policyname = 'audit_logs_service_insert'
  ) THEN
    CREATE POLICY audit_logs_service_insert ON public.audit_logs
      FOR INSERT TO service_role WITH CHECK (true);
  END IF;
END $$;

-- 6) Tighten additional sensitive table RLS scopes
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'contact_submissions' AND policyname = 'contact_submissions_select_auth'
  ) THEN
    DROP POLICY contact_submissions_select_auth ON public.contact_submissions;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'contact_submissions' AND policyname = 'contact_submissions_update_auth'
  ) THEN
    DROP POLICY contact_submissions_update_auth ON public.contact_submissions;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'contact_submissions' AND policyname = 'contact_submissions_delete_auth'
  ) THEN
    DROP POLICY contact_submissions_delete_auth ON public.contact_submissions;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'contact_submissions' AND policyname = 'contact_submissions_service_select'
  ) THEN
    CREATE POLICY contact_submissions_service_select ON public.contact_submissions
      FOR SELECT TO service_role USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'contact_submissions' AND policyname = 'contact_submissions_service_delete'
  ) THEN
    CREATE POLICY contact_submissions_service_delete ON public.contact_submissions
      FOR DELETE TO service_role USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'anmeldung_submissions' AND policyname = 'anmeldung_submissions_select_auth'
  ) THEN
    DROP POLICY anmeldung_submissions_select_auth ON public.anmeldung_submissions;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'anmeldung_submissions' AND policyname = 'anmeldung_submissions_update_auth'
  ) THEN
    DROP POLICY anmeldung_submissions_update_auth ON public.anmeldung_submissions;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'anmeldung_submissions' AND policyname = 'anmeldung_submissions_delete_auth'
  ) THEN
    DROP POLICY anmeldung_submissions_delete_auth ON public.anmeldung_submissions;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'anmeldung_submissions' AND policyname = 'anmeldung_submissions_service_select'
  ) THEN
    CREATE POLICY anmeldung_submissions_service_select ON public.anmeldung_submissions
      FOR SELECT TO service_role USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'anmeldung_submissions' AND policyname = 'anmeldung_submissions_service_delete'
  ) THEN
    CREATE POLICY anmeldung_submissions_service_delete ON public.anmeldung_submissions
      FOR DELETE TO service_role USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'user_roles_select'
  ) THEN
    DROP POLICY user_roles_select ON public.user_roles;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'user_roles_service_select'
  ) THEN
    CREATE POLICY user_roles_service_select ON public.user_roles
      FOR SELECT TO service_role USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_page_permissions' AND policyname = 'user_page_permissions_select'
  ) THEN
    DROP POLICY user_page_permissions_select ON public.user_page_permissions;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_page_permissions' AND policyname = 'user_page_permissions_service_select'
  ) THEN
    CREATE POLICY user_page_permissions_service_select ON public.user_page_permissions
      FOR SELECT TO service_role USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'pages' AND policyname = 'pages_update_auth'
  ) THEN
    DROP POLICY pages_update_auth ON public.pages;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'pages' AND policyname = 'pages_delete_auth'
  ) THEN
    DROP POLICY pages_delete_auth ON public.pages;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'pages' AND policyname = 'pages_insert_auth'
  ) THEN
    DROP POLICY pages_insert_auth ON public.pages;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'pages' AND policyname = 'pages_service_insert'
  ) THEN
    CREATE POLICY pages_service_insert ON public.pages
      FOR INSERT TO service_role WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'pages' AND policyname = 'pages_service_update'
  ) THEN
    CREATE POLICY pages_service_update ON public.pages
      FOR UPDATE TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'pages' AND policyname = 'pages_service_delete'
  ) THEN
    CREATE POLICY pages_service_delete ON public.pages
      FOR DELETE TO service_role USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'navigation_items' AND policyname = 'navigation_items_insert_auth'
  ) THEN
    DROP POLICY navigation_items_insert_auth ON public.navigation_items;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'navigation_items' AND policyname = 'navigation_items_update_auth'
  ) THEN
    DROP POLICY navigation_items_update_auth ON public.navigation_items;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'navigation_items' AND policyname = 'navigation_items_delete_auth'
  ) THEN
    DROP POLICY navigation_items_delete_auth ON public.navigation_items;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'navigation_items' AND policyname = 'navigation_items_service_insert'
  ) THEN
    CREATE POLICY navigation_items_service_insert ON public.navigation_items
      FOR INSERT TO service_role WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'navigation_items' AND policyname = 'navigation_items_service_update'
  ) THEN
    CREATE POLICY navigation_items_service_update ON public.navigation_items
      FOR UPDATE TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'navigation_items' AND policyname = 'navigation_items_service_delete'
  ) THEN
    CREATE POLICY navigation_items_service_delete ON public.navigation_items
      FOR DELETE TO service_role USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'tags' AND policyname = 'tags_insert_auth'
  ) THEN
    DROP POLICY tags_insert_auth ON public.tags;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'tags' AND policyname = 'tags_update_auth'
  ) THEN
    DROP POLICY tags_update_auth ON public.tags;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'tags' AND policyname = 'tags_delete_auth'
  ) THEN
    DROP POLICY tags_delete_auth ON public.tags;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'tags' AND policyname = 'tags_service_insert'
  ) THEN
    CREATE POLICY tags_service_insert ON public.tags
      FOR INSERT TO service_role WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'tags' AND policyname = 'tags_service_update'
  ) THEN
    CREATE POLICY tags_service_update ON public.tags
      FOR UPDATE TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'tags' AND policyname = 'tags_service_delete'
  ) THEN
    CREATE POLICY tags_service_delete ON public.tags
      FOR DELETE TO service_role USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'event_tags' AND policyname = 'event_tags_insert_auth'
  ) THEN
    DROP POLICY event_tags_insert_auth ON public.event_tags;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'event_tags' AND policyname = 'event_tags_delete_auth'
  ) THEN
    DROP POLICY event_tags_delete_auth ON public.event_tags;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'event_tags' AND policyname = 'event_tags_service_insert'
  ) THEN
    CREATE POLICY event_tags_service_insert ON public.event_tags
      FOR INSERT TO service_role WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'event_tags' AND policyname = 'event_tags_service_delete'
  ) THEN
    CREATE POLICY event_tags_service_delete ON public.event_tags
      FOR DELETE TO service_role USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'document_tags' AND policyname = 'document_tags_insert_auth'
  ) THEN
    DROP POLICY document_tags_insert_auth ON public.document_tags;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'document_tags' AND policyname = 'document_tags_delete_auth'
  ) THEN
    DROP POLICY document_tags_delete_auth ON public.document_tags;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'document_tags' AND policyname = 'document_tags_service_insert'
  ) THEN
    CREATE POLICY document_tags_service_insert ON public.document_tags
      FOR INSERT TO service_role WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'document_tags' AND policyname = 'document_tags_service_delete'
  ) THEN
    CREATE POLICY document_tags_service_delete ON public.document_tags
      FOR DELETE TO service_role USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'post_tags' AND policyname = 'post_tags_insert_auth'
  ) THEN
    DROP POLICY post_tags_insert_auth ON public.post_tags;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'post_tags' AND policyname = 'post_tags_delete_auth'
  ) THEN
    DROP POLICY post_tags_delete_auth ON public.post_tags;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'post_tags' AND policyname = 'post_tags_service_insert'
  ) THEN
    CREATE POLICY post_tags_service_insert ON public.post_tags
      FOR INSERT TO service_role WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'post_tags' AND policyname = 'post_tags_service_delete'
  ) THEN
    CREATE POLICY post_tags_service_delete ON public.post_tags
      FOR DELETE TO service_role USING (true);
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
