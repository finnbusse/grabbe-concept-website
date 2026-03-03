-- ============================================================================
-- Migration: Add Presentations (Präsentationen)
-- Idempotent: Safe to run multiple times
-- ============================================================================

-- 1. Create the presentations table
CREATE TABLE IF NOT EXISTS public.presentations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title               TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  subtitle            TEXT,
  blocks              JSONB NOT NULL DEFAULT '[]',
  status              TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft','published')),
  show_on_aktuelles   BOOLEAN NOT NULL DEFAULT true,
  tag_ids             UUID[] DEFAULT '{}',
  cover_image_url     TEXT,
  meta_description    TEXT,
  seo_og_image        TEXT,
  author_id           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_presentations_status ON public.presentations (status);
CREATE INDEX IF NOT EXISTS idx_presentations_slug ON public.presentations (slug);
CREATE INDEX IF NOT EXISTS idx_presentations_show_on_aktuelles ON public.presentations (show_on_aktuelles);

-- 3. updated_at trigger
CREATE OR REPLACE FUNCTION public.set_presentations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_presentations_updated_at ON public.presentations;
CREATE TRIGGER trg_presentations_updated_at
  BEFORE UPDATE ON public.presentations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_presentations_updated_at();

-- 4. Enable RLS
ALTER TABLE public.presentations ENABLE ROW LEVEL SECURITY;

-- Public can SELECT published presentations
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'presentations_public_select' AND tablename = 'presentations') THEN
    CREATE POLICY presentations_public_select ON public.presentations
      FOR SELECT TO anon
      USING (status = 'published');
  END IF;
END $$;

-- Authenticated users can SELECT all
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'presentations_auth_select' AND tablename = 'presentations') THEN
    CREATE POLICY presentations_auth_select ON public.presentations
      FOR SELECT TO authenticated
      USING (true);
  END IF;
END $$;

-- Authenticated users can INSERT
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'presentations_auth_insert' AND tablename = 'presentations') THEN
    CREATE POLICY presentations_auth_insert ON public.presentations
      FOR INSERT TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Authenticated users can UPDATE
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'presentations_auth_update' AND tablename = 'presentations') THEN
    CREATE POLICY presentations_auth_update ON public.presentations
      FOR UPDATE TO authenticated
      USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Authenticated users can DELETE
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'presentations_auth_delete' AND tablename = 'presentations') THEN
    CREATE POLICY presentations_auth_delete ON public.presentations
      FOR DELETE TO authenticated
      USING (true);
  END IF;
END $$;
