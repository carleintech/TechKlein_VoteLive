-- ============================================
-- SEED CANDIDATE DATA
-- ============================================
-- Auto-generated for project: avpgqqpsgswmpermjopm
-- Generated: 2025-11-06T18:55:20.855Z

-- Clear existing data (dev only - remove for production)
TRUNCATE TABLE public.candidate_meta CASCADE;
TRUNCATE TABLE public.candidates RESTART IDENTITY CASCADE;

-- Insert all 48 candidates (47 original + Guy Philippe)
INSERT INTO public.candidates (name, slug, photo_url, party, motto) VALUES
('Jude Célestin', 'jude-celestin', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/jude-celestin.jpg', 'LAPEH', 'Stability Through Experience'),
('Jocelerme Privert', 'jocelerme-privert', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/jocelerme-privert.jpg', 'Independent', 'Unity and Progress'),
('Jean Michel Lapin', 'jean-michel-lapin', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/jean-michel-lapin.jpg', 'Independent', 'Competence and Integrity'),
('Olivier Barrau', 'olivier-barrau', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/olivier-barrau.jpg', 'Independent', NULL),
('Jacky Lumarque', 'jacky-lumarque', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/jacky-lumarque.jpg', 'Independent', NULL),
('Pasteur Dieupie Chérubin', 'pasteur-dieupie-cherubin', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/pasteur-dieupie-cherubin.jpg', 'Religious Coalition', 'Faith and Action'),
('Kelly Bastien', 'kelly-bastien', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/kelly-bastien.jpg', 'Independent', NULL),
('Joseph Milcent Paul Doirin', 'joseph-milcent-paul-doirin', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/joseph-milcent-paul-doirin.jpg', 'Independent', NULL),
('Evel Fanfan', 'evel-fanfan', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/evel-fanfan.jpg', 'Independent', NULL),
('Walsonn Sanon', 'walsonn-sanon', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/walsonn-sanon.jpg', 'Independent', NULL),
('Clarens Renoit', 'clarens-renoit', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/clarens-renoit.jpg', 'Renmen Ayiti', 'Love Haiti'),
('Jean-Rodolphe Joazil', 'jean-rodolphe-joazil', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/jean-rodolphe-joazil.jpg', 'Independent', NULL),
('Moïse Jean-Charles', 'moise-jean-charles', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/moise-jean-charles.jpg', 'Pitit Dessalines', 'Power to the People'),
('Jean Renel Sénatus', 'jean-renel-senatus', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/jean-renel-senatus.jpg', 'Independent', NULL),
('Etzer Emile', 'etzer-emile', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/etzer-emile.jpg', 'Independent', NULL),
('Claude Joseph', 'claude-joseph', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/claude-joseph.jpg', 'Independent', 'Security and Development'),
('Acao Rilnor', 'acao-rilnor', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/acao-rilnor.jpg', 'Independent', NULL),
('Pasteur Bernier Lauredan', 'pasteur-bernier-lauredan', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/pasteur-bernier-lauredan.jpg', 'Religious Coalition', NULL),
('Yvon Bonhomme', 'yvon-bonhomme', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/yvon-bonhomme.jpg', 'Independent', NULL),
('Major Lener Renauld', 'major-lener-renauld', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/major-lener-renauld.jpg', 'Independent', 'Discipline and Order'),
('Joanas Gué', 'joanas-gue', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/joanas-gue.jpg', 'Independent', NULL),
('Père Jean Miguel Auguste', 'pere-jean-miguel-auguste', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/pere-jean-miguel-auguste.jpg', 'Religious Coalition', NULL),
('Wilson Jeudy', 'wilson-jeudy', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/wilson-jeudy.jpg', 'Independent', NULL),
('Jean Paul Toussaint', 'jean-paul-toussaint', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/jean-paul-toussaint.jpg', 'Independent', NULL),
('Ginette Chérubin', 'ginette-cherubin', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/ginette-cherubin.jpg', 'Independent', 'Women''s Empowerment'),
('Robert Denis', 'robert-denis', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/robert-denis.jpg', 'Independent', NULL),
('Martine Moïse', 'martine-moise', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/martine-moise.jpg', 'PHTK', 'Continue the Vision'),
('Lyonel Valbrun', 'lyonel-valbrun', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/lyonel-valbrun.jpg', 'Independent', NULL),
('Dunois Erick Cantave', 'dunois-erick-cantave', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/dunois-erick-cantave.jpg', 'Independent', NULL),
('Henry Emmanuel Saturné', 'henry-emmanuel-saturne', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/henry-emmanuel-saturne.jpg', 'Independent', NULL),
('Jean Renald Lubérice', 'jean-renald-luberice', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/jean-renald-luberice.jpg', 'Independent', NULL),
('Edo Zenny', 'edo-zenny', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/edo-zenny.jpg', 'AAA', NULL),
('Déus Déronneth', 'deus-deronneth', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/deus-deronneth.jpg', 'Independent', NULL),
('Pasteur Julio Volcy', 'pasteur-julio-volcy', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/pasteur-julio-volcy.jpg', 'Religious Coalition', NULL),
('Ronsard St-Cyr', 'ronsard-st-cyr', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/ronsard-st-cyr.jpg', 'Independent', NULL),
('Samuel Madistin', 'samuel-madistin', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/samuel-madistin.jpg', 'Fusion', NULL),
('Anthony Dessources', 'anthony-dessources', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/anthony-dessources.jpg', 'Independent', NULL),
('Jerry Tardieu', 'jerry-tardieu', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/jerry-tardieu.jpg', 'AAA', 'Accountability and Action'),
('Jacques Thimoléon', 'jacques-thimoleon', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/jacques-thimoleon.jpg', 'Independent', NULL),
('Nesmy Manigat', 'nesmy-manigat', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/nesmy-manigat.jpg', 'RDNP', 'Democratic Renewal'),
('Dickenson Lorthé Blema', 'dickenson-lorthe-blema', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/dickenson-lorthe-blema.jpg', 'Independent', NULL),
('Jacques Sauveur Jean', 'jacques-sauveur-jean', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/jacques-sauveur-jean.jpg', 'Independent', NULL),
('Steeve Khawly', 'steeve-khawly', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/steeve-khawly.jpg', 'Independent', NULL),
('Wilner Valcin', 'wilner-valcin', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/wilner-valcin.jpg', 'Independent', NULL),
('Evaliè̀re Beauplan', 'evaliere-beauplan', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/evaliere-beauplan.jpg', 'Independent', 'Women Leading Change'),
('Commissaire Jean Ernst Muscadin', 'commissaire-jean-ernst-muscadin', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/commissaire-jean-ernst-muscadin.jpg', 'Independent', 'Law and Order'),
('Michel Soukar', 'michel-soukar', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/michel-soukar.jpg', 'Independent', NULL),
('Guy Philippe', 'guy-philippe', 'https://avpgqqpsgswmpermjopm.supabase.co/storage/v1/object/public/candidates/guy-philippe.jpg', 'Independent', NULL);

-- Verify the count
DO $$
DECLARE
  candidate_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO candidate_count FROM public.candidates;
  RAISE NOTICE 'Successfully inserted % candidates', candidate_count;
  
  IF candidate_count != 48 THEN
    RAISE EXCEPTION 'Expected 48 candidates but found %', candidate_count;
  END IF;
END $$;
