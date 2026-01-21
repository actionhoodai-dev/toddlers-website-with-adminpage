-- ================================================
-- CMS ENHANCEMENT MIGRATION SCRIPT
-- Phase 1: Database Schema Updates
-- ================================================
-- IMPORTANT: DO NOT modify gallery table or related structures
-- ================================================

-- ================================================
-- 1. EXTEND SITE_SETTINGS TABLE (Contact Information)
-- ================================================

ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS phone_primary VARCHAR(50),
ADD COLUMN IF NOT EXISTS phone_secondary VARCHAR(50),
ADD COLUMN IF NOT EXISTS phone_tertiary VARCHAR(50),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(50);

-- Populate with existing hard-coded values
UPDATE site_settings SET
  address = 'No.74, North Park street, Gobichettipalayam, Erode District, Pin: 638452',
  phone_primary = '9597744300',
  phone_secondary = '9865935809',
  phone_tertiary = '9677638738',
  email = 'toddlersmstc@gmail.com',
  whatsapp_number = '919597744300'
WHERE id = 1;

-- ================================================
-- 2. CREATE SERVICES TABLE
-- ================================================

CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for services
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at DESC);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view services" ON services;
DROP POLICY IF EXISTS "Authenticated users can insert services" ON services;
DROP POLICY IF EXISTS "Authenticated users can update services" ON services;
DROP POLICY IF EXISTS "Authenticated users can delete services" ON services;

-- Create RLS policies for services
CREATE POLICY "Public can view services" ON services
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert services" ON services
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update services" ON services
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete services" ON services
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger for services updated_at
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 3. CREATE CLINICAL CONDITIONS TABLE
-- ================================================

CREATE TABLE IF NOT EXISTS clinical_conditions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(50),
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for clinical_conditions
CREATE INDEX IF NOT EXISTS idx_conditions_slug ON clinical_conditions(slug);
CREATE INDEX IF NOT EXISTS idx_conditions_category ON clinical_conditions(category);
CREATE INDEX IF NOT EXISTS idx_conditions_order ON clinical_conditions(display_order);
CREATE INDEX IF NOT EXISTS idx_conditions_created_at ON clinical_conditions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE clinical_conditions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view conditions" ON clinical_conditions;
DROP POLICY IF EXISTS "Authenticated users can insert conditions" ON clinical_conditions;
DROP POLICY IF EXISTS "Authenticated users can update conditions" ON clinical_conditions;
DROP POLICY IF EXISTS "Authenticated users can delete conditions" ON clinical_conditions;

-- Create RLS policies for clinical_conditions
CREATE POLICY "Public can view conditions" ON clinical_conditions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert conditions" ON clinical_conditions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update conditions" ON clinical_conditions
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete conditions" ON clinical_conditions
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger for clinical_conditions updated_at
DROP TRIGGER IF EXISTS update_conditions_updated_at ON clinical_conditions;
CREATE TRIGGER update_conditions_updated_at
  BEFORE UPDATE ON clinical_conditions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 4. MIGRATE EXISTING SERVICES DATA
-- ================================================

-- Insert existing 4 services (from app/services/page.tsx)
INSERT INTO services (title, slug, short_description, full_description, display_order)
VALUES 
(
  'Occupational therapy',
  'occupational-therapy',
  'Occupational therapy helps individuals of all ages develop, maintain, or regain the skills needed for daily living and work.',
  E'## What is Occupational Therapy?\n\nOccupational therapy helps individuals of all ages develop, maintain, or regain the skills needed for daily living and work.\n\n## Key Benefits\n\n- Helps develop motor skills and hand-eye coordination\n- Assists in improving self-care abilities\n- Supports work-related skill development\n- Addresses sensory processing issues\n- Promotes independence and quality of life',
  1
),
(
  'Physical therapy',
  'physical-therapy',
  'Physical therapy focuses on restoring mobility, strength, and function through evidence-based rehabilitation techniques.',
  E'## What is Physical Therapy?\n\nPhysical therapy focuses on restoring mobility, strength, and function through evidence-based rehabilitation techniques.\n\n## Key Benefits\n\n- Improves muscle strength and flexibility\n- Restores mobility and range of motion\n- Reduces pain and inflammation\n- Prevents further injury or disability\n- Supports recovery after injury or surgery',
  2
),
(
  'Special education',
  'special-education',
  'Special education provides customized learning programs for children with developmental and cognitive challenges.',
  E'## What is Special Education?\n\nSpecial education provides customized learning programs for children with developmental and cognitive challenges.\n\n## Key Benefits\n\n- Personalized learning plans\n- Small group and individual sessions\n- Focus on academic and life skills\n- Collaboration with families and therapists\n- Continuous progress monitoring',
  3
),
(
  'Speech therapy',
  'speech-therapy',
  'Speech therapy addresses communication and swallowing disorders with specialized interventions.',
  E'## What is Speech Therapy?\n\nSpeech therapy addresses communication and swallowing disorders with specialized interventions.\n\n## Key Benefits\n\n- Speech and language development\n- Articulation and pronunciation improvement\n- Voice and fluency enhancement\n- Swallowing and feeding support\n- Communication strategies and aids',
  4
)
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- 5. MIGRATE EXISTING CLINICAL CONDITIONS DATA
-- ================================================

