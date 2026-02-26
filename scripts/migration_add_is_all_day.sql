-- Add is_all_day column to support multi-day (all-day) events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_all_day BOOLEAN NOT NULL DEFAULT false;
