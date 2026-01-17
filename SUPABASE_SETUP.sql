-- ================================================
-- COMPLETE SUPABASE SETUP SCRIPT
-- For: Toddlers Website Admin Panel
-- Run this in: Supabase SQL Editor
-- ================================================

-- ================================================
-- 1. CREATE GALLERY TABLE
-- ================================================

CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at DESC);

-- Enable Row Level Security
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view gallery items" ON gallery;
DROP POLICY IF EXISTS "Authenticated users can insert gallery items" ON gallery;
DROP POLICY IF EXISTS "Authenticated users can update gallery items" ON gallery;
DROP POLICY IF EXISTS "Authenticated users can delete gallery items" ON gallery;

-- Create RLS policies
CREATE POLICY "Public can view gallery items" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert gallery items" ON gallery
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update gallery items" ON gallery
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete gallery items" ON gallery
  FOR DELETE USING (auth.role() = 'authenticated');

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for gallery
DROP TRIGGER IF EXISTS update_gallery_updated_at ON gallery;
CREATE TRIGGER update_gallery_updated_at
  BEFORE UPDATE ON gallery
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 2. CREATE CONTACT MESSAGES TABLE
-- ================================================

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public can insert messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can view messages" ON contact_messages;

-- Create policies
CREATE POLICY "Public can insert messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view messages" ON contact_messages
  FOR SELECT TO authenticated USING (true);

-- ================================================
-- 3. CREATE SITE SETTINGS TABLE
-- ================================================

CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  gallery_enabled BOOLEAN DEFAULT true,
  max_gallery_images INTEGER DEFAULT 150,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT single_row_constraint CHECK (id = 1)
);

-- Insert default settings row (only if doesn't exist)
INSERT INTO site_settings (id, gallery_enabled, max_gallery_images)
VALUES (1, true, 150)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view settings" ON site_settings;
DROP POLICY IF EXISTS "Authenticated users can update settings" ON site_settings;

-- Create policies
CREATE POLICY "Anyone can view settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update settings" ON site_settings
  FOR UPDATE TO authenticated USING (true);

-- Create trigger for site_settings
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 4. CREATE PAGE VIEWS TABLE (Analytics)
-- ================================================

CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for sorting by date
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can track views" ON page_views;
DROP POLICY IF EXISTS "Authenticated users can view analytics" ON page_views;

-- Create policies
CREATE POLICY "Anyone can track views" ON page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view analytics" ON page_views
  FOR SELECT TO authenticated USING (true);

-- ================================================
-- 5. STORAGE BUCKET SETUP
-- ================================================

-- Note: Storage bucket must be created via UI:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "New Bucket"
-- 3. Name: gallery-images
-- 4. Check "Public bucket"
-- 5. Click "Create bucket"

-- After creating the bucket, run these storage policies:

-- Drop existing storage policies if any
DROP POLICY IF EXISTS "Authenticated can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;

-- Storage policies for gallery-images bucket
CREATE POLICY "Authenticated can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery-images');

CREATE POLICY "Authenticated can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery-images');

CREATE POLICY "Authenticated can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery-images');

CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery-images');

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

-- Check if all tables were created
SELECT 
  table_name,
  EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = table_name
  ) as exists
FROM (VALUES 
  ('gallery'),
  ('contact_messages'),
  ('site_settings'),
  ('page_views')
) AS t(table_name);

-- Check row counts
SELECT 'gallery' as table_name, COUNT(*) as row_count FROM gallery
UNION ALL
SELECT 'contact_messages', COUNT(*) FROM contact_messages
UNION ALL
SELECT 'site_settings', COUNT(*) FROM site_settings
UNION ALL
SELECT 'page_views', COUNT(*) FROM page_views;

-- Verify site_settings default row
SELECT * FROM site_settings;

-- ================================================
-- SETUP COMPLETE!
-- ================================================

-- Next steps:
-- 1. Create admin user in Authentication > Users
--    Email: admin@toddlers.com
--    Password: Admin@123456
--    ✓ Check "Auto Confirm User"
--
-- 2. Create storage bucket "gallery-images" (via UI)
--
-- 3. Test image upload at http://localhost:3000/admin/upload
