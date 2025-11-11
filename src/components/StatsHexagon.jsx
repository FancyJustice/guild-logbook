export default function StatsHexagon({ stats = {} }) {
  // Default stats
  const defaultStats = {
    str: 0,
    agi: 0,
    dex: 0,
    int: 0,
    luk: 0,
    vit: 0,
  }

  const finalStats = { ...defaultStats, ...stats }
  const maxStat = 10 // Maximum possible stat value for scaling

  // Calculate normalized values (0-1) for drawing
  const normalizeValue = (value) => {
    return Math.min(Math.max(value / maxStat, 0), 1)
  }

  // Hexagon vertices (in order): STR, AGI, DEX, INT, LUK, VIT
  const angles = [0, 60, 120, 180, 240, 300].map(deg => (deg * Math.PI) / 180)
  const statKeys = ['str', 'agi', 'dex', 'int', 'luk', 'vit']
  const statLabels = ['STR', 'AGI', 'DEX', 'INT', 'LUK', 'VIT']
  const statColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9']

  // Calculate points for the stat polygon
  const radius = 80 // Distance from center to vertex
  const centerX = 120
  const centerY = 120

  const getPointCoordinates = (angle, distance) => {
    const x = centerX + distance * Math.cos(angle - Math.PI / 2)
    const y = centerY + distance * Math.sin(angle - Math.PI / 2)
    return [x, y]
  }

  // Get hexagon outline vertices
  const hexagonPoints = angles
    .map(angle => getPointCoordinates(angle, radius))
    .map(coords => coords.join(','))
    .join(' ')

  // Get stat points (scaled based on values)
  const statPoints = angles
    .map((angle, i) => {
      const normalizedValue = normalizeValue(finalStats[statKeys[i]])
      const distance = radius * normalizedValue
      return getPointCoordinates(angle, distance)
    })
    .map(coords => coords.join(','))
    .join(' ')

  return (
    <div className="bg-parchment text-wood p-4 rounded-lg border-2 border-gold overflow-hidden w-full">
      <div className="flex justify-center">
        <svg width="240" height="240" viewBox="0 0 240 240" className="mx-auto">
          {/* Background hexagon grid */}
          {[1, 0.75, 0.5, 0.25].map((scale, idx) => (
            <polygon
              key={`grid-${idx}`}
              points={angles
                .map(angle => getPointCoordinates(angle, radius * scale))
                .map(coords => coords.join(','))
                .join(' ')}
              fill="none"
              stroke="#d4a574"
              strokeWidth="0.5"
              opacity="0.3"
            />
          ))}

          {/* Hexagon outline */}
          <polygon
            points={hexagonPoints}
            fill="none"
            stroke="#d4a574"
            strokeWidth="2"
          />

          {/* Stat polygon (filled) */}
          <polygon
            points={statPoints}
            fill="rgba(212, 165, 116, 0.2)"
            stroke="#d4a574"
            strokeWidth="2"
          />

          {/* Stat vertices with labels and values */}
          {angles.map((angle, i) => {
            const value = finalStats[statKeys[i]]
            const normalizedValue = normalizeValue(value)
            const distance = radius * normalizedValue
            const [x, y] = getPointCoordinates(angle, distance)
            const [labelX, labelY] = getPointCoordinates(angle, radius + 25)

            return (
              <g key={`stat-${i}`}>
                {/* Stat point circle */}
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={statColors[i]}
                  stroke="white"
                  strokeWidth="1"
                />

                {/* Stat label */}
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-medieval font-bold fill-gold-dark"
                  fontSize="12"
                >
                  {statLabels[i]}
                </text>
              </g>
            )
          })}

          {/* Center dot */}
          <circle cx={centerX} cy={centerY} r="2" fill="#d4a574" />
        </svg>
      </div>
    </div>
  )
}
