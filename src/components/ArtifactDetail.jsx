import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

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

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
      scene.add(ambientLight)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
      directionalLight.position.set(5, 5, 5)
      scene.add(directionalLight)
      console.log('Lights added')

      // Mouse controls
      let isDragging = false
      let previousMousePosition = { x: 0, y: 0 }
      let rotation = { x: 0, y: 0 }

      const handleMouseDown = (e) => {
        isDragging = true
        previousMousePosition = { x: e.clientX, y: e.clientY }
      }

      const handleMouseMove = (e) => {
        if (isDragging && objectToRotate) {
          const deltaX = e.clientX - previousMousePosition.x
          const deltaY = e.clientY - previousMousePosition.y

          rotation.x += deltaY * 0.005
          rotation.y += deltaX * 0.005

          objectToRotate.rotation.x = rotation.x
          objectToRotate.rotation.y = rotation.y

          previousMousePosition = { x: e.clientX, y: e.clientY }
        }
      }

      const handleMouseUp = () => {
        isDragging = false
      }

      const handleMouseLeave = () => {
        isDragging = false
      }

      container.addEventListener('mousedown', handleMouseDown)
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('mouseup', handleMouseUp)
      container.addEventListener('mouseleave', handleMouseLeave)

      // Animation loop (created before loading model)
      let animationId = null
      let objectToRotate = null

      const animate = () => {
        animationId = requestAnimationFrame(animate)
        renderer.render(scene, camera)
      }

      // Check if we have a modelPath to load
      if (artifact.modelPath) {
        console.log('Loading FBX model from:', artifact.modelPath)

        const fbxLoader = new FBXLoader()

        // Resolve the model path relative to public folder
        const modelPath = artifact.modelPath.startsWith('/')
          ? artifact.modelPath.substring(1)
          : artifact.modelPath
        const fullPath = `${import.meta.env.BASE_URL}${modelPath}`
        console.log('Resolved model path:', fullPath)

        fbxLoader.load(
          fullPath,
          (fbx) => {
            console.log('FBX loaded successfully:', fbx)

            // Center and scale the model
            const box = new THREE.Box3().setFromObject(fbx)
            const size = box.getSize(new THREE.Vector3())
            const maxDim = Math.max(size.x, size.y, size.z)
            const scale = 5 / maxDim
            fbx.scale.multiplyScalar(scale)

            const center = box.getCenter(new THREE.Vector3())
            fbx.position.sub(center)
            fbx.position.multiplyScalar(scale)

            scene.add(fbx)
            objectToRotate = fbx
            console.log('FBX added to scene and ready to rotate')

            // Apply texture if provided
            if (artifact.texturePath) {
              console.log('Applying texture from:', artifact.texturePath)
              const textureLoader = new THREE.TextureLoader()
              const texturePath = artifact.texturePath.startsWith('/')
                ? artifact.texturePath.substring(1)
                : artifact.texturePath
              const fullTexturePath = `${import.meta.env.BASE_URL}${texturePath}`

              textureLoader.load(
                fullTexturePath,
                (texture) => {
                  console.log('Texture loaded successfully')
                  fbx.traverse((child) => {
                    if (child.isMesh) {
                      child.material.map = texture
                      child.material.needsUpdate = true
                    }
                  })
                },
                undefined,
                (error) => {
                  console.warn('Texture load error:', error)
                }
              )
            }
          },
          (progress) => {
            const percent = (progress.loaded / progress.total * 100).toFixed(2)
            console.log(`Model loading progress: ${percent}%`)
          },
          (error) => {
            console.error('FBX load error:', error)
            // Fall back to cube if model fails to load
            console.log('Falling back to test cube')
            const geometry = new THREE.BoxGeometry(3, 3, 3)
            const material = new THREE.MeshPhongMaterial({ color: 0xd4a574 })
            const cube = new THREE.Mesh(geometry, material)
            scene.add(cube)
            objectToRotate = cube
            console.log('Fallback cube created')
          }
        )
      } else {
        // No model path provided, create a test cube
        console.log('No model path provided, creating test cube')
        const geometry = new THREE.BoxGeometry(3, 3, 3)
        const material = new THREE.MeshPhongMaterial({ color: 0xd4a574 })
        const cube = new THREE.Mesh(geometry, material)
        scene.add(cube)
        objectToRotate = cube
        console.log('Test cube created')
      }

      animate()
      console.log('Animation started')

      // Cleanup
      return () => {
        console.log('Cleaning up 3D viewer')
        if (animationId) cancelAnimationFrame(animationId)
        renderer.dispose()

        // Remove event listeners
        container.removeEventListener('mousedown', handleMouseDown)
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('mouseup', handleMouseUp)
        container.removeEventListener('mouseleave', handleMouseLeave)
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
