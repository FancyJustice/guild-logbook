import { useState } from 'react'
import CharacterForm from './CharacterForm'
import ArtifactForm from './ArtifactForm'

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

      {showCharacterForm && (
        <CharacterForm
          dropdownOptions={dropdownOptions}
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
      )}

      <div className="space-y-4">
        {characters.map(character => (
          <div
            key={character.id}
            className="bg-parchment text-wood p-4 rounded border-2 border-gold flex justify-between items-start"
          >
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
                  setShowForm(true)
                }}
                className="px-3 py-1 bg-gold-dark text-parchment hover:bg-gold transition rounded text-sm font-medieval"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete ${character.name}?`)) {
                    onDeleteCharacter(character.id)
                  }
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
      )}

      <div className="space-y-4">
        {artifacts && artifacts.length > 0 ? (
          artifacts.map(artifact => (
            <div
              key={artifact.id}
              className="bg-parchment text-wood p-4 rounded border-2 border-gold flex justify-between items-start"
            >
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
                    if (confirm(`Delete ${artifact.name}?`)) {
                      onDeleteArtifact(artifact.id)
                    }
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
    </div>
  )
}
