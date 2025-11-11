import { useEffect } from 'react'
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

  // Scroll to top when character changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [character.id])

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
          <div className="bg-wood-light rounded-lg overflow-hidden shadow-lg border-2 border-gold">
            <img
              src={getImageSource(character.photo)}
              alt={character.name}
              className="w-full h-auto"
            />
          </div>

          {/* Quick Stats */}
          <div className="bg-parchment text-wood p-4 rounded-lg border-2 border-gold space-y-3">
            <div className="border-b-2 border-gold-dark pb-2">
              <div className="inline-block px-4 py-2 bg-gold text-wood text-sm uppercase tracking-widest font-medieval font-bold rounded mb-2">
                <i className={`ra ${character.type === 'guild' ? 'ra-shield' : 'ra-dragon-emblem'}`} style={{ marginRight: '0.5rem', color: '#2a2420' }}></i>
                {character.type === 'guild' ? 'Guild Member' : 'Criminal'}
              </div>
              <h2 className="text-4xl font-bold font-medieval text-gold-dark" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>{character.name}</h2>
              {character.title && (
                <p className="text-lg italic text-gold mt-2" style={{ fontStyle: 'italic' }}>"{character.title}"</p>
              )}
            </div>

            <div className="text-base space-y-3">
              <p className="text-wood-light"><i className="ra ra-explosion" style={{ marginRight: '0.5rem', color: '#d4a574' }}></i><strong>Lvl:</strong> {character.level}</p>
              <img src="/VRLogo.png" alt="VRChat" style={{ height: '1.2rem', width: 'auto', marginRight: '0.5rem', display: 'inline-block' }} /><p className="text-wood-light" style={{ display: 'inline' }}><strong>Player:</strong> {character.vrcPlayerName && (
                <a
                  href={character.vrcProfileUrl || `https://vrchat.com/home/user/${character.vrcPlayerName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-parchment transition cursor-pointer ml-1"
                >
                  {character.vrcPlayerName}
                </a>
              )}</p>
            </div>

            {/* Prominent Rank/Threat Level Display */}
            {character.rank && (
              <div className="mt-4 pt-4 border-t-2 border-gold-dark">
                <RankBadge label={character.type === 'guild' ? 'Rank' : 'Threat Level'} value={character.rank} />
              </div>
            )}
          </div>

          {/* Character Stats Hexagon */}
          <StatsHexagon stats={{
            str: character.str || 0,
            agi: character.agi || 0,
            dex: character.dex || 0,
            int: character.int || 0,
            luk: character.luk || 0,
            vit: character.vit || 0,
          }} />
        </div>

        {/* Main Content - Right 3 Columns */}
        <div className="lg:col-span-3 space-y-4">
          {/* Header with Quote & Lore */}
          <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold space-y-4">
            {character.quote && (
              <blockquote className="italic text-lg text-gold-dark pl-6 border-l-4 border-gold relative" style={{ fontStyle: 'italic', letterSpacing: '0.02em' }}>
                <span className="text-gold text-2xl" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }}>✦</span>
                "{character.quote}"
                <span className="text-gold text-2xl" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '0.5rem' }}>✦</span>
              </blockquote>
            )}
            {character.lore && (
              <div>
                <h3 className="text-2xl font-medieval font-bold text-gold-dark mb-4 uppercase tracking-wider"><i className="ra ra-scroll" style={{ marginRight: '0.5rem', color: '#d4a574' }}></i>━ Lore ━</h3>
                <p className="text-base leading-relaxed text-wood">{character.lore}</p>
              </div>
            )}
            {character.observations && Array.isArray(character.observations) && character.observations.length > 0 && (
              <div className="pt-4 border-t-2 border-gold-dark">
                <h3 className="text-2xl font-medieval font-bold text-gold-dark mb-4 uppercase tracking-wider"><i className="ra ra-book" style={{ marginRight: '0.5rem', color: '#d4a574' }}></i>━ Observations ━</h3>
                <ul className="space-y-3">
                  {character.observations.map((observation, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-base text-wood-light pl-2 border-l-2 border-gold-dark">
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
              <div className="space-y-5">
                <div className="flex justify-between items-center py-4 border-b border-gold-dark">
                  <span className="text-lg text-wood-light font-medieval">Race</span>
                  <span className="font-bold text-lg text-wood">{character.race || '—'}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gold-dark">
                  <span className="text-lg text-wood-light font-medieval">Class</span>
                  <span className="font-bold text-lg text-wood">{character.class || '—'}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gold-dark">
                  <span className="text-lg text-wood-light font-medieval">Age</span>
                  <span className="font-bold text-lg text-wood">{character.age || '—'}</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-lg text-wood-light font-medieval">Height</span>
                  <span className="font-bold text-lg text-wood">{character.height || '—'}</span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                <div className="flex justify-between items-center py-4 border-b border-gold-dark">
                  <span className="text-lg text-wood-light font-medieval">Gender</span>
                  <span className="font-bold text-lg text-wood">{character.gender || '—'}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gold-dark">
                  <span className="text-lg text-wood-light font-medieval">Status</span>
                  <span className="font-bold text-lg text-wood">{character.status || '—'}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gold-dark">
                  <span className="text-lg text-wood-light font-medieval">Origin</span>
                  <span className="font-bold text-lg text-wood">{character.placeOfOrigin || '—'}</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-lg text-wood-light font-medieval">Affiliation</span>
                  <span className="font-bold text-lg text-wood">{character.affiliation || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personality & Elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AttributeBox label="Personality" value={character.personality} />
            <AttributeBox label="Elemental Attunement" value={character.elemeltanAttunement} />
            {character.type === 'guild' && (
              <AttributeBox label="Flaw" value={character.flaw} />
            )}
          </div>

          {/* Criminal Record - Below the personality boxes */}
          {character.type === 'criminal' && (
            <div className="bg-parchment text-wood p-4 rounded-lg border-2 border-gold">
              <h3 className="text-sm font-medieval font-bold mb-3 text-gold-dark">Criminal Record</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Bounty:</strong> {character.bounty || '—'}
                </p>
                {character.crime && (
                  <p className="text-sm">
                    <strong>Crime:</strong> {character.crime}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Combat Skills */}
          {character.combatSkills && character.combatSkills.length > 0 && (
            <div className="bg-parchment text-wood p-4 rounded-lg border-2 border-gold">
              <h3 className="text-2xl font-medieval font-bold mb-4 text-gold-dark"><i className="ra ra-sword" style={{ marginRight: '0.5rem', color: '#d4a574' }}></i>━ Combat Skills ━</h3>
              <div className="space-y-4">
                {character.combatSkills.map((skill, idx) => {
                  const isUltimate = typeof skill !== 'string' && skill.isUltimate
                  const skillObj = typeof skill === 'string' ? { name: skill, description: '' } : skill

                  let icon = '⚔'
                  if (isUltimate) icon = '⚡'
                  else if (skillObj.heal) icon = '💚'
                  else if (skillObj.buff) icon = '⬆️'
                  else if (skillObj.passive) icon = '✦'

                  return (
                    <div key={idx} className={`border-l-4 pl-4 py-3 ${isUltimate ? 'border-ultimate' : 'border-gold-dark'}`}>
                      <div className="flex items-start gap-4">
                        <span className="text-gold text-3xl flex-shrink-0">{icon}</span>
                        <div className="flex-1">
                          <div
                            className={`${isUltimate ? 'ultimate-skill text-xl' : 'font-bold text-xl'}`}
                            style={isUltimate ? {
                              '--gradient-color-1': ultimateColors.color1,
                              '--gradient-color-2': ultimateColors.color2,
                            } : {}}
                          >
                            {skillObj.name}
                          </div>
                          {skillObj.description && (
                            <div className="text-lg text-wood-light mt-2">{skillObj.description}</div>
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
            <div className="bg-parchment text-wood p-4 rounded-lg border-2 border-gold">
              <h3 className="text-lg font-medieval font-bold mb-3 text-gold-dark"><i className="ra ra-fishing-hook" style={{ marginRight: '0.5rem', color: '#d4a574' }}></i>━ Life Skills ━</h3>
              <ul className="grid grid-cols-2 gap-3">
                {character.lifeSkills.map((skill, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-base">
                    <i className="ra ra-sparkles" style={{ color: '#d4a574', fontSize: '1.1rem' }}></i>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value }) {
  // Rank and threat level color mapping
  const rankColors = {
    'S': { bg: 'bg-red-900', border: 'border-red-600', text: 'text-red-100', animate: true },
    'A': { bg: 'bg-orange-900', border: 'border-orange-600', text: 'text-orange-100', animate: true },
    'B': { bg: 'bg-yellow-900', border: 'border-yellow-600', text: 'text-yellow-100', animate: false },
    'C': { bg: 'bg-green-900', border: 'border-green-600', text: 'text-green-100', animate: false },
    'D': { bg: 'bg-blue-900', border: 'border-blue-600', text: 'text-blue-100', animate: false },
  }

  const threatColors = {
    'Critical': { bg: 'bg-red-900', border: 'border-red-600', text: 'text-red-100', animate: true },
    'High': { bg: 'bg-orange-900', border: 'border-orange-600', text: 'text-orange-100', animate: true },
    'Medium': { bg: 'bg-yellow-900', border: 'border-yellow-600', text: 'text-yellow-100', animate: false },
    'Low': { bg: 'bg-green-900', border: 'border-green-600', text: 'text-green-100', animate: false },
  }

  const isRank = label.includes('Rank')
  const colorMap = isRank ? rankColors : threatColors
  const colors = value ? colorMap[value] : null

  const bgClass = colors?.bg || 'bg-parchment'
  const borderClass = colors?.border || 'border-gold'
  const textClass = colors?.text || 'text-wood'
  const animate = colors?.animate ? 'animate-pulse' : ''

  return (
    <div className={`${bgClass} ${textClass} p-4 rounded border-2 ${borderClass} text-center ${animate}`}>
      <div className={`text-sm ${colors?.text || 'text-gold-dark'} uppercase tracking-wide font-medieval mb-3`}>{label}</div>
      <div className="font-medieval font-bold text-2xl">{value || '—'}</div>
    </div>
  )
}

function AttributeBox({ label, value }) {
  // Element color mapping with icons
  const elementColors = {
    'Fire': { bg: 'bg-red-900', border: 'border-red-600', text: 'text-red-100', icon: 'ra-fire' },
    'Water': { bg: 'bg-blue-900', border: 'border-blue-600', text: 'text-blue-100', icon: 'ra-droplet' },
    'Earth': { bg: 'bg-amber-900', border: 'border-amber-700', text: 'text-amber-100', icon: 'ra-mountain' },
    'Air': { bg: 'bg-cyan-800', border: 'border-cyan-500', text: 'text-cyan-100', icon: 'ra-wind' },
    'Lightning': { bg: 'bg-yellow-900', border: 'border-yellow-600', text: 'text-yellow-100', icon: 'ra-lightning' },
    'Ice': { bg: 'bg-sky-800', border: 'border-sky-500', text: 'text-sky-100', icon: 'ra-snowflake' },
    'Nature': { bg: 'bg-green-900', border: 'border-green-600', text: 'text-green-100', icon: 'ra-leaf' },
    'Light': { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-900', icon: 'ra-sun' },
    'Dark': { bg: 'bg-gray-900', border: 'border-gray-700', text: 'text-gray-300', icon: 'ra-night' },
    'Wind': { bg: 'bg-cyan-800', border: 'border-cyan-500', text: 'text-cyan-100', icon: 'ra-wind' },
    'Steam': { bg: 'bg-slate-700', border: 'border-slate-500', text: 'text-slate-100', icon: 'ra-smoke' },
    'Magma': { bg: 'bg-orange-900', border: 'border-orange-600', text: 'text-orange-100', icon: 'ra-fire' },
    'Sand': { bg: 'bg-yellow-700', border: 'border-yellow-600', text: 'text-yellow-100', icon: 'ra-hourglass' },
    'Metal': { bg: 'bg-zinc-700', border: 'border-zinc-600', text: 'text-zinc-100', icon: 'ra-anvil' },
    'Gravity': { bg: 'bg-purple-950', border: 'border-purple-700', text: 'text-purple-100', icon: 'ra-hole' },
    'Poison': { bg: 'bg-purple-900', border: 'border-purple-700', text: 'text-purple-100', icon: 'ra-toxic' },
    'Blood': { bg: 'bg-red-950', border: 'border-red-800', text: 'text-red-100', icon: 'ra-droplet' },
    'Ghost': { bg: 'bg-violet-950', border: 'border-violet-700', text: 'text-violet-100', icon: 'ra-ghost' },
    'Prism': { bg: 'bg-pink-800', border: 'border-pink-600', text: 'text-pink-100', icon: 'ra-gem' },
    'Solar': { bg: 'bg-orange-700', border: 'border-orange-500', text: 'text-orange-100', icon: 'ra-sun' },
    'Darkflame': { bg: 'bg-red-950', border: 'border-red-900', text: 'text-red-100', icon: 'ra-explosion' }
  }

  const colors = label === 'Elemental Attunement' && value ? elementColors[value] : null
  const bgClass = colors?.bg || 'bg-parchment'
  const borderClass = colors?.border || 'border-gold'
  const textClass = colors?.text || 'text-wood'
  const labelClass = label === 'Elemental Attunement' && value ? colors?.text : 'text-gold-dark'

  return (
    <div className={`${bgClass} ${textClass} p-4 rounded border-2 ${borderClass}`}>
      <div className={`text-sm ${labelClass} uppercase tracking-wide font-medieval mb-3`}>{label}</div>
      <div className="font-medieval text-lg flex items-center justify-center gap-3">
        {label === 'Elemental Attunement' && colors?.icon ? (
          <>
            <i className={`ra ${colors.icon} text-2xl`}></i>
            {value}
          </>
        ) : (
          value || '—'
        )}
      </div>
    </div>
  )
}

function RankBadge({ label, value }) {
  // Rank and threat level color mapping with expanded palette
  const rankColors = {
    'S': { bg: 'bg-red-900', border: 'border-red-600', text: 'text-red-100', shadow: 'shadow-lg shadow-red-600/50', animate: 'animate-pulse' },
    'A': { bg: 'bg-orange-900', border: 'border-orange-600', text: 'text-orange-100', shadow: 'shadow-lg shadow-orange-600/50', animate: 'animate-pulse' },
    'B': { bg: 'bg-yellow-900', border: 'border-yellow-600', text: 'text-yellow-100', shadow: 'shadow-lg shadow-yellow-600/30', animate: '' },
    'C': { bg: 'bg-green-900', border: 'border-green-600', text: 'text-green-100', shadow: 'shadow-lg shadow-green-600/30', animate: '' },
    'D': { bg: 'bg-blue-900', border: 'border-blue-600', text: 'text-blue-100', shadow: 'shadow-lg shadow-blue-600/30', animate: '' },
  }

  const threatColors = {
    'Devastating': { bg: 'bg-red-900', border: 'border-red-600', text: 'text-red-100', shadow: 'shadow-lg shadow-red-600/50', animate: 'animate-pulse' },
    'Dangerous': { bg: 'bg-orange-900', border: 'border-orange-600', text: 'text-orange-100', shadow: 'shadow-lg shadow-orange-600/50', animate: 'animate-pulse' },
    'Notorious': { bg: 'bg-yellow-900', border: 'border-yellow-600', text: 'text-yellow-100', shadow: 'shadow-lg shadow-yellow-600/30', animate: '' },
    'Harmless': { bg: 'bg-green-900', border: 'border-green-600', text: 'text-green-100', shadow: 'shadow-lg shadow-green-600/30', animate: '' },
  }

  const isRank = label.includes('Rank')
  const colorMap = isRank ? rankColors : threatColors
  const colors = value ? colorMap[value] : null

  const bgClass = colors?.bg || 'bg-parchment'
  const borderClass = colors?.border || 'border-gold'
  const textClass = colors?.text || 'text-wood'
  const shadowClass = colors?.shadow || ''
  const animateClass = colors?.animate || ''

  return (
    <div className={`${bgClass} ${borderClass} ${shadowClass} border-2 rounded-lg p-4 text-center transition-all duration-300 ${animateClass} overflow-hidden`}>
      <div className={`text-xs ${textClass} uppercase tracking-widest font-medieval mb-2 opacity-90`}>{label}</div>
      <div className={`${textClass} font-medieval font-black text-3xl md:text-4xl drop-shadow-lg leading-tight`}>
        {value || '—'}
      </div>
    </div>
  )
}
