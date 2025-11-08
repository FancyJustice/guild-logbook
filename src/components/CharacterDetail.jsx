import StatsHexagon from './StatsHexagon'

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

  return (
    <div className="space-y-4" style={{
      '--gradient-color-1': ultimateColors.color1,
      '--gradient-color-2': ultimateColors.color2,
    }}>
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded"
      >
        ← Back to Browse
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Column - Image & Basic Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-wood-light rounded-lg overflow-hidden shadow-lg border-2 border-gold">
            <img
              src={character.photo}
              alt={character.name}
              className="w-full h-auto"
            />
          </div>

          {/* Quick Stats */}
          <div className="bg-parchment text-wood p-4 rounded-lg border-2 border-gold space-y-3">
            <div className="border-b border-gold-dark pb-2">
              <div className="text-xs text-gold uppercase tracking-wide font-medieval">
                {character.type === 'guild' ? 'Guild Member' : 'Criminal'}
              </div>
              <h2 className="text-xl font-bold font-medieval text-wood">{character.name}</h2>
              {character.title && (
                <p className="text-xs italic text-gold-dark mt-1">"{character.title}"</p>
              )}
            </div>

            <div className="text-sm space-y-1">
              <p className="text-wood-light"><strong>Lvl:</strong> {character.level}</p>
              <p className="text-wood-light"><strong>Rank:</strong> {character.rank}</p>
              <p className="text-wood-light">
                <strong>Player:</strong> {character.vrcPlayerName && (
                  <a
                    href={`https://vrchat.com/home/user/${character.vrcPlayerName}`}
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
        </div>

        {/* Main Content - Right 3 Columns */}
        <div className="lg:col-span-3 space-y-4">
          {/* Header with Quote & Lore */}
          <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold">
            {character.quote && (
              <blockquote className="italic text-base text-gold-dark mb-3 pl-4 border-l-4 border-gold">
                "{character.quote}"
              </blockquote>
            )}
            {character.lore && (
              <div>
                <h3 className="text-lg font-medieval font-bold text-gold-dark mb-2">Lore</h3>
                <p className="text-sm leading-relaxed">{character.lore}</p>
              </div>
            )}
            {character.observations && character.observations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gold-dark">
                <h3 className="text-lg font-medieval font-bold text-gold-dark mb-2">Observations</h3>
                <ul className="space-y-1">
                  {character.observations.map((observation, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-wood-light">
                      <span className="text-gold mt-1">•</span>
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

          {/* Character Stats Hexagon */}
          <div className="flex justify-center">
            <StatsHexagon stats={{
              str: character.str || 0,
              agi: character.agi || 0,
              dex: character.dex || 0,
              int: character.int || 0,
              luk: character.luk || 0,
              vit: character.vit || 0,
            }} />
          </div>

          {/* Combat Skills & Life Skills in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {character.combatSkills && character.combatSkills.length > 0 && (
              <div className="bg-parchment text-wood p-4 rounded-lg border-2 border-gold">
                <h3 className="text-base font-medieval font-bold mb-3 text-gold-dark">Combat Skills</h3>
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

            {character.lifeSkills && character.lifeSkills.length > 0 && (
              <div className="bg-parchment text-wood p-4 rounded-lg border-2 border-gold">
                <h3 className="text-base font-medieval font-bold mb-3 text-gold-dark">Life Skills</h3>
                <ul className="grid grid-cols-1 gap-1">
                  {character.lifeSkills.map((skill, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <span className="text-gold">✦</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

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
