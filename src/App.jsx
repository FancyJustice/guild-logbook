import { useState, useEffect } from 'react'
import Browser from './components/Browser'
import AdminPanel from './components/AdminPanel'
import Cover from './components/Cover'
import MergePreview from './components/MergePreview'
import { findDifferences, mergeCharacters, generateMergeReport, validateImportedData } from './utils/mergeUtils'
import {
  fetchCharactersFromFirebase,
  subscribeToCharacters,
  addCharacterToFirebase,
  updateCharacterInFirebase,
  deleteCharacterFromFirebase,
  addArtifactToFirebase,
  updateArtifactInFirebase,
  deleteArtifactFromFirebase,
  mergeCharactersInFirebase
} from './utils/firebaseUtils'
import './App.css'

function App() {
  const [showCover, setShowCover] = useState(true)
  const [view, setView] = useState('browser')
  const [characters, setCharacters] = useState([])
  const [artifacts, setArtifacts] = useState([])
  const [dropdownOptions, setDropdownOptions] = useState({})
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminPassword, setAdminPassword] = useState('guild2024')
  const [showMergePreview, setShowMergePreview] = useState(false)
  const [pendingMergeData, setPendingMergeData] = useState(null)
  const [mergeReport, setMergeReport] = useState(null)
  const [navigationHistory, setNavigationHistory] = useState([])

  useEffect(() => {
    // Check if user was previously authenticated
    const savedAuth = localStorage.getItem('adminAuth')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }

    // Load initial data from Firebase
    const loadInitialData = async () => {
      try {
        const data = await fetchCharactersFromFirebase()
        setCharacters(data.characters || [])
        setArtifacts(data.artifacts || [])
        setDropdownOptions(data.dropdownOptions || {})
      } catch (error) {
        console.error('Error loading characters from Firebase:', error)
      }
    }

    loadInitialData()

    // Subscribe to real-time updates from Firebase
    const unsubscribe = subscribeToCharacters((data) => {
      setCharacters(data.characters || [])
      setArtifacts(data.artifacts || [])
      setDropdownOptions(data.dropdownOptions || {})
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (navigationHistory.length > 1) {
        const newHistory = navigationHistory.slice(0, -1)
        const previousView = newHistory[newHistory.length - 1]
        setNavigationHistory(newHistory)
        setView(previousView)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [navigationHistory])

  // Helper function to change view and update history
  const navigateTo = (newView) => {
    setNavigationHistory(prev => [...prev, newView])
    setView(newView)
    window.history.pushState({ view: newView }, '')
  }

  const exportCharactersAsJSON = () => {
    const dataToExport = {
      characters: characters,
      artifacts: artifacts,
      dropdownOptions: dropdownOptions
    }
    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'characters.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const importCharactersFromJSON = (event, isMerge = false) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)

          // Check if it's a single character export
          if (data.character && !data.characters) {
            // Single character import
            const singleCharArray = [data.character]
            const differences = findDifferences(characters, singleCharArray)
            const report = generateMergeReport(differences)
            setPendingMergeData({ characters: singleCharArray, artifacts: [] })
            setMergeReport(report)
            setShowMergePreview(true)
            return
          }

          // Validate imported data (full export)
          const validation = validateImportedData(data)
          if (!validation.isValid) {
            alert('Invalid JSON format:\n' + validation.errors.join('\n'))
            return
          }

          if (isMerge) {
            // Show merge preview
            const differences = findDifferences(characters, data.characters)
            const report = generateMergeReport(differences)
            setPendingMergeData({ characters: data.characters, artifacts: data.artifacts || [] })
            setMergeReport(report)
            setShowMergePreview(true)
          } else {
            // Direct import (replace all)
            setCharacters(data.characters)
            localStorage.setItem('characters', JSON.stringify(data.characters))
            if (data.artifacts && Array.isArray(data.artifacts)) {
              setArtifacts(data.artifacts)
              localStorage.setItem('artifacts', JSON.stringify(data.artifacts))
            }
            alert('Characters and artifacts imported successfully!')
          }
        } catch (error) {
          alert('Error parsing JSON file: ' + error.message)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleMergeConfirm = async (differences) => {
    if (!pendingMergeData) return

    // Merge characters
    const mergedCharacters = mergeCharacters(characters, pendingMergeData.characters)

    // Merge artifacts if present
    let mergedArtifacts = artifacts
    if (pendingMergeData.artifacts && pendingMergeData.artifacts.length > 0) {
      mergedArtifacts = mergeCharacters(artifacts, pendingMergeData.artifacts)
    }

    try {
      await mergeCharactersInFirebase(mergedCharacters, mergedArtifacts, dropdownOptions)

      // Clear merge state
      setShowMergePreview(false)
      setPendingMergeData(null)
      setMergeReport(null)

      alert(`Merge successful!\nAdded: ${differences.added.length}, Modified: ${differences.modified.length}`)
    } catch (error) {
      console.error('Error saving merge:', error)
      alert('Error saving merge: ' + error.message)
    }
  }

  const handleMergeCancel = () => {
    setShowMergePreview(false)
    setPendingMergeData(null)
    setMergeReport(null)
  }

  const handleAddCharacter = async (newCharacter) => {
    const characterWithId = { ...newCharacter, id: `char_${Date.now()}` }

    try {
      await addCharacterToFirebase(characterWithId, characters, artifacts, dropdownOptions)
    } catch (error) {
      console.error('Error adding character:', error)
      alert('Error adding character: ' + error.message)
    }
  }

  const handleUpdateCharacter = async (updatedCharacter) => {
    try {
      await updateCharacterInFirebase(updatedCharacter, characters, artifacts, dropdownOptions)
    } catch (error) {
      console.error('Error updating character:', error)
      alert('Error updating character: ' + error.message)
    }
  }

  const handleDeleteCharacter = async (characterId) => {
    try {
      await deleteCharacterFromFirebase(characterId, characters, artifacts, dropdownOptions)
    } catch (error) {
      console.error('Error deleting character:', error)
      alert('Error deleting character: ' + error.message)
    }
  }

  const handleAddArtifact = async (newArtifact) => {
    const artifactWithId = { ...newArtifact, id: `artifact_${Date.now()}` }

    try {
      await addArtifactToFirebase(artifactWithId, characters, artifacts, dropdownOptions)
    } catch (error) {
      console.error('Error adding artifact:', error)
      alert('Error adding artifact: ' + error.message)
    }
  }

  const handleUpdateArtifact = async (updatedArtifact) => {
    try {
      await updateArtifactInFirebase(updatedArtifact, characters, artifacts, dropdownOptions)
    } catch (error) {
      console.error('Error updating artifact:', error)
      alert('Error updating artifact: ' + error.message)
    }
  }

  const handleDeleteArtifact = async (artifactId) => {
    try {
      await deleteArtifactFromFirebase(artifactId, characters, artifacts, dropdownOptions)
    } catch (error) {
      console.error('Error deleting artifact:', error)
      alert('Error deleting artifact: ' + error.message)
    }
  }

  const handleAdminLogin = (inputPassword) => {
    if (inputPassword === adminPassword) {
      setIsAuthenticated(true)
      setPassword('')
      // Save authentication state to localStorage
      localStorage.setItem('adminAuth', 'true')
    } else {
      alert('Incorrect password')
    }
  }

  const handleAdminLogout = () => {
    setIsAuthenticated(false)
    navigateTo('browser')
    // Clear authentication state from localStorage
    localStorage.removeItem('adminAuth')
  }

  if (showCover) {
    return <Cover onFlip={() => setShowCover(false)} />
  }

  return (
    <div className="min-h-screen bg-wood flex flex-col animate-in fade-in duration-1000">
      <header className="bg-gradient-to-b from-wood-light to-wood border-b-4 border-gold shadow-2xl relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(212,165,116,0.3) 35px, rgba(212,165,116,0.3) 70px)`
        }}></div>

        <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          <div className="flex justify-between items-center gap-8">
            {/* Left side - Title with decorative elements */}
            <div className="flex items-center gap-4">
              <div className="text-gold text-4xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>📖</div>
              <div>
                <h1 className="text-5xl font-medieval text-gold font-bold tracking-wide" style={{
                  textShadow: '3px 3px 6px rgba(0,0,0,0.7), -1px -1px 2px rgba(255,255,255,0.1)'
                }}>
                  The Guild Logbook
                </h1>
                <p className="text-sm text-gold-dark italic tracking-widest uppercase">
                  Official Record of Adventurers & Criminals
                </p>
              </div>
            </div>

            {/* Right side - Navigation */}
            <nav className="flex gap-8 items-center">
              <button
                onClick={() => { navigateTo('browser'); setIsAuthenticated(false) }}
                className={`px-6 py-3 font-medieval font-bold text-sm tracking-wide transition rounded-lg border-2 ${
                  view === 'browser' && !isAuthenticated
                    ? 'bg-gold text-wood border-gold shadow-lg'
                    : 'bg-transparent text-parchment border-gold-dark hover:bg-gold hover:text-wood hover:border-gold'
                }`}
              >
                📜 Browse
              </button>
              <button
                onClick={() => navigateTo('admin')}
                className={`px-6 py-3 font-medieval font-bold text-sm tracking-wide transition rounded-lg border-2 ${
                  view === 'admin'
                    ? 'bg-gold text-wood border-gold shadow-lg'
                    : 'bg-transparent text-parchment border-gold-dark hover:bg-gold hover:text-wood hover:border-gold'
                }`}
              >
                🔐 Admin
              </button>
            </nav>
          </div>

          {/* Decorative divider line */}
          <div className="mt-6 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {view === 'browser' && !isAuthenticated && (
          <Browser characters={characters} artifacts={artifacts} dropdownOptions={dropdownOptions} />
        )}
        {view === 'admin' && !isAuthenticated && (
          <AdminPanel
            onLogin={handleAdminLogin}
            password={password}
            setPassword={setPassword}
          />
        )}
        {isAuthenticated && (
          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <button
                onClick={handleAdminLogout}
                className="px-4 py-2 bg-seal text-parchment hover:bg-seal-light transition rounded"
              >
                Logout
              </button>
            </div>
            <AdminPanel
              authenticated={true}
              characters={characters}
              artifacts={artifacts}
              dropdownOptions={dropdownOptions}
              onAddCharacter={handleAddCharacter}
              onUpdateCharacter={handleUpdateCharacter}
              onDeleteCharacter={handleDeleteCharacter}
              onAddArtifact={handleAddArtifact}
              onUpdateArtifact={handleUpdateArtifact}
              onDeleteArtifact={handleDeleteArtifact}
            />
          </div>
        )}
      </main>

      {showMergePreview && mergeReport && (
        <MergePreview
          differences={pendingMergeData}
          onConfirm={handleMergeConfirm}
          onCancel={handleMergeCancel}
          report={mergeReport}
        />
      )}
    </div>
  )
}

export default App
