import { Profile } from '../types/game.types'

const API_URL = '/api'

export const profileService = {
  async createProfile(profileData: Omit<Profile, 'id' | 'created' | 'lastPlayed'>): Promise<Profile> {
    const response = await fetch(`${API_URL}/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la création du profil')
    }

    return response.json()
  },

  async getProfiles(): Promise<Profile[]> {
    const response = await fetch(`${API_URL}/profiles`)
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des profils')
    }

    return response.json()
  },

  async getProfile(id: string): Promise<Profile> {
    const response = await fetch(`${API_URL}/profiles/${id}`)
    
    if (!response.ok) {
      throw new Error('Profil non trouvé')
    }

    return response.json()
  },

  async updateProfile(id: string, profileData: Partial<Profile>): Promise<Profile> {
    const response = await fetch(`${API_URL}/profiles/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du profil')
    }

    return response.json()
  },

  async deleteProfile(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/profiles/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du profil')
    }
  }
} 