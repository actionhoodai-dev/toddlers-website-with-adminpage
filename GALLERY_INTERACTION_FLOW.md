# GALLERY MANAGER - INTERACTION FLOW

## 📸 New User Experience

### DEFAULT MODE (Normal View)
```
┌─────────────────────────────────────────────────────┐
│  Gallery Manager                      [Select Multiple] [Upload New] [Dashboard]  │
│  Total: 12 images                                       │
├─────────────────────────────────────────────────────┤
│                                                          │
│  📁 therapy (4 images)                                  │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐                      │
│  │ 📷 │  │ 📷 │  │ 📷 │  │ 📷 │  ← Click = PREVIEW    │
│  │img1│  │img2│  │img3│  │img4│                        │
│  └────┘  └────┘  └────┘  └────┘                      │
│                                                          │
│  📁 facilities (3 images)                               │
│  ┌────┐  ┌────┐  ┌────┐                                │
│  │ 📷 │  │ 📷 │  │ 📷 │  ← Click = PREVIEW            │
│  └────┘  └────┘  └────┘                                │
└─────────────────────────────────────────────────────┘

CLICK IMAGE → Opens Preview/Edit Modal ✅
```

---

### PREVIEW/EDIT MODAL
```
┌─────────────────────────────────────────────────────┐
│  Edit Image                                    [✕]  │
├─────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐    Title: [Updated Title_______]     │
│  │              │                                         │
│  │   [IMAGE]    │    Description:                        │
│  │              │    ┌─────────────────────────────┐  │
│  │              │    │ Updated description text... │  │
│  │              │    │                             │  │
│  └──────────────┘    └─────────────────────────────┘  │
│  Uploaded: 1/18/26   Category: [Therapy ▼]            │
│                                                          │
│  [Save Changes]  [Delete Image]                        │
└─────────────────────────────────────────────────────┘

ACTION: Edit metadata, then "Save Changes" → UPDATE ✅
ACTION: "Delete Image" → DELETE + Storage cleanup ✅
```

---

### SELECT MODE (Bulk Operations)
```
┌─────────────────────────────────────────────────────┐
│  Gallery Manager   [Cancel Selection] [Delete Selected (3)] [Select All]  │
│  Total: 12 images                                       │
├─────────────────────────────────────────────────────┤
│                                                          │
│  📁 therapy (4 images)                                  │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐                      │
│  │☑️📷│  │☐📷│  │☑️📷│  │☑️📷│  ← Click = SELECT    │
│  │img1│  │img2│  │img3│  │img4│                        │
│  └────┘  └────┘  └────┘  └────┘                      │
│   ✅      ---      ✅      ✅                           │
└─────────────────────────────────────────────────────┘

CLICK IMAGE → Toggles checkbox ✅
CLICK "Delete Selected" → Bulk delete with storage cleanup ✅
```

---

## 🔄 State Transitions

```
┌───────────────┐
│ DEFAULT MODE  │ ← User lands here
│ (Preview)     │
└───────┬───────┘
        │
        │ Click "Select Multiple" button
        ↓
┌───────────────┐
│  SELECT MODE  │
│ (Checkboxes)  │
└───────┬───────┘
        │
        │ Click "Cancel Selection" or after bulk delete
        ↓
┌───────────────┐
│ DEFAULT MODE  │
│ (Preview)     │
└───────────────┘
```

---

## 🎯 Key Features

### DEFAULT MODE:
- ✅ **Click image** → Opens preview/edit modal
- ✅ No checkboxes visible
- ✅ Clean, simple interface
- ✅ Can edit individual image metadata
- ✅ Can delete individual image

### SELECT MODE:
- ✅ **Click image** → Toggles selection (checkbox)
- ✅ Checkboxes visible on all images
- ✅ "Select All" / "Deselect All" buttons
- ✅ "Delete Selected (X)" button appears when images selected
- ✅ Bulk delete with confirmation
- ✅ Auto-exits to default mode after delete

---

## 🛠️ Implementation Details

### Click Handler Logic:
```typescript
onClick={() => {
  if (selectMode) {
    // In select mode: toggle checkbox
    toggleSelection(img.id)
  } else {
    // Default mode: open preview/edit modal
    openPreview(img)
  }
}}
```

### Modal Actions:
```typescript
// UPDATE - Changes metadata only, image_url unchanged
handleSaveEdit() {
  await supabase
    .from("gallery")
    .update({ title, description, category })
    .eq("id", imageId)
}

// DELETE - Removes from storage AND database
handleDeleteSingle(img) {
  const fileName = img.image_url.split('/').pop()
  await supabase.storage.from("gallery-images").remove([fileName])
  await supabase.from("gallery").delete().eq("id", img.id)
}
```

### Bulk Delete:
```typescript
handleDeleteSelected() {
  const imagesToDelete = images.filter(img => selectedImages.has(img.id))
  
  // Delete each from storage and database
  await Promise.all(imagesToDelete.map(async (img) => {
    const fileName = img.image_url.split('/').pop()
    await supabase.storage.from("gallery-images").remove([fileName])
    await supabase.from("gallery").delete().eq("id", img.id)
  }))
  
  setSelectMode(false) // Exit select mode
}
```

---

## ✅ Requirements Met

1. ✅ **DEFAULT MODE:** Clicking image opens preview (not selection)
2. ✅ **SELECT MODE:** Checkboxes only appear when explicitly enabled
3. ✅ **EDIT:** Full UPDATE functionality for metadata
4. ✅ **DELETE:** Single delete from modal
5. ✅ **BULK DELETE:** Multi-select and delete in select mode
6. ✅ **STORAGE CLEANUP:** All deletes remove both DB row and storage file
7. ✅ **IMAGE URL:** Never changes during update (no re-upload)

---

## 🎨 Visual Indicators

### Image Border States:
- **Default:** Gray border (`border-gray-200`)
- **Hover:** Darker gray (`hover:border-gray-300`)
- **Selected (in select mode):** Teal border + ring (`border-teal-500 ring-2 ring-teal-200`)

### Buttons:
- **Select Multiple:** Blue (`bg-blue-600`)
- **Delete Selected:** Red (`bg-red-600`)
- **Save Changes:** Teal (`bg-teal-600`)
- **Cancel Selection:** Gray (`bg-gray-200`)

---

## 🚀 User Experience Flow

### Scenario 1: Edit Single Image
1. User sees gallery in default mode
2. Clicks image → Modal opens
3. Edits title/description/category
4. Clicks "Save Changes"
5. Success! Image updated, modal closes

### Scenario 2: Delete Single Image
1. User clicks image → Modal opens
2. Clicks "Delete Image"
3. Confirms deletion
4. Success! Image removed, modal closes

### Scenario 3: Bulk Delete
1. User clicks "Select Multiple"
2. Interface switches to select mode
3. User clicks 3 images (checkboxes appear)
4. Clicks "Delete Selected (3)"
5. Confirms deletion
6. Success! All 3 images removed, mode exits

### Scenario 4: Cancel Selection
1. User in select mode
2. Realizes they don't want to delete
3. Clicks "Cancel Selection"
4. Returns to default mode, checkboxes hidden

---

**The gallery manager now provides an intuitive, professional experience!**
