# Photo Upload Implementation Guide

## Overview

This project uses **Supabase Storage** to handle photo uploads. Photos are stored in a cloud storage bucket and accessible via public URLs.

## Architecture

### Storage Location
- **Service**: Supabase Storage
- **Bucket Name**: `profile-photos` (configurable via `SUPABASE_STORAGE_BUCKET` env var)
- **File Structure**: `{userId}/{userId}_{timestamp}.{ext}`
  - Example: `123/123_1704067200000.jpg`

### Flow
1. User selects a photo in the frontend
2. File is uploaded to `/api/upload/photo` API route
3. API route validates file and uploads to Supabase Storage
4. Supabase returns a public URL
5. URL is stored in the database `User.photoUrl` field
6. Frontend displays the image using the public URL

## Setup Instructions

### 1. Create Supabase Storage Bucket

In your Supabase dashboard:

1. Go to **Storage** section
2. Click **New bucket**
3. Name it: `profile-photos` (or your preferred name)
4. Make it **Public** (so photos are accessible via URL)
5. Click **Create bucket**

### 2. Configure Storage Policies (Optional but Recommended)

For security, you may want to add RLS policies:

```sql
-- Allow authenticated users to upload their own photos
CREATE POLICY "Users can upload own photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to photos
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-photos');
```

### 3. Environment Variables

Add to your `.env.local`:

```env
# Supabase Configuration (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-anon-key

# Required for server-side uploads
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Custom bucket name (defaults to "profile-photos")
SUPABASE_STORAGE_BUCKET=profile-photos

# JWT Secret (already in use for auth)
JWT_SECRET=your-jwt-secret
```

**Important**: 
- `SUPABASE_SERVICE_ROLE_KEY` is required for server-side uploads in the API route
- Get it from: Supabase Dashboard → Settings → API → Service Role Key
- **Never expose this key in client-side code** - it has admin privileges!

## How It Works in Deployment

### Accessing Photos

Once uploaded, photos are accessible via public URLs:

```
https://{your-project-id}.supabase.co/storage/v1/object/public/profile-photos/{userId}/{filename}
```

Example:
```
https://abcdefgh.supabase.co/storage/v1/object/public/profile-photos/123/123_1704067200000.jpg
```

### Deployment Considerations

1. **No Changes Needed**: Supabase Storage works the same in development and production
2. **URLs Persist**: Once uploaded, URLs remain accessible as long as:
   - The bucket exists
   - The file isn't deleted
   - The bucket remains public (or proper policies are set)

3. **Database Storage**: Only the URL string is stored in the database, not the actual file
   - Database remains lightweight
   - Files are served from Supabase CDN
   - Fast global access

### File Management

#### Deleting Old Photos (Optional)

To prevent storage bloat, you can delete old photos when users upload new ones:

```typescript
// In your API route, before uploading new photo:
// 1. Get old photo URL from user profile
// 2. Extract file path from URL
// 3. Delete from Supabase Storage
// 4. Upload new photo
```

Example deletion code:
```typescript
const oldPath = extractPathFromUrl(oldPhotoUrl);
await supabase.storage.from(STORAGE_BUCKET).remove([oldPath]);
```

## Alternative Storage Options

If you prefer not to use Supabase Storage, here are alternatives:

### 1. Cloudinary
- Free tier: 25GB storage, 25GB bandwidth/month
- Easy image transformations
- URL: `https://res.cloudinary.com/{cloud}/image/upload/{path}`

### 2. AWS S3
- Industry standard
- Highly scalable
- Requires AWS setup and configuration
- URL: `https://{bucket}.s3.{region}.amazonaws.com/{path}`

### 3. Vercel Blob Storage
- Integrated with Vercel deployments
- Simple API
- URL: `https://{project}.blob.vercel-storage.com/{path}`

## Current Implementation

The current setup uses:
- **Upload API**: `/api/upload/photo/route.ts`
- **File validation**: Type (JPEG, PNG, WebP) and size (5MB max)
- **Storage**: Supabase Storage bucket `profile-photos`
- **URL format**: Public Supabase Storage URLs

## Testing

To test photo upload:

1. Start your development server
2. Navigate to profile page
3. Click "Upload Photo"
4. Select an image file
5. Photo should upload and display
6. Check Supabase Storage dashboard to see the uploaded file

## Troubleshooting

### Photos not displaying
- Check if bucket is public
- Verify URL is correct in database
- Check browser console for CORS errors

### Upload fails
- Verify Supabase credentials in environment variables
- Check bucket exists and is accessible
- Ensure file size is under 5MB
- Check file type is allowed

### CORS Issues
- Supabase Storage handles CORS automatically for public buckets
- If using RLS, ensure policies allow read access

