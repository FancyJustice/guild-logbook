import { useState } from 'react'
import { uploadCharacterPhoto } from '../utils/firebaseUtils'

export default function CharacterForm({ dropdownOptions, characters = [], editingCharacter, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(editingCharacter ? {
    ...editingCharacter,
    observations: Array.isArray(editingCharacter.observations) ? editingCharacter.observations : (editingCharacter.observations ? [editingCharacter.observations] : []),
    combatSkills: editingCharacter.combatSkills || [],
    lifeSkills: editingCharacter.lifeSkills || [],
    ultimateSkillColor: editingCharacter.ultimateSkillColor || 'gold',
  } : {
    type: 'guild',
    photo: '',
    title: '',
    name: '',
    vrcPlayerName: '',
    vrcProfileUrl: '',
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
    str: 0,
    agi: 0,
    dex: 0,
    int: 0,
    luk: 0,
    vit: 0,
  })

  const [skillInput, setSkillInput] = useState('')
  const [skillDescription, setSkillDescription] = useState('')
  const [skillHeal, setSkillHeal] = useState(false)
  const [skillBuff, setSkillBuff] = useState(false)
  const [skillPassive, setSkillPassive] = useState(false)
  const [lifeSkillInput, setLifeSkillInput] = useState('')
  const [observationInput, setObservationInput] = useState('')
  const [photoPreview, setPhotoPreview] = useState(editingCharacter?.photo || '')
  const [uploading, setUploading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getTotalStats = () => {
    return (formData.str || 0) + (formData.agi || 0) + (formData.dex || 0) + (formData.int || 0) + (formData.luk || 0) + (formData.vit || 0)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }

      try {
        setUploading(true)

        // Create canvas to resize image to 230x300
        const reader = new FileReader()
        reader.onload = async (event) => {
          try {
            const img = new Image()
            img.onload = async () => {
              try {
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

                // Convert canvas to blob and upload to Firebase
                canvas.toBlob(async (blob) => {
                  try {
                    const characterId = editingCharacter?.id || 'temp'
                    const downloadURL = await uploadCharacterPhoto(blob, characterId)
                    setFormData(prev => ({
                      ...prev,
                      photo: downloadURL
                    }))
                  } catch (error) {
                    console.error('Error uploading image to Firebase:', error)
                    alert('Error uploading image: ' + error.message)
                  } finally {
                    setUploading(false)
                  }
                }, 'image/png')
              } catch (error) {
                console.error('Error resizing image:', error)
                alert('Error resizing image: ' + error.message)
                setUploading(false)
              }
            }
            img.onerror = () => {
              alert('Error loading image')
              setUploading(false)
            }
            img.src = event.target.result
          } catch (error) {
            console.error('Error processing image:', error)
            alert('Error processing image: ' + error.message)
            setUploading(false)
          }
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('Error starting image upload:', error)
        alert('Error uploading image: ' + error.message)
        setUploading(false)
      }
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
    <form onSubmit={handleSubmit} className="bg-parchment text-wood p-8 rounded-lg border-2 border-gold space-y-8 max-w-6xl mx-auto" style={{ fontFamily: 'Crimson Text, serif' }}>
      {/* Header Section */}
      <div>
        <h2 className="text-3xl font-medieval font-bold text-gold-dark mb-6 border-b-2 border-gold-dark pb-3">Character Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            label="Name *"
            value={formData.name}
            onChange={(value) => handleInputChange('name', value)}
            required
          />
          <FormInput
            label="VRC Player Name *"
            value={formData.vrcPlayerName}
            onChange={(value) => handleInputChange('vrcPlayerName', value)}
            required
          />
          <FormInput
            label="VRC Profile URL"
            value={formData.vrcProfileUrl}
            onChange={(value) => handleInputChange('vrcProfileUrl', value)}
            placeholder="e.g., https://vrchat.com/home/user/usr_xxxxx"
            type="url"
          />
          <FormInput
            label="Title"
            value={formData.title}
            onChange={(value) => handleInputChange('title', value)}
          />
          <FormInput
            label="Status"
            value={formData.status}
            onChange={(value) => handleInputChange('status', value)}
          />
        </div>
      </div>

      {/* Appearance & Demographics Section */}
      <div className="border-t-2 border-gold-dark pt-6">
        <h3 className="text-xl font-medieval font-bold text-gold-dark mb-6">Appearance & Demographics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            label="Gender"
            value={formData.gender}
            onChange={(value) => handleInputChange('gender', value)}
            placeholder="e.g., Male, Female, Non-binary"
          />
          <FormInput
            label="Age"
            value={formData.age}
            onChange={(value) => handleInputChange('age', value)}
            placeholder="e.g., 25, Unknown, Ageless"
          />
          <FormInput
            label="Height"
            value={formData.height}
            onChange={(value) => handleInputChange('height', value)}
          />
          <FormInput
            label="Place of Origin"
            value={formData.placeOfOrigin}
            onChange={(value) => handleInputChange('placeOfOrigin', value)}
          />
          <FormInput
            label="Affiliation"
            value={formData.affiliation}
            onChange={(value) => handleInputChange('affiliation', value)}
            placeholder="e.g., The Guild, Shadow Syndicate, Lone Wolf"
          />
          <FormInput
            label="Level"
            type="number"
            value={formData.level}
            onChange={(value) => handleInputChange('level', value)}
          />
          <FormSelect
            label={formData.type === 'guild' ? 'Rank' : 'Threat Level'}
            value={formData.rank}
            onChange={(value) => handleInputChange('rank', value)}
            options={formData.type === 'guild'
              ? [
                  { value: '', label: 'Select Rank' },
                  { value: 'S', label: 'S' },
                  { value: 'A', label: 'A' },
                  { value: 'B', label: 'B' },
                  { value: 'C', label: 'C' },
                  { value: 'D', label: 'D' }
                ]
              : [
                  { value: '', label: 'Select Threat Level' },
                  { value: 'Harmless', label: 'Harmless' },
                  { value: 'Notorious', label: 'Notorious' },
                  { value: 'Dangerous', label: 'Dangerous' },
                  { value: 'Devastating', label: 'Devastating' }
                ]
            }
          />
        </div>
      </div>

      {/* Photo Upload Section */}
      <div className="bg-parchment-dark p-6 rounded border-2 border-gold-dark">
        <label className="block text-sm font-medieval text-wood-light mb-3">Profile Photo (230x300 PNG)</label>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex gap-2 items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="flex-1 px-3 py-2 border-2 border-gold-dark rounded bg-parchment-dark text-wood focus:outline-none focus:border-gold text-sm cursor-pointer disabled:opacity-50"
              />
              {uploading && (
                <span className="text-yellow-400 text-sm animate-pulse">↑ Uploading...</span>
              )}
            </div>
            <p className="text-xs text-wood-light mt-2">Upload PNG, JPG, or other image format. Will be automatically resized to 230x300 and uploaded to Firebase Storage</p>
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
            key="personality-guild"
            label="Personality"
            value={formData.personality}
            onChange={(value) => handleInputChange('personality', value)}
            options={[
              { value: '', label: 'Select Personality' },
              { value: 'Adventurous', label: 'Adventurous' },
              { value: 'Stoic', label: 'Stoic' },
              { value: 'Charismatic', label: 'Charismatic' },
              { value: 'Cunning', label: 'Cunning' },
              { value: 'Loyal', label: 'Loyal' },
              { value: 'Rebellious', label: 'Rebellious' },
              { value: 'Intellectual', label: 'Intellectual' },
              { value: 'Compassionate', label: 'Compassionate' },
              { value: 'Ambitious', label: 'Ambitious' },
              { value: 'Optimistic', label: 'Optimistic' },
              { value: 'Humorous', label: 'Humorous' },
              { value: 'Mysterious', label: 'Mysterious' }
            ]}
          />
        ) : (
          <FormSelect
            key="personality-criminal"
            label="Personality"
            value={formData.personality}
            onChange={(value) => handleInputChange('personality', value)}
            options={[
              { value: '', label: 'Select Personality' },
              { value: 'Impulsive', label: 'Impulsive' },
              { value: 'Reckless', label: 'Reckless' },
              { value: 'Arrogant', label: 'Arrogant' },
              { value: 'Vindictive', label: 'Vindictive' },
              { value: 'Envious', label: 'Envious' },
              { value: 'Greedy', label: 'Greedy' },
              { value: 'Cowardly', label: 'Cowardly' },
              { value: 'Melancholic', label: 'Melancholic' },
              { value: 'Pessimistic', label: 'Pessimistic' },
              { value: 'Naive', label: 'Naive' },
              { value: 'Dishonest', label: 'Dishonest' },
              { value: 'Lazy', label: 'Lazy' },
              { value: 'Obsessive', label: 'Obsessive' },
              { value: 'Ambitious', label: 'Ambitious' }
            ]}
          />
        )}
        {formData.type === 'guild' && (
          <FormSelect
            label="Flaw"
            value={formData.flaw}
            onChange={(value) => handleInputChange('flaw', value)}
            options={[
              { value: '', label: 'Select Flaw' },
              { value: 'Impulsive', label: 'Impulsive' },
              { value: 'Reckless', label: 'Reckless' },
              { value: 'Arrogant', label: 'Arrogant' },
              { value: 'Vindictive', label: 'Vindictive' },
              { value: 'Envious', label: 'Envious' },
              { value: 'Greedy', label: 'Greedy' },
              { value: 'Cowardly', label: 'Cowardly' },
              { value: 'Melancholic', label: 'Melancholic' },
              { value: 'Pessimistic', label: 'Pessimistic' },
              { value: 'Naive', label: 'Naive' },
              { value: 'Dishonest', label: 'Dishonest' },
              { value: 'Lazy', label: 'Lazy' },
              { value: 'Obsessive', label: 'Obsessive' },
              { value: 'Ambitious', label: 'Ambitious' }
            ]}
          />
        )}
        <ElementalAttunementSelect
          label="Elemental Attunement"
          value={formData.elemeltanAttunement}
          onChange={(value) => handleInputChange('elemeltanAttunement', value)}
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
        {/* Preview of selected color */}
        <div className="mb-4 p-4 bg-wood-light rounded border-2 border-gold-dark">
          <p className="text-xs text-wood-light mb-2">Preview:</p>
          <div
            style={{
              '--gradient-color-1': [
                { value: 'gold', color1: '#daa520' },
                { value: 'purple', color1: '#9d4edd' },
                { value: 'cyan', color1: '#00d4ff' },
                { value: 'red', color1: '#ff006e' },
                { value: 'green', color1: '#00ff88' },
                { value: 'orange', color1: '#ff8c42' },
                { value: 'pink', color1: '#ff006e' },
                { value: 'blue', color1: '#4361ee' },
              ].find(c => c.value === formData.ultimateSkillColor)?.color1 || '#daa520',
              '--gradient-color-2': [
                { value: 'gold', color2: '#ffd700' },
                { value: 'purple', color2: '#e0aaff' },
                { value: 'cyan', color2: '#00ffff' },
                { value: 'red', color2: '#ff6b9d' },
                { value: 'green', color2: '#76ffb3' },
                { value: 'orange', color2: '#ffb347' },
                { value: 'pink', color2: '#ffb3d9' },
                { value: 'blue', color2: '#7209b7' },
              ].find(c => c.value === formData.ultimateSkillColor)?.color2 || '#ffd700',
            }}
            className="ultimate-skill text-2xl font-bold"
          >
            Ultimate Skill Name
          </div>
        </div>
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

      {/* Character Stats */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medieval text-wood-light">Character Stats (40 points total)</label>
          <span className={`text-sm font-medieval ${getTotalStats() > 40 ? 'text-seal' : 'text-green-400'}`}>
            Total: {getTotalStats()}/40
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <FormInput
            label="STR"
            type="number"
            value={formData.str || 0}
            onChange={(value) => {
              const parsed = parseInt(value) || 0
              const otherStats = (formData.agi || 0) + (formData.dex || 0) + (formData.int || 0) + (formData.luk || 0) + (formData.vit || 0)
              const maxForThisStat = 40 - otherStats
              handleInputChange('str', Math.min(Math.max(parsed, 0), maxForThisStat))
            }}
          />
          <FormInput
            label="AGI"
            type="number"
            value={formData.agi || 0}
            onChange={(value) => {
              const parsed = parseInt(value) || 0
              const otherStats = (formData.str || 0) + (formData.dex || 0) + (formData.int || 0) + (formData.luk || 0) + (formData.vit || 0)
              const maxForThisStat = 40 - otherStats
              handleInputChange('agi', Math.min(Math.max(parsed, 0), maxForThisStat))
            }}
          />
          <FormInput
            label="DEX"
            type="number"
            value={formData.dex || 0}
            onChange={(value) => {
              const parsed = parseInt(value) || 0
              const otherStats = (formData.str || 0) + (formData.agi || 0) + (formData.int || 0) + (formData.luk || 0) + (formData.vit || 0)
              const maxForThisStat = 40 - otherStats
              handleInputChange('dex', Math.min(Math.max(parsed, 0), maxForThisStat))
            }}
          />
          <FormInput
            label="INT"
            type="number"
            value={formData.int || 0}
            onChange={(value) => {
              const parsed = parseInt(value) || 0
              const otherStats = (formData.str || 0) + (formData.agi || 0) + (formData.dex || 0) + (formData.luk || 0) + (formData.vit || 0)
              const maxForThisStat = 40 - otherStats
              handleInputChange('int', Math.min(Math.max(parsed, 0), maxForThisStat))
            }}
          />
          <FormInput
            label="LUK"
            type="number"
            value={formData.luk || 0}
            onChange={(value) => {
              const parsed = parseInt(value) || 0
              const otherStats = (formData.str || 0) + (formData.agi || 0) + (formData.dex || 0) + (formData.int || 0) + (formData.vit || 0)
              const maxForThisStat = 40 - otherStats
              handleInputChange('luk', Math.min(Math.max(parsed, 0), maxForThisStat))
            }}
          />
          <FormInput
            label="VIT"
            type="number"
            value={formData.vit || 0}
            onChange={(value) => {
              const parsed = parseInt(value) || 0
              const otherStats = (formData.str || 0) + (formData.agi || 0) + (formData.dex || 0) + (formData.int || 0) + (formData.luk || 0)
              const maxForThisStat = 40 - otherStats
              handleInputChange('vit', Math.min(Math.max(parsed, 0), maxForThisStat))
            }}
          />
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

function FormInput({ label, value, onChange, type = 'text', required = false, placeholder = '', max = null }) {
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
        max={max}
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

function ElementalAttunementSelect({ label, value, onChange }) {
  const elementColors = {
    'Fire': { bg: 'bg-red-900', border: 'border-red-600', text: 'text-red-100' },
    'Water': { bg: 'bg-blue-900', border: 'border-blue-600', text: 'text-blue-100' },
    'Wind': { bg: 'bg-cyan-800', border: 'border-cyan-500', text: 'text-cyan-100' },
    'Earth': { bg: 'bg-amber-900', border: 'border-amber-700', text: 'text-amber-100' },
    'Light': { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-900' },
    'Dark': { bg: 'bg-gray-900', border: 'border-gray-700', text: 'text-gray-300' },
    'Ice': { bg: 'bg-sky-800', border: 'border-sky-500', text: 'text-sky-100' },
    'Steam': { bg: 'bg-slate-700', border: 'border-slate-500', text: 'text-slate-100' },
    'Lightning': { bg: 'bg-yellow-900', border: 'border-yellow-600', text: 'text-yellow-100' },
    'Nature': { bg: 'bg-green-900', border: 'border-green-600', text: 'text-green-100' },
    'Magma': { bg: 'bg-orange-900', border: 'border-orange-600', text: 'text-orange-100' },
    'Sand': { bg: 'bg-yellow-700', border: 'border-yellow-600', text: 'text-yellow-100' },
    'Metal': { bg: 'bg-zinc-700', border: 'border-zinc-600', text: 'text-zinc-100' },
    'Gravity': { bg: 'bg-purple-950', border: 'border-purple-700', text: 'text-purple-100' },
    'Poison': { bg: 'bg-purple-900', border: 'border-purple-700', text: 'text-purple-100' },
    'Blood': { bg: 'bg-red-950', border: 'border-red-800', text: 'text-red-100' },
    'Ghost': { bg: 'bg-violet-950', border: 'border-violet-700', text: 'text-violet-100' },
    'Prism': { bg: 'bg-pink-800', border: 'border-pink-600', text: 'text-pink-100' },
    'Solar': { bg: 'bg-orange-700', border: 'border-orange-500', text: 'text-orange-100' },
    'Darkflame': { bg: 'bg-red-950', border: 'border-red-900', text: 'text-red-100' }
  }

  const elements = [
    'Fire', 'Water', 'Wind', 'Earth', 'Light', 'Dark', 'Ice', 'Steam',
    'Lightning', 'Nature', 'Magma', 'Sand', 'Metal', 'Gravity', 'Poison',
    'Blood', 'Ghost', 'Prism', 'Solar', 'Darkflame'
  ]

  return (
    <div>
      <label className="block text-xs text-gold-dark uppercase tracking-wide font-medieval mb-3">
        {label}
      </label>
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => onChange('')}
          className={`px-3 py-2 rounded border-2 text-sm font-medieval transition ${
            value === ''
              ? 'border-gold bg-gold text-wood'
              : 'border-gold-dark bg-parchment-dark text-wood-light hover:border-gold'
          }`}
        >
          None
        </button>
        {elements.map(element => {
          const colors = elementColors[element]
          return (
            <button
              key={element}
              type="button"
              onClick={() => onChange(element)}
              className={`px-3 py-2 rounded border-2 text-sm font-medieval transition ${
                value === element
                  ? `${colors.bg} ${colors.border} ${colors.text} border-opacity-100`
                  : `${colors.bg} border-opacity-50 ${colors.text} border-opacity-40 hover:border-opacity-100`
              }`}
            >
              {element}
            </button>
          )
        })}
      </div>
    </div>
  )
}
