import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

export default function ArtifactDetail({ artifact, characters = [], onBack, onSelectCharacter }) {
  const [showModel, setShowModel] = useState(false)
  const [meshVisibility, setMeshVisibility] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef(null)
  const meshReferencesRef = useRef({})
  const rendererRef = useRef(null)
  const animationIdRef = useRef(null)
  const cameraRef = useRef(null)
  const sceneRef = useRef(null)

  // Toggle mesh visibility
  const toggleMeshVisibility = (meshName) => {
    console.log('Toggling mesh visibility for:', meshName)

    // Directly update the mesh visibility
    if (meshReferencesRef.current[meshName]) {
      meshReferencesRef.current[meshName].visible = !meshReferencesRef.current[meshName].visible
      console.log('Toggled to:', meshReferencesRef.current[meshName].visible)
    } else {
      console.warn('Mesh not found:', meshName)
    }

    // Update state for UI
    setMeshVisibility(prev => {
      const newState = { ...prev, [meshName]: !prev[meshName] }
      return newState
    })
  }

  // Handle visibility change - resize renderer when model becomes visible
  useEffect(() => {
    if (!showModel || !containerRef.current || !rendererRef.current || !cameraRef.current) return

    console.log('Model became visible, updating renderer size...')
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    console.log('New dimensions:', width, 'x', height)

    if (width > 0 && height > 0) {
      rendererRef.current.setSize(width, height)
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      console.log('Renderer resized and camera updated')
    }
  }, [showModel])

  // Preload and setup 3D viewer when artifact is selected
  useEffect(() => {
    if (!containerRef.current || !artifact.modelPath) return

    setIsLoading(true)
    console.log('Starting 3D viewer preload...')

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
      sceneRef.current = scene

      // Camera - closer initial zoom
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
      camera.position.z = 5
      console.log('Camera created')
      cameraRef.current = camera

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
      let isDraggingRotate = false
      let isDraggingPan = false
      let previousMousePosition = { x: 0, y: 0 }
      let rotation = { x: 0, y: 0 }

      const handleMouseDown = (e) => {
        // Left click (button 0) = rotate
        if (e.button === 0) {
          isDraggingRotate = true
          previousMousePosition = { x: e.clientX, y: e.clientY }
        }
        // Right click (button 2) = pan camera
        if (e.button === 2) {
          isDraggingPan = true
          previousMousePosition = { x: e.clientX, y: e.clientY }
          e.preventDefault()
        }
      }

      const handleMouseMove = (e) => {
        const deltaX = e.clientX - previousMousePosition.x
        const deltaY = e.clientY - previousMousePosition.y

        // Rotate with left click
        if (isDraggingRotate && objectToRotate) {
          rotation.x += deltaY * 0.005
          rotation.y += deltaX * 0.005

          objectToRotate.rotation.x = rotation.x
          objectToRotate.rotation.y = rotation.y
        }

        // Pan camera with right click
        if (isDraggingPan && camera) {
          camera.position.x -= deltaX * 0.005
          camera.position.y += deltaY * 0.005
        }

        previousMousePosition = { x: e.clientX, y: e.clientY }
      }

      const handleMouseUp = () => {
        isDraggingRotate = false
        isDraggingPan = false
      }

      const handleContextMenu = (e) => {
        e.preventDefault()
      }

      container.addEventListener('mousedown', handleMouseDown)
      container.addEventListener('contextmenu', handleContextMenu)
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      // Zoom controls with mouse wheel
      let isMouseOverViewer = false

      const handleMouseEnter = () => {
        isMouseOverViewer = true
      }

      const handleMouseExit = () => {
        isMouseOverViewer = false
      }

      const handleWheel = (e) => {
        // Only zoom when mouse is over the viewer
        if (!isMouseOverViewer) return
        e.preventDefault()
        const zoomSpeed = 0.1
        const direction = e.deltaY > 0 ? 1 : -1
        camera.position.z += direction * zoomSpeed * camera.position.z
        // Clamp zoom to reasonable values
        camera.position.z = Math.max(1, Math.min(50, camera.position.z))
      }

      container.addEventListener('mouseenter', handleMouseEnter)
      container.addEventListener('mouseleave', handleMouseExit)
      document.addEventListener('wheel', handleWheel, { passive: false })

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
            console.log('FBX children:', fbx.children)

            // Center and scale the model
            const box = new THREE.Box3().setFromObject(fbx)
            console.log('Box:', box)
            const size = box.getSize(new THREE.Vector3())
            console.log('Model size:', size)
            const maxDim = Math.max(size.x, size.y, size.z)
            console.log('Max dimension:', maxDim)
            const scale = 5 / maxDim
            console.log('Scale factor:', scale)
            fbx.scale.multiplyScalar(scale)

            // Recalculate bounding box after scaling
            const scaledBox = new THREE.Box3().setFromObject(fbx)
            const center = scaledBox.getCenter(new THREE.Vector3())

            // Center the model at origin
            fbx.position.copy(center).multiplyScalar(-1)

            // Parse toggleable meshes from artifact data
            const toggleableMeshNames = artifact.toggleableMeshes
              ? artifact.toggleableMeshes.split(',').map(m => m.trim())
              : []

            // Ensure all meshes are visible with flat lit materials
            fbx.traverse((child) => {
              if (child.isMesh) {
                console.log('Found mesh:', child.name, child.geometry, child.material)
                child.visible = true

                // Store reference if it's a toggleable mesh
                if (toggleableMeshNames.includes(child.name)) {
                  meshReferencesRef.current[child.name] = child
                  console.log('Stored toggleable mesh:', child.name)
                }

                // Convert materials to flat lit (MeshBasicMaterial)
                if (Array.isArray(child.material)) {
                  child.material = child.material.map(mat => {
                    const newMat = new THREE.MeshBasicMaterial({
                      color: mat.color || 0xcccccc,
                      side: THREE.DoubleSide
                    })
                    return newMat
                  })
                } else if (child.material) {
                  const originalColor = child.material.color ? child.material.color.getHex() : 0xcccccc
                  child.material = new THREE.MeshBasicMaterial({
                    color: originalColor,
                    side: THREE.DoubleSide
                  })
                }
              }
            })

            // Initialize visibility state for toggleable meshes
            const initialVisibility = {}
            toggleableMeshNames.forEach(name => {
              initialVisibility[name] = true // Start all meshes visible
            })
            setMeshVisibility(initialVisibility)

            scene.add(fbx)
            objectToRotate = fbx
            console.log('FBX added to scene and ready to rotate')
            console.log('Scene children after adding FBX:', scene.children)

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
            const material = new THREE.MeshBasicMaterial({ color: 0xd4a574 })
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
        const material = new THREE.MeshBasicMaterial({ color: 0xd4a574 })
        const cube = new THREE.Mesh(geometry, material)
        scene.add(cube)
        objectToRotate = cube
        console.log('Test cube created')
      }

      animate()
      animationIdRef.current = animationId
      rendererRef.current = renderer
      console.log('Animation started')
      setIsLoading(false)

      // Cleanup
      return () => {
        console.log('Cleaning up 3D viewer')
        if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current)
        renderer.dispose()

        // Remove event listeners
        container.removeEventListener('mousedown', handleMouseDown)
        container.removeEventListener('contextmenu', handleContextMenu)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        container.removeEventListener('mouseenter', handleMouseEnter)
        container.removeEventListener('mouseleave', handleMouseExit)
        document.removeEventListener('wheel', handleWheel)
      }
    } catch (error) {
      console.error('3D viewer error:', error)
      console.error('Error stack:', error.stack)
      setIsLoading(false)
    }
  }, [artifact.id])

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
              <p className="text-wood-light">
                <strong>Owner:</strong>{' '}
                {artifact.owner ? (
                  (() => {
                    const owner = characters.find(char => char.name === artifact.owner)
                    return owner ? (
                      <button
                        onClick={() => onSelectCharacter && onSelectCharacter(owner)}
                        className="text-gold hover:text-gold-dark transition underline cursor-pointer"
                      >
                        {artifact.owner}
                      </button>
                    ) : (
                      <span>{artifact.owner}</span>
                    )
                  })()
                ) : (
                  '—'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* 3D Model Container - Always rendered but hidden until showModel is true */}
          {artifact.modelPath && (
            <div className={`bg-parchment text-wood p-6 rounded-lg border-2 border-gold space-y-4 overflow-hidden ${!showModel && 'hidden'}`}>
              <h3 className="text-lg font-medieval font-bold text-gold-dark mb-3">3D Model {isLoading && '(Loading...)'}</h3>
              <div
                ref={containerRef}
                style={{
                  width: '100%',
                  height: '400px',
                  maxWidth: '100%',
                  maxHeight: '400px',
                  borderRadius: '8px',
                  border: '2px solid #d4a574',
                  backgroundColor: '#2a2420',
                  display: 'block',
                  overflow: 'hidden'
                }}
              />

              {Object.keys(meshVisibility).length > 0 && (
                <div className="border-t border-gold-dark pt-4">
                  <p className="text-xs text-gold uppercase tracking-wide font-medieval mb-2">Toggle Parts</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(meshVisibility).map(([meshName, isVisible]) => (
                      <button
                        key={meshName}
                        onClick={() => toggleMeshVisibility(meshName)}
                        className={`px-3 py-1 text-sm font-medieval rounded transition ${
                          isVisible
                            ? 'bg-gold text-wood hover:bg-gold-dark'
                            : 'bg-gold-dark text-parchment hover:bg-gold'
                        }`}
                      >
                        {isVisible ? '✓ ' : '✗ '} {meshName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!showModel && artifact.modelPath && !isLoading && (
            <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold text-center text-wood-light">
              <p onClick={() => setShowModel(true)} className="cursor-pointer hover:text-wood">Click "View 3D Model →" to see the viewer</p>
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
