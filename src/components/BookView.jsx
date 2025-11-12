import { useState } from 'react'
import { getImageSource } from '../utils/imageUtils'
import '../styles/bookView.css'

/**
 * BookView Component - Simple character card selector
 * Scroll through characters one at a time with next/previous buttons
 */
export default function BookView({ characters, onSelectCharacter }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (characters.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-parchment text-wood rounded-lg border-2 border-gold">
        <p className="text-lg">No characters to display</p>
      </div>
    )
  }

  const character = characters[currentIndex]

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < characters.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <div className="space-y-6 flex flex-col items-center">
      {/* Character Card */}
      <div className="character-card">
        <div className="card-content">
          {/* Character Photo */}
          {character.photo && (
            <div className="flex justify-center mb-4">
              <div className="w-80 h-full border-2 border-gold-dark rounded overflow-hidden shadow-lg" style={{ maxWidth: '460px', height: '600px' }}>
                <img
                  src={getImageSource(character.photo)}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Character Name */}
          <h2 className="text-3xl font-medieval font-bold text-wood text-center mb-2">
            {character.name}
          </h2>

          {/* Character Title */}
          {character.title && (
            <p className="text-sm text-gold-dark italic text-center mb-3">
              "{character.title}"
            </p>
          )}

          {/* Character Details */}
          <div className="space-y-2 text-center mb-4">
            <p className="text-wood font-medieval">
              {character.race} {character.class}
            </p>
            <p className="text-wood-light">
              Level {character.level || '—'}
            </p>
            <p className="text-wood-light">
              {character.affiliation || 'Unknown Affiliation'}
            </p>
            <p className="text-wood-light italic text-sm">
              {character.vrcPlayerName}
            </p>
          </div>

          {/* Type Badge */}
          <div className="flex justify-center mb-4">
            <span className={`px-3 py-1 text-xs uppercase font-medieval font-bold rounded ${
              character.type === 'guild'
                ? 'bg-gold text-wood'
                : 'bg-seal text-parchment'
            }`}>
              {character.type === 'guild' ? '⚔ Guild Member' : '👑 Criminal'}
            </span>
          </div>

          {/* View Full Button */}
          <button
            onClick={() => onSelectCharacter(character)}
            className="w-full px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded font-medieval text-sm font-bold"
          >
            View Full Entry
          </button>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-6 py-3 font-medieval font-bold rounded transition ${
            currentIndex === 0
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-gold-dark text-parchment hover:bg-gold'
          }`}
        >
          ← Previous
        </button>

        <div className="text-wood font-medieval text-lg font-bold">
          {currentIndex + 1} / {characters.length}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === characters.length - 1}
          className={`px-6 py-3 font-medieval font-bold rounded transition ${
            currentIndex === characters.length - 1
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-gold-dark text-parchment hover:bg-gold'
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
