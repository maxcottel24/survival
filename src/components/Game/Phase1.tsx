import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useObservable, Show, useSelector } from '@legendapp/state/react';
import { state$, gameActions, inventoryActions } from '../../store/state';
import { GameEvent } from '../../types/game.types';
import gameService from '../../services/gameService';
import { storageService } from '../../services/storageService';
import { PageLayout } from '../Common/PageLayout';
import { Inventory } from './Inventory';
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const HudContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  left: auto;
  z-index: 1000;
`;

const GameContainer = styled.div`
  padding: 20px;
  max-width: 900px;
  margin: auto;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  color: white;
  animation: ${fadeIn} 1s ease-in-out;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 40px);
`;

const TopBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const MenuContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
`;

const MenuButton = styled.button`
  background: none;
  border: 1px solid white;
  color: white;
  padding: 10px;
  font-size: 20px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.inventory {
    border: 1px solid #4CAF50;
    color: #4CAF50;
    font-size: 16px;
    padding: 12px;
    width: 100%;
    margin-top: 10px;

    &:hover {
      background-color: rgba(76, 175, 80, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
  }
`;

const Sidebar = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: ${props => props.isOpen ? '0' : '-300px'};
  width: 300px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  border-right: 2px solid #555;
  z-index: 999;
  transition: left 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #555;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  border-radius: 3px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const SidebarMenuItem = styled.button`
  width: 100%;
  padding: 15px 20px;
  background: none;
  border: none;
  color: white;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background-color: rgba(76, 175, 80, 0.2);
    transform: translateX(5px);
    border-left: 3px solid #4CAF50;
  }

  &:active {
    transform: translateX(2px);
  }
`;

const MenuIcon = styled.span`
  font-size: 18px;
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const StatBar = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
`;

const BarContainer = styled.div`
  background: #555;
  border-radius: 5px;
  overflow: hidden;
  height: 15px;
  border: 1px solid #777;
`;

const HealthBar = styled.div<{ width: number }>`
  background: linear-gradient(to right,rgb(62, 198, 94), #218838);
  width: ${props => props.width}%;
  height: 100%;
  transition: width 0.5s ease-in-out;
`;

const EnergyBar = styled.div<{ width: number }>`
  background: linear-gradient(to right,rgb(255, 247, 0),rgb(250, 191, 17));
  width: ${props => props.width}%;
  height: 100%;
  transition: width 0.5s ease-in-out;
`;

const StatLabel = styled.span`
  margin-bottom: 5px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const StatValue = styled.span`
  align-self: center;
  margin-top: 5px;
  font-size: 0.9em;
`;

const pulseAnimation = (speed: string) => keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const Icon = styled.span<{ speed: string }>`
  animation: ${props => css`${pulseAnimation(props.speed)} ${props.speed} infinite`};
`;

const MainContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  text-align: center;
  color: #4CAF50;
`;

const ActionsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
`;

const DayInfo = styled.span`
  font-weight: bold;
`;

const ActionsRemaining = styled.span<{ remaining: number }>`
  font-weight: bold;
  color: ${props => (props.remaining > 0 ? '#28a745' : '#dc3545')};
`;

const ZoneInfo = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.4);
  border-left: 3px solid #ffc107;
`;

const EventLog = styled.div`
  margin-top: 20px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  flex-grow: 1;
  overflow-y: auto;
  max-height: 300px;
`;

const EventMessage = styled.p<{ type: GameEvent['type'] }>`
  margin: 5px 0;
  color: ${props => {
    if (props.type === 'danger') return '#dc3545';
    if (props.type === 'success') return '#28a745';
    return '#fff';
  }};
`;

const ActionsSection = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  border: 1px solid #555;
`;

const ActionsTitle = styled.h3`
  color: #4CAF50;
  margin-bottom: 15px;
  text-align: center;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const ActionButton = styled.button<{ disabled?: boolean }>`
  padding: 12px 20px;
  background: ${props => props.disabled ? '#6c757d' : '#2a2a2a'};
  border: 2px solid ${props => props.disabled ? '#6c757d' : '#4CAF50'};
  color: ${props => props.disabled ? '#ccc' : '#4CAF50'};
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: #4CAF50;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    transform: none;
  }
`;

const Footer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid #555;

  button {
    padding: 12px 24px;
    background: #2a2a2a;
    border: 2px solid #4CAF50;
    color: #4CAF50;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
    font-size: 14px;

    &:hover:not(:disabled) {
      background: #4CAF50;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    &:disabled {
      background: #6c757d;
      border-color: #6c757d;
      color: #ccc;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

const SaveLoadModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1002;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid #555;
  border-radius: 10px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  color: #4CAF50;
  margin-bottom: 20px;
  text-align: center;
`;

const SaveList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const SaveItem = styled.div`
  padding: 15px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid #4CAF50;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(76, 175, 80, 0.3);
    border-color: #4CAF50;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

const SaveName = styled.div`
  color: #4CAF50;
  font-weight: bold;
  margin-bottom: 5px;
`;

const SaveDetails = styled.div`
  color: #ccc;
  font-size: 0.9em;
  margin-bottom: 5px;
