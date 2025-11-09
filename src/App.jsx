import { useState, useEffect } from 'react'
import Browser from './components/Browser'
import AdminPanel from './components/AdminPanel'
import Cover from './components/Cover'
import MergePreview from './components/MergePreview'
import { findDifferences, mergeCharacters, generateMergeReport, validateImportedData } from './utils/mergeUtils'
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

  useEffect(() => {
    fetchCharacters()
  }, [])

  const fetchCharacters = async () => {
    try {
      // Load all data from JSON file (source of truth)
      const response = await fetch(import.meta.env.BASE_URL + 'characters.json')
      const data = await response.json()

      setCharacters(data.characters || [])
      setArtifacts(data.artifacts || [])
      setDropdownOptions(data.dropdownOptions || {})
    } catch (error) {
      console.error('Error loading characters:', error)
    }
  }

  // Reload data from JSON file periodically to sync changes globally
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCharacters()
    }, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

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
      const response = await fetch(import.meta.env.BASE_URL + 'api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'merge',
          characters: mergedCharacters,
          artifacts: mergedArtifacts
        })
      })

      if (response.ok) {
        setCharacters(mergedCharacters)
        setArtifacts(mergedArtifacts)

        // Clear merge state
        setShowMergePreview(false)
        setPendingMergeData(null)
        setMergeReport(null)

        alert(`Merge successful!\nAdded: ${differences.added.length}, Modified: ${differences.modified.length}`)
      } else {
        alert('Failed to save merged data')
      }
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
    const updatedCharacters = [...characters, characterWithId]

    try {
      const response = await fetch(import.meta.env.BASE_URL + 'api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          character: characterWithId,
          allCharacters: updatedCharacters
        })
      })

      if (response.ok) {
        setCharacters(updatedCharacters)
      } else {
        alert('Failed to add character')
      }
    } catch (error) {
      console.error('Error adding character:', error)
      alert('Error adding character: ' + error.message)
    }
  }

  const handleUpdateCharacter = async (updatedCharacter) => {
    const updatedCharacters = characters.map(char =>
      char.id === updatedCharacter.id ? updatedCharacter : char
    )

    try {
      const response = await fetch(import.meta.env.BASE_URL + 'api/characters', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          character: updatedCharacter,
          allCharacters: updatedCharacters
        })
      })

      if (response.ok) {
        setCharacters(updatedCharacters)
      } else {
        alert('Failed to update character')
      }
    } catch (error) {
      console.error('Error updating character:', error)
      alert('Error updating character: ' + error.message)
    }
  }

  const handleDeleteCharacter = async (characterId) => {
    const updatedCharacters = characters.filter(char => char.id !== characterId)

    try {
      const response = await fetch(import.meta.env.BASE_URL + 'api/characters', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          characterId: characterId,
          allCharacters: updatedCharacters
        })
      })

      if (response.ok) {
        setCharacters(updatedCharacters)
      } else {
        alert('Failed to delete character')
      }
    } catch (error) {
      console.error('Error deleting character:', error)
      alert('Error deleting character: ' + error.message)
    }
  }

  const handleAddArtifact = async (newArtifact) => {
    const artifactWithId = { ...newArtifact, id: `artifact_${Date.now()}` }
    const updatedArtifacts = [...artifacts, artifactWithId]

    try {
      const response = await fetch(import.meta.env.BASE_URL + 'api/artifacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          artifact: artifactWithId,
          allArtifacts: updatedArtifacts
        })
      })

      if (response.ok) {
        setArtifacts(updatedArtifacts)
      } else {
        alert('Failed to add artifact')
      }
    } catch (error) {
      console.error('Error adding artifact:', error)
      alert('Error adding artifact: ' + error.message)
    }
  }

  const handleUpdateArtifact = async (updatedArtifact) => {
    const updatedArtifacts = artifacts.map(artifact =>
      artifact.id === updatedArtifact.id ? updatedArtifact : artifact
    )

    try {
      const response = await fetch(import.meta.env.BASE_URL + 'api/artifacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          artifact: updatedArtifact,
          allArtifacts: updatedArtifacts
        })
      })

      if (response.ok) {
        setArtifacts(updatedArtifacts)
      } else {
        alert('Failed to update artifact')
      }
    } catch (error) {
      console.error('Error updating artifact:', error)
      alert('Error updating artifact: ' + error.message)
    }
  }

  const handleDeleteArtifact = async (artifactId) => {
    const updatedArtifacts = artifacts.filter(artifact => artifact.id !== artifactId)

    try {
      const response = await fetch(import.meta.env.BASE_URL + 'api/artifacts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          artifactId: artifactId,
          allArtifacts: updatedArtifacts
        })
      })

      if (response.ok) {
        setArtifacts(updatedArtifacts)
      } else {
        alert('Failed to delete artifact')
      }
    } catch (error) {
      console.error('Error deleting artifact:', error)
      alert('Error deleting artifact: ' + error.message)
    }
  }

  const handleAdminLogin = (inputPassword) => {
    if (inputPassword === adminPassword) {
      setIsAuthenticated(true)
      setPassword('')
    } else {
      alert('Incorrect password')
    }
  }

  const handleAdminLogout = () => {
    setIsAuthenticated(false)
    setView('browser')
  }

  if (showCover) {
    return <Cover onFlip={() => setShowCover(false)} />
  }

  return (
    <div className="min-h-screen bg-wood flex flex-col animate-in fade-in duration-1000">
      <header className="bg-wood-light border-b-4 border-gold shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-medieval text-gold">The Guild Logbook</h1>
            <nav className="space-x-4">
              <button
                onClick={() => { setView('browser'); setIsAuthenticated(false) }}
                className={`px-4 py-2 ${view === 'browser' && !isAuthenticated ? 'text-gold' : 'text-parchment'} hover:text-gold transition`}
              >
                Browse
              </button>
              <button
                onClick={() => setView('admin')}
                className={`px-4 py-2 ${view === 'admin' ? 'text-gold' : 'text-parchment'} hover:text-gold transition`}
              >
                Admin
              </button>
            </nav>
          </div>
          {characters.length > 1 && (
            <div className="bg-seal/20 border border-seal text-parchment px-4 py-3 rounded text-sm">
              <strong>📌 Tip:</strong> Your characters are saved in your browser. Before pushing code updates, use the Admin panel to <strong>Export JSON</strong> as a backup. After updates, use <strong>Import JSON</strong> to restore them.
            </div>
          )}
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
              <button
                onClick={exportCharactersAsJSON}
                className="px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded"
              >
                Export JSON
              </button>
              <label className="px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded cursor-pointer">
                Import JSON (Replace)
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => importCharactersFromJSON(e, false)}
                  style={{ display: 'none' }}
                />
              </label>
              <label className="px-4 py-2 bg-gold text-wood hover:bg-gold-light transition rounded cursor-pointer">
                Merge JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => importCharactersFromJSON(e, true)}
                  style={{ display: 'none' }}
                />
              </label>
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
