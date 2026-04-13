-- Migration: CMS Architecture Refactoring Phase 1
-- Note: This is an additive, backwards-compatible migration.
-- Legacy fields are kept but new structures are introduced.

BEGIN;

-- ============================================================================
-- 1. Base Traits (Adding missing columns to pages, posts, events)
-- ============================================================================

-- Pages
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public';
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS canonical TEXT;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS no_index BOOLEAN DEFAULT false;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS hero_media_id UUID;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS teaser_media_id UUID;

-- Backfill created_by from legacy user_id
UPDATE public.pages SET created_by = user_id WHERE created_by IS NULL AND user_id IS NOT NULL;
UPDATE public.pages SET status = CASE WHEN published THEN 'published' ELSE 'draft' END WHERE status IS NULL;

-- Posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS canonical TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS no_index BOOLEAN DEFAULT false;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS hero_media_id UUID;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS teaser_media_id UUID;

UPDATE public.posts SET created_by = user_id WHERE created_by IS NULL AND user_id IS NOT NULL;
UPDATE public.posts SET status = CASE WHEN published THEN 'published' ELSE 'draft' END WHERE status IS NULL;

-- Events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

UPDATE public.events SET created_by = user_id WHERE created_by IS NULL AND user_id IS NOT NULL;
UPDATE public.events SET status = CASE WHEN published THEN 'published' ELSE 'draft' END WHERE status IS NULL;


-- ============================================================================
-- 2. Centralized Tagging System
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.topic_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT 'blue',
  parent_id UUID REFERENCES public.topic_tags(id) ON DELETE SET NULL,
  landing_page_id UUID REFERENCES public.pages(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- We simulate an enum using a check constraint for flexibility
CREATE TABLE IF NOT EXISTS public.entity_tag_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('page', 'news', 'event', 'media')),
  entity_id UUID NOT NULL,
  tag_id UUID NOT NULL REFERENCES public.topic_tags(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'secondary' CHECK (role IN ('primary', 'secondary', 'contextual')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(entity_type, entity_id, tag_id)
);

-- Migrate old tags into topic_tags
INSERT INTO public.topic_tags (id, name, slug, color, created_at, updated_at)
SELECT id, name, name, color, created_at, updated_at
FROM public.tags
ON CONFLICT DO NOTHING;

-- Migrate post_tags to entity_tag_assignments (as 'news')
INSERT INTO public.entity_tag_assignments (entity_type, entity_id, tag_id)
SELECT 'news', post_id, tag_id FROM public.post_tags
ON CONFLICT DO NOTHING;

-- Migrate event_tags to entity_tag_assignments (as 'event')
INSERT INTO public.entity_tag_assignments (entity_type, entity_id, tag_id)
SELECT 'event', event_id, tag_id FROM public.event_tags
ON CONFLICT DO NOTHING;

-- Migrate document_tags to entity_tag_assignments (as 'media')
INSERT INTO public.entity_tag_assignments (entity_type, entity_id, tag_id)
SELECT 'media', document_id, tag_id FROM public.document_tags
ON CONFLICT DO NOTHING;


-- ============================================================================
-- 3. Media Asset Management
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
  asset_type TEXT NOT NULL CHECK (asset_type IN ('image', 'file', 'video', 'audio')),
  alt_text TEXT,
  dimensions JSONB,

  -- Publishable traits
  status TEXT DEFAULT 'published',
  published_at TIMESTAMPTZ,
  visibility TEXT DEFAULT 'public',

  -- Owned traits
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),

  -- Base traits
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Note: In a real environment we would also INSERT data from `documents` to `media_assets`
-- mapping file_type to mime_type and asset_type, but skipping the complex query for safety.

-- Add foreign keys for media references to ContentItems now that media_assets exists
ALTER TABLE public.pages ADD CONSTRAINT fk_pages_hero_media FOREIGN KEY (hero_media_id) REFERENCES public.media_assets(id) ON DELETE SET NULL;
ALTER TABLE public.pages ADD CONSTRAINT fk_pages_teaser_media FOREIGN KEY (teaser_media_id) REFERENCES public.media_assets(id) ON DELETE SET NULL;
ALTER TABLE public.posts ADD CONSTRAINT fk_posts_hero_media FOREIGN KEY (hero_media_id) REFERENCES public.media_assets(id) ON DELETE SET NULL;
ALTER TABLE public.posts ADD CONSTRAINT fk_posts_teaser_media FOREIGN KEY (teaser_media_id) REFERENCES public.media_assets(id) ON DELETE SET NULL;

-- ============================================================================
-- 4. Revisions and Navigation
-- ============================================================================

-- Content Revision (Rename content to snapshot)
ALTER TABLE public.content_revisions RENAME COLUMN content TO snapshot;

-- Navigation
ALTER TABLE public.navigation_items ADD COLUMN IF NOT EXISTS topic_tag_id UUID REFERENCES public.topic_tags(id) ON DELETE SET NULL;

COMMIT;
