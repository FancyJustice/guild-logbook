import { useRef } from 'react'
import { getImageSource } from '../utils/imageUtils'

export default function CharacterGrid({ characters, onSelectCharacter }) {
  const cardRefs = useRef({})

  const handleCardClick = (character) => {
    const cardElement = cardRefs.current[character.id]
    if (!cardElement) {
      onSelectCharacter(character)
      return
    }

    // Get card's current position
    const cardRect = cardElement.getBoundingClientRect()
    const cardX = cardRect.left
    const cardY = cardRect.top
    const cardWidth = cardRect.width
    const cardHeight = cardRect.height

    // Store position in sessionStorage for CharacterDetail to use
    sessionStorage.setItem('cardClickPosition', JSON.stringify({
      x: cardX,
      y: cardY,
      width: cardWidth,
      height: cardHeight
    }))

    // Navigate immediately - animation happens on detail page
    onSelectCharacter(character)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {characters.map(character => (
        <div
          key={character.id}
          ref={(el) => cardRefs.current[character.id] = el}
          onClick={() => handleCardClick(character)}
          className="bg-parchment text-wood rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer transform hover:scale-105 border-2 border-gold"
          style={{ transformOrigin: 'center' }}
        >
          <div className="overflow-hidden bg-wood-light" style={{ aspectRatio: '230/300' }}>
            <img
              src={getImageSource(character.photo)}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <div className="text-sm text-gold uppercase tracking-wide font-medieval">
              {character.type === 'guild' ? 'Guild Member' : 'Criminal'}
            </div>
            {character.title && (
              <div className="text-sm text-gold-dark italic mb-2">"{character.title}"</div>
            )}
            <h3 className="text-2xl font-medieval font-bold text-wood mb-1">{character.name}</h3>
            <div className="text-base text-wood-light mb-3">
              <div>{character.race} {character.class}</div>
              <div className="text-sm">{character.vrcPlayerName}</div>
            </div>
            <div className="flex justify-between text-sm text-wood-light border-t border-gold-dark pt-2">
              <span className="font-medieval capitalize">{character.class || 'Unknown'}</span>
              <span className="font-medieval">Lv. {character.level || '—'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
