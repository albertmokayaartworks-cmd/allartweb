# Cloudinary Upload 420 Error - Troubleshooting Guide

## Error Details
**Error Code:** 420 "Enhance Your Calm"  
**Meaning:** Rate limiting, invalid request, or configuration issue

## Quick Fixes

### 1. Verify Cloudinary Credentials
Check in your `.env` file:
```
REACT_APP_CLOUDINARY_CLOUD_NAME=dhxitpddx
REACT_APP_CLOUDINARY_UPLOAD_PRESET=shopki_products
```

**To verify they're correct:**
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy your **Cloud Name** (should match `dhxitpddx`)
3. Go to **Settings** → **Upload** → **Upload presets**
4. Verify `shopki_products` exists and is **Unsigned**

### 2. Check Upload Preset Settings
The upload preset must be:
- ✅ **Type:** Unsigned
- ✅ **Folder:** (optional, but should be consistent)
- ✅ **Resource type:** Image

**To fix:**
1. Go to [Cloudinary Upload Presets](https://cloudinary.com/console/settings/upload)
2. Click `shopki_products` preset
3. Ensure **Signing Mode** is set to **Unsigned**
4. Save changes

### 3. Test Upload with Browser Console

Run this in your browser console to test:

```javascript
// Test 1: Check if credentials are loaded
console.log('Cloud Name:', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
console.log('Upload Preset:', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

// Test 2: Manual upload test
const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });

const formData = new FormData();
formData.append('file', testFile);
formData.append('upload_preset', 'shopki_products');

const response = await fetch(
  'https://api.cloudinary.com/v1_1/dhxitpddx/image/upload',
  {
    method: 'POST',
    body: formData
  }
);

const data = await response.json();
console.log('Upload response:', response.status, data);
```

## Common Causes of 420 Error

| Issue | Solution |
|-------|----------|
| **Invalid upload preset** | Verify it exists in [Upload Presets](https://cloudinary.com/console/settings/upload) |
| **Preset is Signed (not Unsigned)** | Change to Unsigned in preset settings |
| **cloud_name in POST body** | ✅ Fixed - Only goes in URL now |
| **Rate limiting** | Wait a few minutes, try again |
| **File too large** | Check file size < 100MB |
| **Invalid file format** | Ensure file is valid image/document |
| **Wrong URL format** | URL should be: `https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload` |
| **Missing upload_preset** | FormData must include `upload_preset` |

## How the Fix Works

**Before (❌ Causes 420):**
```javascript
formData.append('cloud_name', CLOUD_NAME);  // WRONG - causes error
```

**After (✅ Correct):**
```javascript
// cloud_name goes in URL only:
// https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload

// FormData only contains:
formData.append('file', file);
formData.append('upload_preset', UPLOAD_PRESET);
```

## If Still Getting Error

### Option 1: Create New Upload Preset
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console/settings/upload)
2. Click "Add upload preset"
3. Name: `shopki_test`
4. Signing Mode: **Unsigned**
5. Save
6. Update `.env`:
   ```
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=shopki_test
   ```
7. Restart dev server (`npm start`)

### Option 2: Use API Key Authentication
Instead of unsigned preset, use API key:

```javascript
// More secure but requires backend
const response = await axios.post(
  `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
  formData,
  {
    auth: {
      username: CLOUD_NAME,
      password: process.env.REACT_APP_CLOUDINARY_API_SECRET
    }
  }
);
```

**Add to `.env`:**
```
REACT_APP_CLOUDINARY_API_SECRET=your_api_secret
```

### Option 3: Upload via Backend
For maximum security:

```javascript
// Frontend
const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});
```

```javascript
// Backend (Node.js)
const cloudinary = require('cloudinary').v2;

cloudinary.uploader.upload(req.file.path, (error, result) => {
  res.json({ url: result.secure_url });
});
```

## Testing File Upload

### Step 1: Create a simple test image
```javascript
// Generate 1x1 pixel image
const canvas = document.createElement('canvas');
canvas.toBlob(blob => {
  const file = new File([blob], 'test.png', { type: 'image/png' });
  console.log('Created test file:', file.name, file.size);
});
```

### Step 2: Test with the fixed upload function
```javascript
const { uploadImage } = await import('./src/services/cloudinary/upload');
const result = await uploadImage(file);
console.log('Upload result:', result);
```

## Expected Success Response

When upload succeeds, you should see:
```javascript
{
  success: true,
  data: {
    url: "https://res.cloudinary.com/dhxitpddx/image/upload/v1234567890/...",
    publicId: "shopki_products/abc123",
    width: 1920,
    height: 1080
  }
}
```

## API Limits

**Cloudinary Free Tier:**
- 25 requests/hour on upload endpoints
- 500 requests/hour on other endpoints
- 25 GB/month storage

If you're hitting rate limits:
1. Wait 1 hour for requests to reset
2. Or upgrade to a paid plan
3. Or cache uploaded images

## Verify Fix

After implementing the fix:

1. **Restart dev server:** `npm start`
2. **Clear browser cache:** Ctrl+Shift+Delete
3. **Test upload:** Try uploading an image
4. **Check console:** Look for `✅ Upload successful:`

Should see success message and image URL instead of 420 error.
