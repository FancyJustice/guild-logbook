import { useState } from 'react'

export default function ArtifactForm({ dropdownOptions, editingArtifact, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(editingArtifact || {
    name: '',
    owner: '',
    type: '',
    photo: '',
    description: '',
    modelPath: '',
    texturePath: '',
  })
  const [photoPreview, setPhotoPreview] = useState(editingArtifact?.photo || '')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target.result
        setPhotoPreview(dataUrl)
        setFormData(prev => ({ ...prev, photo: dataUrl }))
      }
      reader.readAsDataURL(file)
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
          options={[{ value: '', label: 'Select Type' }, ...(dropdownOptions.artifactType || []).map(t => ({ value: t, label: t }))]}
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

      {/* 3D Model Paths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Model Path (FBX file)"
          value={formData.modelPath}
          onChange={(value) => handleInputChange('modelPath', value)}
          placeholder="e.g., /models/sword.fbx"
        />
        <FormInput
          label="Texture Path (Image file)"
          value={formData.texturePath}
          onChange={(value) => handleInputChange('texturePath', value)}
          placeholder="e.g., /textures/sword.jpg"
        />
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