`;

const SaveDate = styled.div`
  color: #888;
  font-size: 0.8em;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  background: #2a2a2a;
  border: 1px solid #4CAF50;
  color: #4CAF50;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4CAF50;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &.primary {
    background: #4CAF50;
    border-color: #4CAF50;
    color: white;

    &:hover {
      background: #45a049;
    }
  }

  &.danger {
    background: #dc3545;
    border-color: #dc3545;
    color: white;

    &:hover {
      background: #c82333;
    }
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #888;
  padding: 20px;
  border: 1px dashed #4CAF50;
  border-radius: 5px;
`;

// Le sous-composant qui affiche l'interface du jeu
const GameUI: React.FC = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const [saves, setSaves] = useState<any[]>([]);
    
    // On s'abonne à chaque valeur individuellement pour garantir la réactivité
    const pv = useSelector(state$.game.pv);
    const energie = useSelector(state$.game.energie);
    const day = useSelector(state$.game.day);
    const actionsRemaining = useSelector(state$.game.actionsRemaining);
    const gameEvents = useSelector(state$.game.gameEvents);
    const currentZoneId = useSelector(state$.game.currentZone);
    const currentProfile = useSelector(state$.game.currentProfile);
    const zone = gameService.getZoneById(currentZoneId);

    // Les fonctions de test restent les mêmes, elles sont correctes
    useEffect(() => {
        const testPv = (amount: number) => gameActions.changePV(amount);
        const testEnergy = (amount: number) => gameActions.changeEnergie(amount);
        (window as any).testPv = testPv;
        (window as any).testEnergy = testEnergy;
        console.log("Fonctions de test (v4) disponibles : testPv(x), testEnergy(x)");
    }, []);

    // Initialiser l'inventaire au démarrage du jeu
    useEffect(() => {
        if (currentProfile && !state$.inventory.items.get().length) {
            inventoryActions.initializeInventory();
        }
    }, [currentProfile]);

    const getPulseSpeed = (value: number, max: number) => {
        const p = (value / max) * 100;
        if (p < 25) return '0.5s';
        if (p < 50) return '0.7s';
        if (p < 75) return '1s';
        return '2s';
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };

    const handleContinue = () => {
        handleMenuClose();
        // Logique pour continuer le jeu
    };

    const handleSave = async () => {
        handleMenuClose();
        try {
            if (!currentProfile) {
                alert('Aucun profil actif pour sauvegarder');
                return;
            }

            const gameState = {
                pv: pv,
                energie: energie,
                currentZone: currentZoneId,
                gamePhase: 1
            };

            await storageService.saveGame(currentProfile, gameState);
            alert('Partie sauvegardée avec succès !');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            alert('Erreur lors de la sauvegarde');
        }
    };

    const handleLoad = async () => {
        handleMenuClose();
        try {
            const savesList = await storageService.getSaves();
            setSaves(savesList);
            setIsLoadModalOpen(true);
        } catch (error) {
            console.error('Erreur lors du chargement des sauvegardes:', error);
            alert('Erreur lors du chargement des sauvegardes');
        }
    };

    const handleLoadSave = async (save: any) => {
        try {
            // Utiliser directement les actions Legend-State avec les données de la sauvegarde
            gameActions.startGame(save.profile, save.gameState.currentZone);
            
            // Restaurer les stats spécifiques
            state$.game.pv.set(save.gameState.pv);
            state$.game.energie.set(save.gameState.energie);
            
            setIsLoadModalOpen(false);
            alert('Partie chargée avec succès !');
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            alert('Erreur lors du chargement de la partie');
        }
    };

    const handleDeleteSave = async (saveId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Empêcher le chargement
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette sauvegarde ?')) {
            try {
                await storageService.deleteSave(saveId);
                const updatedSaves = await storageService.getSaves();
                setSaves(updatedSaves);
                alert('Sauvegarde supprimée');
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const handleReturnToMainMenu = () => {
        handleMenuClose();
        navigate('/');
    };

    const handleOverlayClick = () => {
        handleMenuClose();
    };

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('fr-FR');
    };

    return (
        <>
            <Overlay isOpen={isMenuOpen} onClick={handleOverlayClick} />
            
            <Sidebar isOpen={isMenuOpen}>
                <SidebarHeader>
                    <CloseButton onClick={handleMenuClose}>×</CloseButton>
                </SidebarHeader>
                
                <SidebarMenuItem onClick={handleContinue}>
                    <MenuIcon>▶️</MenuIcon>
                    Continuer
                </SidebarMenuItem>
                
                <SidebarMenuItem onClick={handleSave}>
                    <MenuIcon>💾</MenuIcon>
                    Sauvegarder
                </SidebarMenuItem>
                
                <SidebarMenuItem onClick={handleLoad}>
                    <MenuIcon>📂</MenuIcon>
                    Charger
                </SidebarMenuItem>
                
                <SidebarMenuItem onClick={handleReturnToMainMenu}>
                    <MenuIcon>🏠</MenuIcon>
                    Retour au menu principal
                </SidebarMenuItem>
            </Sidebar>

            {/* Modal de chargement */}
            <SaveLoadModal isOpen={isLoadModalOpen}>
                <ModalContent>
                    <ModalTitle>Charger une partie</ModalTitle>
                    {saves.length > 0 ? (
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
                                    <SaveDate>{formatDate(save.timestamp)}</SaveDate>
                                    <ButtonGroup>
                                        <ModalButton 
                                            className="danger" 
                                            onClick={(e) => handleDeleteSave(save.id, e)}
                                        >
                                            Supprimer
                                        </ModalButton>
                                    </ButtonGroup>
                                </SaveItem>
                            ))}
                        </SaveList>
                    ) : (
                        <EmptyMessage>Aucune sauvegarde disponible</EmptyMessage>
                    )}
                    <ButtonGroup>
                        <ModalButton onClick={() => setIsLoadModalOpen(false)}>
                            Fermer
                        </ModalButton>
                    </ButtonGroup>
                </ModalContent>
            </SaveLoadModal>

            <MenuContainer>
                <MenuButton onClick={handleMenuToggle}>☰</MenuButton>
            </MenuContainer>

            <HudContainer>
                <StatsContainer>
                    <StatBar>
                        <StatLabel>Vie<Icon speed={getPulseSpeed(pv, 20)}>❤️</Icon></StatLabel>
                        <BarContainer><HealthBar width={(pv / 20) * 100} /></BarContainer>
                        <StatValue>{pv}/20</StatValue>
                    </StatBar>
                    <StatBar>
                        <StatLabel>Énergie<Icon speed={getPulseSpeed(energie, 14)}>⚡</Icon></StatLabel>
                        <BarContainer><EnergyBar width={(energie / 14) * 100} /></BarContainer>
                        <StatValue>{energie}/14</StatValue>
                    </StatBar>
                </StatsContainer>
                <MenuButton 
                    className="inventory"
                    onClick={() => setIsInventoryOpen(true)}
                >
                    🎒 Inventaire
                </MenuButton>
            </HudContainer>

            <GameContainer>
                <TopBar>
                    <div></div>
                </TopBar>
                <MainContent>
                    <Title>Phase 1 : Le Naufrage</Title>
                    <ActionsInfo>
                        <DayInfo>Jour {day}</DayInfo>
                        <ActionsRemaining remaining={actionsRemaining}>
                            Actions restantes : {actionsRemaining}/3
                        </ActionsRemaining>
                    </ActionsInfo>
                    {zone && (
                        <ZoneInfo>
                            <h2>LOCALISATION: {zone.name}</h2>
                            <p>{zone.description}</p>
                        </ZoneInfo>
                    )}
                    
                    <ActionsSection>
                        <ActionsTitle>Actions disponibles</ActionsTitle>
                        <ActionButtons>
                            <ActionButton 
                                onClick={gameActions.fouiller}
                                disabled={actionsRemaining <= 0}
                            >
                                🔍 Fouiller
                            </ActionButton>
                        </ActionButtons>
                    </ActionsSection>
                    
                    <EventLog>
                        <h3>Journal des événements :</h3>
                        {gameEvents
                            .slice()
                            // On assure à TypeScript que a et b ne sont pas undefined
                            .sort((a, b) => (b?.timestamp ?? 0) - (a?.timestamp ?? 0))
                            .map((event) => (
                                // On vérifie que event existe avant de le rendre
                                event && <EventMessage key={event.id} type={event.type}>{event.message}</EventMessage>
                            ))}
                    </EventLog>
                </MainContent>
                <Footer>
                    <button onClick={gameActions.nextDay} disabled={actionsRemaining > 0}>
                        Terminer la journée ({actionsRemaining} actions restantes)
                    </button>
                </Footer>
            </GameContainer>

            <Inventory 
                isOpen={isInventoryOpen} 
                onClose={() => setIsInventoryOpen(false)}
            />
        </>
    );
};

// Le composant principal qui gère la redirection
export const Phase1: React.FC = () => {
    const navigate = useNavigate();
    const hasStarted = useObservable(state$.game.hasStarted);
    const currentProfile = useObservable(state$.game.currentProfile);

    useEffect(() => {
        console.log('🎮 Phase1 - hasStarted:', hasStarted)
        console.log('🎮 Phase1 - currentProfile:', currentProfile?.name)
        
        // Vérifier s'il y a un profil courant dans le localStorage
        const currentProfileId = storageService.getCurrentProfileId();
        console.log('🎮 Phase1 - currentProfileId dans localStorage:', currentProfileId)
        
        // Si aucune partie n'a démarré ET qu'aucun profil n'est enregistré, rediriger
        if (!hasStarted && !currentProfileId) {
            console.log('🔄 Phase1 - Redirection vers /profiles')
            navigate('/profiles');
        } else {
            console.log('✅ Phase1 - Pas de redirection nécessaire')
        }
    }, [hasStarted, navigate]);

    return (
        <PageLayout>
            <Show
                if={state$.game.hasStarted}
                else={<GameContainer><Title>Chargement...</Title></GameContainer>}
            >
                <GameUI />
            </Show>
        </PageLayout>
    );
}; 