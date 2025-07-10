import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../Common/PageLayout'
import charactersData from '../../data/characters.json'

const Container = styled.div`
  max-width: 1200px;
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

const CharacterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`

const CharacterCard = styled.div<{ isDiscovered: boolean }>`
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #4CAF50;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: ${props => props.isDiscovered ? 'pointer' : 'default'};
  opacity: ${props => props.isDiscovered ? '1' : '0.7'};

  &:hover {
    transform: ${props => props.isDiscovered ? 'translateY(-5px)' : 'none'};
    box-shadow: ${props => props.isDiscovered ? '0 8px 16px rgba(0, 0, 0, 0.4)' : 'none'};
  }
`

const CharacterPhoto = styled.div<{ photo: string; isDiscovered: boolean }>`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.photo}), url('/images/background.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;

  ${props => !props.isDiscovered && css`
    filter: blur(8px) brightness(0.5);
    transform: scale(1.1);
  `}
`

const CharacterName = styled.h3<{ isDiscovered: boolean }>`
  color: ${props => props.isDiscovered ? '#4CAF50' : '#666'};
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
`

const CharacterType = styled.div<{ isDiscovered: boolean }>`
  color: ${props => props.isDiscovered ? '#ccc' : '#666'};
  font-size: 1rem;
  margin-bottom: 0.5rem;
  text-align: center;
`

const CharacterTraits = styled.div<{ isDiscovered: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  opacity: ${props => props.isDiscovered ? '1' : '0'};
  transition: opacity 0.3s ease;
`

const TraitTag = styled.span`
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid #4CAF50;
  color: #4CAF50;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
`

const CharacterStats = styled.div<{ isDiscovered: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  opacity: ${props => props.isDiscovered ? '1' : '0'};
  transition: opacity 0.3s ease;
`

const StatItem = styled.div`
  text-align: center;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
`

const StatLabel = styled.div`
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 0.2rem;
`

const StatValue = styled.div`
  color: #4CAF50;
  font-weight: bold;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
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

// Interface pour les personnages du JSON
interface Character {
  id: string;
  name: string;
  gender: string;
  age: number | null;
  traits: string[];
  skills: string[];
  description: string;
  stats: {
    pv: number;
    energie: number;
    force: number;
    dexterite: number;
    constitution: number;
    intelligence: number;
    sagesse: number;
    charisme: number;
  };
  photo?: string;
}

// Interface étendue avec les champs de découverte
interface DiscoverableCharacter extends Character {
  isDiscovered: boolean;
  type: 'survivant';
}

// Générer les données des PNJ à partir du JSON
const generateNPCData = (): DiscoverableCharacter[] => {
  const typedCharactersData = charactersData as Character[];

  return typedCharactersData.map((char: Character) => ({
    ...char,
    photo: char.photo ? `/images/characters/${char.photo}` : '',
    isDiscovered: false,
    type: 'survivant' as const
  }));
}

// Fonction pour générer une couleur unique basée sur le nom
const getColorForCharacter = (name: string): string => {
  const colors = [
    '4CAF50', 'FF9800', 'F44336', '2196F3', '9C27B0', '607D8B',
    '795548', 'E91E63', '3F51B5', '009688', 'FF5722', '673AB7'
  ]
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

export const CharacterLibrary: React.FC = () => {
  const navigate = useNavigate()
  const [npcs, setNpcs] = useState<DiscoverableCharacter[]>(generateNPCData())

  // Logique de découverte ici, à l'intérieur du composant
  const discoverNPC = (npcId: string) => {
    setNpcs(
      npcs.map(npc =>
        npc.id === npcId ? { ...npc, isDiscovered: true } : npc
      )
    )
  }

  // Rendre la fonction accessible globalement pour les tests
  useEffect(() => {
    (window as any).discoverNPC = discoverNPC
  }, [npcs])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'survivant': return '#2196F3'
      case 'zombie': return '#9C27B0'
      case 'animal': return '#607D8B'
      default: return '#666'
    }
  }

  return (
    <PageLayout>
      <Container>
        <Title>Bibliothèque des personnages</Title>
        
        <ButtonContainer style={{ marginBottom: '2rem' }}>
          <Button onClick={() => navigate('/')}>
            Retour au menu principal
          </Button>
        </ButtonContainer>
        
        <CharacterGrid>
          {npcs.map((npc) => (
            <CharacterCard key={npc.id} isDiscovered={npc.isDiscovered}>
              <CharacterPhoto 
                photo={npc.photo || ''}
                isDiscovered={npc.isDiscovered}
              >
                {/* ... */}
              </CharacterPhoto>
              
              <CharacterName isDiscovered={npc.isDiscovered}>
                {npc.isDiscovered ? npc.name : 'Personnage inconnu'}
              </CharacterName>
              
              <CharacterType isDiscovered={npc.isDiscovered}>
                {npc.isDiscovered && (
                  <>
                    <span style={{ color: getTypeColor(npc.type) }}>
                      Survivant
                    </span>
                    {' • '}
                    <span style={{ color: '#ccc' }}>
                      {npc.age ? `${npc.age} ans` : 'Âge inconnu'}
                    </span>
                  </>
                )}
              </CharacterType>
              
              <CharacterTraits isDiscovered={npc.isDiscovered}>
                {npc.traits.map((trait, index) => (
                  <TraitTag key={index}>{trait}</TraitTag>
                ))}
                {npc.skills.length > 0 && npc.skills.map((skill, index) => (
                  <TraitTag key={`skill-${index}`} style={{ 
                    background: 'rgba(255, 193, 7, 0.2)', 
                    borderColor: '#FFC107', 
                    color: '#FFC107' 
                  }}>
                    {skill}
                  </TraitTag>
                ))}
              </CharacterTraits>
              
              <CharacterStats isDiscovered={npc.isDiscovered}>
                <StatItem>
                  <StatLabel>PV</StatLabel>
                  <StatValue>{npc.stats.pv}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Énergie</StatLabel>
                  <StatValue>{npc.stats.energie}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Force</StatLabel>
                  <StatValue>{npc.stats.force}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Dextérité</StatLabel>
                  <StatValue>{npc.stats.dexterite}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Constitution</StatLabel>
                  <StatValue>{npc.stats.constitution}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Intelligence</StatLabel>
                  <StatValue>{npc.stats.intelligence}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Sagesse</StatLabel>
                  <StatValue>{npc.stats.sagesse}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Charisme</StatLabel>
                  <StatValue>{npc.stats.charisme}</StatValue>
                </StatItem>
              </CharacterStats>
            </CharacterCard>
          ))}
        </CharacterGrid>
      </Container>
    </PageLayout>
  )
} 