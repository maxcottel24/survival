import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { GameMenu } from './components/Game/GameMenu'
import { CreatePlayer } from './components/Profile/CreatePlayer'
import { Profiles } from './components/Profile/Profiles'
import { CharacterLibrary } from './components/Profile/CharacterLibrary'
import { Phase1 } from './components/Game/Phase1'
import { Introduction } from './components/Game/Introduction'
import { GlobalStyle } from './styles/GlobalStyle'
import { profileActions } from './store/state'
import { storageService } from './services/storageService'

function App() {
  // Initialiser l'état au démarrage
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Charger les profils existants
        const profiles = await storageService.getProfiles()
        profileActions.setProfiles(profiles)

        // Rétablir le profil courant depuis le localStorage
        const currentProfileId = storageService.getCurrentProfileId()
        if (currentProfileId) {
          profileActions.setCurrentProfile(currentProfileId)
        }

        console.log('Application initialisée avec', profiles.length, 'profils')
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error)
      }
    }

    initializeApp()
  }, [])

  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<GameMenu />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/profiles/create" element={<CreatePlayer />} />
        <Route path="/profiles/library" element={<CharacterLibrary />} />
        <Route path="/game/phase1/intro" element={<Introduction />} />
        <Route path="/game/phase1" element={<Phase1 />} />
      </Routes>
    </Router>
  )
}

export default App 