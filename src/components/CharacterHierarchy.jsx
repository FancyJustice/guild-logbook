import { useState } from 'react'

export default function CharacterHierarchy({ characters, onSelectCharacter }) {
  const [expandedRanks, setExpandedRanks] = useState({})

  // Group characters by rank
  const groupedByRank = characters.reduce((acc, char) => {
    const rank = char.rank || 'Unranked'
    if (!acc[rank]) acc[rank] = []
    acc[rank].push(char)
    return acc
  }, {})

  // Get unique ranks in order (you can customize this order)
  const rankOrder = [
    'Leader', 'Co-Leader', 'Officer', 'Elder',
    'Member', 'Initiate', 'Recruit',
    'S-Rank', 'A-Rank', 'B-Rank', 'C-Rank', 'D-Rank',
    'Unranked'
  ]

  const sortedRanks = Object.keys(groupedByRank).sort((a, b) => {
    const aIndex = rankOrder.indexOf(a)
    const bIndex = rankOrder.indexOf(b)
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })

  const toggleRankExpanded = (rank) => {
    setExpandedRanks(prev => ({
      ...prev,
      [rank]: !prev[rank]
    }))
  }

  return (
    <div className="space-y-2">
      {sortedRanks.map(rank => (
        <div key={rank} className="bg-parchment text-wood p-4 rounded-lg border-2 border-gold">
          {/* Rank Header */}
          <button
            onClick={() => toggleRankExpanded(rank)}
            className="w-full flex items-center gap-3 mb-2 hover:text-gold-dark transition"
          >
            <span className={`text-lg transition transform ${expandedRanks[rank] ? 'rotate-90' : ''}`}>
              ▶
            </span>
            <h3 className="text-lg font-medieval font-bold text-gold-dark flex-1 text-left">
              {rank}
            </h3>
            <span className="text-sm text-wood-light bg-gold-dark px-2 py-1 rounded">
              {groupedByRank[rank].length}
            </span>
          </button>

          {/* Characters under this rank */}
          {expandedRanks[rank] && (
            <div className="ml-6 mt-3 space-y-2 border-l-2 border-gold-dark pl-4">
              {groupedByRank[rank].map(character => (
                <div
                  key={character.id}
                  onClick={() => onSelectCharacter(character)}
                  className="bg-parchment-dark p-3 rounded border border-gold-dark hover:bg-gold hover:text-wood transition cursor-pointer"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="font-bold text-wood">{character.name}</div>
                      <div className="text-sm text-wood-light">
                        {character.race} {character.class}
                      </div>
                    </div>
                    <div className="text-right text-sm text-wood-light flex-shrink-0">
                      <div className="text-xs text-gold-dark font-medieval">
                        Lv. {character.level || '—'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
