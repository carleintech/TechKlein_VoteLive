-- Migration 009: Add email columns to private_voter_records table
-- Purpose: Support email verification in addition to phone verification

-- Make normalized_phone nullable (was NOT NULL before)
ALTER TABLE public.private_voter_records
ALTER COLUMN normalized_phone DROP NOT NULL;

-- Add email columns to private_voter_records
ALTER TABLE public.private_voter_records
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS normalized_email TEXT,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMPTZ;

-- Drop old unique constraint that only works for phone
ALTER TABLE public.private_voter_records
DROP CONSTRAINT IF EXISTS private_voter_records_normalized_first_name_normalized_last_nam_key;

-- Add new unique constraints for both verification methods
CREATE UNIQUE INDEX IF NOT EXISTS idx_voter_unique_phone
ON public.private_voter_records(normalized_first_name, normalized_last_name, date_of_birth, normalized_phone)
WHERE normalized_phone IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_voter_unique_email
ON public.private_voter_records(normalized_first_name, normalized_last_name, date_of_birth, normalized_email)
WHERE normalized_email IS NOT NULL;

-- Add index for email lookups
CREATE INDEX IF NOT EXISTS idx_private_voter_records_email 
ON public.private_voter_records(normalized_email) 
WHERE normalized_email IS NOT NULL;

-- Add check constraint to ensure either phone or email is provided
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'check_phone_or_email' 
    AND conrelid = 'public.private_voter_records'::regclass
  ) THEN
    ALTER TABLE public.private_voter_records
    ADD CONSTRAINT check_phone_or_email 
    CHECK (normalized_phone IS NOT NULL OR normalized_email IS NOT NULL);
  END IF;
END $$;

COMMENT ON COLUMN public.private_voter_records.email IS 'Original email address (for email verification method)';
COMMENT ON COLUMN public.private_voter_records.normalized_email IS 'Lowercase email for duplicate detection';
COMMENT ON COLUMN public.private_voter_records.email_verified_at IS 'Timestamp when email was verified via OTP';
COMMENT ON COLUMN public.private_voter_records.phone_verified_at IS 'Timestamp when phone was verified via OTP';
