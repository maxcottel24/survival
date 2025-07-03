import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useObservable } from '@legendapp/state/react'
import { PageLayout } from '../Common/PageLayout'
import { storageService, GameSave } from '../../services/storageService'
import { profileActions, gameActions, state$ } from '../../store/state'

const Container = styled.div`
  max-width: 800px;
  width: 100%;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.30);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #4CAF50;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
`

const SaveList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`

const SaveItem = styled.div`
  padding: 1rem;
  background: rgba(76, 175, 80, 0.1);
  border: 2px solid #4CAF50;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(76, 175, 80, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`

const SaveName = styled.div`
  color: #4CAF50;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`

const SaveDetails = styled.div`
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`

const SaveDate = styled.div`
  color: #888;
  font-size: 0.8rem;
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`

const Button = styled.button`
  padding: 1rem 2rem;
  background: #2a2a2a;
  border: 2px solid #4CAF50;
  color: #4CAF50;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;

  &:hover {
    background: #4CAF50;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`

const EmptyMessage = styled.div`
  text-align: center;
  color: #888;
  font-size: 1.1rem;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px dashed #4CAF50;
`

export const Profiles: React.FC = () => {
  const navigate = useNavigate()
  const [saves, setSaves] = useState<GameSave[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSaves()
  }, [])

  const loadSaves = async () => {
    try {
      setLoading(true)
      const savesList = await storageService.getSaves()
      setSaves(savesList)
    } catch (error) {
      console.error('Erreur lors du chargement des sauvegardes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadSave = async (save: GameSave) => {
    try {
      // Utiliser directement les actions Legend-State avec les données de la sauvegarde
      profileActions.setCurrentProfile(save.profile.id)
      gameActions.startGame(save.profile, save.gameState.currentZone)

      // Restaurer les stats spécifiques de la sauvegarde
      state$.game.pv.set(save.gameState.pv)
      state$.game.energie.set(save.gameState.energie)

      // Rediriger vers le jeu
      navigate('/game/phase1')
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      alert('Erreur lors du chargement de la partie')
    }
  }

  const handleDeleteSave = async (saveId: string, event: React.MouseEvent) => {
    event.stopPropagation() // Empêcher le chargement
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette sauvegarde ?')) {
      try {
        await storageService.deleteSave(saveId)
        await loadSaves() // Recharger la liste
        alert('Sauvegarde supprimée')
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        alert('Erreur lors de la suppression')
      }
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR')
  }

  if (loading) {
    return (
      <PageLayout>
        <Container>
          <Title>Chargement...</Title>
        </Container>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Container>
        <Title>Charger une partie</Title>
        
        {saves.length === 0 ? (
          <EmptyMessage>
            Aucune sauvegarde trouvée
            <br />
            <small>Créez une nouvelle partie pour commencer</small>
          </EmptyMessage>
        ) : (
          <SaveList>
            {saves.map((save) => (
              <SaveItem key={save.id} onClick={() => handleLoadSave(save)}>
                <SaveName>{save.name}</SaveName>
                <SaveDetails>
                  Personnage: {save.profile.name} | 
                  PV: {save.gameState.pv}/20 | 
                  Énergie: {save.gameState.energie}/14 | 
                  Phase: {save.gameState.gamePhase}
                </SaveDetails>
                <SaveDate>
                  Sauvegardé le {formatDate(save.timestamp)}
                  <Button 
                    onClick={(e) => handleDeleteSave(save.id, e)}
                    style={{ 
                      float: 'right', 
                      padding: '0.3rem 0.8rem', 
                      fontSize: '0.8rem',
                      background: 'rgba(255, 0, 0, 0.2)',
                      borderColor: '#ff0000',
                      color: '#ff0000'
                    }}
                  >
                    Supprimer
                  </Button>
                </SaveDate>
              </SaveItem>
            ))}
          </SaveList>
        )}

        <ButtonContainer>
          <Button onClick={() => navigate('/profiles/create')}>
            Nouvelle partie
          </Button>
          <Button onClick={() => navigate('/')}>
            Retour au menu
          </Button>
        </ButtonContainer>
      </Container>
    </PageLayout>
  )
} 