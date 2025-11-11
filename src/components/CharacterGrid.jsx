import { getImageSource } from '../utils/imageUtils'

export default function CharacterGrid({ characters, onSelectCharacter }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
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
            {/* Decorative top border */}
            <div className={`h-1 ${character.type === 'guild' ? 'bg-gold' : 'bg-seal'}`}></div>

            {/* Character image with frame */}
            <div className="relative overflow-hidden bg-wood-light p-3" style={{ aspectRatio: '230/300' }}>
              <div className="border-2 border-gold-dark rounded h-full w-full overflow-hidden">
                <img
                  src={getImageSource(character.photo)}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content section with book-like styling */}
            <div className="p-5 space-y-3">
              {/* Type label with decorative line */}
              <div className="flex items-center gap-2">
                <div className={`h-px flex-1 ${character.type === 'guild' ? 'bg-gold' : 'bg-seal'}`}></div>
                <div className="text-xs text-gold uppercase tracking-widest font-medieval font-bold">
                  {character.type === 'guild' ? 'Guild Member' : 'Criminal'}
                </div>
                <div className={`h-px flex-1 ${character.type === 'guild' ? 'bg-gold' : 'bg-seal'}`}></div>
              </div>

              {/* Title - italicized like a book */}
              {character.title && (
                <div className="text-sm text-gold-dark italic text-center font-medieval">
                  "{character.title}"
                </div>
              )}

              {/* Name - prominent like a chapter title */}
              <h3 className="text-2xl font-medieval font-bold text-wood text-center border-b-2 border-gold-dark pb-2">
                {character.name}
              </h3>

              {/* Character details */}
              <div className="text-sm space-y-1 text-center">
                <div className="text-wood font-medieval">
                  {character.race} {character.class}
                </div>
                <div className="text-xs text-wood-light italic">
                  {character.vrcPlayerName}
                </div>
              </div>

              {/* Footer details with book page aesthetic */}
              <div className="border-t-2 border-gold-dark pt-3 flex justify-between text-xs text-wood-light font-medieval">
                <span>{character.class || 'Unknown'}</span>
                <span className="font-bold text-gold">Lv. {character.level || '—'}</span>
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
