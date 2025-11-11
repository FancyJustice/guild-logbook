import { getImageSource } from '../utils/imageUtils'

export default function ArtifactGrid({ artifacts, onSelectArtifact }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {artifacts.map(artifact => (
        <div
          key={artifact.id}
          onClick={() => onSelectArtifact(artifact)}
          className="bg-parchment text-wood rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer transform hover:scale-105 border-2 border-gold"
        >
          {artifact.photo && (
            <div className="overflow-hidden bg-wood-light h-48">
              <img
                src={getImageSource(artifact.photo)}
                alt={artifact.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <div className="text-xs text-gold uppercase tracking-wide font-medieval mb-1">
              {artifact.type}
            </div>
            <h3 className="text-xl font-medieval font-bold text-wood mb-2">{artifact.name}</h3>
            <div className="text-sm text-wood-light">
              <p><strong>Owner:</strong> {artifact.owner || '—'}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
