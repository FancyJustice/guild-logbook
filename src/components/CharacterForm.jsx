import { useState } from 'react'

export default function CharacterForm({ dropdownOptions, editingCharacter, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(editingCharacter ? {
    ...editingCharacter,
    observations: Array.isArray(editingCharacter.observations) ? editingCharacter.observations : (editingCharacter.observations ? [editingCharacter.observations] : []),
    combatSkills: editingCharacter.combatSkills || [],
    lifeSkills: editingCharacter.lifeSkills || [],
  } : {
    type: 'guild',
    photo: '',
    title: '',
    name: '',
    vrcPlayerName: '',
    gender: '',
    race: '',
    age: '',
    level: '',
    class: '',
    height: '',
    affiliation: '',
    placeOfOrigin: '',
    status: 'Active',
    rank: '',
    quote: '',
    lore: '',
    personality: '',
    flaw: '',
    elemeltanAttunement: '',
    combatSkills: [],
    lifeSkills: [],
    observations: [],
    bounty: '',
    crime: '',
    ultimateSkillColor: 'gold',
  })

  const [skillInput, setSkillInput] = useState('')
  const [skillDescription, setSkillDescription] = useState('')
  const [skillHeal, setSkillHeal] = useState(false)
  const [skillBuff, setSkillBuff] = useState(false)
  const [skillPassive, setSkillPassive] = useState(false)
  const [lifeSkillInput, setLifeSkillInput] = useState('')
  const [observationInput, setObservationInput] = useState('')
  const [photoPreview, setPhotoPreview] = useState(editingCharacter?.photo || '')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }

      // Create canvas to resize image to 230x300
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = 230
          canvas.height = 300
          const ctx = canvas.getContext('2d')

          // Calculate dimensions to maintain aspect ratio
          const imgRatio = img.width / img.height
          const canvasRatio = 230 / 300
          let drawWidth, drawHeight, offsetX = 0, offsetY = 0

          if (imgRatio > canvasRatio) {
            drawHeight = 300
            drawWidth = 300 * imgRatio
            offsetX = (drawWidth - 230) / 2
          } else {
            drawWidth = 230
            drawHeight = 230 / imgRatio
            offsetY = (drawHeight - 300) / 2
          }

          ctx.drawImage(img, -offsetX, -offsetY, drawWidth, drawHeight)
          const dataUrl = canvas.toDataURL('image/png')
          setPhotoPreview(dataUrl)
          setFormData(prev => ({ ...prev, photo: dataUrl }))
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        combatSkills: [...(prev.combatSkills || []), {
          name: skillInput.trim(),
          description: skillDescription.trim(),
          heal: skillHeal,
          buff: skillBuff,
          passive: skillPassive
        }]
      }))
      setSkillInput('')
      setSkillDescription('')
      setSkillHeal(false)
      setSkillBuff(false)
      setSkillPassive(false)
    }
  }

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      combatSkills: (prev.combatSkills || []).filter((_, i) => i !== index)
    }))
  }

  const handleAddLifeSkill = () => {
    if (lifeSkillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        lifeSkills: [...(prev.lifeSkills || []), lifeSkillInput.trim()]
      }))
      setLifeSkillInput('')
    }
  }

  const handleRemoveLifeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      lifeSkills: (prev.lifeSkills || []).filter((_, i) => i !== index)
    }))
  }

  const handleAddObservation = () => {
    if (observationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        observations: [...(prev.observations || []), observationInput.trim()]
      }))
      setObservationInput('')
    }
  }

  const handleRemoveObservation = (index) => {
    setFormData(prev => ({
      ...prev,
      observations: (prev.observations || []).filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold space-y-6" style={{ fontFamily: 'Crimson Text, serif' }}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <FormSelect
          label="Type"
          value={formData.type}
          onChange={(value) => handleInputChange('type', value)}
          options={[
            { value: 'guild', label: 'Guild Member' },
            { value: 'criminal', label: 'Criminal' },
          ]}
        />
        <FormInput
          label="Name"
          value={formData.name}
          onChange={(value) => handleInputChange('name', value)}
          required
        />
        <FormInput
          label="VRC Player Name"
          value={formData.vrcPlayerName}
          onChange={(value) => handleInputChange('vrcPlayerName', value)}
          required
        />
        <FormInput
          label="Title"
          value={formData.title}
          onChange={(value) => handleInputChange('title', value)}
        />
        <FormInput
          label="Gender"
          value={formData.gender}
          onChange={(value) => handleInputChange('gender', value)}
          placeholder="e.g., Male, Female, Non-binary"
        />
        <FormInput
          label="Race"
          value={formData.race}
          onChange={(value) => handleInputChange('race', value)}
          placeholder="e.g., Human, Elf, Dwarf"
        />
        <FormInput
          label="Class"
          value={formData.class}
          onChange={(value) => handleInputChange('class', value)}
          placeholder="e.g., Ranger, Mage, Warrior"
        />
        <FormInput
          label="Age"
          value={formData.age}
          onChange={(value) => handleInputChange('age', value)}
          placeholder="e.g., 25, Unknown, Ageless"
        />
        <FormInput
          label="Level"
          type="number"
          value={formData.level}
          onChange={(value) => handleInputChange('level', value)}
        />
        <FormInput
          label="Height"
          value={formData.height}
          onChange={(value) => handleInputChange('height', value)}
        />
        <FormInput
          label="Affiliation"
          value={formData.affiliation}
          onChange={(value) => handleInputChange('affiliation', value)}
        />
        <FormInput
          label="Place of Origin"
          value={formData.placeOfOrigin}
          onChange={(value) => handleInputChange('placeOfOrigin', value)}
        />
        <FormSelect
          label={formData.type === 'guild' ? 'Rank' : 'Threat Level'}
          value={formData.rank}
          onChange={(value) => handleInputChange('rank', value)}
          options={formData.type === 'guild'
            ? [{ value: '', label: 'Select Rank' }, ...(dropdownOptions.rank || []).map(r => ({ value: r, label: r }))]
            : [{ value: '', label: 'Select Threat Level' }, ...(dropdownOptions.threatLevel || []).map(t => ({ value: t, label: t }))]
          }
        />
        <FormInput
          label="Status"
          value={formData.status}
          onChange={(value) => handleInputChange('status', value)}
        />
      </div>

      {/* Photo Upload Section */}
      <div className="bg-parchment-dark p-4 rounded border-2 border-gold-dark">
        <label className="block text-sm font-medieval text-wood-light mb-3">Profile Photo (230x300 PNG)</label>
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border-2 border-gold-dark rounded bg-parchment-dark text-wood focus:outline-none focus:border-gold text-sm cursor-pointer"
            />
            <p className="text-xs text-wood-light mt-2">Upload PNG, JPG, or other image format. Will be automatically resized to 230x300.</p>
          </div>
          {photoPreview && (
            <div className="w-32 flex-shrink-0">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-auto border-2 border-gold rounded"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {formData.type === 'guild' ? (
          <FormSelect
            label="Personality"
            value={formData.personality}
            onChange={(value) => handleInputChange('personality', value)}
            options={[{ value: '', label: 'Select Personality' }, ...(dropdownOptions.personality || []).map(p => ({ value: p, label: p }))]}
          />
        ) : (
          <FormSelect
            label="Personality"
            value={formData.personality}
            onChange={(value) => handleInputChange('personality', value)}
            options={[{ value: '', label: 'Select Flaw' }, ...(dropdownOptions.flaw || []).map(f => ({ value: f, label: f }))]}
          />
        )}
        {formData.type === 'guild' && (
          <FormSelect
            label="Flaw"
            value={formData.flaw}
            onChange={(value) => handleInputChange('flaw', value)}
            options={[{ value: '', label: 'Select Flaw' }, ...(dropdownOptions.flaw || []).map(f => ({ value: f, label: f }))]}
          />
        )}
        <FormSelect
          label="Elemental Attunement"
          value={formData.elemeltanAttunement}
          onChange={(value) => handleInputChange('elemeltanAttunement', value)}
          options={[{ value: '', label: 'Select Attunement' }, ...(dropdownOptions.elemeltanAttunement || []).map(a => ({ value: a, label: a }))]}
        />
      </div>

      <div>
        <label className="block text-sm font-medieval text-wood-light mb-2">Quote</label>
        <textarea
          value={formData.quote}
          onChange={(e) => handleInputChange('quote', e.target.value)}
          className="w-full px-3 py-2 border-2 border-gold-dark rounded bg-parchment-dark text-wood focus:outline-none focus:border-gold"
          rows="2"
        />
      </div>

      <div>
        <label className="block text-sm font-medieval text-wood-light mb-2">Lore</label>
        <textarea
          value={formData.lore}
          onChange={(e) => handleInputChange('lore', e.target.value)}
          className="w-full px-3 py-2 border-2 border-gold-dark rounded bg-parchment-dark text-wood focus:outline-none focus:border-gold"
          rows="4"
        />
      </div>

      {/* Combat Skills */}
      <div>
        <label className="block text-sm font-medieval text-wood-light mb-2">Combat Skills & Spells</label>
        <div className="space-y-2 mb-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gold-dark rounded bg-parchment-dark text-wood focus:outline-none focus:border-gold"
            placeholder="Enter skill name"
          />
          <textarea
            value={skillDescription}
            onChange={(e) => setSkillDescription(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gold-dark rounded bg-parchment-dark text-wood focus:outline-none focus:border-gold text-sm"
            placeholder="Enter skill description (optional)"
            rows="2"
          />
          <div className="grid grid-cols-3 gap-2">
            <label className="flex items-center gap-2 text-sm text-wood-light cursor-pointer">
              <input
                type="checkbox"
                checked={skillHeal}
                onChange={(e) => setSkillHeal(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              Heal
            </label>
            <label className="flex items-center gap-2 text-sm text-wood-light cursor-pointer">
              <input
                type="checkbox"
                checked={skillBuff}
                onChange={(e) => setSkillBuff(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              Buff
            </label>
            <label className="flex items-center gap-2 text-sm text-wood-light cursor-pointer">
              <input
                type="checkbox"
                checked={skillPassive}
                onChange={(e) => setSkillPassive(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              Passive
            </label>
          </div>
          <button
            type="button"
            onClick={handleAddSkill}
            className="w-full px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded text-sm"
          >
            Add Skill
          </button>
        </div>
        <div className="space-y-2">
          {(formData.combatSkills || []).map((skill, idx) => {
            const isLastSkill = idx === (formData.combatSkills || []).length - 1
            const isUltimate = typeof skill !== 'string' && skill.isUltimate
            const skillObj = typeof skill === 'string' ? { name: skill, description: '' } : skill

            const toggleParameter = (param) => {
              const updatedSkills = [...(formData.combatSkills || [])]
              updatedSkills[idx] = { ...skillObj, [param]: !skillObj[param] }
              setFormData(prev => ({ ...prev, combatSkills: updatedSkills }))
            }

            const moveSkill = (newIdx) => {
              const updatedSkills = [...(formData.combatSkills || [])]
              const [moved] = updatedSkills.splice(idx, 1)
              updatedSkills.splice(newIdx, 0, moved)
              setFormData(prev => ({ ...prev, combatSkills: updatedSkills }))
            }

            return (
              <div key={idx} className={`bg-parchment-dark p-3 rounded border-l-4 ${isUltimate ? 'border-ultimate' : 'border-gold'}`}>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => moveSkill(idx - 1)}
                        className="px-2 py-1 bg-gold-dark text-parchment hover:bg-gold transition rounded text-sm"
                        title="Move up"
                      >
                        ↑
                      </button>
                    )}
                    {idx < (formData.combatSkills || []).length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveSkill(idx + 1)}
                        className="px-2 py-1 bg-gold-dark text-parchment hover:bg-gold transition rounded text-sm"
                        title="Move down"
                      >
                        ↓
                      </button>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`font-bold ${isUltimate ? 'ultimate-skill text-lg' : 'text-wood'}`}>
                      {skillObj.name}
                      {isUltimate && ' ⚡'}
                    </div>
                    {skillObj.description && (
                      <div className="text-sm text-wood-light mt-1">{skillObj.description}</div>
                    )}
                    <div className="flex gap-1 mt-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => toggleParameter('heal')}
                        className={`text-xs px-2 py-1 rounded transition ${skillObj.heal ? 'bg-green-900 text-green-100' : 'bg-gray-600 text-gray-200'}`}
                      >
                        💚 Heal
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleParameter('buff')}
                        className={`text-xs px-2 py-1 rounded transition ${skillObj.buff ? 'bg-blue-900 text-blue-100' : 'bg-gray-600 text-gray-200'}`}
                      >
                        ⬆️ Buff
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleParameter('passive')}
                        className={`text-xs px-2 py-1 rounded transition ${skillObj.passive ? 'bg-purple-900 text-purple-100' : 'bg-gray-600 text-gray-200'}`}
                      >
                        ✦ Passive
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {isLastSkill && (
                      <button
                        type="button"
                        onClick={() => {
                          const updatedSkills = [...(formData.combatSkills || [])]
                          updatedSkills[idx] = { ...skillObj, isUltimate: !isUltimate }
                          setFormData(prev => ({ ...prev, combatSkills: updatedSkills }))
                        }}
                        className={`px-2 py-1 transition rounded text-xs ${isUltimate ? 'bg-ultimate-dark text-wood hover:bg-ultimate' : 'bg-gold-dark text-parchment hover:bg-gold'}`}
                        title="Mark as Ultimate"
                      >
                        {isUltimate ? '✓ Ultimate' : 'Ultimate'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(idx)}
                      className="px-2 py-1 bg-seal text-parchment hover:bg-seal-light transition rounded text-xs"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Ultimate Skill Color */}
      <div>
        <label className="block text-sm font-medieval text-wood-light mb-2">Ultimate Skill Gradient Color</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 'gold', label: 'Gold', color1: '#daa520', color2: '#ffd700' },
            { value: 'purple', label: 'Purple', color1: '#9d4edd', color2: '#e0aaff' },
            { value: 'cyan', label: 'Cyan', color1: '#00d4ff', color2: '#00ffff' },
            { value: 'red', label: 'Red', color1: '#ff006e', color2: '#ff6b9d' },
            { value: 'green', label: 'Green', color1: '#00ff88', color2: '#76ffb3' },
            { value: 'orange', label: 'Orange', color1: '#ff8c42', color2: '#ffb347' },
            { value: 'pink', label: 'Pink', color1: '#ff006e', color2: '#ffb3d9' },
            { value: 'blue', label: 'Blue', color1: '#4361ee', color2: '#7209b7' },
          ].map(colorOption => (
            <button
              key={colorOption.value}
              type="button"
              onClick={() => handleInputChange('ultimateSkillColor', colorOption.value)}
              className={`p-3 rounded transition border-2 ${
                formData.ultimateSkillColor === colorOption.value
                  ? 'border-gold'
                  : 'border-gold-dark'
              }`}
              title={colorOption.label}
              style={{
                background: `linear-gradient(135deg, ${colorOption.color1}, ${colorOption.color2})`,
              }}
            >
              <span className="text-white font-bold text-sm drop-shadow-lg">
                {colorOption.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Life Skills */}
      <div>
        <label className="block text-sm font-medieval text-wood-light mb-2">Life Skills</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={lifeSkillInput}
            onChange={(e) => setLifeSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLifeSkill())}
            className="flex-1 px-3 py-2 border-2 border-gold-dark rounded bg-parchment-dark text-wood focus:outline-none focus:border-gold"
            placeholder="Enter skill and press Enter"
          />
          <button
            type="button"
            onClick={handleAddLifeSkill}
            className="px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded text-sm"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {(formData.lifeSkills || []).map((skill, idx) => (
            <div key={idx} className="flex justify-between items-center bg-parchment-dark p-2 rounded">
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveLifeSkill(idx)}
                className="px-2 py-1 bg-seal text-parchment hover:bg-seal-light transition rounded text-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medieval text-wood-light mb-2">Observations</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={observationInput}
            onChange={(e) => setObservationInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddObservation())}
            className="flex-1 px-3 py-2 border-2 border-gold-dark rounded bg-parchment-dark text-wood focus:outline-none focus:border-gold"
            placeholder="Enter observation and press Enter"
          />
          <button
            type="button"
            onClick={handleAddObservation}
            className="px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded text-sm"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {(formData.observations || []).map((observation, idx) => (
            <div key={idx} className="flex justify-between items-center bg-parchment-dark p-2 rounded">
              <span>{observation}</span>
              <button
                type="button"
                onClick={() => handleRemoveObservation(idx)}
                className="px-2 py-1 bg-seal text-parchment hover:bg-seal-light transition rounded text-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {formData.type === 'criminal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Bounty"
            value={formData.bounty}
            onChange={(value) => handleInputChange('bounty', value)}
          />
          <FormInput
            label="Crime"
            value={formData.crime}
            onChange={(value) => handleInputChange('crime', value)}
          />
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded font-cinzel"
        >
          {editingCharacter ? 'Update Character' : 'Add Character'}
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

function FormInput({ label, value, onChange, type = 'text', required = false, placeholder = '' }) {
  return (
    <div>
      <label className="block text-xs text-gold-dark uppercase tracking-wide font-medieval mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-2 py-1 border-2 border-gold-dark rounded bg-parchment-dark text-wood focus:outline-none focus:border-gold text-sm"
      />
    </div>
  )
}

function FormSelect({ label, value, onChange, options = [] }) {
  return (
    <div>
      <label className="block text-xs text-gold-dark uppercase tracking-wide font-medieval mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1 border-2 border-gold-dark rounded bg-parchment-dark text-wood focus:outline-none focus:border-gold text-sm"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
