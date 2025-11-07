import { useState } from 'react'
import CharacterForm from './CharacterForm'

export default function AdminPanel({
  authenticated,
  onLogin,
  password,
  setPassword,
  characters,
  dropdownOptions,
  onAddCharacter,
  onUpdateCharacter,
  onDeleteCharacter,
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState(null)

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
      <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-medieval font-bold text-gold-dark">Character Management</h2>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingCharacter(null)
            }}
            className="px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded font-medieval"
          >
            {showForm ? 'Cancel' : '+ Add Character'}
          </button>
        </div>
      </div>

      {showForm && (
        <CharacterForm
          dropdownOptions={dropdownOptions}
          editingCharacter={editingCharacter}
          onSubmit={(character) => {
            if (editingCharacter) {
              onUpdateCharacter(character)
            } else {
              onAddCharacter(character)
            }
            setShowForm(false)
            setEditingCharacter(null)
          }}
          onCancel={() => {
            setShowForm(false)
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
    </div>
  )
}
