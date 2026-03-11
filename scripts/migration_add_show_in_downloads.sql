-- ============================================================================
-- Migration: Add show_in_downloads flag to documents table
--
-- Background:
--   Previously, every file uploaded via the CMS Image-Picker was automatically
--   stored in the `documents` table with status='published', which caused all
--   uploaded images to appear on the public Downloads page — even images that
--   were only intended as inline media for blog posts or page content.
--
-- Solution:
--   A new boolean column `show_in_downloads` explicitly controls whether a
--   document appears on the public Downloads page. Defaults to FALSE so that
--   newly uploaded media (e.g., images for blog posts) are NOT shown on the
--   Downloads page unless an admin actively enables the flag.
--
-- Retroactive behaviour:
--   • Existing non-image documents (PDFs, Word files, etc.) are assumed to
--     have been intentionally uploaded as downloads → set to TRUE.
--   • Existing image files (file_type LIKE 'image/%') are assumed to have
--     been uploaded as inline media → remain FALSE (hidden from Downloads).
--
-- All statements are idempotent and safe to re-run.
-- ============================================================================

-- 1. Add the column (no-op if it already exists)
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS show_in_downloads BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Back-fill: mark existing non-image documents as downloads
--    (file_type IS NULL covers legacy rows without a detected MIME type)
UPDATE public.documents
SET show_in_downloads = TRUE
WHERE show_in_downloads = FALSE
  AND (file_type IS NULL OR file_type NOT LIKE 'image/%');

-- 3. Partial index to speed up the Downloads-page query
CREATE INDEX IF NOT EXISTS idx_documents_show_in_downloads
  ON public.documents (show_in_downloads)
  WHERE show_in_downloads = TRUE;

-- 4. Add a comment so future developers understand the column's purpose
COMMENT ON COLUMN public.documents.show_in_downloads IS
  'When TRUE the document is listed on the public Downloads page. '
  'Images uploaded purely as inline media should remain FALSE.';
