import { useState } from 'react'
import CharacterForm from './CharacterForm'
import ArtifactForm from './ArtifactForm'
import { getImageSource } from '../utils/imageUtils'

/**
 * AdminPanel Component
 *
 * Password-protected admin interface for managing characters and artifacts
 *
 * Two modes:
 * 1. NOT AUTHENTICATED: Shows password login form
 * 2. AUTHENTICATED: Shows full admin interface with CRUD operations
 *
 * Displays:
 * - Character list with edit/delete/export buttons
 * - Add/edit character form (modal)
 * - Artifact list with edit/delete buttons
 * - Add/edit artifact form (modal)
 * - Confirmation dialogs for destructive actions
 *
 * All actual database operations are handled by parent (App.jsx)
 * This component just manages UI state and calls callback functions
 */
export default function AdminPanel({
  // Authentication
  authenticated, // Boolean: is admin logged in?
  onLogin, // Callback: (password) => void
  password, // Current password input value
  setPassword, // Setter for password input

  // Data
  characters, // Array of all characters
  artifacts, // Array of all artifacts
  dropdownOptions, // Config for form selects

  // Character CRUD callbacks from App.jsx
  onAddCharacter, // (character) => void
  onUpdateCharacter, // (character) => void
  onDeleteCharacter, // (characterId) => void

  // Artifact CRUD callbacks from App.jsx
  onAddArtifact, // (artifact) => void
  onUpdateArtifact, // (artifact) => void
  onDeleteArtifact, // (artifactId) => void
}) {
  // ============== UI STATE ==============
  const [showCharacterForm, setShowCharacterForm] = useState(false) // Show character add/edit form?
  const [showArtifactForm, setShowArtifactForm] = useState(false) // Show artifact add/edit form?
  const [editingCharacter, setEditingCharacter] = useState(null) // Character being edited (null = adding new)
  const [editingArtifact, setEditingArtifact] = useState(null) // Artifact being edited (null = adding new)
  const [confirmDialog, setConfirmDialog] = useState(null) // Delete confirmation modal data

  /**
   * Export a single character as JSON file
   * User clicks "Download" and gets a JSON file they can share or backup
   * Filename is based on character name
   */
  const exportCharacterAsJSON = (character) => {
    const dataToExport = {
      character: character
    }
    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${character.name.replace(/\s+/g, '_')}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  /**
   * Import characters from JSON file
   * Prevents duplicate imports by checking for existing IDs
   * Shows success message with count of imported characters
   */
  const handleImportCharacters = async (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result)
          const charsToImport = data.characters || []

          if (charsToImport.length === 0) {
            alert('No characters found in file')
            return
          }

          // Get existing character IDs to avoid duplicates
          const existingIds = new Set(characters.map(c => c.id))

          // Import each character sequentially with a small delay
          let imported = 0
          let skipped = 0
          for (const char of charsToImport) {
            // Skip if this character already exists
            if (existingIds.has(char.id)) {
              skipped++
              continue
            }

            const charWithId = { ...char, id: char.id || `char_${Date.now()}_${Math.random()}` }
            onAddCharacter(charWithId)
            // Wait a bit between imports to let Firebase process
            await new Promise(resolve => setTimeout(resolve, 100))
            imported++
          }

          alert(`Successfully imported ${imported} characters!${skipped > 0 ? ` (${skipped} skipped as duplicates)` : ''}`)
          event.target.value = '' // Reset file input
        } catch (error) {
          alert('Error parsing JSON file: ' + error.message)
        }
      }
      reader.readAsText(file)
    }
  }

