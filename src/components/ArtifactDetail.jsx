import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

export default function ArtifactDetail({ artifact, onBack }) {
  const [showModel, setShowModel] = useState(false)
  const containerRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !artifact.modelPath || !showModel) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x2a2420)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 5, 15)
    camera.lookAt(0, 0, 0)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    containerRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 10)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xffd700, 0.5)
    pointLight.position.set(-10, 5, 10)
    scene.add(pointLight)

    // Load FBX model
    const loader = new FBXLoader()
    loader.load(artifact.modelPath, (fbx) => {
      fbx.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true
          node.receiveShadow = true

          // Apply texture if available
          if (artifact.texturePath && node.material) {
            const textureLoader = new THREE.TextureLoader()
            textureLoader.load(artifact.texturePath, (texture) => {
              node.material.map = texture
              node.material.needsUpdate = true
            })
          }
        }
      })

      // Center and scale model
      const box = new THREE.Box3().setFromObject(fbx)
      const center = box.getCenter(new THREE.Vector3())
      fbx.position.sub(center)
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 8 / maxDim
      fbx.scale.multiplyScalar(scale)

      scene.add(fbx)
      sceneRef.current = { scene, camera, renderer, fbx }

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate)
        fbx.rotation.y += 0.005
        renderer.render(scene, camera)
      }
      animate()
    })

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      containerRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [artifact.modelPath, artifact.texturePath, showModel])

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded"
      >
        ← Back to Artifacts
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Column - Image & Basic Info */}
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

          {/* Quick Info */}
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

        {/* Main Content - Right 3 Columns */}
        <div className="lg:col-span-3 space-y-4">
          {/* 3D Model Viewer */}
          {showModel && artifact.modelPath ? (
            <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold">
              <h3 className="text-lg font-medieval font-bold text-gold-dark mb-3">3D Model</h3>
              <div
                ref={containerRef}
                style={{
                  width: '100%',
                  height: '400px',
                  borderRadius: '8px',
                  border: '2px solid #d4a574',
                  backgroundColor: '#2a2420'
                }}
              />
            </div>
          ) : !showModel && artifact.modelPath ? (
            <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold text-center text-wood-light">
              <p>Click "View 3D Model →" to load the model viewer</p>
            </div>
          ) : null}

          {/* Description */}
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
