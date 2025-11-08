import { useState } from 'react'

export default function Cover({ onFlip }) {
  const [isFading, setIsFading] = useState(false)

  const handleClick = () => {
    setIsFading(true)
    setTimeout(() => {
      onFlip()
    }, 1200)
  }

  return (
    <div
      onClick={handleClick}
      className={`min-h-screen bg-wood flex items-center justify-center cursor-pointer overflow-hidden relative ${isFading ? 'opacity-0' : 'opacity-100'}`}
      style={{
        backgroundImage: `url('${import.meta.env.BASE_URL}parchment.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#2a2420',
        transition: 'opacity 1.2s ease-in-out',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>

      <div className="relative z-10 text-center max-w-2xl px-8 animate-in fade-in duration-1000" style={{
        transition: 'opacity 1.2s ease-in-out',
        opacity: isFading ? 0 : 1,
      }}>
        {/* Main Title */}
        <h1 className="text-7xl font-medieval text-gold mb-8 drop-shadow-lg" style={{
          textShadow: '2px 2px 4px rgba(0,0,0,0.5), -2px -2px 4px rgba(0,0,0,0.3)',
          letterSpacing: '0.1em',
        }}>
          Guild Vagabonds
        </h1>

        {/* Subtitle */}
        <div className="space-y-6 mb-12">
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <h2 className="text-4xl font-medieval text-gold-dark mb-2">Adventurer</h2>
              <div className="w-24 h-1 bg-gold mx-auto"></div>
            </div>
            <div className="text-gold-dark text-3xl">|</div>
            <div className="text-center">
              <h2 className="text-4xl font-medieval text-gold-dark mb-2">Criminal</h2>
              <div className="w-24 h-1 bg-gold mx-auto"></div>
            </div>
          </div>
          <h3 className="text-2xl font-medieval text-gold-dark">Records</h3>
        </div>

        {/* Attribution */}
        <div className="space-y-3 mb-16">
          <p className="text-sm text-gold-dark tracking-widest font-serif">
            As kept by Guildmaster
          </p>
          <p className="text-3xl font-medieval text-gold tracking-[0.3em] select-none">
            ■■■■■■■■■■■■
          </p>
        </div>

        {/* Description */}
        <p className="text-lg text-gold-dark italic font-serif leading-relaxed mb-12">
          Information of various adventurers and criminals are to be documented in this report.
        </p>

        {/* Click to continue */}
        <div className="animate-pulse">
          <p className="text-gold-dark text-sm tracking-widest uppercase">Click to open</p>
          <p className="text-gold text-2xl font-medieval mt-2">➤</p>
        </div>
      </div>

    </div>
  )
}
