import { useState, useEffect, useRef } from 'react'
import StatsHexagon from './StatsHexagon'
import { getImageSource } from '../utils/imageUtils'

// Color palette for ultimate skills
const colorPalette = {
  gold: { color1: '#daa520', color2: '#ffd700' },
  purple: { color1: '#9d4edd', color2: '#e0aaff' },
  cyan: { color1: '#00d4ff', color2: '#00ffff' },
  red: { color1: '#ff006e', color2: '#ff6b9d' },
  green: { color1: '#00ff88', color2: '#76ffb3' },
  orange: { color1: '#ff8c42', color2: '#ffb347' },
  pink: { color1: '#ff006e', color2: '#ffb3d9' },
  blue: { color1: '#4361ee', color2: '#7209b7' },
}

export default function CharacterDetail({ character, onBack }) {
  const ultimateColors = colorPalette[character.ultimateSkillColor] || colorPalette.gold
  const [animationStyle, setAnimationStyle] = useState({})
  const [showContent, setShowContent] = useState(false)
  const portraitRef = useRef(null)

  useEffect(() => {
    // Read the stored card position from sessionStorage
    const cardPosition = sessionStorage.getItem('cardClickPosition')
    if (cardPosition) {
      try {
        const position = JSON.parse(cardPosition)

        // Get the portrait element's final position
        if (portraitRef.current) {
          const portraitRect = portraitRef.current.getBoundingClientRect()

          // Calculate the offset needed to position portrait at card location
          const offsetX = position.x - portraitRect.left
          const offsetY = position.y - portraitRect.top
          const scaleRatio = position.width / portraitRect.width

          // Set CSS custom properties for the animation
          setAnimationStyle({
            '--start-x': `${offsetX}px`,
            '--start-y': `${offsetY}px`,
            '--start-width': `${position.width}px`,
            '--final-width': `${portraitRect.width}px`,
            animation: 'portrait-expand 0.8s ease-out forwards',
          })

          // Show content after a brief delay
          setTimeout(() => setShowContent(true), 100)

          // Clean up sessionStorage after animation
          setTimeout(() => {
            sessionStorage.removeItem('cardClickPosition')
          }, 800)
        }
      } catch (error) {
        console.error('Error parsing card position:', error)
        setShowContent(true)
      }
    } else {
      // No animation data, show content immediately
      setShowContent(true)
    }
  }, [])


  const exportCharacterAsJSON = () => {
    const dataToExport = {
      character: character
    }
    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${character.name.replace(/\s+/g, '_')}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4" style={{
      '--gradient-color-1': ultimateColors.color1,
      '--gradient-color-2': ultimateColors.color2,
    }}>
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded"
        >
          ← Back to Browse
        </button>
        <button
          onClick={exportCharacterAsJSON}
          className="px-4 py-2 bg-gold text-wood hover:bg-gold-light transition rounded flex items-center gap-2"
        >
          <i className="ra ra-download" style={{ color: '#2a2420' }}></i>
          Export {character.name}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Column - Image & Basic Info */}
        <div className="lg:col-span-1 space-y-4">
          <div
            ref={portraitRef}
            className="bg-wood-light rounded-lg overflow-hidden shadow-lg border-2 border-gold"
            style={animationStyle}
          >
            <img
              src={getImageSource(character.photo)}
              alt={character.name}
              className="w-full h-auto"
            />
          </div>

          {/* Quick Stats */}
          <div
            className={`bg-parchment text-wood p-4 rounded-lg border-2 border-gold space-y-3 ${
              showContent ? 'animate-in fade-in duration-700' : 'opacity-0'
            }`}
            style={{
              animation: showContent ? 'content-fade-in 0.6s ease-out forwards' : 'none',
            }}
          >
            <div className="border-b-2 border-gold-dark pb-2">
              <div className="inline-block px-3 py-1 bg-gold text-wood text-xs uppercase tracking-widest font-medieval font-bold rounded mb-2">
                <i className={`ra ${character.type === 'guild' ? 'ra-shield' : 'ra-dragon-emblem'}`} style={{ marginRight: '0.5rem', color: '#2a2420' }}></i>
                {character.type === 'guild' ? 'Guild Member' : 'Criminal'}
              </div>
              <h2 className="text-2xl font-bold font-medieval text-gold-dark" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>{character.name}</h2>
              {character.title && (
                <p className="text-xs italic text-gold mt-2" style={{ fontStyle: 'italic' }}>"{character.title}"</p>
              )}
            </div>

            <div className="text-sm space-y-2">
              <p className="text-wood-light"><i className="ra ra-explosion" style={{ marginRight: '0.5rem', color: '#d4a574' }}></i><strong>Lvl:</strong> {character.level}</p>
              <p className="text-wood-light"><i className="ra ra-crown" style={{ marginRight: '0.5rem', color: '#d4a574' }}></i><strong>Rank:</strong> {character.rank}</p>
              <p className="text-wood-light">
                <i className="ra ra-portrait" style={{ marginRight: '0.5rem', color: '#d4a574' }}></i><strong>Player:</strong> {character.vrcPlayerName && (
                  <a
                    href={character.vrcProfileUrl || `https://vrchat.com/home/user/${character.vrcPlayerName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-parchment transition cursor-pointer"
                  >
                    {character.vrcPlayerName}
                  </a>
                )}
              </p>
            </div>
          </div>

          {/* Character Stats Hexagon */}
          <div
            style={{
              animation: showContent ? 'content-fade-in 0.6s ease-out 0.1s forwards' : 'none',
              opacity: showContent ? 1 : 0,
            }}
          >
            <StatsHexagon stats={{
              str: character.str || 0,
              agi: character.agi || 0,
              dex: character.dex || 0,
              int: character.int || 0,
              luk: character.luk || 0,
              vit: character.vit || 0,
            }} />
          </div>
        </div>

        {/* Main Content - Right 3 Columns */}
        <div
          className="lg:col-span-3 space-y-4"
          style={{
            animation: showContent ? 'content-fade-in 0.6s ease-out 0.15s forwards' : 'none',
            opacity: showContent ? 1 : 0,
          }}
        >
          {/* Header with Quote & Lore */}
          <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold space-y-4">
            {character.quote && (
              <blockquote className="italic text-lg text-gold-dark pl-6 border-l-4 border-gold relative" style={{ fontStyle: 'italic', letterSpacing: '0.02em' }}>
                <span className="text-gold text-2xl absolute left-0 top-0">✦</span>
                "{character.quote}"
                <span className="text-gold text-2xl">✦</span>
              </blockquote>
            )}
            {character.lore && (
              <div>
                <h3 className="text-lg font-medieval font-bold text-gold-dark mb-3 uppercase tracking-wider"><i className="ra ra-scroll" style={{ marginRight: '0.5rem', color: '#d4a574' }}></i>━ Lore ━</h3>
                <p className="text-sm leading-relaxed text-wood">{character.lore}</p>
              </div>
            )}
            {character.observations && Array.isArray(character.observations) && character.observations.length > 0 && (
              <div className="pt-4 border-t-2 border-gold-dark">
                <h3 className="text-lg font-medieval font-bold text-gold-dark mb-3 uppercase tracking-wider"><i className="ra ra-book" style={{ marginRight: '0.5rem', color: '#d4a574' }}></i>━ Observations ━</h3>
                <ul className="space-y-2">
                  {character.observations.map((observation, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-wood-light pl-2 border-l-2 border-gold-dark">
                      <i className="ra ra-feather" style={{ color: '#d4a574', marginTop: '0.25rem' }}></i>
                      <span>{observation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Core Attributes - Combined Panel */}
          <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold">
            <h3 className="text-lg font-medieval font-bold text-gold-dark mb-4">Character Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gold-dark">
                  <span className="text-sm text-wood-light font-medieval">Race</span>
                  <span className="font-bold text-wood">{character.race || '—'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gold-dark">
                  <span className="text-sm text-wood-light font-medieval">Class</span>
                  <span className="font-bold text-wood">{character.class || '—'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gold-dark">
                  <span className="text-sm text-wood-light font-medieval">Age</span>
                  <span className="font-bold text-wood">{character.age || '—'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-wood-light font-medieval">Height</span>
                  <span className="font-bold text-wood">{character.height || '—'}</span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gold-dark">
                  <span className="text-sm text-wood-light font-medieval">Gender</span>
                  <span className="font-bold text-wood">{character.gender || '—'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gold-dark">
                  <span className="text-sm text-wood-light font-medieval">Status</span>
                  <span className="font-bold text-wood">{character.status || '—'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gold-dark">
                  <span className="text-sm text-wood-light font-medieval">Origin</span>
                  <span className="font-bold text-wood">{character.placeOfOrigin || '—'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-wood-light font-medieval">Affiliation</span>
                  <span className="font-bold text-wood">{character.affiliation || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personality & Elements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {character.type === 'guild' ? (
              <>
                <AttributeBox label="Personality" value={character.personality} />
                <AttributeBox label="Flaw" value={character.flaw} />
              </>
            ) : (
              <AttributeBox label="Personality" value={character.personality} />
            )}
            <AttributeBox label="Elemental Attunement" value={character.elemeltanAttunement} />
          </div>

          {/* Combat Skills */}
          {character.combatSkills && character.combatSkills.length > 0 && (
            <div className="bg-parchment text-wood p-4 rounded-lg border-2 border-gold">
              <h3 className="text-base font-medieval font-bold mb-3 text-gold-dark"><i className="ra ra-sword" style={{ marginRight: '0.5rem', color: '#d4a574' }}></i>━ Combat Skills ━</h3>
              <div className="space-y-2">
                {character.combatSkills.map((skill, idx) => {
                  const isUltimate = typeof skill !== 'string' && skill.isUltimate
                  const skillObj = typeof skill === 'string' ? { name: skill, description: '' } : skill

                  let icon = '⚔'
                  if (isUltimate) icon = '⚡'
                  else if (skillObj.heal) icon = '💚'
                  else if (skillObj.buff) icon = '⬆️'
                  else if (skillObj.passive) icon = '✦'

                  return (
                    <div key={idx} className={`border-l-4 pl-2 py-1 ${isUltimate ? 'border-ultimate' : 'border-gold-dark'}`}>
                      <div className="flex items-start gap-2">
                        <span className="text-gold text-lg">{icon}</span>
                        <div className="flex-1">
                          <div className={`${isUltimate ? 'ultimate-skill text-sm' : 'font-bold text-sm'}`}>
                            {skillObj.name}
                          </div>
                          {skillObj.description && (
                            <div className="text-sm text-wood-light mt-0.5">{skillObj.description}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Life Skills - Small */}
          {character.lifeSkills && character.lifeSkills.length > 0 && (
            <div className="bg-parchment text-wood p-3 rounded-lg border-2 border-gold">
              <h3 className="text-sm font-medieval font-bold mb-2 text-gold-dark"><i className="ra ra-fishing-hook" style={{ marginRight: '0.5rem', color: '#d4a574' }}></i>━ Life Skills ━</h3>
              <ul className="grid grid-cols-2 gap-2">
                {character.lifeSkills.map((skill, idx) => (
                  <li key={idx} className="flex items-center gap-1 text-xs">
                    <i className="ra ra-sparkles" style={{ color: '#d4a574', fontSize: '0.9rem' }}></i>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Criminal Only Fields */}
          {character.type === 'criminal' && (
            <div className="grid grid-cols-2 gap-4">
              <StatBox label="Bounty" value={character.bounty || '—'} />
              {character.crime && <StatBox label="Crime" value={character.crime} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div className="bg-parchment text-wood p-4 rounded border-2 border-gold text-center">
      <div className="text-xs text-gold-dark uppercase tracking-wide font-medieval mb-2">{label}</div>
      <div className="font-medieval font-bold text-lg">{value}</div>
    </div>
  )
}

function AttributeBox({ label, value }) {
  return (
    <div className="bg-parchment text-wood p-4 rounded border-2 border-gold">
      <div className="text-xs text-gold-dark uppercase tracking-wide font-medieval mb-2">{label}</div>
      <div className="font-medieval text-base">{value || '—'}</div>
    </div>
  )
}
