import { useState } from 'react'
import CollapsibleAdminItem from './CollapsibleAdminItem'
import ArtifactForm from './ArtifactForm'

export default function AdminArtifactList({
  artifacts,
  searchTerm,
  dropdownOptions,
  onUpdateArtifact,
  onDeleteArtifact,
}) {
  const [expandedId, setExpandedId] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])

  // Filter artifacts by search term
  const filteredArtifacts = artifacts.filter(art =>
    art.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    if (selectedIds.length === filteredArtifacts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredArtifacts.map(a => a.id))
    }
  }

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return
    if (window.confirm(`Delete ${selectedIds.length} artifacts? This cannot be undone.`)) {
      selectedIds.forEach(id => onDeleteArtifact(id))
      setSelectedIds([])
    }
  }

  const handleSaveEdit = (artifactId, formData) => {
    const dataToSave = { ...formData, id: artifactId }
    onUpdateArtifact(dataToSave)
    setExpandedId(null)
  }

  return (
    <div className="space-y-4">
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

        {selectedIds.length === 0 && filteredArtifacts.length > 0 && (
          <button
            onClick={handleSelectAll}
            className="px-3 py-1 bg-gray-500 text-white hover:bg-gray-600 transition rounded text-sm"
          >
            Select All
          </button>
        )}
      </div>

      {/* Artifact Count */}
      <div className="text-sm text-parchment-dark">
        {filteredArtifacts.length === artifacts.length
          ? `${artifacts.length} artifacts`
          : `${filteredArtifacts.length} of ${artifacts.length} artifacts`}
      </div>

      {/* Artifact List */}
      {filteredArtifacts.length > 0 ? (
        <div className="space-y-3">
          {filteredArtifacts.map(artifact => (
            <CollapsibleAdminItem
              key={artifact.id}
              item={artifact}
              itemType="artifact"
              isExpanded={expandedId === artifact.id}
              onToggleExpand={() => handleToggleExpand(artifact.id)}
              onDelete={() => onDeleteArtifact(artifact.id)}
              isSelected={selectedIds.includes(artifact.id)}
              onSelectChange={(isSelected) => handleSelectChange(artifact.id, isSelected)}
            >
              <ArtifactForm
                dropdownOptions={dropdownOptions}
                editingArtifact={artifact}
                onSubmit={(formData) => handleSaveEdit(artifact.id, formData)}
                onCancel={() => setExpandedId(null)}
              />
            </CollapsibleAdminItem>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-parchment-dark">
          {artifacts.length === 0 ? 'No artifacts yet' : 'No artifacts match your search'}
        </div>
      )}
    </div>
  )
}
