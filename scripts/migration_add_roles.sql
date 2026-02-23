-- ============================================================================
-- Migration: Add Role-Based Access Control (RBAC)
-- Idempotent: Safe to run multiple times
-- ============================================================================

-- 1. Role definitions (predefined + custom)
CREATE TABLE IF NOT EXISTS public.cms_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_system BOOLEAN DEFAULT false,
  permissions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User role assignments
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.cms_roles(id) ON DELETE CASCADE,
  UNIQUE(user_id, role_id)
);

-- 3. Per-user page access assignments
CREATE TABLE IF NOT EXISTS public.user_page_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_type TEXT NOT NULL CHECK (page_type IN ('editable', 'cms')),
  page_id TEXT NOT NULL,
  UNIQUE(user_id, page_type, page_id)
);

-- ============================================================================
-- Seed system roles (idempotent via ON CONFLICT)
-- ============================================================================

INSERT INTO public.cms_roles (name, slug, is_system, permissions) VALUES
(
  'Administrator',
  'administrator',
  true,
  '{
    "posts": { "create": true, "edit": "all", "delete": "all", "publish": true },
    "events": { "create": true, "edit": "all", "delete": "all", "publish": true },
    "pages": { "edit": true },
    "documents": { "upload": true, "delete": "all" },
    "settings": { "basic": true, "advanced": true, "seo": true },
    "navigation": true,
    "seitenstruktur": true,
    "seitenEditor": true,
    "users": { "view": true, "create": true, "delete": true, "assignRoles": true },
    "tags": true,
    "messages": true,
    "anmeldungen": true,
    "diagnostic": true,
    "roles": { "view": true, "create": true, "edit": true, "delete": true }
  }'::jsonb
),
(
  'Schulleitung',
  'schulleitung',
  true,
  '{
    "posts": { "create": true, "edit": "all", "delete": "all", "publish": true },
    "events": { "create": true, "edit": "all", "delete": "all", "publish": true },
    "pages": { "edit": true },
    "documents": { "upload": true, "delete": "all" },
    "settings": { "basic": true, "advanced": false, "seo": false },
    "navigation": false,
    "seitenstruktur": false,
    "seitenEditor": true,
    "users": { "view": true, "create": true, "delete": true, "assignRoles": true },
    "tags": true,
    "messages": true,
    "anmeldungen": true,
    "diagnostic": true,
    "roles": { "view": true, "create": true, "edit": true, "delete": true }
  }'::jsonb
),
(
  'Lehrer',
  'lehrer',
  true,
  '{
    "posts": { "create": true, "edit": "own", "delete": "own", "publish": true },
    "events": { "create": true, "edit": "own", "delete": "own", "publish": true },
    "pages": { "edit": false },
    "documents": { "upload": true, "delete": "own" },
    "settings": { "basic": false, "advanced": false, "seo": false },
    "navigation": false,
    "seitenstruktur": false,
    "seitenEditor": false,
    "users": { "view": false, "create": false, "delete": false, "assignRoles": false },
    "tags": false,
    "messages": false,
    "anmeldungen": false,
    "diagnostic": false,
    "roles": { "view": false, "create": false, "edit": false, "delete": false }
  }'::jsonb
),
(
  'Benutzerdefiniert',
  'benutzerdefiniert',
  true,
  '{
    "posts": { "create": false, "edit": false, "delete": false, "publish": false },
    "events": { "create": false, "edit": false, "delete": false, "publish": false },
    "pages": { "edit": false },
    "documents": { "upload": false, "delete": false },
    "settings": { "basic": false, "advanced": false, "seo": false },
    "navigation": false,
    "seitenstruktur": false,
    "seitenEditor": false,
    "users": { "view": false, "create": false, "delete": false, "assignRoles": false },
    "tags": false,
    "messages": false,
    "anmeldungen": false,
    "diagnostic": false,
    "roles": { "view": false, "create": false, "edit": false, "delete": false }
  }'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- Assign existing users to Administrator role (first migration safety)
-- ============================================================================

INSERT INTO public.user_roles (user_id, role_id)
SELECT u.id, r.id
FROM auth.users u
CROSS JOIN public.cms_roles r
WHERE r.slug = 'administrator'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur WHERE ur.user_id = u.id
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE public.cms_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_page_permissions ENABLE ROW LEVEL SECURITY;

-- cms_roles: all authenticated users can read
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'cms_roles_select' AND tablename = 'cms_roles') THEN
    CREATE POLICY cms_roles_select ON public.cms_roles FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- cms_roles: only service role can insert/update/delete (via admin client)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'cms_roles_insert' AND tablename = 'cms_roles') THEN
    CREATE POLICY cms_roles_insert ON public.cms_roles FOR INSERT TO service_role WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'cms_roles_update' AND tablename = 'cms_roles') THEN
    CREATE POLICY cms_roles_update ON public.cms_roles FOR UPDATE TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'cms_roles_delete' AND tablename = 'cms_roles') THEN
    CREATE POLICY cms_roles_delete ON public.cms_roles FOR DELETE TO service_role USING (true);
  END IF;
END $$;

-- user_roles: authenticated users can read all (needed for sidebar/permission checks)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_roles_select' AND tablename = 'user_roles') THEN
    CREATE POLICY user_roles_select ON public.user_roles FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- user_roles: only service role can modify
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_roles_insert' AND tablename = 'user_roles') THEN
    CREATE POLICY user_roles_insert ON public.user_roles FOR INSERT TO service_role WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_roles_update' AND tablename = 'user_roles') THEN
    CREATE POLICY user_roles_update ON public.user_roles FOR UPDATE TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_roles_delete' AND tablename = 'user_roles') THEN
    CREATE POLICY user_roles_delete ON public.user_roles FOR DELETE TO service_role USING (true);
  END IF;
END $$;

-- user_page_permissions: authenticated users can read all
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_page_permissions_select' AND tablename = 'user_page_permissions') THEN
    CREATE POLICY user_page_permissions_select ON public.user_page_permissions FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- user_page_permissions: only service role can modify
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_page_permissions_insert' AND tablename = 'user_page_permissions') THEN
    CREATE POLICY user_page_permissions_insert ON public.user_page_permissions FOR INSERT TO service_role WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_page_permissions_update' AND tablename = 'user_page_permissions') THEN
    CREATE POLICY user_page_permissions_update ON public.user_page_permissions FOR UPDATE TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_page_permissions_delete' AND tablename = 'user_page_permissions') THEN
    CREATE POLICY user_page_permissions_delete ON public.user_page_permissions FOR DELETE TO service_role USING (true);
  END IF;
END $$;
