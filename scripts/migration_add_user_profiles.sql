-- ============================================================================
-- Migration: Add User Profiles Table for Teacher Management
-- ============================================================================
-- This migration creates a user_profiles table to store extended information
-- about teachers (name, title, profile picture) beyond what Supabase Auth provides
-- ============================================================================

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  title TEXT, -- e.g., "Dr.", "Prof. Dr.", etc.
  profile_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
-- Anyone can view profiles (for displaying author info on posts)
CREATE POLICY "user_profiles_select_all" ON public.user_profiles
  FOR SELECT USING (true);

-- Users can only insert their own profile
CREATE POLICY "user_profiles_insert_own" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "user_profiles_update_own" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own profile
CREATE POLICY "user_profiles_delete_own" ON public.user_profiles
  FOR DELETE USING (auth.uid() = user_id);
