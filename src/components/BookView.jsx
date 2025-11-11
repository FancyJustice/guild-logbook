import { useState } from 'react'
import { getImageSource } from '../utils/imageUtils'
import '../styles/bookView.css'

/**
 * BookView Component - Displays characters in a realistic flipbook style
 * Shows two pages at a time (like an open book) with page-turning animation
 */
export default function BookView({ characters, onSelectCharacter }) {
  const [currentPage, setCurrentPage] = useState(0) // Left page number
  const [isFlipping, setIsFlipping] = useState(false)

  if (characters.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-parchment text-wood rounded-lg border-2 border-gold">
        <p className="text-lg">No characters to display</p>
      </div>
    )
  }

  const handleNextPage = () => {
    // Move to next pair of pages
    if (currentPage + 2 < characters.length && !isFlipping) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage + 2)
        setIsFlipping(false)
      }, 600)
    }
  }

  const handlePrevPage = () => {
    // Move to previous pair of pages
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(Math.max(0, currentPage - 2))
        setIsFlipping(false)
      }, 600)
    }
  }

  // Get the two pages to display (left and right of open book)
  const leftCharacter = characters[currentPage] || null
  const rightCharacter = characters[currentPage + 1] || null

  return (
    <div className="space-y-6">
      {/* Open Book Display */}
      <div className="flex items-center justify-center perspective py-8">
        <div className="book-container" style={{ perspective: '1200px' }}>
          {/* Left Page */}
          <div className={`book-page book-page-left ${isFlipping ? 'flip-out' : ''}`}>
            {leftCharacter && (
              <div className="page-content">
                <div className="page-number">← {currentPage + 1}</div>

                {leftCharacter.photo && (
                  <div className="flex justify-center mb-2">
                    <div className="w-40 h-56 border-2 border-gold-dark rounded overflow-hidden shadow-lg">
                      <img
                        src={getImageSource(leftCharacter.photo)}
                        alt={leftCharacter.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="text-center flex-1 flex flex-col justify-end">
                  <h3 className="text-lg font-medieval font-bold text-wood mb-1">{leftCharacter.name}</h3>
                  <p className="text-[10px] text-wood-light mb-2">{leftCharacter.race} {leftCharacter.class}</p>
                  <button
                    onClick={() => onSelectCharacter(leftCharacter)}
                    className="text-[10px] px-2 py-1 bg-gold-dark text-parchment hover:bg-gold rounded transition font-medieval"
                  >
                    View Full
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Page */}
          <div className={`book-page book-page-right ${isFlipping ? 'flip-in' : ''}`}>
            {rightCharacter && (
              <div className="page-content">
                <div className="page-number">{currentPage + 2} →</div>

                {rightCharacter.photo && (
                  <div className="flex justify-center mb-2">
                    <div className="w-40 h-56 border-2 border-gold-dark rounded overflow-hidden shadow-lg">
                      <img
                        src={getImageSource(rightCharacter.photo)}
                        alt={rightCharacter.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="text-center flex-1 flex flex-col justify-end">
                  <h3 className="text-lg font-medieval font-bold text-wood mb-1">{rightCharacter.name}</h3>
                  <p className="text-[10px] text-wood-light mb-2">{rightCharacter.race} {rightCharacter.class}</p>
                  <button
                    onClick={() => onSelectCharacter(rightCharacter)}
                    className="text-[10px] px-2 py-1 bg-gold-dark text-parchment hover:bg-gold rounded transition font-medieval"
                  >
                    View Full
                  </button>
                </div>
              </div>
            )}
          </div>
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
          Pages {currentPage + 1}-{Math.min(currentPage + 2, characters.length)} of {characters.length}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage + 2 >= characters.length || isFlipping}
          className={`px-4 py-2 font-medieval font-bold rounded transition ${
            currentPage + 2 >= characters.length || isFlipping
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
