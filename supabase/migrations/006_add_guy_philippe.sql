-- ============================================
-- ADD GUY PHILIPPE CANDIDATE
-- ============================================
-- Date: 2025-11-07
-- Adding Guy Philippe as candidate #48

-- Insert Guy Philippe
INSERT INTO public.candidates (name, slug, photo_url, party, motto) VALUES
('Guy Philippe', 'guy-philippe', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/guy-philippe.jpg', 'Independent', NULL);

-- Verify the candidate was added
DO $$
DECLARE
  candidate_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.candidates WHERE slug = 'guy-philippe'
  ) INTO candidate_exists;
  
  IF candidate_exists THEN
    RAISE NOTICE 'Successfully added Guy Philippe as candidate';
  ELSE
    RAISE EXCEPTION 'Failed to add Guy Philippe';
  END IF;
END $$;
