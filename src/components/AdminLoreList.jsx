import { useState } from 'react'
import CollapsibleAdminItem from './CollapsibleAdminItem'
import LoreForm from './LoreForm'

export default function AdminLoreList({
  lore,
  characters,
  artifacts,
  searchTerm,
  onUpdateLore,
  onDeleteLore,
}) {
  const [expandedId, setExpandedId] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [typeFilter, setTypeFilter] = useState('all') // 'all', 'place', 'affiliation'

  // Filter lore by search term and type
  const filteredLore = lore.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || l.type === typeFilter
    return matchesSearch && matchesType
  })

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
    if (selectedIds.length === filteredLore.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredLore.map(l => l.id))
    }
  }

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return
    if (window.confirm(`Delete ${selectedIds.length} lore entries? This cannot be undone.`)) {
      selectedIds.forEach(id => onDeleteLore(id))
      setSelectedIds([])
    }
  }

  const handleSaveEdit = (loreId, formData) => {
    const dataToSave = { ...formData, id: loreId }
    onUpdateLore(dataToSave)
    setExpandedId(null)
  }

  const getRelatedCount = (loreEntry) => {
    const relatedChars = characters.filter(c =>
      (loreEntry.type === 'place' && c.placeOfOrigin === loreEntry.name) ||
      (loreEntry.type === 'affiliation' && c.affiliation === loreEntry.name)
    )
    const relatedArts = artifacts.filter(a =>
      a.name.toLowerCase().includes(loreEntry.name.toLowerCase()) ||
      a.owner?.toLowerCase().includes(loreEntry.name.toLowerCase())
    )
    return `${relatedChars.length} chars, ${relatedArts.length} artifacts`
  }

  return (
    <div className="space-y-4">
      {/* Type Filter */}
      <div className="flex gap-2">
        {['all', 'place', 'affiliation'].map(type => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-3 py-1 rounded text-sm transition ${
              typeFilter === type
                ? 'bg-gold text-wood font-medieval'
                : 'bg-gold-dark text-parchment hover:bg-gold'
            }`}
          >
            {type === 'all' ? 'All' : type === 'place' ? 'Places' : 'Affiliations'}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <div></div>

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

        {selectedIds.length === 0 && filteredLore.length > 0 && (
          <button
            onClick={handleSelectAll}
            className="px-3 py-1 bg-gray-500 text-white hover:bg-gray-600 transition rounded text-sm"
          >
            Select All
          </button>
        )}
      </div>

      {/* Lore Count */}
      <div className="text-sm text-parchment-dark">
        {filteredLore.length === lore.length
          ? `${lore.length} lore entries`
          : `${filteredLore.length} of ${lore.length} lore entries`}
      </div>

      {/* Lore List */}
      {filteredLore.length > 0 ? (
        <div className="space-y-3">
          {filteredLore.map(loreEntry => (
            <CollapsibleAdminItem
              key={loreEntry.id}
              item={loreEntry}
              itemType="lore"
              isExpanded={expandedId === loreEntry.id}
              onToggleExpand={() => handleToggleExpand(loreEntry.id)}
              onDelete={() => onDeleteLore(loreEntry.id)}
              isSelected={selectedIds.includes(loreEntry.id)}
              onSelectChange={(isSelected) => handleSelectChange(loreEntry.id, isSelected)}
            >
              <div className="space-y-2 mb-4 text-sm text-parchment-dark">
                <p><strong>Related:</strong> {getRelatedCount(loreEntry)}</p>
              </div>
              <LoreForm
                editingLore={loreEntry}
                onSubmit={(formData) => handleSaveEdit(loreEntry.id, formData)}
                onCancel={() => setExpandedId(null)}
              />
            </CollapsibleAdminItem>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-parchment-dark">
          {lore.length === 0 ? 'No lore entries yet' : 'No lore entries match your search'}
        </div>
      )}
    </div>
  )
}
