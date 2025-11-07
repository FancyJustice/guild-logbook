import { useState } from 'react'
import CharacterGrid from './CharacterGrid'
import CharacterDetail from './CharacterDetail'
import FilterBar from './FilterBar'

export default function Browser({ characters, dropdownOptions }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [filters, setFilters] = useState({
    type: 'all',
    race: 'all',
    class: 'all',
    affiliation: 'all',
    personality: 'all',
  })
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCharacters = characters.filter(char => {
    if (filters.type !== 'all' && char.type !== filters.type) return false
    if (filters.race !== 'all' && char.race !== filters.race) return false
    if (filters.class !== 'all' && char.class !== filters.class) return false
    if (filters.affiliation !== 'all' && char.affiliation !== filters.affiliation) return false
    if (filters.personality !== 'all' && char.personality !== filters.personality) return false
    if (searchTerm && !char.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !char.vrcPlayerName.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const uniqueAffiliations = [...new Set(characters.map(c => c.affiliation).filter(Boolean))]

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
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dropdownOptions={dropdownOptions}
          uniqueAffiliations={uniqueAffiliations}
        />

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
      </div>
    </div>
  )
}
