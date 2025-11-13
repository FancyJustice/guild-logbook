import { useState } from 'react'
import CollapsibleAdminItem from './CollapsibleAdminItem'
import CharacterForm from './CharacterForm'

export default function AdminCharacterList({
  characters,
  searchTerm,
  dropdownOptions,
  onAddCharacter,
  onUpdateCharacter,
  onDeleteCharacter,
  onGeneratePins,
}) {
  const [expandedId, setExpandedId] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])

  // Filter characters by search term
  const filteredCharacters = characters.filter(char =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleSelectChange = (id, isSelected) => {
    if (isSelected) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter(sid => sid !== id))
    }
  }

  const handleSelectAll = () => {
    if (selectedIds.length === filteredCharacters.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredCharacters.map(c => c.id))
    }
  }

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return
    if (window.confirm(`Delete ${selectedIds.length} characters? This cannot be undone.`)) {
      selectedIds.forEach(id => onDeleteCharacter(id))
      setSelectedIds([])
    }
  }

  const handleSaveEdit = (charId, formData) => {
    const dataToSave = { ...formData, id: charId }
    onUpdateCharacter(dataToSave)
    setExpandedId(null)
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <button
          onClick={onGeneratePins}
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition rounded font-medieval"
        >
          🎲 Generate Random PINs
        </button>

        {selectedIds.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1 bg-gray-500 text-white hover:bg-gray-600 transition rounded text-sm"
            >
              Deselect All
            </button>
            <button
              onClick={handleDeleteSelected}
              className="px-3 py-1 bg-red-700 text-white hover:bg-red-800 transition rounded text-sm"
            >
              Delete Selected ({selectedIds.length})
            </button>
          </div>
        )}

        {selectedIds.length === 0 && filteredCharacters.length > 0 && (
          <button
            onClick={handleSelectAll}
            className="px-3 py-1 bg-gray-500 text-white hover:bg-gray-600 transition rounded text-sm"
          >
            Select All
          </button>
        )}
      </div>

      {/* Character Count */}
      <div className="text-sm text-parchment-dark">
        {filteredCharacters.length === characters.length
          ? `${characters.length} characters`
          : `${filteredCharacters.length} of ${characters.length} characters`}
      </div>

      {/* Character List */}
      {filteredCharacters.length > 0 ? (
        <div className="space-y-3">
          {filteredCharacters.map(character => (
            <CollapsibleAdminItem
              key={character.id}
              item={character}
              itemType="character"
              isExpanded={expandedId === character.id}
              onToggleExpand={() => handleToggleExpand(character.id)}
              onDelete={() => onDeleteCharacter(character.id)}
              isSelected={selectedIds.includes(character.id)}
              onSelectChange={(isSelected) => handleSelectChange(character.id, isSelected)}
            >
              <CharacterForm
                dropdownOptions={dropdownOptions}
                characters={characters}
                editingCharacter={character}
                onSubmit={(formData) => handleSaveEdit(character.id, formData)}
                onCancel={() => setExpandedId(null)}
              />
            </CollapsibleAdminItem>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-parchment-dark">
          {characters.length === 0 ? 'No characters yet' : 'No characters match your search'}
        </div>
      )}
    </div>
  )
}
