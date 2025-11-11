import { useState } from 'react'
import { uploadArtifactPhoto, uploadFBXModel, uploadArtifactTexture } from '../utils/firebaseUtils'

export default function ArtifactForm({ dropdownOptions, editingArtifact, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(editingArtifact || {
    name: '',
    owner: '',
    type: '',
    photo: '',
    description: '',
    modelPath: '',
    texturePath: '',
    toggleableMeshes: '',
  })
  const [photoPreview, setPhotoPreview] = useState(editingArtifact?.photo || '')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ photo: false, model: false, texture: false })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }

      // Show preview immediately
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhotoPreview(event.target.result)
      }
      reader.readAsDataURL(file)

      // Upload to Firebase Storage
      setUploadProgress(prev => ({ ...prev, photo: true }))
      try {
        const downloadURL = await uploadArtifactPhoto(file, editingArtifact?.id || 'temp')
        setFormData(prev => ({ ...prev, photo: downloadURL }))
      } catch (error) {
        alert('Failed to upload photo: ' + error.message)
        setPhotoPreview('')
      } finally {
        setUploadProgress(prev => ({ ...prev, photo: false }))
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Artifact name is required')
      return
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold space-y-6" style={{ fontFamily: 'Crimson Text, serif' }}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <FormInput
          label="Name"
          value={formData.name}
          onChange={(value) => handleInputChange('name', value)}
          required
        />
        <FormInput
          label="Owner"
          value={formData.owner}
          onChange={(value) => handleInputChange('owner', value)}
        />
        <FormSelect
          label="Type"
          value={formData.type}
          onChange={(value) => handleInputChange('type', value)}
          options={[
            { value: '', label: 'Select Type' },
            { value: 'Consumable', label: 'Consumable' },
            { value: 'Weapon', label: 'Weapon' },
            { value: 'Armor', label: 'Armor' },
            { value: 'Accessory', label: 'Accessory' },
            { value: 'Currency', label: 'Currency' }
          ]}
        />
      </div>

      {/* Photo Upload Section */}
      <div className="bg-parchment-dark p-4 rounded border-2 border-gold-dark">
        <label className="block text-sm font-medieval text-wood-light mb-3">Artifact Photo</label>
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="w-full px-4 py-2 border-2 border-gold-dark rounded bg-parchment text-wood cursor-pointer"
            />
          </div>
          {photoPreview && (
            <div className="w-24 h-24 border-2 border-gold rounded overflow-hidden">
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medieval text-wood-light mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full px-4 py-2 border-2 border-gold-dark rounded bg-parchment-dark text-wood focus:outline-none focus:border-gold h-24 resize-none"
          placeholder="Describe the artifact..."
        />
      </div>

      {/* 3D Model and Texture Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* FBX Model Upload */}
        <div className="bg-parchment-dark p-4 rounded border-2 border-gold-dark">
          <label className="block text-sm font-medieval text-wood-light mb-3">3D Model (FBX)</label>
          <div className="flex gap-2 items-center">
            <input
              type="file"
              accept=".fbx,.FBX"
              onChange={async (e) => {
                const file = e.target.files[0]
                if (file) {
                  setUploadProgress(prev => ({ ...prev, model: true }))
                  try {
                    const downloadURL = await uploadFBXModel(file, editingArtifact?.id || 'temp')
                    setFormData(prev => ({ ...prev, modelPath: downloadURL }))
                  } catch (error) {
                    alert('Failed to upload model: ' + error.message)
                  } finally {
                    setUploadProgress(prev => ({ ...prev, model: false }))
                  }
                }
              }}
              disabled={uploading || uploadProgress.model}
              className="flex-1 px-4 py-2 border-2 border-gold-dark rounded bg-parchment text-wood cursor-pointer text-sm disabled:opacity-50"
            />
            {uploadProgress.model && (
              <span className="text-yellow-400 text-xs animate-pulse">↑ Uploading...</span>
            )}
            {formData.modelPath && !uploadProgress.model && (
              <span className="text-green-400 text-xs">✓ Loaded</span>
            )}
          </div>
          <p className="text-xs text-wood-light mt-2">Upload .fbx model file</p>
        </div>

        {/* Texture Upload */}
        <div className="bg-parchment-dark p-4 rounded border-2 border-gold-dark">
          <label className="block text-sm font-medieval text-wood-light mb-3">Texture (Image)</label>
          <div className="flex gap-2 items-center">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0]
                if (file) {
                  setUploadProgress(prev => ({ ...prev, texture: true }))
                  try {
                    const downloadURL = await uploadArtifactTexture(file, editingArtifact?.id || 'temp')
                    setFormData(prev => ({ ...prev, texturePath: downloadURL }))
                  } catch (error) {
                    alert('Failed to upload texture: ' + error.message)
                  } finally {
                    setUploadProgress(prev => ({ ...prev, texture: false }))
                  }
                }
              }}
              disabled={uploading || uploadProgress.texture}
              className="flex-1 px-4 py-2 border-2 border-gold-dark rounded bg-parchment text-wood cursor-pointer text-sm disabled:opacity-50"
            />
            {uploadProgress.texture && (
              <span className="text-yellow-400 text-xs animate-pulse">↑ Uploading...</span>
            )}
            {formData.texturePath && !uploadProgress.texture && (
              <span className="text-green-400 text-xs">✓ Loaded</span>
            )}
          </div>
          <p className="text-xs text-wood-light mt-2">Upload texture image file</p>
        </div>
      </div>

      {/* Toggleable Meshes */}
      <div>
        <label className="block text-sm font-medieval text-wood-light mb-2">Toggleable Meshes (comma-separated)</label>
        <input
          type="text"
          value={formData.toggleableMeshes}
          onChange={(e) => handleInputChange('toggleableMeshes', e.target.value)}
          className="w-full px-4 py-2 border-2 border-gold-dark rounded bg-parchment-dark text-wood focus:outline-none focus:border-gold"
          placeholder="e.g., Sheath, Handle, Blade"
        />
        <p className="text-xs text-wood-light mt-1">Names of mesh parts that can be toggled on/off in the viewer</p>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded font-medieval"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-seal text-parchment hover:bg-seal-light transition rounded font-medieval"
        >
          {editingArtifact ? 'Update Artifact' : 'Add Artifact'}
        </button>
      </div>
    </form>
  )
}

function FormInput({ label, value, onChange, type = 'text', placeholder = '', required = false }) {
  return (
    <div>
      <label className="block text-sm font-medieval text-wood-light mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border-2 border-gold-dark rounded bg-parchment-dark text-wood focus:outline-none focus:border-gold"
        placeholder={placeholder}
        required={required}
      />
    </div>
  )
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medieval text-wood-light mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border-2 border-gold-dark rounded bg-parchment-dark text-wood focus:outline-none focus:border-gold"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
