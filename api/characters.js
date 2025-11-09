/**
 * API endpoint for managing character data
 * Handles GET, POST, PUT, DELETE requests
 *
 * NOTE: Vercel serverless functions cannot write to /public directory
 * This endpoint is a placeholder that accepts requests.
 *
 * To enable automatic persistence on Vercel, integrate with:
 * - Firebase Firestore (recommended)
 * - Supabase PostgreSQL
 * - MongoDB Atlas
 * - Vercel KV (Redis)
 *
 * For now, data persists in the JSON file via:
 * 1. Manual export/import through the admin panel
 * 2. 30-second polling to sync across browsers
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

  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'Character data endpoint',
      note: 'Use the /api/characters or /api/artifacts endpoints to manage data',
      persistence: 'Database integration required for automatic persistence'
    });
  }

  // Accept POST, PUT, DELETE requests and return success
  // Data changes are stored in browser state and will be visible on next poll
  // To enable automatic persistence, connect to a database service

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    const { action } = req.body;

    return res.status(200).json({
      success: true,
      message: `${action || 'Request'} received successfully`,
      note: 'Changes stored in browser. Set up database for automatic persistence.',
      persistence: 'Configure Firebase, Supabase, or another database to persist changes automatically'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