-- Insert existing 26 conditions (from app/conditions/page.tsx)
-- NOTE: Initially inserted WITHOUT descriptions (admin can add later)
INSERT INTO clinical_conditions (name, slug, category, display_order)
VALUES 
-- Pediatric conditions
('Autism', 'autism', 'Pediatric', 1),
('Attention deficit hyperactivity disorder', 'adhd', 'Pediatric', 2),
('Dyslexia', 'dyslexia', 'Pediatric', 3),
('Developmental delay', 'developmental-delay', 'Pediatric', 4),
('Cerebral palsy', 'cerebral-palsy', 'Pediatric', 5),
('Intellectual disabilities', 'intellectual-disabilities', 'Pediatric', 6),
('Dysgraphia', 'dysgraphia', 'Pediatric', 7),
('Dyscalculia', 'dyscalculia', 'Pediatric', 8),
('Behavioural problems', 'behavioural-problems', 'Pediatric', 9),

-- Adult conditions
('Stroke', 'stroke', 'Adult', 10),
('Memory impairments', 'memory-impairments', 'Adult', 11),
('Hand functions impairments', 'hand-functions-impairments', 'Adult', 12),
('Pain', 'pain', 'Adult', 13),
('Stress', 'stress', 'Adult', 14),
('Suicidal idea', 'suicidal-idea', 'Adult', 15),
('Depression', 'depression', 'Adult', 16),
('Brain injury', 'brain-injury', 'Adult', 17),
('Schizophrenia', 'schizophrenia', 'Adult', 18),
('Alcohol and Drug use disorders', 'alcohol-drug-disorders', 'Adult', 19),
('Addictions', 'addictions', 'Adult', 20)
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

-- Check if all tables exist
SELECT 
  table_name,
  EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = table_name
  ) as exists
FROM (VALUES 
  ('services'),
  ('clinical_conditions'),
  ('site_settings')
) AS t(table_name);

-- Check row counts
SELECT 'services' as table_name, COUNT(*) as row_count FROM services
UNION ALL
SELECT 'clinical_conditions', COUNT(*) FROM clinical_conditions
UNION ALL
SELECT 'site_settings', COUNT(*) FROM site_settings;

-- Verify site_settings has contact info
SELECT 
  id, 
  address, 
  phone_primary, 
  phone_secondary, 
  phone_tertiary, 
  email, 
  whatsapp_number 
FROM site_settings 
WHERE id = 1;

-- Verify services
SELECT id, title, slug, 
  CASE WHEN full_description IS NOT NULL AND LENGTH(TRIM(full_description)) > 0 
    THEN 'Has Detail Page' 
    ELSE 'No Detail Page' 
  END as page_status
FROM services 
ORDER BY display_order;

-- Verify clinical conditions
SELECT id, name, category, 
  CASE WHEN description IS NOT NULL AND LENGTH(TRIM(description)) > 0 
    THEN 'Has Detail Page' 
    ELSE 'No Detail Page' 
  END as page_status
FROM clinical_conditions 
ORDER BY display_order;

-- ================================================
-- MIGRATION COMPLETE!
-- ================================================
-- Next Steps:
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify all tables and data
-- 3. Implement admin pages
-- 4. Update user-facing pages
-- ================================================
