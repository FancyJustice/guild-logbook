import { useState } from 'react'
import CharacterForm from './CharacterForm'
import ArtifactForm from './ArtifactForm'
import { getImageSource } from '../utils/imageUtils'

export default function AdminPanel({
  authenticated,
  onLogin,
  password,
  setPassword,
  characters,
  artifacts,
  dropdownOptions,
  onAddCharacter,
  onUpdateCharacter,
  onDeleteCharacter,
  onAddArtifact,
  onUpdateArtifact,
  onDeleteArtifact,
}) {
  const [showCharacterForm, setShowCharacterForm] = useState(false)
  const [showArtifactForm, setShowArtifactForm] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState(null)
  const [editingArtifact, setEditingArtifact] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState(null)

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
            </div>
            <div className="space-x-2 flex">
              <button
                onClick={() => {
                  setEditingCharacter(character)
                  setShowCharacterForm(true)
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
