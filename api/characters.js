import fs from 'fs';
import path from 'path';

/**
 * API endpoint for managing character data
 * Handles GET, POST, PUT, DELETE requests for character data persistence
 *
 * This endpoint saves changes to public/characters.json on Vercel
 */

const CHARACTERS_FILE = path.join(process.cwd(), 'public', 'characters.json');

async function readCharactersFile() {
  try {
    const data = fs.readFileSync(CHARACTERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading characters file:', error);
    return { characters: [], artifacts: [], dropdownOptions: {} };
  }
}

function writeCharactersFile(data) {
  try {
    fs.writeFileSync(CHARACTERS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing characters file:', error);
    return false;
  }
}

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
    // GET - Return current characters
    const data = readCharactersFile();
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    // POST - Handle add or merge operations
    try {
      const { action, character, characters: newCharacters, artifacts: newArtifacts, allCharacters, allArtifacts } = req.body;

      if (!action) {
        return res.status(400).json({ error: 'Action required' });
      }

      const currentData = readCharactersFile();

      if (action === 'add') {
        // Add single character
        if (!character || !character.id) {
          return res.status(400).json({ error: 'Invalid character data' });
        }

        const updatedCharacters = allCharacters || [...currentData.characters, character];
        const success = writeCharactersFile({
          ...currentData,
          characters: updatedCharacters
        });

        if (success) {
          return res.status(200).json({
            success: true,
            message: 'Character added successfully',
            character: character
          });
        } else {
          return res.status(500).json({ error: 'Failed to save character' });
        }
      }

      if (action === 'merge') {
        // Merge characters and artifacts
        if (!newCharacters || !Array.isArray(newCharacters)) {
          return res.status(400).json({ error: 'Invalid merge data' });
        }

        const success = writeCharactersFile({
          characters: newCharacters,
          artifacts: newArtifacts || currentData.artifacts,
          dropdownOptions: currentData.dropdownOptions
        });

        if (success) {
          return res.status(200).json({
            success: true,
            message: 'Merge completed successfully',
            characterCount: newCharacters.length,
            artifactCount: (newArtifacts || []).length
          });
        } else {
          return res.status(500).json({ error: 'Failed to save merged data' });
        }
      }

      return res.status(400).json({ error: 'Unknown action' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    // PUT - Handle update operations
    try {
      const { action, character, artifact, allCharacters, allArtifacts } = req.body;

      if (!action) {
        return res.status(400).json({ error: 'Action required' });
      }

      const currentData = readCharactersFile();

      if (action === 'update') {
        if (character) {
          // Update character
          if (!character.id) {
            return res.status(400).json({ error: 'Character ID required' });
          }

          const updatedCharacters = allCharacters || currentData.characters.map(c =>
            c.id === character.id ? character : c
          );

          const success = writeCharactersFile({
            ...currentData,
            characters: updatedCharacters
          });

          if (success) {
            return res.status(200).json({
              success: true,
              message: 'Character updated successfully',
              character: character
            });
          } else {
            return res.status(500).json({ error: 'Failed to save character' });
          }
        } else if (artifact) {
          // Update artifact
          if (!artifact.id) {
            return res.status(400).json({ error: 'Artifact ID required' });
          }

          const updatedArtifacts = allArtifacts || currentData.artifacts.map(a =>
            a.id === artifact.id ? artifact : a
          );

          const success = writeCharactersFile({
            ...currentData,
            artifacts: updatedArtifacts
          });

          if (success) {
            return res.status(200).json({
              success: true,
              message: 'Artifact updated successfully',
              artifact: artifact
            });
          } else {
            return res.status(500).json({ error: 'Failed to save artifact' });
          }
        }
      }

      return res.status(400).json({ error: 'Invalid update request' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    // DELETE - Handle deletion operations
    try {
      const { action, characterId, artifactId, allCharacters, allArtifacts } = req.body;

      if (!action) {
        return res.status(400).json({ error: 'Action required' });
      }

      const currentData = readCharactersFile();

      if (action === 'delete') {
        if (characterId) {
          // Delete character
          const updatedCharacters = allCharacters || currentData.characters.filter(c => c.id !== characterId);

          const success = writeCharactersFile({
            ...currentData,
            characters: updatedCharacters
          });

          if (success) {
            return res.status(200).json({
              success: true,
              message: 'Character deleted successfully'
            });
          } else {
            return res.status(500).json({ error: 'Failed to delete character' });
          }
        } else if (artifactId) {
          // Delete artifact
          const updatedArtifacts = allArtifacts || currentData.artifacts.filter(a => a.id !== artifactId);

          const success = writeCharactersFile({
            ...currentData,
            artifacts: updatedArtifacts
          });

          if (success) {
            return res.status(200).json({
              success: true,
              message: 'Artifact deleted successfully'
            });
          } else {
            return res.status(500).json({ error: 'Failed to delete artifact' });
          }
        }
      }

      return res.status(400).json({ error: 'Invalid delete request' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