if (!authenticated) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-parchment text-wood p-8 rounded-lg border-2 border-gold">
          <h2 className="text-2xl font-medieval font-bold mb-6 text-gold-dark">Admin Access</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medieval text-wood-light mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onLogin(password)}
                className="w-full px-4 py-2 border-2 border-gold-dark rounded bg-parchment-dark text-wood focus:outline-none focus:border-gold"
                placeholder="Enter admin password"
              />
            </div>
            <button
              onClick={() => onLogin(password)}
              className="w-full px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded font-medieval"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Character Management Section */}
      <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-medieval font-bold text-gold-dark">Character Management</h2>
          <div className="flex gap-2">
            <label className="px-4 py-2 bg-seal text-parchment hover:bg-seal-light transition rounded font-medieval cursor-pointer">
              Import Characters
              <input
                type="file"
                accept=".json"
                onChange={handleImportCharacters}
                className="hidden"
              />
            </label>
            <button
              onClick={() => {
                setShowCharacterForm(!showCharacterForm)
                setEditingCharacter(null)
              }}
              className="px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded font-medieval"
            >
              {showCharacterForm ? 'Cancel' : '+ Add Character'}
            </button>
          </div>
        </div>
      </div>

      {showCharacterForm && (
        <>
          <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold">
            <h3 className="text-xl font-medieval font-bold text-gold-dark mb-4">
              {editingCharacter ? 'Edit Character' : 'Add Character'}
            </h3>
          </div>
          <CharacterForm
            dropdownOptions={dropdownOptions}
            characters={characters}
            editingCharacter={editingCharacter}
            onSubmit={(character) => {
              if (editingCharacter) {
                onUpdateCharacter(character)
              } else {
                onAddCharacter(character)
              }
              setShowCharacterForm(false)
              setEditingCharacter(null)
            }}
            onCancel={() => {
              setShowCharacterForm(false)
              setEditingCharacter(null)
            }}
          />
        </>
      )}

      <div className="space-y-4">
        {characters.map(character => (
          <div
            key={character.id}
            className="bg-parchment text-wood p-4 rounded border-2 border-gold flex justify-between items-start gap-4"
          >
            {character.photo && (
              <div className="flex-shrink-0">
                <img
                  src={getImageSource(character.photo)}
                  alt={character.name}
                  className="w-16 h-20 object-cover rounded border border-gold-dark"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-medieval font-bold">{character.name}</h3>
              <p className="text-sm text-wood-light">
                {character.race} {character.class} • {character.vrcPlayerName}
              </p>
              <p className="text-xs text-gold-dark mt-1">
                {character.type === 'guild' ? 'Guild Member' : 'Criminal'} • {character.affiliation}
              </p>
              {character.pin && (
                <p className="text-sm font-bold text-seal-light mt-2">
                  PIN: <span className="font-mono bg-parchment px-2 py-1 rounded">{character.pin}</span>
                </p>
              )}
            </div>
            <div className="space-x-2 flex">
              <button
                onClick={() => {
                  setEditingCharacter(character)
                  setShowCharacterForm(true)
                  window.scrollTo(0, 0)
                }}
                className="px-3 py-1 bg-gold-dark text-parchment hover:bg-gold transition rounded text-sm font-medieval"
              >
                Edit
              </button>
              <button
                onClick={() => exportCharacterAsJSON(character)}
                className="px-3 py-1 bg-gold text-wood hover:bg-gold-light transition rounded text-sm font-medieval flex items-center gap-1"
              >
                <i className="ra ra-download" style={{ color: '#2a2420' }}></i>
                Export
              </button>
              <button
                onClick={() => {
                  setConfirmDialog({
                    title: `Delete ${character.name}?`,
                    message: 'This action cannot be undone.',
                    onConfirm: () => {
                      onDeleteCharacter(character.id)
                      setConfirmDialog(null)
                    },
                    onCancel: () => setConfirmDialog(null)
                  })
                }}
                className="px-3 py-1 bg-seal text-parchment hover:bg-seal-light transition rounded text-sm font-medieval"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Artifact Management Section */}
      <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-medieval font-bold text-gold-dark">Artifact Management</h2>
          <button
            onClick={() => {
              setShowArtifactForm(!showArtifactForm)
              setEditingArtifact(null)
            }}
            className="px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded font-medieval"
          >
            {showArtifactForm ? 'Cancel' : '+ Add Artifact'}
          </button>
        </div>
      </div>

      {showArtifactForm && (
        <>
          <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold">
            <h3 className="text-xl font-medieval font-bold text-gold-dark mb-4">
              {editingArtifact ? 'Edit Artifact' : 'Add Artifact'}
            </h3>
          </div>
          <ArtifactForm
            dropdownOptions={dropdownOptions}
            editingArtifact={editingArtifact}
            onSubmit={(artifact) => {
              if (editingArtifact) {
                onUpdateArtifact(artifact)
              } else {
                onAddArtifact(artifact)
              }
              setShowArtifactForm(false)
              setEditingArtifact(null)
            }}
            onCancel={() => {
              setShowArtifactForm(false)
              setEditingArtifact(null)
            }}
          />
        </>
      )}

      <div className="space-y-4">
        {artifacts && artifacts.length > 0 ? (
          artifacts.map(artifact => (
            <div
              key={artifact.id}
              className="bg-parchment text-wood p-4 rounded border-2 border-gold flex justify-between items-start gap-4"
            >
              {artifact.photo && (
                <div className="flex-shrink-0">
                  <img
                    src={getImageSource(artifact.photo)}
                    alt={artifact.name}
                    className="w-16 h-20 object-cover rounded border border-gold-dark"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-medieval font-bold">{artifact.name}</h3>
                <p className="text-sm text-wood-light">
                  {artifact.type} • Owner: {artifact.owner || '—'}
                </p>
              </div>
              <div className="space-x-2 flex">
                <button
                  onClick={() => {
                    setEditingArtifact(artifact)
                    setShowArtifactForm(true)
                    window.scrollTo(0, 0)
                  }}
                  className="px-3 py-1 bg-gold-dark text-parchment hover:bg-gold transition rounded text-sm font-medieval"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setConfirmDialog({
                      title: `Delete ${artifact.name}?`,
                      message: 'This action cannot be undone.',
                      onConfirm: () => {
                        onDeleteArtifact(artifact.id)
                        setConfirmDialog(null)
                      },
                      onCancel: () => setConfirmDialog(null)
                    })
                  }}
                  className="px-3 py-1 bg-seal text-parchment hover:bg-seal-light transition rounded text-sm font-medieval"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-parchment text-wood p-4 rounded border-2 border-gold text-center text-wood-light">
            <p>No artifacts yet. Add one to get started!</p>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-parchment text-wood p-8 rounded-lg border-2 border-gold max-w-md w-full mx-4">
            <h2 className="text-2xl font-medieval font-bold text-gold-dark mb-4">{confirmDialog.title}</h2>
            <p className="text-base mb-6">{confirmDialog.message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={confirmDialog.onCancel}
                className="px-6 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded font-medieval"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-6 py-2 bg-seal text-parchment hover:bg-seal-light transition rounded font-medieval"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
