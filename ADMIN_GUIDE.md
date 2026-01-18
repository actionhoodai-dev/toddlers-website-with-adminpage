# Admin Dashboard - Quick Start Guide

## **First-Time Setup**

### 1. Database Setup
Run `MIGRATION.sql` in your Supabase SQL Editor:
- This adds the `phone` column to contact_messages
- Adds delete permissions for messages
- Creates the default settings row

### 2. Verify Supabase Configuration
Make sure these exist in your Supabase project:
- ✅ Storage bucket: `gallery-images` (must be PUBLIC)
- ✅ Authentication enabled (Email/Password)
- ✅ Admin user created

### 3. Local Development
```bash
npm install
npm run dev
```
Visit `http://localhost:3000/admin/login`

---

## **Admin Panel Features**

### **Dashboard** (`/admin`)
- View statistics: Total images, messages, page views
- Quick links to all admin sections
- Account information display

### **Upload Image** (`/admin/upload`)
**What you can do:**
- Upload images to gallery
- Add title, description, category
- Preview before upload

**What to know:**
- Shows current image count and limit
- Form auto-disables if gallery is full or disabled
- Clear warnings when uploads blocked

**Categories available:**
- General
- Therapy
- Facilities
- Events

---

### **Manage Gallery** (`/admin/gallery`)
**What you can do:**
- View all uploaded images organized by category
- Select individual images by clicking
- Select all images with one button
- Delete single image (hover and click X button)
- Delete multiple images (select, then "Delete Selected")

**How to use:**
1. **Single Delete:** Hover over image → Click red X → Confirm
2. **Bulk Delete:** Click images to select → Click "Delete Selected (X)" → Confirm
3. **Select All:** Click "Select All" button to select every image

**Important:**
- Deleting removes image from BOTH database AND storage
- This action cannot be undone
- Gallery automatically refreshes after delete

---

### **View Messages** (`/admin/messages`)
**What you can do:**
- View all contact form submissions
- See name, email, phone, message preview, date
- Click email/phone to contact directly
- View full message in popup
- Delete old messages

**How to use:**
1. **View Full Message:** Click "View" button → Read details in modal
2. **Delete Message:** Click "Delete" in table or modal → Confirm
3. **Contact Submitter:** Click email (opens mail app) or phone (calls on mobile)

**What you see:**
- Date/time of submission
- Full name and contact info
- Message preview (clickable to expand)
- Total message count

---

### **Settings** (`/admin/settings`)
**What you can configure:**
1. **Gallery Enabled** (checkbox)
   - ON: Uploads allowed
   - OFF: Upload page disabled with warning

2. **Max Gallery Images** (number)
   - Hard limit for total images
   - Upload blocked when limit reached
   - Default: 150

**How to use:**
1. Toggle "Gallery Enabled" on/off
2. Set "Max Gallery Images" to your desired limit
3. Click "Save Changes"
4. Confirmation message appears

**Example use cases:**
- Disable uploads during maintenance
- Set limit to control storage usage
- Temporarily stop new uploads

---

### **Analytics** (`/admin/analytics`)
**What you see:**
- Total page views count
- Recent 50 page views with path and timestamp

**Note:** This tracks overall site traffic, not gallery-specific views.

---

## **Common Tasks**

### Adding Images to Gallery
1. Go to "Upload Image"
2. Check status bar (current count / max allowed)
3. Fill in title (required)
4. Select category
5. Add description (optional)
6. Choose file
7. Click "Upload Image"
8. Wait for success message
9. Redirected to gallery automatically

### Managing Full Gallery
**When limit reached:**
1. Go to "Manage Gallery"
2. Select old/unwanted images
3. Click "Delete Selected"
4. Confirm deletion
5. Upload page now allows new uploads

### Checking Contact Messages
1. Go to "View Messages"
2. Click "View" on any message
3. Read full details in popup
4. Use email/phone links to respond
5. Delete after handling (optional)

### Changing Upload Limits
1. Go to "Settings"
2. Change "Max Gallery Images" number
3. Click "Save Changes"
4. New limit applies immediately

---

## **Troubleshooting**

### "Upload Disabled" Button
**Cause:** Gallery is disabled in settings OR limit reached  
**Fix:** 
- Check Settings → Enable gallery
- OR delete old images to free space

### Images Not Appearing After Upload
**Cause:** Browser cache  
**Fix:** Hard refresh (Ctrl+F5 or Cmd+Shift+R)

### Delete Button Not Working
**Cause:** Network error or permissions  
**Fix:** 
- Check internet connection
- Verify you're logged in
- Check browser console for errors

### Settings Won't Save
**Cause:** Database connection issue  
**Fix:** 
- Check Supabase project is online
- Verify environment variables in `.env.local`
- Check browser console for error details

---

## **Best Practices**

### Gallery Management
- ✅ Use descriptive titles for images
- ✅ Categorize images appropriately
- ✅ Add descriptions for better context
- ✅ Delete outdated images regularly
- ✅ Monitor storage usage via dashboard

### Upload Limits
- ✅ Set realistic max_gallery_images based on storage plan
- ✅ Periodically review and clean up old images
- ✅ Don't set limit too low (causes frequent blocks)

### Message Handling
- ✅ Check messages regularly
- ✅ Respond promptly via email/phone
- ✅ Delete messages after handling
- ✅ Keep important messages for records

### Security
- ✅ Keep admin credentials secure
- ✅ Log out when finished
- ✅ Don't share login details
- ✅ Regularly review uploaded content

---

## **Technical Details**

### Image Storage
- Storage: Supabase Storage (`gallery-images` bucket)
- Access: Public (images visible on website)
- Format: Automatically handled (JPG, PNG, WebP, etc.)
- Naming: Auto-generated with timestamp

### Database Tables
- `gallery`: Stores image metadata
- `contact_messages`: Stores contact form submissions
- `site_settings`: Stores admin preferences
- `page_views`: Stores analytics data

### User Roles
- Authenticated users = Admins (full access)
- Public users = Can view gallery and submit messages only

---

## **Support**

If you encounter issues:
1. Check `TESTING_CHECKLIST.md` for known issues
2. Review `COMPLETION_SUMMARY.md` for technical details
3. Check browser console (F12) for error messages
4. Verify Supabase project status
5. Ensure environment variables are set correctly

---

**Last Updated:** 2026-01-18  
**Version:** 1.0 (Admin Dashboard Complete)
