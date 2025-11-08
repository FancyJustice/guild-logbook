import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function ArtifactDetail({ artifact, onBack }) {
  const [showModel, setShowModel] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!showModel || !containerRef.current) return

    console.log('Starting 3D viewer setup...')
    console.log('Container element:', containerRef.current)
    console.log('Container dimensions before:', containerRef.current.clientWidth, 'x', containerRef.current.clientHeight)

    try {
      // Ensure container has dimensions
      const container = containerRef.current
      let width = container.clientWidth
      let height = container.clientHeight

      console.log('Container dimensions after:', width, 'x', height)

      // Fallback if dimensions are 0
      if (width === 0) {
        width = Math.max(400, window.innerWidth * 0.6)
        console.log('Width was 0, using fallback:', width)
      }
      if (height === 0) {
        height = 400
        console.log('Height was 0, using fallback:', height)
      }

      console.log('Final dimensions:', width, 'x', height)

      // Scene
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x2a2420)
      console.log('Scene created')

      // Camera
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
      camera.position.z = 10
      console.log('Camera created')

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
      renderer.setSize(width, height)
      renderer.setPixelRatio(window.devicePixelRatio)
      console.log('Renderer created, canvas:', renderer.domElement)

      // Clear and mount
      container.innerHTML = ''
      container.appendChild(renderer.domElement)
      console.log('Renderer mounted to container')

      // Light
      const light = new THREE.AmbientLight(0xffffff, 1)
      scene.add(light)
      console.log('Light added')

      // Create cube
      const geometry = new THREE.BoxGeometry(3, 3, 3)
      const material = new THREE.MeshPhongMaterial({ color: 0xd4a574 })
      const cube = new THREE.Mesh(geometry, material)
      scene.add(cube)
      console.log('Cube created and added to scene')

      // Animation
      let animationId = null
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        renderer.render(scene, camera)
      }
      animate()
      console.log('Animation started')

      // Cleanup
      return () => {
        console.log('Cleaning up 3D viewer')
        if (animationId) cancelAnimationFrame(animationId)
        renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    } catch (error) {
      console.error('3D viewer error:', error)
      console.error('Error stack:', error.stack)
    }
  }, [showModel])

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded"
      >
        ← Back to Artifacts
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-4">
          {artifact.photo && (
            <div className="space-y-2">
              <div className="bg-wood-light rounded-lg overflow-hidden shadow-lg border-2 border-gold">
                <img
                  src={artifact.photo}
                  alt={artifact.name}
                  className="w-full h-auto"
                />
              </div>
              {artifact.modelPath && (
                <button
                  onClick={() => setShowModel(!showModel)}
                  className="w-full px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded font-medieval text-sm"
                >
                  {showModel ? '← View Photo' : 'View 3D Model →'}
                </button>
              )}
            </div>
          )}

          <div className="bg-parchment text-wood p-4 rounded-lg border-2 border-gold space-y-3">
            <div className="border-b border-gold-dark pb-2">
              <div className="text-xs text-gold uppercase tracking-wide font-medieval">
                {artifact.type}
              </div>
              <h2 className="text-xl font-bold font-medieval text-wood">{artifact.name}</h2>
            </div>
            <div className="text-sm space-y-1">
              <p className="text-wood-light"><strong>Owner:</strong> {artifact.owner || '—'}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {showModel && (
            <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold">
              <h3 className="text-lg font-medieval font-bold text-gold-dark mb-3">3D Model</h3>
              <div
                ref={containerRef}
                style={{
                  width: '100%',
                  height: '400px',
                  borderRadius: '8px',
                  border: '2px solid #d4a574',
                  backgroundColor: '#2a2420',
                  display: 'block',
                  minWidth: '400px',
                  minHeight: '400px'
                }}
              />
            </div>
          )}

          {!showModel && artifact.modelPath && (
            <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold text-center text-wood-light">
              <p>Click "View 3D Model →" to load the viewer</p>
            </div>
          )}

          {artifact.description && (
            <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold">
              <h3 className="text-lg font-medieval font-bold text-gold-dark mb-3">Description</h3>
              <p className="text-sm leading-relaxed">{artifact.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
