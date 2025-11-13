import { useState } from 'react'
import { getImageSource } from '../utils/imageUtils'
import { getPlaceholderImage } from '../utils/placeholderUtils'

export default function LoreDetail({ lore, characters, artifacts, onBack, onEdit = null, isAdmin = false, dropdownOptions = {} }) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [editData, setEditData] = useState(lore)

  // Get related characters
  const relatedCharacters = characters.filter(char =>
    (lore.type === 'place' && char.placeOfOrigin === lore.name) ||
    (lore.type === 'affiliation' && char.affiliation === lore.name)
  )

  // Get related artifacts
  const relatedArtifacts = artifacts.filter(art =>
    art.name.toLowerCase().includes(lore.name.toLowerCase()) ||
    art.owner?.toLowerCase().includes(lore.name.toLowerCase()) ||
    art.description?.toLowerCase().includes(lore.name.toLowerCase())
  )

  const handleEditClick = () => {
    if (isAdmin) {
      setIsEditMode(true)
      setEditData(lore)
    }
  }

  const handleSaveEdit = (updatedData) => {
    if (onEdit) {
      const dataToSave = { ...updatedData, id: lore.id }
      onEdit(dataToSave)
    }
    setIsEditMode(false)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setEditData(lore)
  }

  if (isEditMode) {
    return (
      <div className="bg-parchment text-wood p-6 rounded-lg border-4 border-gold">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medieval font-bold text-gold-dark">Edit {lore.name}</h2>
          <button
            onClick={handleCancelEdit}
            className="px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded font-medieval"
          >
            Close
          </button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault()
          handleSaveEdit(editData)
        }} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medieval mb-2">Name</label>
            <input
              type="text"
              value={editData.name || ''}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-3 py-2 bg-wood text-parchment rounded border border-gold-dark"
            />
          </div>
          <div>
            <label className="block text-sm font-medieval mb-2">Type</label>
            <select
              value={editData.type || 'place'}
              onChange={(e) => setEditData({ ...editData, type: e.target.value })}
              className="w-full px-3 py-2 bg-wood text-parchment rounded border border-gold-dark"
            >
              <option value="place">Place of Origin</option>
              <option value="affiliation">Affiliation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medieval mb-2">Description</label>
            <textarea
              value={editData.description || ''}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              rows="8"
              className="w-full px-3 py-2 bg-wood text-parchment rounded border border-gold-dark font-serif"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded font-cinzel"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex-1 px-4 py-2 bg-wood-light text-parchment hover:bg-wood transition rounded font-cinzel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Location Photo */}
      <div className="bg-parchment text-wood p-0 rounded-lg border-4 border-gold overflow-hidden">
        <div className="w-full h-64 overflow-hidden">
          <img
            src={lore.photo ? getImageSource(lore.photo) : getPlaceholderImage(lore.type)}
            alt={lore.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Header */}
      <div className="bg-parchment text-wood p-6 rounded-lg border-4 border-gold">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm font-medieval text-gold-dark mb-1">
              {lore.type === 'place' ? 'PLACE OF ORIGIN' : 'AFFILIATION'}
            </div>
            <h1 className="text-4xl font-medieval font-bold text-wood mb-4">{lore.name}</h1>
          </div>
          {isAdmin && (
            <button
              onClick={handleEditClick}
              className="px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded font-medieval"
            >
              ✏️ Edit
            </button>
          )}
        </div>

        {/* Description */}
        {lore.description ? (
          <div className="mt-4 text-lg leading-relaxed border-t border-gold-dark pt-4">
            {lore.description.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-3">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-lg text-parchment-dark border-t border-gold-dark pt-4">
            No description added yet
          </div>
        )}
      </div>

      {/* Related Characters */}
      {relatedCharacters.length > 0 && (
        <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold">
          <h2 className="text-2xl font-medieval font-bold text-gold-dark mb-4">
            Related Characters ({relatedCharacters.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedCharacters.map(char => (
              <div
                key={char.id}
                className="bg-wood-light rounded-lg overflow-hidden border-2 border-gold text-center cursor-pointer hover:shadow-lg transition"
              >
                {/* Square photo container */}
                <div className="aspect-square overflow-hidden bg-wood">
                  <img
                    src={char.photo ? getImageSource(char.photo) : getPlaceholderImage('character')}
                    alt={char.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <h3 className="font-medieval font-bold text-wood text-sm truncate">{char.name}</h3>
                  <p className="text-xs text-wood-light">{char.race} {char.class}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Artifacts */}
      {relatedArtifacts.length > 0 && (
        <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold">
          <h2 className="text-2xl font-medieval font-bold text-gold-dark mb-4">
            Related Artifacts ({relatedArtifacts.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedArtifacts.map(art => (
              <div key={art.id} className="bg-wood-light rounded-lg overflow-hidden border-2 border-gold p-3">
                <div className="flex gap-3">
                  {art.photo && (
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={getImageSource(art.photo)}
                        alt={art.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medieval font-bold text-wood">{art.name}</h3>
                    <p className="text-xs text-wood-light">{art.type} • {art.owner}</p>
                    {art.description && (
                      <p className="text-xs mt-1 line-clamp-2">{art.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="flex justify-start pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gold-dark text-parchment hover:bg-gold transition rounded font-medieval"
        >
          ← Back
        </button>
      </div>
    </div>
  )
}
