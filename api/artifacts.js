/**
 * API endpoint for managing artifact data
 * Handles GET, POST, PUT, DELETE requests for artifact data persistence
 *
 * NOTE: Vercel serverless functions cannot write to /public directory
 * This endpoint is a placeholder that accepts requests.
 *
 * To enable persistence on Vercel, integrate with:
 * - Firebase Firestore (recommended)
 * - Supabase PostgreSQL
 * - MongoDB Atlas
 * - Vercel KV (Redis)
 */

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // For now, accept all requests and return success
  // Data is stored in browser and persists in the JSON file via manual export/import
  // To enable automatic persistence, set up a database (Firebase, Supabase, etc)

  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'Artifact persistence not yet configured',
      note: 'Use browser localStorage or export/import JSON for now'
    });
  }

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    // Accept the request but don't actually persist
    // This keeps the frontend working while you set up a database
    return res.status(200).json({
      success: true,
      message: 'Request received. Database persistence not configured yet.'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
