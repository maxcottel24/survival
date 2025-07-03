import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { storageService } from '../../services/storageService'
import { v4 as uuidv4 } from 'uuid'
import { Profile } from '../../types/game.types'
import { profileActions, gameActions } from '../../store/state'
import gameService from '../../services/gameService'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.30);
`

const FormContainer = styled.div`
  max-width: 600px;
  width: 100%;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.30);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #4CAF50;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 1.1rem;
  color: #4CAF50;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`

const Input = styled.input`
  padding: 0.8rem;
  border: 2px solid #3a3a3a;
  border-radius: 6px;
  background: #2a2a2a;
  color: #fff;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`

const Select = styled.select`
  padding: 0.8rem;
  border: 2px solid #3a3a3a;
  border-radius: 6px;
  background: #2a2a2a;
  color: #fff;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const PrimaryButton = styled(Button)`
  background: #4CAF50;
  color: white;
  flex: 1;

  &:hover:not(:disabled) {
    background: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`

const SecondaryButton = styled(Button)`
  background: #3a3a3a;
  color: #fff;
  border: 1px solid #4CAF50;

  &:hover:not(:disabled) {
    background: #45a049;
    color: white;
  }
`

const ErrorMessage = styled.div`
  color: #ff4444;
  margin-top: 1rem;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`

export const CreatePlayer: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    gender: 'homme',
    age: 25
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      setError('Le nom est requis')
      return
    }

    try {
      const now = new Date().toISOString()
      const newProfile: Profile = {
        id: uuidv4(),
        name: formData.name,
        created: now,
        lastPlayed: now,
        data: {
          gender: formData.gender,
          age: parseInt(formData.age as any, 10),
          stats: {
            pv: 20,
            energie: 14,
          },
          inventory: [],
          skills: [],
          traits: [],
          currentZone: '',
          gamePhase: 1
        }
      }

      await storageService.saveProfile(newProfile)
      
      profileActions.addProfile(newProfile)
      profileActions.setCurrentProfile(newProfile.id)
      
      const startingZone = gameService.getRandomStartingZone();
      if (!startingZone) {
        setError("Erreur : Impossible de trouver une zone de départ valide.");
        return;
      }
      
      gameActions.startGame(newProfile, startingZone.id);
      gameActions.addGameEvent({
        type: 'success',
        message: `Vous vous réveillez sur un(e) ${startingZone.name}. Le début de votre survie commence.`
      });

      navigate('/game/phase1')
    } catch (error) {
      setError('Erreur lors de la création du personnage')
      console.error('Erreur:', error)
    }
  }

  return (
    <Container>
      <FormContainer>
        <Title>Créer un nouveau personnage</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Nom du personnage</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Entrez le nom de votre personnage"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="gender">Genre</Label>
            <Select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="autre">Autre</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="age">Âge</Label>
            <Input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="16"
              max="80"
              required
            />
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonGroup>
            <SecondaryButton type="button" onClick={() => navigate('/profiles')}>
              Annuler
            </SecondaryButton>
            <PrimaryButton type="submit">
              Créer le personnage
            </PrimaryButton>
          </ButtonGroup>
        </Form>
      </FormContainer>
    </Container>
  )
} 