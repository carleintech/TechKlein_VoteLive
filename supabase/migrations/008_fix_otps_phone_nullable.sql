-- ============================================
-- FIX: Make phone column nullable in private_otps
-- ============================================
-- Date: 2025-11-08
-- The phone column needs to be nullable to support email verification

-- Make phone column nullable
ALTER TABLE public.private_otps
ALTER COLUMN phone DROP NOT NULL;

-- Verify changes
DO $$
BEGIN
  RAISE NOTICE 'Successfully made phone column nullable in private_otps table';
END $$;
