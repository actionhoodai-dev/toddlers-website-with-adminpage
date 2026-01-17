# 🔍 Image Upload Diagnosis & Fix Guide

## ❗ CRITICAL ISSUES FOUND

### 1. Missing npm Package
**Error:** `Module not found: Can't resolve '@supabase/ssr'`

**Fix:**
```bash
npm install @supabase/ssr
```

This is blocking the entire application from running.

---

## 🖼️ Image Upload Not Working - Possible Causes

### Issue 1: Supabase Storage Bucket Missing or Misconfigured

**Check if bucket exists:**
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/dbyuuqshwncleihprvve
2. Click "Storage" in left sidebar
3. Look for bucket named `gallery-images`

**If bucket doesn't exist, create it:**
1. Click "New Bucket"
2. Name: `gallery-images`
3. ✅ Check "Public bucket"
4. Click "Create bucket"

**Storage Policies Required:**

After creating the bucket, set up policies:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery-images');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery-images');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery-images');

-- Allow anyone to view (public bucket)
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery-images');
```

---

### Issue 2: Gallery Table Missing or Wrong Schema

**Check if table exists:**
1. Go to Supabase Dashboard → Database → Tables
2. Look for table named `gallery`

**If table doesn't exist, create it:**

Go to SQL Editor and run:

```sql
-- Create gallery table
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_gallery_category ON gallery(category);
CREATE INDEX idx_gallery_order ON gallery(display_order);
CREATE INDEX idx_gallery_created_at ON gallery(created_at);

-- Enable RLS
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Create policies
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

CREATE TRIGGER update_gallery_updated_at
  BEFORE UPDATE ON gallery
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

### Issue 3: Environment Variables

**Check `.env.local` has these variables:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://dbyuuqshwncleihprvve.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRieXV1cXNod25jbGVpaHBydnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NDI4MzQsImV4cCI6MjA4NDExODgzNH0.85wIkToelOMfDIudj9zTMUBu3iWm2_3dCUgwTHzEaeE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRieXV1cXNod25jbGVpaHBydnZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODU0MjgzNCwiZXhwIjoyMDg0MTE4ODM0fQ.lVuaE62du0JEbtS-ZA4MvmUvu1L3iccSPBG70t4zzj8
```

✅ Your `.env.local` is correct!

---

### Issue 4: Other Required Tables

Your admin panel also needs these tables:

**contact_messages:**
```sql
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view messages" ON contact_messages
  FOR SELECT TO authenticated USING (true);
```

**site_settings:**
```sql
CREATE TABLE site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  gallery_enabled BOOLEAN DEFAULT true,
  max_gallery_images INTEGER DEFAULT 150,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default row
INSERT INTO site_settings (id, gallery_enabled, max_gallery_images)
VALUES (1, true, 150)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update settings" ON site_settings
  FOR UPDATE TO authenticated USING (true);
```

**page_views:**
```sql
CREATE TABLE page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX idx_page_views_created_at ON page_views(created_at DESC);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can track views" ON page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view analytics" ON page_views
  FOR SELECT TO authenticated USING (true);
```

---

## 🔐 Authentication Setup

Make sure you have an admin user:

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Email: `admin@toddlers.com`
4. Password: `Admin@123456`
5. ✅ Check "Auto Confirm User"
6. Click "Create User"

---

## 🧪 Testing Image Upload

After fixing all issues:

1. **Restart dev server:**
   ```bash
   npm run dev
   ```

2. **Login:**
   - Go to: http://localhost:3000/admin/login
   - Email: admin@toddlers.com
   - Password: Admin@123456

3. **Test upload:**
   - Go to: http://localhost:3000/admin/upload
   - Fill in:
     - Title: Test Image
     - Category: General
     - Description: Testing upload
     - File: Select any image (JPG, PNG)
   - Click "Upload Image"

4. **Check for errors:**
   - Open browser console (F12)
   - Check Network tab for API call to `/api/upload`
   - Look for any error messages

5. **Verify in Supabase:**
   - Storage → gallery-images → Should see uploaded file
   - Database → gallery table → Should see new row

---

## 📝 Complete Setup Checklist

Run through this checklist:

### Prerequisites:
- [ ] Install `@supabase/ssr`: `npm install @supabase/ssr`
- [ ] Restart dev server after install

### Supabase Storage:
- [ ] Bucket `gallery-images` exists
- [ ] Bucket is set to PUBLIC
- [ ] Storage policies are configured

### Supabase Database Tables:
- [ ] `gallery` table exists with correct schema
- [ ] `contact_messages` table exists
- [ ] `site_settings` table exists with default row
- [ ] `page_views` table exists
- [ ] All tables have RLS enabled
- [ ] All policies are created

### Authentication:
- [ ] Admin user created in Supabase
- [ ] User is confirmed (not pending email)

### Code:
- [ ] Environment variables are correct
- [ ] `.env.local` file exists in project root
- [ ] All required packages installed

### Testing:
- [ ] Can login to admin panel
- [ ] Can access /admin/upload page
- [ ] Can select and preview image
- [ ] Upload button works
- [ ] No console errors
- [ ] Image appears in /admin/gallery

---

## 🐛 Debugging Upload Errors

If upload still fails, check:

1. **Browser Console (F12):**
   - Look for JavaScript errors
   - Check Network tab → `/api/upload` request
   - See response body for error message

2. **Server Logs:**
   - Check terminal where `npm run dev` is running
   - Look for "Server Storage Error" or "Server DB Error"

3. **Supabase Logs:**
   - Supabase Dashboard → Logs
   - Check for authorization errors
   - Check for policy violations

4. **Common Error Messages:**

   **"Storage Error: new row violates row-level security policy"**
   → Storage policies not configured correctly

   **"Database Error: new row violates row-level security policy"**
   → Gallery table policies not configured

   **"Server Configuration Error: Missing Supabase Credentials"**
   → Environment variables missing

   **"Bucket not found"**
   → `gallery-images` bucket doesn't exist

   **"relation 'gallery' does not exist"**
   → Gallery table not created

---

## ✅ Expected Successful Upload Flow

When everything works:

1. User selects image → Preview shows
2. User clicks "Upload Image" → Button shows "Uploading..."
3. Console log: "Submitting via API Route..."
4. API uploads file to Supabase Storage
5. API gets public URL
6. API inserts record to `gallery` table
7. Success message: "Image uploaded successfully!"
8. Auto-redirect to `/admin/gallery` after 1.5 seconds
9. New image appears in gallery grid

---

## 🚨 If Nothing Works

As a last resort, try this simplified upload test:

Create `app/api/test-upload/route.ts`:

```typescript
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File
        
        console.log("File received:", file?.name, file?.size, file?.type)
        
        return NextResponse.json({ 
            success: true, 
            fileInfo: {
                name: file?.name,
                size: file?.size,
                type: file?.type
            }
        })
    } catch (error: any) {
        console.error("Test upload error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
```

Then in upload page, temporarily change line 57:
```typescript
// Change from:
const response = await fetch("/api/upload", {

// To:
const response = await fetch("/api/test-upload", {
```

This will test if the file is even reaching the server. If this works, the issue is in Supabase connection.

---

## 📞 Need More Help?

If you're still stuck, provide:
1. Error message from browser console
2. Error message from terminal (server logs)
3. Screenshot of Supabase Storage buckets page
4. Screenshot of Supabase Database Tables page
5. Any error messages from Supabase Logs

Good luck! 🚀
