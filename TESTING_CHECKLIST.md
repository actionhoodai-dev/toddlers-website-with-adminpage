# Admin Dashboard Completion - Testing Checklist

## **Pre-requisites**
Before testing, ensure:
1. Run the updated `SUPABASE_SETUP.sql` in Supabase SQL Editor
2. Ensure `site_settings` table has at least one row (will auto-create on first visit to Settings)
3. Ensure `gallery-images` bucket exists and is PUBLIC

## **1. Settings Page Testing**

### Test Auto-Initialization
1. Navigate to `/admin/settings`
2. **Expected:** Settings load or auto-create with defaults:
   - gallery_enabled: true
   - max_gallery_images: 150

### Test Settings Save
1. Change `gallery_enabled` to false
2. Change `max_gallery_images` to 100
3. Click "Save Changes"
4. **Expected:** "Settings saved successfully!" message
5. Refresh page
6. **Expected:** Changes persist

---

## **2. Upload Page Testing**

### Test Upload Status Display
1. Navigate to `/admin/upload`
2. **Expected:** See status bar showing:
   - Current Images: X
   - Max Allowed: Y
   - Uploads Enabled/Disabled status

### Test Upload When Gallery Disabled
1. Go to Settings, set `gallery_enabled = false`, save
2. Go to Upload page
3. **Expected:** 
   - Red warning: "Gallery Uploads Disabled"
   - All form fields disabled
   - Submit button shows "Upload Disabled"

### Test Upload When Gallery Full
1. Go to Settings, set `max_gallery_images = 3` (or current count)
2. Go to Upload page
3. **Expected:**
   - Orange warning: "Gallery Full"
   - Form disabled
   - Cannot upload

### Test Successful Upload
1. Enable gallery, increase limit
2. Fill form and upload image
3. **Expected:**
   - Success message
   - Redirect to gallery
   - Image appears in gallery

---

## **3. Gallery Manager Testing**

### Test Category Grouping
1. Upload images with different categories (general, therapy, facilities, events)
2. Navigate to `/admin/gallery`
3. **Expected:** 
   - Images grouped by category
   - Each category shows as a folder with count
   - Images sorted by date within category

### Test Single Image Selection
1. Click on an image (not on buttons)
2. **Expected:** 
   - Checkbox becomes checked
   - Border turns teal with ring effect

### Test Select All
1. Click "Select All" button
2. **Expected:** All images selected
3. Click again
4. **Expected:** All images deselected

### Test Single Image Delete
1. Hover over an image
2. Click the red X button
3. Confirm deletion
4. **Expected:**
   - Image deleted from database
   - File removed from storage
   - Gallery refreshes
   - Image no longer appears

### Test Bulk Delete
1. Select multiple images (click to select)
2. Click "Delete Selected (X)" button
3. Confirm deletion
4. **Expected:**
   - All selected images deleted
   - Storage files removed
   - Gallery refreshes
   - Count updates

---

## **4. Messages Page Testing**

### Test Message List Display
1. Submit a contact form with name, email, phone, message
2. Navigate to `/admin/messages`
3. **Expected:**
   - Message appears in table
   - Shows: Date, Name, Email, Phone, truncated Message
   - Total count updates

### Test Phone Column
1. Check messages with phone numbers
2. **Expected:** Phone displayed and clickable (tel: link)
3. Check messages without phone
4. **Expected:** Shows "—" placeholder

### Test View Full Message
1. Click "View" button on a message
2. **Expected:**
   - Modal opens with full details
   - All fields visible: Name, Email, Phone, Date, Full Message
   - Email and phone are clickable links

### Test Delete Message
1. In modal or table, click "Delete"
2. Confirm
3. **Expected:**
   - Message deleted from database
   - List refreshes
   - Count updates on dashboard

---

## **5. Dashboard Testing**

### Test Stats Accuracy
1. Navigate to `/admin` (dashboard)
2. **Expected:**
   - Gallery Images count matches actual
   - Contact Submissions count matches actual
   - Total Views count matches actual

---

## **6. Analytics Testing**

### Test Page Views
1. Navigate to `/admin/analytics`
2. **Expected:**
   - Total Page Views count displayed
   - Recent 50 views listed
   - Shows path and timestamp

---

## **7. Upload Validation Testing**

### Test API Validation - Gallery Disabled
1. Disable gallery in settings
2. Try to upload via API (use Postman or form)
3. **Expected:** 403 error with message "Gallery uploads are currently disabled"

### Test API Validation - Gallery Full
1. Set max_gallery_images to current count
2. Try to upload
3. **Expected:** 403 error with message "Gallery is full. Maximum X images allowed..."

---

## **8. Edge Cases**

### Missing Settings Row
1. Delete all rows from `site_settings` table manually
2. Visit `/admin/settings`
3. **Expected:** Auto-creates default row with id=1

### Image URL Extraction
1. Delete an image that has a complex URL
2. **Expected:** Filename correctly extracted and removed from storage

### Empty States
- **Gallery:** Shows "No images uploaded yet"
- **Messages:** Shows "No messages found"
- **Analytics:** Shows 0 total views

---

## **9. Codebase Consistency Checks**

### Supabase Client Usage
- ✅ Client-side uses `@/lib/supabase/client` (anon key)
- ✅ API routes use service role key
- ✅ No service key exposed to browser

### Table/Column Names
- ✅ `gallery` table (not `galleries`)
- ✅ `contact_messages` table with `phone` column
- ✅ `site_settings` table
- ✅ `page_views` table with `path` column
- ✅ `gallery-images` bucket

---

## **10. Database Migration**

If you haven't run the updated SQL yet, execute this in Supabase SQL Editor:

```sql
-- Add phone column to contact_messages if missing
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS phone VARCHAR(50);

-- Add delete policy for contact_messages
DROP POLICY IF EXISTS "Authenticated users can delete messages" ON contact_messages;
CREATE POLICY "Authenticated users can delete messages" ON contact_messages
  FOR DELETE TO authenticated USING (true);

-- Ensure site_settings has default row
INSERT INTO site_settings (id, gallery_enabled, max_gallery_images)
VALUES (1, true, 150)
ON CONFLICT (id) DO NOTHING;
```

---

## **Success Criteria**

All above tests should pass. The admin should be able to:
- ✅ Manage all gallery images (view, upload, delete single, delete bulk)
- ✅ See images organized by category
- ✅ View all contact messages with phone numbers
- ✅ View full message details in modal
- ✅ Delete messages
- ✅ Configure and save site settings
- ✅ See upload limits enforced
- ✅ View analytics
- ✅ No silent failures or crashes
