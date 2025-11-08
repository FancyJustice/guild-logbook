import { useState } from 'react'
import CharacterGrid from './CharacterGrid'
import CharacterDetail from './CharacterDetail'

import ArtifactGrid from './ArtifactGrid'
import ArtifactDetail from './ArtifactDetail'

export default function Browser({ characters, artifacts, dropdownOptions }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [selectedArtifact, setSelectedArtifact] = useState(null)
  const [view, setView] = useState('characters') // 'characters' or 'artifacts'
  const [filters, setFilters] = useState({
    type: 'all',
  })

  const filteredCharacters = characters.filter(char => {
    if (filters.type !== 'all' && char.type !== filters.type) return false
    return true
  })

  return (
    <div className="flex gap-4">
      {/* Left Sidebar - Type Tabs */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          onClick={() => setFilters(prev => ({ ...prev, type: 'guild' }))}
          className={`px-4 py-3 text-sm font-medieval whitespace-nowrap transition rounded-r-lg border-l-4 ${
            filters.type === 'guild'
              ? 'bg-gold text-wood border-l-gold'
              : 'bg-gold-dark text-parchment hover:bg-gold border-l-gold-dark'
          }`}
        >
          Guild Members
        </button>
        <button
          onClick={() => setFilters(prev => ({ ...prev, type: 'criminal' }))}
          className={`px-4 py-3 text-sm font-medieval whitespace-nowrap transition rounded-r-lg border-l-4 ${
            filters.type === 'criminal'
              ? 'bg-seal-light text-parchment border-l-seal-light'
              : 'bg-seal text-parchment hover:bg-seal-light border-l-seal'
          }`}
        >
          Criminals
        </button>
        <button
          onClick={() => setFilters(prev => ({ ...prev, type: 'all' }))}
          className={`px-4 py-3 text-sm font-medieval whitespace-nowrap transition rounded-r-lg border-l-4 ${
            filters.type === 'all'
              ? 'bg-wood-light text-parchment border-l-wood-light'
              : 'bg-wood text-parchment-dark hover:bg-wood-light border-l-wood'
          }`}
        >
          All Records
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {view === 'characters' ? (
          <>
            {selectedCharacter ? (
              <CharacterDetail
                character={selectedCharacter}
                onBack={() => setSelectedCharacter(null)}
              />
            ) : (
              <>
                <div className="text-sm text-parchment-dark">
                  Showing {filteredCharacters.length} of {characters.length} characters
                </div>
                <CharacterGrid
                  characters={filteredCharacters}
                  onSelectCharacter={setSelectedCharacter}
                />
              </>
            )}
          </>
        ) : (
          <>
            {selectedArtifact ? (
              <ArtifactDetail
                artifact={selectedArtifact}
                onBack={() => setSelectedArtifact(null)}
              />
            ) : (
              <>
                <div className="text-sm text-parchment-dark">
                  Showing {artifacts.length} artifacts
                </div>
                <ArtifactGrid
                  artifacts={artifacts}
                  onSelectArtifact={setSelectedArtifact}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Right Sidebar - View Tabs */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          onClick={() => { setView('characters'); setSelectedCharacter(null); setSelectedArtifact(null) }}
          className={`px-4 py-3 text-sm font-medieval whitespace-nowrap transition rounded-l-lg border-r-4 ${
            view === 'characters'
              ? 'bg-gold text-wood border-r-gold'
              : 'bg-gold-dark text-parchment hover:bg-gold border-r-gold-dark'
          }`}
        >
          Characters
        </button>
        <button
          onClick={() => setView('artifacts')}
          className={`px-4 py-3 text-sm font-medieval whitespace-nowrap transition rounded-l-lg border-r-4 ${
            view === 'artifacts'
              ? 'bg-wood-light text-parchment border-r-wood-light'
              : 'bg-wood text-parchment-dark hover:bg-wood-light border-r-wood'
          }`}
        >
          Artifacts
        </button>
      </div>
    </div>
  )
}
