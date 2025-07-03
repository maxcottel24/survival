import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.30);
`

const ContentContainer = styled.div`
  max-width: 800px;
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

export const Introduction: React.FC = () => {
  return (
    <Container>
      <ContentContainer>
        <Title>Introduction en cours de développement</Title>
      </ContentContainer>
    </Container>
  )
} 