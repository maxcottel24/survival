import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  height: 100vh;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.30);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.2);
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--primary-color);
    border-radius: 4px;
  }
`

interface PageLayoutProps {
  children: React.ReactNode
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return <Container>{children}</Container>
} 