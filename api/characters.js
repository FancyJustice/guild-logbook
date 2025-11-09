/**
 * API endpoint for managing character data
 * Handles GET and POST requests for character data
 *
 * Note: For full persistence, you would connect this to a database
 * For now, this provides a template for future enhancement
 */

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // GET - Return current characters
    // In a production app, this would fetch from a database
    return res.status(200).json({
      message: 'Use the browser localStorage for character data. For persistence, connect to Firebase or another database.',
      hint: 'Characters are stored in browser localStorage and exported as JSON.'
    });
  }

  if (req.method === 'POST') {
    // POST - Save character data
    // In a production app, this would save to a database
    try {
      const { character } = req.body;

      if (!character || !character.id) {
        return res.status(400).json({ error: 'Invalid character data' });
      }

      // TODO: Add database integration here
      // For now, just acknowledge the request
      return res.status(200).json({
        success: true,
        message: 'Character data received. To persist changes, connect this to Firebase, Supabase, or another database.',
        character: character
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
