import React from 'react';
import styled from 'styled-components';
import { useSelector } from '@legendapp/state/react';
import { state$, inventoryActions } from '../../store/state';
import { InventoryItem } from '../../types/game.types';

const InventoryModal = styled.div<{ isOpen: boolean }>`
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

const InventoryContent = styled.div`
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid #555;
  border-radius: 10px;
  padding: 30px;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const InventoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #555;
`;

const InventoryTitle = styled.h2`
  color: #4CAF50;
  margin: 0;
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

const InventoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 20px;
`;

const InventorySlot = styled.div<{ isEmpty: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  border: 2px solid ${props => props.isEmpty ? '#555' : '#4CAF50'};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${props => props.isEmpty ? 'rgba(255, 255, 255, 0.05)' : 'rgba(76, 175, 80, 0.1)'};
  cursor: ${props => props.isEmpty ? 'default' : 'pointer'};
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: ${props => props.isEmpty ? 'none' : 'scale(1.05)'};
    border-color: ${props => props.isEmpty ? '#555' : '#4CAF50'};
    box-shadow: ${props => props.isEmpty ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.3)'};
  }
`;

const ItemIcon = styled.div`
  font-size: 24px;
  margin-bottom: 5px;
`;

const ItemName = styled.div`
  color: #fff;
  font-size: 0.8em;
  text-align: center;
  font-weight: bold;
  margin-bottom: 2px;
`;

const ItemQuantity = styled.div`
  color: #4CAF50;
  font-size: 0.7em;
  font-weight: bold;
`;

const ItemRarity = styled.div<{ rarity: string }>`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.rarity === 'bonne qualité' ? '#4CAF50' : '#FF9800'};
`;

const InventoryInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 20px;
`;

const SpaceInfo = styled.div`
  color: #ccc;
  font-size: 0.9em;
`;

const ItemDetails = styled.div<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'block' : 'none'};
  padding: 15px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #555;
  border-radius: 8px;
  margin-top: 10px;
`;

const ItemDescription = styled.p`
  color: #ccc;
  margin: 10px 0;
  font-size: 0.9em;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 8px 16px;
  background: ${props => props.variant === 'danger' ? '#dc3545' : '#2a2a2a'};
  border: 1px solid ${props => props.variant === 'danger' ? '#dc3545' : '#4CAF50'};
  color: ${props => props.variant === 'danger' ? 'white' : '#4CAF50'};
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8em;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: ${props => props.variant === 'danger' ? '#c82333' : '#4CAF50'};
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    background: #6c757d;
    border-color: #6c757d;
    color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const getItemIcon = (type: string) => {
  const icons: Record<string, string> = {
    'outil': '🔧',
    'nourriture': '🍎',
    'boisson': '🥤',
    'medicament': '💊',
    'arme': '⚔️',
    'radio': '📻',
    'boussole': '🧭',
    'ressource': '📦',
    'vêtement': '👕',
    'autre': '❓'
  };
  return icons[type] || '❓';
};

interface InventoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Inventory: React.FC<InventoryProps> = ({ isOpen, onClose }) => {
  const inventoryItems = useSelector(state$.inventory.items);
  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | null>(null);

  const maxSlots = 10;
  const usedSlots = inventoryItems.length;
  const emptySlots = maxSlots - usedSlots;

  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(selectedItem?.id === item.id ? null : item);
  };

  const handleUseItem = (itemId: string) => {
    const success = inventoryActions.useItem(itemId);
    if (success) {
      setSelectedItem(null);
      // Ajouter un événement de jeu
      const item = inventoryItems.find(i => i?.id === itemId);
      if (item) {
        state$.game.gameEvents.push({
          id: `${Date.now()}-${Math.random()}`,
          type: 'success',
          message: `Vous avez utilisé ${item.name}`,
          timestamp: Date.now()
        });
      }
    }
  };

  const handleDropItem = (itemId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir jeter cet objet ?')) {
      inventoryActions.removeItem(itemId, 1);
      setSelectedItem(null);
      // Ajouter un événement de jeu
      const item = inventoryItems.find(i => i?.id === itemId);
      if (item) {
        state$.game.gameEvents.push({
          id: `${Date.now()}-${Math.random()}`,
          type: 'info',
          message: `Vous avez jeté ${item.name}`,
          timestamp: Date.now()
        });
      }
    }
  };

  return (
    <InventoryModal isOpen={isOpen}>
      <InventoryContent>
        <InventoryHeader>
          <InventoryTitle>Inventaire</InventoryTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </InventoryHeader>

        <InventoryInfo>
          <SpaceInfo>
            Espace utilisé : {usedSlots}/{maxSlots} emplacements
          </SpaceInfo>
          <SpaceInfo>
            Espace libre : {emptySlots} emplacements
          </SpaceInfo>
        </InventoryInfo>

        <InventoryGrid>
          {/* Slots avec objets */}
          {inventoryItems.filter((item): item is InventoryItem => item !== undefined).map((item, index) => (
            <InventorySlot
              key={`${item.id}-${index}`}
              isEmpty={false}
              onClick={() => handleItemClick(item)}
            >
              <ItemIcon>{getItemIcon(item.type)}</ItemIcon>
              <ItemName>{item.name}</ItemName>
              {item.quantity > 1 && <ItemQuantity>x{item.quantity}</ItemQuantity>}
              <ItemRarity rarity={item.rarity} />
            </InventorySlot>
          ))}

          {/* Slots vides */}
          {Array.from({ length: emptySlots }).map((_, index) => (
            <InventorySlot key={`empty-${index}`} isEmpty={true}>
              <ItemIcon>📭</ItemIcon>
              <ItemName>Vide</ItemName>
            </InventorySlot>
          ))}
        </InventoryGrid>

        {/* Détails de l'objet sélectionné */}
        {selectedItem && (
          <ItemDetails isVisible={true}>
            <h3 style={{ color: '#4CAF50', margin: '0 0 10px 0' }}>
              {selectedItem.name}
            </h3>
            <ItemDescription>{selectedItem.description}</ItemDescription>
            <div style={{ color: '#ccc', fontSize: '0.8em', marginBottom: '10px' }}>
              Type: {selectedItem.type} | Qualité: {selectedItem.rarity}
            </div>
            <ItemActions>
              <ActionButton
                onClick={() => handleUseItem(selectedItem.id)}
                disabled={!selectedItem.consumable && selectedItem.type !== 'nourriture' && selectedItem.type !== 'boisson'}
              >
                Utiliser
              </ActionButton>
              <ActionButton
                variant="danger"
                onClick={() => handleDropItem(selectedItem.id)}
              >
                Jeter
              </ActionButton>
            </ItemActions>
          </ItemDetails>
        )}
      </InventoryContent>
    </InventoryModal>
  );
}; 