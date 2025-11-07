import { useState, useEffect } from 'react'
import Browser from './components/Browser'
import AdminPanel from './components/AdminPanel'
import Cover from './components/Cover'
import './App.css'

function App() {
  const [showCover, setShowCover] = useState(true)
  const [view, setView] = useState('browser')
  const [characters, setCharacters] = useState([])
  const [dropdownOptions, setDropdownOptions] = useState({})
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminPassword, setAdminPassword] = useState('guild2024')

  useEffect(() => {
    fetchCharacters()
  }, [])

  const fetchCharacters = async () => {
    try {
      // First try to load from localStorage
      const savedCharacters = localStorage.getItem('characters')
      if (savedCharacters) {
        setCharacters(JSON.parse(savedCharacters))
      } else {
        // If no saved data, load from JSON file
        const response = await fetch(import.meta.env.BASE_URL + 'characters.json')
        const data = await response.json()
        setCharacters(data.characters || [])
      }

      // Always load dropdown options from JSON file
      const response = await fetch(import.meta.env.BASE_URL + 'characters.json')
      const data = await response.json()
      setDropdownOptions(data.dropdownOptions || {})
    } catch (error) {
      console.error('Error loading characters:', error)
    }
  }

  const exportCharactersAsJSON = () => {
    const dataToExport = {
      characters: characters,
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

  const importCharactersFromJSON = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (data.characters && Array.isArray(data.characters)) {
            setCharacters(data.characters)
            localStorage.setItem('characters', JSON.stringify(data.characters))
            alert('Characters imported successfully!')
          } else {
            alert('Invalid JSON format. Make sure it has a "characters" array.')
          }
        } catch (error) {
          alert('Error parsing JSON file: ' + error.message)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleAddCharacter = (newCharacter) => {
    const updatedCharacters = [...characters, { ...newCharacter, id: `char_${Date.now()}` }]
    setCharacters(updatedCharacters)
    localStorage.setItem('characters', JSON.stringify(updatedCharacters))
  }

  const handleUpdateCharacter = (updatedCharacter) => {
    const updatedCharacters = characters.map(char =>
      char.id === updatedCharacter.id ? updatedCharacter : char
    )
    setCharacters(updatedCharacters)
    localStorage.setItem('characters', JSON.stringify(updatedCharacters))
  }

  const handleDeleteCharacter = (characterId) => {
    const updatedCharacters = characters.filter(char => char.id !== characterId)
    setCharacters(updatedCharacters)
    localStorage.setItem('characters', JSON.stringify(updatedCharacters))
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
          <Browser characters={characters} dropdownOptions={dropdownOptions} />
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
                Import JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={importCharactersFromJSON}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <AdminPanel
              authenticated={true}
              characters={characters}
              dropdownOptions={dropdownOptions}
              onAddCharacter={handleAddCharacter}
              onUpdateCharacter={handleUpdateCharacter}
              onDeleteCharacter={handleDeleteCharacter}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
