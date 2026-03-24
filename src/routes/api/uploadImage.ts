import type { Context } from 'hono';
import { getCurrentUser } from '../../auth';

// Allowed file types and size limits
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const onRequestPost = async (c: Context) => {
  // Check if user is admin
  const currentUser = await getCurrentUser(c);
  if (!currentUser?.admin) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const formData = await c.req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return c.json({ 
        error: `Invalid file type. Allowed: ${ALLOWED_TYPES.map(t => t.split('/')[1]).join(', ')}` 
      }, 400);
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return c.json({ 
        error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      }, 400);
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filename = `upload_${timestamp}_${randomStr}.${ext}`;

    // Check if R2 bucket is available
    const bucket = (c.env as any).IMAGES_BUCKET;
    
    if (bucket) {
      // Upload to R2 bucket
      const arrayBuffer = await file.arrayBuffer();
      await bucket.put(filename, arrayBuffer, {
        httpMetadata: {
          contentType: file.type,
        },
      });

      return c.json({
        success: true,
        filename: filename,
        url: `/images/${filename}`,
        message: 'Image uploaded successfully'
      });
    } else {
      // R2 not configured - return filename for manual placement
      // In development, you can manually place files in assets/statics/
      return c.json({
        success: true,
        filename: filename,
        url: `/statics/${filename}`,
        message: 'R2 not configured. Please manually place the image in assets/statics/',
        manualUpload: true
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Failed to upload image' }, 500);
  }
};

// Serve images from R2 bucket
export const onRequestGetImage = async (c: Context) => {
  const filename = c.req.param('filename');
  
  if (!filename) {
    return c.json({ error: 'No filename provided' }, 400);
  }

  const bucket = (c.env as any).IMAGES_BUCKET;
  
  if (!bucket) {
    // Fallback to static assets
    return c.redirect(`/statics/${filename}`);
  }

  try {
    const object = await bucket.get(filename);
    
    if (!object) {
      return c.json({ error: 'Image not found' }, 404);
    }

    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new Response(object.body, { headers });
  } catch (error) {
    console.error('Error serving image:', error);
    return c.json({ error: 'Failed to retrieve image' }, 500);
  }
};
