import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../Common/PageLayout'

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 3rem;
  color: #4CAF50;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 400px;
`

const MenuButton = styled.button`
  padding: 1.2rem;
  font-size: 1.2rem;
  background: rgba(0, 0, 0, 0.30);
  color: #4CAF50;
  border: 2px solid #4CAF50;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  font-weight: bold;

  &:hover {
    transform: translateY(-2px);
    background: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
    border-color: #4CAF50;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
`

export const GameMenu: React.FC = () => {
  const navigate = useNavigate()

  return (
    <PageLayout>
      <Title>SURVIE : ÎLE ZÉRO</Title>
      <ButtonContainer>
        <MenuButton onClick={() => navigate('/profiles/create')}>
          Nouvelle partie
        </MenuButton>
        <MenuButton onClick={() => navigate('/profiles')}>
          Charger une partie
        </MenuButton>
        <MenuButton onClick={() => navigate('/profiles/library')}>
          Bibliothèque des personnages
        </MenuButton>
      </ButtonContainer>
    </PageLayout>
  )
} 