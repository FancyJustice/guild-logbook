import { useState } from 'react'
import AdminCharacterList from './AdminCharacterList'
import AdminArtifactList from './AdminArtifactList'
import AdminLoreList from './AdminLoreList'

/**
 * AdminPanel Component - Tabbed Interface
 *
 * Manages three tabs:
 * 1. Characters - Create, edit, delete characters with collapsible list
 * 2. Artifacts - Create, edit, delete artifacts with collapsible list
 * 3. Lore - Create, edit, delete lore entries with collapsible list
 *
 * Features:
 * - Global search bar that filters current tab
 * - Bulk delete with checkboxes
 * - Collapsible items to keep page length manageable
 * - PIN generation for characters
 */
export default function AdminPanel({
  authenticated,
  onLogin,
  password,
  setPassword,

  characters,
  artifacts,
  lore,
  dropdownOptions,

  onAddCharacter,
  onUpdateCharacter,
  onDeleteCharacter,

  onAddArtifact,
  onUpdateArtifact,
  onDeleteArtifact,

  onAddLore,
  onUpdateLore,
  onDeleteLore,

  onLogout,
}) {
  // ============== UI STATE ==============
  const [activeTab, setActiveTab] = useState('characters') // 'characters', 'artifacts', 'lore'
  const [searchTerm, setSearchTerm] = useState('')

  // ============== LOGIN FLOW ==============
  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto py-16 space-y-6">
        <div className="bg-parchment text-wood p-8 rounded-lg border-4 border-gold">
          <h2 className="text-3xl font-medieval font-bold text-gold-dark mb-6 text-center">Admin Login</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onLogin(password)
            }}
            className="space-y-4"
          >
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full px-4 py-2 bg-wood text-parchment rounded border-2 border-gold-dark"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-gold-dark text-parchment hover:bg-gold transition rounded font-medieval font-bold text-lg"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ============== AUTHENTICATED ADMIN VIEW ==============
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-medieval font-bold text-gold-dark">Admin Panel</h1>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-700 text-white hover:bg-red-800 transition rounded font-medieval"
        >
          Logout
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-parchment text-wood p-4 rounded-lg border-2 border-gold">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${activeTab}...`}
          className="w-full px-4 py-2 bg-wood text-parchment rounded border border-gold-dark"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-gold-dark">
        {['characters', 'artifacts', 'lore'].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab)
              setSearchTerm('') // Clear search when switching tabs
            }}
            className={`px-6 py-3 font-medieval text-lg transition ${
              activeTab === tab
                ? 'bg-gold text-wood border-b-4 border-gold'
                : 'bg-gold-dark text-parchment hover:bg-gold'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold space-y-4">
        {/* Characters Tab */}
        {activeTab === 'characters' && (
          <>
            <button
              onClick={() => onAddCharacter({ name: '', type: 'guild' })}
              className="px-6 py-2 bg-green-700 text-white hover:bg-green-800 transition rounded font-medieval mb-4"
            >
              + Create New Character
            </button>
            <AdminCharacterList
              characters={characters}
              searchTerm={searchTerm}
              dropdownOptions={dropdownOptions}
              onAddCharacter={onAddCharacter}
              onUpdateCharacter={onUpdateCharacter}
              onDeleteCharacter={onDeleteCharacter}
              onGeneratePins={async () => {
                // Generate random PINs for all characters
                for (let i = 0; i < characters.length; i++) {
                  const char = characters[i]
                  const pin = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
                  onUpdateCharacter({ ...char, pin })
                  // Add delay to avoid rate limiting
                  if (i < characters.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 100))
                  }
                }
                alert(`Generated random PINs for ${characters.length} characters!`)
              }}
            />
          </>
        )}

        {/* Artifacts Tab */}
        {activeTab === 'artifacts' && (
          <>
            <button
              onClick={() => onAddArtifact({ name: '', type: 'weapon' })}
              className="px-6 py-2 bg-green-700 text-white hover:bg-green-800 transition rounded font-medieval mb-4"
            >
              + Create New Artifact
            </button>
            <AdminArtifactList
              artifacts={artifacts}
              searchTerm={searchTerm}
              dropdownOptions={dropdownOptions}
              onUpdateArtifact={onUpdateArtifact}
              onDeleteArtifact={onDeleteArtifact}
            />
          </>
        )}

        {/* Lore Tab */}
        {activeTab === 'lore' && (
          <>
            <button
              onClick={() => onAddLore({ name: '', type: 'place', description: '' })}
              className="px-6 py-2 bg-green-700 text-white hover:bg-green-800 transition rounded font-medieval mb-4"
            >
              + Create New Lore Entry
            </button>
            <AdminLoreList
              lore={lore}
              characters={characters}
              artifacts={artifacts}
              searchTerm={searchTerm}
              onUpdateLore={onUpdateLore}
              onDeleteLore={onDeleteLore}
            />
          </>
        )}
      </div>
    </div>
  )
}
