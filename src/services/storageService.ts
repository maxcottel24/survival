import { Profile } from '../types/game.types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const USE_LOCAL_STORAGE = import.meta.env.VITE_USE_LOCAL_STORAGE === 'true'

const STORAGE_KEYS = {
  PROFILES: 'survival_profiles',
  CURRENT_PROFILE: 'survival_current_profile',
  SAVES: 'survival_saves'
}

export interface GameSave {
  id: string
  name: string
  timestamp: string
  profile: Profile
  gameState: {
    pv: number
    energie: number
    currentZone: string
    gamePhase: number
  }
}

export const storageService = {
  // Profils
  async getProfiles(): Promise<Profile[]> {
    if (USE_LOCAL_STORAGE) {
      const profiles = localStorage.getItem(STORAGE_KEYS.PROFILES)
      return profiles ? JSON.parse(profiles) : []
    }

    try {
      const response = await fetch(`${API_URL}/profiles`)
      if (!response.ok) throw new Error('Erreur lors de la récupération des profils')
      return await response.json()
    } catch (error) {
      console.error('Erreur API:', error)
      return []
    }
  },

  async saveProfile(profile: Profile): Promise<Profile> {
    if (USE_LOCAL_STORAGE) {
      const profiles = await this.getProfiles()
      const existingIndex = profiles.findIndex(p => p.id === profile.id)
      
      if (existingIndex >= 0) {
        profiles[existingIndex] = profile
      } else {
        profiles.push(profile)
      }

      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles))
      return profile
    }

    try {
      const response = await fetch(`${API_URL}/profiles${profile.id ? `/${profile.id}` : ''}`, {
        method: profile.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      })

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde du profil')
      return await response.json()
    } catch (error) {
      console.error('Erreur API:', error)
      throw error
    }
  },

  async deleteProfile(profileId: string): Promise<void> {
    if (USE_LOCAL_STORAGE) {
      const profiles = await this.getProfiles()
      const updatedProfiles = profiles.filter(p => p.id !== profileId)
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(updatedProfiles))
      return
    }

    try {
      const response = await fetch(`${API_URL}/profiles/${profileId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erreur lors de la suppression du profil')
    } catch (error) {
      console.error('Erreur API:', error)
      throw error
    }
  },

  // Profil courant
  getCurrentProfileId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PROFILE)
  },

  setCurrentProfileId(profileId: string | null): void {
    if (profileId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PROFILE, profileId)
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_PROFILE)
    }
  },

  // Sauvegardes de jeu
  async saveGame(profile: Profile, gameState: GameSave['gameState']): Promise<string> {
    try {
      const saves = await this.getSaves()
      const saveId = `save_${Date.now()}`
      
      const gameSave: GameSave = {
        id: saveId,
        name: `${profile.name} - ${new Date().toLocaleString()}`,
        timestamp: new Date().toISOString(),
        profile: profile,
        gameState: gameState
      }
      
      saves.push(gameSave)
      localStorage.setItem(STORAGE_KEYS.SAVES, JSON.stringify(saves))
      
      return saveId
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du jeu:', error)
      throw error
    }
  },

  async getSaves(): Promise<GameSave[]> {
    try {
      const savesJson = localStorage.getItem(STORAGE_KEYS.SAVES)
      return savesJson ? JSON.parse(savesJson) : []
    } catch (error) {
      console.error('Erreur lors du chargement des sauvegardes:', error)
      return []
    }
  },

  async loadGame(saveId: string): Promise<GameSave | null> {
    try {
      const saves = await this.getSaves()
      return saves.find(save => save.id === saveId) || null
    } catch (error) {
      console.error('Erreur lors du chargement de la sauvegarde:', error)
      return null
    }
  },

  async deleteSave(saveId: string): Promise<void> {
    try {
      const saves = await this.getSaves()
      const filteredSaves = saves.filter(s => s.id !== saveId)
      localStorage.setItem(STORAGE_KEYS.SAVES, JSON.stringify(filteredSaves))
    } catch (error) {
      console.error('Erreur lors de la suppression de la sauvegarde:', error)
      throw error
    }
  }
} 