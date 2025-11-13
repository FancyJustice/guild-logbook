import { useState } from 'react'
import { getImageSource } from '../utils/imageUtils'
import { getPlaceholderImage } from '../utils/placeholderUtils'

export default function LoreForm({ editingLore, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(editingLore ? {
    ...editingLore,
  } : {
    name: '',
    type: 'place',
    description: '',
    photo: '',
  })

  const [photoPreview, setPhotoPreview] = useState(editingLore?.photo || null)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          // Resize to 400x300 for lore photos
          const canvas = document.createElement('canvas')
          canvas.width = 400
          canvas.height = 300
          const ctx = canvas.getContext('2d')

          const imgRatio = img.width / img.height
          const canvasRatio = 400 / 300
          let drawWidth, drawHeight, offsetX = 0, offsetY = 0

          if (imgRatio > canvasRatio) {
            drawHeight = 300
            drawWidth = 300 * imgRatio
            offsetX = (drawWidth - 400) / 2
          } else {
            drawWidth = 400
            drawHeight = 400 / imgRatio
            offsetY = (drawHeight - 300) / 2
          }

          ctx.drawImage(img, -offsetX, -offsetY, drawWidth, drawHeight)
          const dataUrl = canvas.toDataURL('image/png')
          setPhotoPreview(dataUrl)
          handleInputChange('photo', dataUrl)
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Error uploading photo')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Please enter a lore name')
      return
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medieval mb-2">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter lore name..."
          className="w-full px-3 py-2 bg-wood text-parchment rounded border border-gold-dark"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medieval mb-2">Type</label>
        <select
          value={formData.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
          className="w-full px-3 py-2 bg-wood text-parchment rounded border border-gold-dark"
        >
          <option value="place">Place of Origin</option>
          <option value="affiliation">Affiliation</option>
        </select>
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medieval mb-2">Location Photo</label>
        <div className="mb-3">
          <div className="w-full h-40 rounded border-2 border-gold-dark overflow-hidden bg-wood-light">
            <img
              src={photoPreview || getPlaceholderImage(formData.type)}
              alt="Lore preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="w-full text-parchment"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medieval mb-2">Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter lore description (optional)..."
          rows="6"
          className="w-full px-3 py-2 bg-wood text-parchment rounded border border-gold-dark font-serif"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded font-cinzel"
        >
          Save Lore
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-wood-light text-parchment hover:bg-wood transition rounded font-cinzel"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
