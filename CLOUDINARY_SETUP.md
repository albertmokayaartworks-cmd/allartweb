# Cloudinary Image Upload Setup

## Overview
This guide explains how to set up Cloudinary for product image uploads in Shopki.

## Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com/
2. Sign up for a **free account**
3. After signup, you'll see your **Dashboard**

## Step 2: Get Your Credentials

### Find Your Cloud Name:
1. Go to **Dashboard** (https://cloudinary.com/console)
2. Copy your **Cloud Name** (appears at the top of the page)

### Create an Upload Preset:
1. Go to **Settings** (gear icon) → **Upload**
2. Scroll to **Upload presets** section
3. Click **Add upload preset**
4. Set:
   - **Name**: `shopki_products` (or any name)
   - **Unsigned**: YES (important - allows unsigned uploads)
   - **Quality**: 85 (balances quality and file size)
5. Click **Save**
6. Copy the **Upload Preset name**

## Step 3: Update .env File

Edit `.env` file in your project root:

```env
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
```

**Example:**
```env
REACT_APP_CLOUDINARY_CLOUD_NAME=dxyz12345
REACT_APP_CLOUDINARY_UPLOAD_PRESET=shopki_products
```

## Step 4: Restart Your App

```bash
npm start
```

## Step 5: Use the Image Upload Component

### In Your Product Form:

```jsx
import ProductImageUpload from '../admin/Products/ProductImageUpload';

function YourProductForm() {
  const [images, setImages] = useState([]);

  const handleImagesUpload = (uploadedUrls) => {
    setImages(uploadedUrls);
    // Save to database
    saveProductWithImages(uploadedUrls);
  };

  return (
    <ProductImageUpload 
      onImagesUpload={handleImagesUpload}
      maxImages={5}
      title="Product Images"
    />
  );
}
```

## Features

✅ **Drag & Drop Upload** - Drag images or click to browse
✅ **Multiple Images** - Upload up to 5 images per product
✅ **Progress Indicator** - See upload progress in real-time
✅ **Image Reordering** - Move images up/down to change order
✅ **Primary Image** - First image is automatically primary
✅ **Error Handling** - Toast notifications for errors
✅ **Optimized Storage** - Images are automatically optimized by Cloudinary

## Advanced Usage

### Custom Options:

```jsx
<ProductImageUpload 
  onImagesUpload={handleImagesUpload}
  maxImages={10}
  initialImages={existingImages}
  title="Upload Product Images"
/>
```

### Get Optimized URLs:

```jsx
import { getOptimizedImageUrl } from '../services/cloudinary/upload';

// Get thumbnail
const thumbnail = getOptimizedImageUrl(imageUrl, {
  width: 200,
  quality: 'auto',
  format: 'auto'
});

// Get larger display
const display = getOptimizedImageUrl(imageUrl, {
  width: 800,
  quality: 'auto',
  format: 'auto'
});
```

## Troubleshooting

### Images Not Uploading?
1. Check if `.env` has correct credentials
2. Verify Upload Preset is set to **Unsigned**
3. Check browser console for errors (F12)
4. Ensure file sizes are under 100MB

### Images Show as Placeholder?
1. Wait for upload to complete (progress spinner)
2. Check Cloudinary dashboard to verify upload
3. Clear browser cache and reload

### CORS Issues?
1. Go to Cloudinary Settings → Security
2. Add your domain to **Allowed CORS origins**
3. Example: `http://localhost:3000`

## Cloudinary Free Tier Limits

- **Storage**: 25 GB
- **Monthly Usage**: 25 GB/month
- **Transformations**: Unlimited
- **API Calls**: 5,000/hour

This is sufficient for most small to medium e-commerce applications.

## File Upload Limits

- **Maximum file size**: 100 MB
- **Allowed formats**: JPG, PNG, GIF, WebP, SVG
- **Recommended**: Compress images to 50KB-5MB for best performance

## More Resources

- Cloudinary Documentation: https://cloudinary.com/documentation
- Upload API: https://cloudinary.com/documentation/image_upload_api_reference
- Transformations: https://cloudinary.com/documentation/image_transformation_reference
