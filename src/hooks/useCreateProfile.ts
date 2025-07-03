import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileService } from '../services/profileService'
import { gameState$ } from '../store/state'

interface CreateProfileData {
  name: string
  gender: string
  age: string
  traits: string[]
}

export const useCreateProfile = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const createProfile = async (data: CreateProfileData) => {
    try {
      setIsLoading(true)
      setError(null)

      // Validation des données
      if (!data.name.trim()) {
        throw new Error('Le nom est requis')
      }

      if (!data.gender) {
        throw new Error('Le genre est requis')
      }

      const age = parseInt(data.age)
      if (isNaN(age) || age < 18 || age > 70) {
        throw new Error('L\'âge doit être compris entre 18 et 70 ans')
      }

      // Création du profil avec les données initiales
      const newProfile = await profileService.createProfile({
        name: data.name,
        data: {
          gender: data.gender,
          age: parseInt(data.age),
          stats: {
            pv: 20,
            energie: 14
          },
          inventory: [],
          skills: [],
          traits: data.traits,
          currentZone: '',
          gamePhase: 1
        }
      })

      // On met à jour l'état avec Legend-State
      gameState$.currentProfile.set(newProfile)

      // Redirection vers le jeu
      navigate('/game')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createProfile,
    isLoading,
    error
  }
} 