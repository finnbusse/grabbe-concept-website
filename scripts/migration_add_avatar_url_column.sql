-- ============================================================================
-- Migration: Ensure avatar_url column exists in user_profiles
-- Purpose: Fix for databases where user_profiles was created before avatar_url was added
-- Note: CREATE TABLE IF NOT EXISTS does NOT add columns to existing tables
-- ============================================================================

ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
