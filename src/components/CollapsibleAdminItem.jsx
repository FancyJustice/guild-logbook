import { useState } from 'react'
import { getImageSource } from '../utils/imageUtils'
import { getPlaceholderImage } from '../utils/placeholderUtils'

/**
 * Reusable collapsible item component for admin panel
 * Shows thumbnail + name + type when collapsed
 * Shows expanded content (form) when clicked
 */
export default function CollapsibleAdminItem({
  item,
  itemType, // 'character', 'artifact', 'lore'
  isExpanded,
  onToggleExpand,
  onDelete,
  onSelectChange,
  isSelected,
  children, // Expanded content (form)
}) {
  const getTypeDisplay = () => {
    if (itemType === 'character') {
      return item.type === 'guild' ? 'Guild' : 'Criminal'
    }
    if (itemType === 'artifact') {
      return item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'Artifact'
    }
    if (itemType === 'lore') {
      return item.type === 'place' ? 'Place' : 'Affiliation'
    }
    return 'Item'
  }

  const getThumbnail = () => {
    if (item.photo) {
      return getImageSource(item.photo)
    }
    return getPlaceholderImage(itemType === 'lore' ? (item.type || 'place') : itemType)
  }

  return (
    <div className="border border-gold-dark rounded-lg overflow-hidden bg-parchment">
      {/* Collapsed View */}
      {!isExpanded ? (
        <div
          onClick={() => onToggleExpand()}
          className="flex items-center gap-4 p-3 cursor-pointer hover:bg-gold-dark hover:bg-opacity-10 transition"
        >
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation()
              onSelectChange(e.target.checked)
            }}
            className="w-5 h-5 cursor-pointer"
          />

          {/* Thumbnail */}
          <div className="w-16 h-20 rounded overflow-hidden flex-shrink-0 border border-gold-dark bg-wood-light">
            <img
              src={getThumbnail()}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name & Type */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medieval font-bold text-wood truncate">{item.name || 'Unnamed'}</h3>
            <p className="text-xs text-wood-light">{getTypeDisplay()}</p>
          </div>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (window.confirm(`Delete "${item.name}"?`)) {
                onDelete()
              }
            }}
            className="px-3 py-1 bg-red-700 text-white hover:bg-red-800 transition rounded text-sm"
          >
            ✕
          </button>
        </div>
      ) : (
        /* Expanded View */
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gold-dark">
            <h3 className="font-medieval font-bold text-wood text-lg">Edit {item.name}</h3>
            <button
              onClick={() => onToggleExpand()}
              className="px-3 py-1 bg-gold-dark text-parchment hover:bg-gold transition rounded text-sm"
            >
              Close
            </button>
          </div>

          {/* Expanded Content (Form) */}
          <div className="overflow-auto max-h-96">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
