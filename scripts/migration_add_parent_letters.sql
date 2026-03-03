-- ============================================================================
-- Migration: Add Parent Letters (Elterninfobriefe)
-- Idempotent: Safe to run multiple times
-- ============================================================================

-- 1. Create the parent_letters table
CREATE TABLE IF NOT EXISTS public.parent_letters (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number        INTEGER NOT NULL,
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  content       JSONB NOT NULL DEFAULT '[]',
  status        TEXT NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft','published')),
  date_from     DATE,
  date_to       DATE,
  author_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_parent_letters_status ON public.parent_letters (status);
CREATE INDEX IF NOT EXISTS idx_parent_letters_number ON public.parent_letters (number);
CREATE INDEX IF NOT EXISTS idx_parent_letters_slug ON public.parent_letters (slug);

-- 3. updated_at trigger
CREATE OR REPLACE FUNCTION public.set_parent_letters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_parent_letters_updated_at ON public.parent_letters;
CREATE TRIGGER trg_parent_letters_updated_at
  BEFORE UPDATE ON public.parent_letters
  FOR EACH ROW
  EXECUTE FUNCTION public.set_parent_letters_updated_at();

-- 4. Function to get the next sequential number
CREATE OR REPLACE FUNCTION public.next_parent_letter_number()
RETURNS INTEGER AS $$
DECLARE
  max_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(number), 0) INTO max_num FROM public.parent_letters;
  RETURN max_num + 1;
END;
$$ LANGUAGE plpgsql;

-- 5. Enable RLS
ALTER TABLE public.parent_letters ENABLE ROW LEVEL SECURITY;

-- Public can SELECT published letters
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'parent_letters_public_select' AND tablename = 'parent_letters') THEN
    CREATE POLICY parent_letters_public_select ON public.parent_letters
      FOR SELECT TO anon
      USING (status = 'published');
  END IF;
END $$;

-- Authenticated users can SELECT all
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'parent_letters_auth_select' AND tablename = 'parent_letters') THEN
    CREATE POLICY parent_letters_auth_select ON public.parent_letters
      FOR SELECT TO authenticated
      USING (true);
  END IF;
END $$;

-- Authenticated users can INSERT
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'parent_letters_auth_insert' AND tablename = 'parent_letters') THEN
    CREATE POLICY parent_letters_auth_insert ON public.parent_letters
      FOR INSERT TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Authenticated users can UPDATE
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'parent_letters_auth_update' AND tablename = 'parent_letters') THEN
    CREATE POLICY parent_letters_auth_update ON public.parent_letters
      FOR UPDATE TO authenticated
      USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Authenticated users can DELETE
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'parent_letters_auth_delete' AND tablename = 'parent_letters') THEN
    CREATE POLICY parent_letters_auth_delete ON public.parent_letters
      FOR DELETE TO authenticated
      USING (true);
  END IF;
END $$;
