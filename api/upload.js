/**
 * API endpoint for uploading character images
 * Uses a simple approach: store base64 in Firestore temporarily
 * Or use a simpler workaround by storing as data URLs
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { imageData, fileName } = req.body;

      if (!imageData || !fileName) {
        return res.status(400).json({ error: 'Missing imageData or fileName' });
      }

      // For now, return the base64 data URL directly
      // This stores the image data inline in Firestore
      // Note: This works for smaller images but may hit Firestore size limits for many large images

      // Alternatively, you could:
      // 1. Use a URL shortener service
      // 2. Use imgbb or similar free image hosting
      // 3. Use Vercel Blob Storage (requires setup)

      return res.status(200).json({
        success: true,
        url: imageData, // Return the base64 data URL
        message: 'Image processed successfully'
      });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({
        error: 'Failed to process image',
        message: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
