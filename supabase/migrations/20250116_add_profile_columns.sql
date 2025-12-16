-- Add missing columns to profiles table
DO $$
BEGIN
  -- Add phone column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN phone TEXT;
    RAISE NOTICE 'Added phone column to profiles table';
  END IF;

  -- Add coach_code column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'coach_code'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN coach_code TEXT;
    RAISE NOTICE 'Added coach_code column to profiles table';
  END IF;
END$$;
