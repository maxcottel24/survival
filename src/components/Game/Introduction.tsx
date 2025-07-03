import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../Common/PageLayout'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`

const Content = styled.div`
  max-width: 800px;
  padding: 2rem;
  text-align: center;
  color: white;
  animation: ${fadeIn} 1s ease-in;
`

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #4CAF50;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`

const Text = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`

const Button = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  }
`

const ContentWrapper = styled.div<{ isFading: boolean }>`
  animation: ${props => props.isFading ? fadeOut : fadeIn} 1s ease-in-out;
`

export const Introduction: React.FC = () => {
  const navigate = useNavigate()
  const [isFading, setIsFading] = useState(false)

  const handleStart = () => {
    setIsFading(true)
    setTimeout(() => {
      navigate('/game/phase1')
    }, 1000)
  }

  return (
    <PageLayout>
      <ContentWrapper isFading={isFading}>
        <Content>
          <Title>Le Naufrage</Title>
          <Text>
            Votre avion s'est écrasé sur une île déserte. Les secours ne sont pas en vue, et vous êtes seul(e) face à votre survie.
            <br /><br />
            Autour de vous, les débris de l'appareil jonchent le sol. Votre priorité : trouver de l'eau, de la nourriture, et un abri.
            <br /><br />
            L'aventure commence maintenant. Votre survie dépend de vos choix...
          </Text>
          <Button onClick={handleStart}>
            Commencer l'aventure
          </Button>
        </Content>
      </ContentWrapper>
    </PageLayout>
  )
} 