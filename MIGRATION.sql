-- ================================================
-- ADMIN DASHBOARD COMPLETION - DATABASE MIGRATION
-- Run this in Supabase SQL Editor to apply updates
-- ================================================

-- 1. Add phone column to contact_messages table
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS phone VARCHAR(50);

-- 2. Add delete policy for contact_messages
DROP POLICY IF EXISTS "Authenticated users can delete messages" ON contact_messages;
CREATE POLICY "Authenticated users can delete messages" ON contact_messages
  FOR DELETE TO authenticated USING (true);

-- 3. Ensure site_settings has default row
INSERT INTO site_settings (id, gallery_enabled, max_gallery_images)
VALUES (1, true, 150)
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

-- Check contact_messages structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'contact_messages' 
ORDER BY ordinal_position;

-- Check site_settings row exists
SELECT * FROM site_settings;

-- Check all policies on contact_messages
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'contact_messages';

-- ================================================
-- MIGRATION COMPLETE!
-- ================================================
