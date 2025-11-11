import { getImageSource } from '../utils/imageUtils'

export default function CharacterGrid({ characters, onSelectCharacter }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-8">
      {characters.map(character => (
        <div
          key={character.id}
          onClick={() => onSelectCharacter(character)}
          className={`relative cursor-pointer transform transition hover:scale-105`}
          style={{
            perspective: '1000px'
          }}
        >
          {/* Book spine shadow effect */}
          <div className={`absolute -inset-1 rounded-lg blur-lg opacity-40 ${
            character.type === 'guild' ? 'bg-gold' : 'bg-seal'
          }`}></div>

          {/* Main card with book-like appearance */}
          <div className={`relative bg-parchment text-wood rounded-lg overflow-hidden shadow-2xl border-2 ${
            character.type === 'guild' ? 'border-gold-dark' : 'border-seal-light'
          }`}
            style={{
              boxShadow: `
                inset -2px 0 4px rgba(0,0,0,0.2),
                0 10px 30px rgba(0,0,0,0.3)
              `
            }}
          >
            {/* Status Badge */}
            {character.status && character.status !== 'Active' && (
              <div className="absolute top-2 right-2 z-10">
                <span className={`px-2 py-1 text-[9px] sm:text-[10px] font-medieval font-bold rounded whitespace-nowrap ${
                  character.status === 'Inactive' ? 'bg-gray-400 text-white' :
                  character.status === 'Deceased' ? 'bg-gray-700 text-gray-300' :
                  character.status === 'Retired' ? 'bg-gold-dark text-parchment' :
                  character.status === 'Missing' ? 'bg-orange-600 text-white' :
                  'bg-blue-600 text-white'
                }`}>
                  {character.status}
                </span>
              </div>
            )}

            {/* Decorative top border */}
            <div className={`h-1 ${character.type === 'guild' ? 'bg-gold' : 'bg-seal'}`}></div>

            {/* Character image with frame - responsive aspect ratio */}
            <div className="relative overflow-hidden bg-wood-light p-1 sm:p-2 md:p-3" style={{ aspectRatio: '230/300' }}>
              <div className="border-2 border-gold-dark rounded h-full w-full overflow-hidden">
                <img
                  src={getImageSource(character.photo)}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content section with book-like styling - responsive spacing */}
            <div className="p-1 sm:p-2 md:p-3 lg:p-5 space-y-0 sm:space-y-1 md:space-y-2 lg:space-y-3">
              {/* Type label with decorative line */}
              <div className="flex items-center gap-1 md:gap-2">
                <div className={`h-px flex-1 ${character.type === 'guild' ? 'bg-gold' : 'bg-seal'}`}></div>
                <div className="text-[10px] md:text-xs text-gold uppercase tracking-widest font-medieval font-bold whitespace-nowrap">
                  {character.type === 'guild' ? 'Guild' : 'Criminal'}
                </div>
                <div className={`h-px flex-1 ${character.type === 'guild' ? 'bg-gold' : 'bg-seal'}`}></div>
              </div>

              {/* Title - italicized like a book - hidden on mobile */}
              {character.title && (
                <div className="hidden md:block text-xs lg:text-sm text-gold-dark italic text-center font-medieval line-clamp-1">
                  "{character.title}"
                </div>
              )}

              {/* Name - prominent like a chapter title */}
              <h3 className="text-xs sm:text-base md:text-lg lg:text-2xl font-medieval font-bold text-wood text-center border-b border-gold-dark pb-0 sm:pb-1 md:pb-2 line-clamp-2">
                {character.name}
              </h3>

              {/* Character details */}
              <div className="text-[9px] sm:text-[11px] md:text-sm space-y-0 text-center">
                <div className="text-wood font-medieval line-clamp-1">
                  {character.race}
                </div>
                <div className="text-[8px] sm:text-[9px] md:text-xs text-wood-light italic line-clamp-1">
                  {character.vrcPlayerName}
                </div>
              </div>

              {/* Footer details with book page aesthetic */}
              <div className="border-t border-gold-dark pt-0 sm:pt-1 md:pt-2 flex justify-between text-[8px] sm:text-[9px] md:text-xs text-wood-light font-medieval">
                <span className="line-clamp-1">{character.class || '—'}</span>
                <span className="font-bold text-gold">Lv{character.level ? `. ${character.level}` : ''}</span>
              </div>
            </div>

            {/* Decorative bottom corner */}
            <div className={`h-1 ${character.type === 'guild' ? 'bg-gold' : 'bg-seal'}`}></div>
          </div>
        </div>
      ))}
    </div>
  )
}
