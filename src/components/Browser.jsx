import { useState } from 'react'
import CharacterGrid from './CharacterGrid'
import CharacterDetail from './CharacterDetail'
import CharacterHierarchy from './CharacterHierarchy'
import BookView from './BookView'

import ArtifactGrid from './ArtifactGrid'
import ArtifactDetail from './ArtifactDetail'

export default function Browser({ characters, artifacts, dropdownOptions }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [selectedArtifact, setSelectedArtifact] = useState(null)
  const [view, setView] = useState('characters') // 'characters' or 'artifacts'
  const [displayMode, setDisplayMode] = useState('grid') // 'grid', 'hierarchy', or 'book'
  const [filters, setFilters] = useState({
    type: 'all',
  })

  const filteredCharacters = characters.filter(char =>
    filters.type === 'all' || char.type === filters.type
  )

  const filteredArtifacts = artifacts.filter(artifact =>
    filters.type === 'all' || artifact.type === filters.type
  )

  // Get unique artifact types
  const artifactTypes = ['all', ...new Set(artifacts.map(a => a.type).filter(Boolean))]
  const characterTypes = ['guild', 'criminal', 'all']

  const isViewingDetail = selectedCharacter || selectedArtifact

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4">
      {/* Left Sidebar - Type Tabs */}
      {!isViewingDetail && <div className="flex flex-row md:flex-col gap-2 pt-0 md:pt-2 overflow-x-auto md:overflow-x-visible">
        {view === 'characters' ? (
          <>
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
          </>
        ) : (
          <>
            {artifactTypes.map(type => (
              <button
                key={type}
                onClick={() => setFilters(prev => ({ ...prev, type }))}
                className={`px-4 py-3 text-sm font-medieval whitespace-nowrap transition rounded-r-lg border-l-4 ${
                  filters.type === type
                    ? 'bg-gold text-wood border-l-gold'
                    : 'bg-gold-dark text-parchment hover:bg-gold border-l-gold-dark'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </>
        )}
      </div>}

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
                <div className="flex justify-between items-center">
                  <div className="text-sm text-parchment-dark">
                    Showing {filteredCharacters.length} of {characters.length} characters
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDisplayMode('grid')}
                      className={`px-3 py-1 text-sm rounded transition ${
                        displayMode === 'grid'
                          ? 'bg-gold text-wood'
                          : 'bg-gold-dark text-parchment hover:bg-gold'
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setDisplayMode('book')}
                      className={`px-3 py-1 text-sm rounded transition ${
                        displayMode === 'book'
                          ? 'bg-gold text-wood'
                          : 'bg-gold-dark text-parchment hover:bg-gold'
                      }`}
                    >
                      📖 Book
                    </button>
                    <button
                      onClick={() => setDisplayMode('hierarchy')}
                      className={`px-3 py-1 text-sm rounded transition ${
                        displayMode === 'hierarchy'
                          ? 'bg-gold text-wood'
                          : 'bg-gold-dark text-parchment hover:bg-gold'
                      }`}
                    >
                      Hierarchy
                    </button>
                  </div>
                </div>
                {displayMode === 'grid' ? (
                  <CharacterGrid
                    characters={filteredCharacters}
                    onSelectCharacter={setSelectedCharacter}
                  />
                ) : displayMode === 'book' ? (
                  <BookView
                    characters={filteredCharacters}
                    onSelectCharacter={setSelectedCharacter}
                  />
                ) : filters.type === 'all' ? (
                  // Split hierarchy for "All Records"
                  <div className="space-y-8">
                    {/* Guild Members Hierarchy */}
                    {characters.some(c => c.type === 'guild') && (
                      <div>
                        <h2 className="text-2xl font-medieval text-gold mb-4">Guild Members</h2>
                        <CharacterHierarchy
                          characters={characters.filter(c => c.type === 'guild')}
                          onSelectCharacter={setSelectedCharacter}
                        />
                      </div>
                    )}

                    {/* Criminals Hierarchy */}
                    {characters.some(c => c.type === 'criminal') && (
                      <div>
                        <h2 className="text-2xl font-medieval text-seal-light mb-4">Criminals</h2>
                        <CharacterHierarchy
                          characters={characters.filter(c => c.type === 'criminal')}
                          onSelectCharacter={setSelectedCharacter}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <CharacterHierarchy
                    characters={filteredCharacters}
                    onSelectCharacter={setSelectedCharacter}
                  />
                )}
              </>
            )}
          </>
        ) : (
          <>
            {selectedArtifact ? (
              <ArtifactDetail
                artifact={selectedArtifact}
                characters={characters}
                onBack={() => setSelectedArtifact(null)}
                onSelectCharacter={(character) => {
                  setView('characters')
                  setSelectedCharacter(character)
                  setSelectedArtifact(null)
                }}
              />
            ) : (
              <>
                <div className="text-sm text-parchment-dark">
                  Showing {filteredArtifacts.length} of {artifacts.length} artifacts
                </div>
                <ArtifactGrid
                  artifacts={filteredArtifacts}
                  onSelectArtifact={setSelectedArtifact}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Right Sidebar - View Tabs */}
      {!isViewingDetail && <div className="flex flex-row md:flex-col gap-2 pt-0 md:pt-2">
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
          onClick={() => { setView('artifacts'); setFilters({ type: 'all' }); setSelectedCharacter(null); setSelectedArtifact(null) }}
          className={`px-4 py-3 text-sm font-medieval whitespace-nowrap transition rounded-l-lg border-r-4 ${
            view === 'artifacts'
              ? 'bg-wood-light text-parchment border-r-wood-light'
              : 'bg-wood text-parchment-dark hover:bg-wood-light border-r-wood'
          }`}
        >
          Artifacts
        </button>
      </div>}
    </div>
  )
}
