import { useState } from 'react'
import { getImageSource } from '../utils/imageUtils'
import '../styles/bookView.css'

/**
 * BookView Component - Displays characters in a realistic 3D flipbook style
 * Each page shows one character with authentic page-turning animation
 */
export default function BookView({ characters, onSelectCharacter }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState('next') // 'next' or 'prev'

  if (characters.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-parchment text-wood rounded-lg border-2 border-gold">
        <p className="text-lg">No characters to display</p>
      </div>
    )
  }

  const handleNextPage = () => {
    if (currentPage < characters.length - 1 && !isFlipping) {
      setFlipDirection('next')
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage + 1)
        setIsFlipping(false)
      }, 600)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setFlipDirection('prev')
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage - 1)
        setIsFlipping(false)
      }, 600)
    }
  }

  const character = characters[currentPage]
  const prevCharacter = currentPage > 0 ? characters[currentPage - 1] : null
  const nextCharacter = currentPage < characters.length - 1 ? characters[currentPage + 1] : null

  return (
    <div className="space-y-6">
      {/* 3D Book Container */}
      <div className="flex items-center justify-center perspective py-8">
        <div className="book-container" style={{ perspective: '1200px' }}>
          {/* Left Page (Previous) */}
          {currentPage > 0 && (
            <div className="book-page book-page-left" onClick={handlePrevPage}>
              <div className="page-content">
                <div className="page-number">← {currentPage}</div>

                {prevCharacter?.photo && (
                  <div className="flex justify-center mb-2">
                    <div className="w-24 h-32 border-2 border-gold-dark rounded overflow-hidden shadow-lg">
                      <img
                        src={getImageSource(prevCharacter.photo)}
                        alt={prevCharacter.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-xs font-medieval text-gold-dark italic mb-2">Previous Entry</p>
                  <p className="text-sm font-medieval font-bold text-wood">{prevCharacter?.name}</p>
                  <p className="text-[10px] text-wood-light mb-2">{prevCharacter?.race} {prevCharacter?.class}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectCharacter(prevCharacter)
                    }}
                    className="text-[10px] px-2 py-1 bg-gold-dark text-parchment hover:bg-gold rounded transition font-medieval"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Current Page (Front) */}
          <div
            className={`book-page book-page-front ${isFlipping ? `flip-${flipDirection}` : ''}`}
          >
            <div className="page-content">
              {/* Page Number */}
              <div className="page-number text-center text-xs text-gold-dark italic mb-4">
                Entry {currentPage + 1} of {characters.length}
              </div>

              {/* Character Image */}
              {character.photo && (
                <div className="flex justify-center mb-4">
                  <div className="w-40 h-56 border-2 border-gold-dark rounded overflow-hidden shadow-lg">
                    <img
                      src={getImageSource(character.photo)}
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Decorative Divider */}
              <div className="flex items-center gap-2 my-4">
                <div className="flex-1 h-px bg-gold-dark"></div>
                <span className="text-gold-dark text-sm">⚜</span>
                <div className="flex-1 h-px bg-gold-dark"></div>
              </div>

              {/* Character Name */}
              <h2 className="text-2xl font-medieval font-bold text-wood text-center mb-2">
                {character.name}
              </h2>

              {/* Character Title */}
              {character.title && (
                <p className="text-xs text-gold-dark italic text-center mb-4">
                  "{character.title}"
                </p>
              )}

              {/* Character Details */}
              <div className="space-y-2 text-xs text-center mb-4">
                <p className="text-wood font-medieval">
                  {character.race} {character.class}
                </p>
                <p className="text-wood-light">
                  Level {character.level || '—'}
                </p>
                <p className="text-wood-light">
                  {character.affiliation || 'Unknown Affiliation'}
                </p>
                <p className="text-wood-light italic">
                  {character.vrcPlayerName}
                </p>
              </div>

              {/* Type Badge */}
              <div className="flex justify-center mb-4">
                <span className={`px-3 py-1 text-[10px] uppercase font-medieval font-bold rounded ${
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
                className="w-full px-3 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded font-medieval text-xs"
              >
                View Full Entry
              </button>
            </div>
          </div>

          {/* Right Page (Back - for the flip effect) */}
          {nextCharacter && (
            <div className="book-page book-page-back" onClick={handleNextPage}>
              <div className="page-content">
                <div className="page-number">{currentPage + 2} →</div>

                {nextCharacter.photo && (
                  <div className="flex justify-center mb-2">
                    <div className="w-24 h-32 border-2 border-gold-dark rounded overflow-hidden shadow-lg">
                      <img
                        src={getImageSource(nextCharacter.photo)}
                        alt={nextCharacter.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-xs font-medieval text-gold-dark italic mb-2">Next Entry</p>
                  <p className="text-sm font-medieval font-bold text-wood">{nextCharacter.name}</p>
                  <p className="text-[10px] text-wood-light mb-2">{nextCharacter.race} {nextCharacter.class}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectCharacter(nextCharacter)
                    }}
                    className="text-[10px] px-2 py-1 bg-gold-dark text-parchment hover:bg-gold rounded transition font-medieval"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0 || isFlipping}
          className={`px-4 py-2 font-medieval font-bold rounded transition ${
            currentPage === 0 || isFlipping
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-gold-dark text-parchment hover:bg-gold'
          }`}
        >
          ← Previous
        </button>

        <div className="text-wood font-medieval text-sm">
          Page {currentPage + 1} of {characters.length}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === characters.length - 1 || isFlipping}
          className={`px-4 py-2 font-medieval font-bold rounded transition ${
            currentPage === characters.length - 1 || isFlipping
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-gold-dark text-parchment hover:bg-gold'
          }`}
        >
          Next →
        </button>
      </div>

      {/* Page Dots Indicator */}
      <div className="flex justify-center gap-2 flex-wrap">
        {characters.map((_, index) => (
          <button
            key={index}
            onClick={() => !isFlipping && setCurrentPage(index)}
            className={`w-2 h-2 rounded-full transition ${
              index === currentPage ? 'bg-gold w-8' : 'bg-gold-dark hover:bg-gold'
            }`}
            disabled={isFlipping}
            title={characters[index].name}
          />
        ))}
      </div>
    </div>
  )
}
