export default function CharacterHierarchy({ characters, onSelectCharacter }) {
  // Group characters by rank
  const groupedByRank = characters.reduce((acc, char) => {
    const rank = char.rank || 'Unranked'
    if (!acc[rank]) acc[rank] = []
    acc[rank].push(char)
    return acc
  }, {})

  // Get unique ranks in order (highest to lowest)
  const rankOrder = [
    'A-Rank', 'B-Rank', 'C-Rank', 'D-Rank', 'S-Rank',
    'Leader', 'Co-Leader', 'Officer', 'Elder',
    'Member', 'Initiate', 'Recruit',
    'Unranked'
  ]

  const sortedRanks = Object.keys(groupedByRank).sort((a, b) => {
    const aIndex = rankOrder.indexOf(a)
    const bIndex = rankOrder.indexOf(b)
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })

  return (
    <div className="flex flex-col items-center py-4 px-2">
      {/* Tree visualization */}
      {sortedRanks.map((rank, rankIndex) => {
        const isLast = rankIndex === sortedRanks.length - 1

        return (
          <div key={rank} className="flex flex-col items-center w-full">
            {/* Rank Label */}
            <div className="bg-gold text-wood px-4 py-2 rounded-lg font-medieval font-bold mb-3 shadow-lg border-2 border-gold-dark">
              {rank} ({groupedByRank[rank].length})
            </div>

            {/* Connection line down from rank */}
            {groupedByRank[rank].length > 0 && (
              <div className="w-1 h-4 bg-gold-dark mb-2"></div>
            )}

            {/* Characters Container */}
            <div className="flex flex-wrap justify-center gap-6 mb-6 relative">
              {/* Horizontal connector line */}
              {groupedByRank[rank].length > 1 && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gold-dark"
                     style={{
                       width: '100%',
                       transform: 'translateY(-1.75rem)',
                       minWidth: `${groupedByRank[rank].length * 140}px`
                     }}>
                </div>
              )}

              {groupedByRank[rank].map((character, charIndex) => {
                const totalChars = groupedByRank[rank].length
                const isOnlyOne = totalChars === 1

                return (
                  <div key={character.id} className="flex flex-col items-center">
                    {/* Vertical line from horizontal to character */}
                    {totalChars > 1 && !isOnlyOne && (
                      <div className="w-1 h-4 bg-gold-dark mb-2"></div>
                    )}

                    {/* Character Card */}
                    <div
                      onClick={() => onSelectCharacter(character)}
                      className="bg-parchment text-wood rounded-lg overflow-hidden border-2 border-gold shadow-lg hover:shadow-2xl transition cursor-pointer transform hover:scale-105 w-32"
                    >
                      {/* Character Photo */}
                      <div className="overflow-hidden bg-wood-light" style={{ aspectRatio: '230/300' }}>
                        <img
                          src={character.photo}
                          alt={character.name}
                          className="w-full h-full object-cover"
                          style={{ height: '100px' }}
                        />
                      </div>

                      {/* Character Info */}
                      <div className="p-2">
                        <h4 className="text-xs font-medieval font-bold text-wood text-center truncate mb-1">
                          {character.name}
                        </h4>
                        <div className="text-xs text-wood-light text-center">
                          <div className="truncate">{character.race}</div>
                          <div className="text-gold-dark font-medieval">Lv. {character.level || '—'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Connection line to next rank */}
            {!isLast && (
              <div className="w-1 h-6 bg-gold-dark mb-2"></div>
            )}
          </div>
        )
      })}
    </div>
  )
}
