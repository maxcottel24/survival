import { observable } from "@legendapp/state";
import { Profile, GameEvent, InventoryItem, ItemType, ItemEffect } from "../types/game.types";
import { getObjetEffects, fouillerZone } from "../data/lootData";
import gameService from "../services/gameService";
import bgImage from "../assets/background.jpg";

// Store principal de l'application
export const state$ = observable({
  // État du jeu
  game: {
    currentProfile: null as Profile | null,
    pv: 20,
    energie: 14,
    currentZone: '',
    hasStarted: false,
    gamePhase: 1,
    day: 1,
    actionsRemaining: 3,
    hasConsumed: false,
    hasSlept: false,
    discoveredZones: [] as string[],
    npcLocations: {} as Record<string, string>,
    gameEvents: [] as GameEvent[],
  },
  
  // État des profils
  profile: {
    profiles: [] as Profile[],
    currentProfile: null as string | null,
  },
  
  // État de l'inventaire
  inventory: {
    items: [] as InventoryItem[],
  },
});

// Actions pour le jeu
export const gameActions = {
  startGame: (profile: Profile, zoneId: string) => {
    state$.game.currentProfile.set(profile);
    state$.game.currentZone.set(zoneId);
    state$.game.hasStarted.set(true);
    state$.game.day.set(1);
    state$.game.pv.set(20);
    state$.game.energie.set(14);
    state$.game.actionsRemaining.set(3);
    state$.game.gameEvents.set([]);
    
    // Initialiser l'inventaire
    inventoryActions.initializeInventory();
  },
  
  nextDay: () => {
    state$.game.day.set(d => d + 1);
    state$.game.actionsRemaining.set(3);
    state$.game.energie.set(e => e - 2);
  },
  
  setZone: (zoneId: string) => {
    state$.game.currentZone.set(zoneId);
  },
  
  addGameEvent: (event: Omit<GameEvent, 'id' | 'timestamp'>) => {
    const newEvent: GameEvent = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      ...event,
    };
    state$.game.gameEvents.push(newEvent);
  },
  
  updatePV: (newPV: number) => {
    state$.game.pv.set(newPV);
  },
  
  updateEnergie: (newEnergie: number) => {
    state$.game.energie.set(newEnergie);
  },
  
  // Fonctions pour le debug
  changePV: (amount: number) => {
    state$.game.pv.set(p => Math.max(0, Math.min(20, p + amount)));
  },

  changeEnergie: (amount: number) => {
    state$.game.energie.set(e => Math.max(0, Math.min(14, e + amount)));
  },
  
  useAction: () => {
    state$.game.actionsRemaining.set(a => Math.max(0, a - 1));
  },

  // Action de fouille
  fouiller: () => {
    const currentZone = state$.game.currentZone.get();
    if (!currentZone) return null;
    
    // Obtenir le type de la zone actuelle
    const zone = gameService.getZoneById(currentZone);
    if (!zone || !zone.type) return null;
    
    // Fouiller la zone
    const resultat = fouillerZone([zone.type]); // On passe un tableau avec le type unique
    
    if (resultat) {
      // Ajouter l'objet trouvé à l'inventaire
      const success = inventoryActions.addLootItem(resultat.item, resultat.type);
      
      if (success) {
        // Ajouter un événement de jeu
        const message = resultat.type === 'ressource' 
          ? `Vous avez trouvé ${resultat.item}`
          : `Vous avez trouvé un objet : ${resultat.item}`;
        
        gameActions.addGameEvent({
          type: 'success',
          message
        });
      }
    } else {
      // Aucun objet trouvé
      gameActions.addGameEvent({
        type: 'info',
        message: "Malgré vos fouilles, vous ne trouvez rien."
      });
    }
    
    // Utiliser une action
    gameActions.useAction();
    
    return resultat;
  },
};

// Actions pour les profils
export const profileActions = {
  setProfiles: (profiles: Profile[]) => {
    state$.profile.profiles.set(profiles);
  },
  
  setCurrentProfile: (profileId: string | null) => {
    state$.profile.currentProfile.set(profileId);
  },
  
  addProfile: (profile: Profile) => {
    state$.profile.profiles.push(profile);
  },
};

// Actions pour l'inventaire
export const inventoryActions = {
  addItem: (item: InventoryItem) => {
    const currentItems = state$.inventory.items.get();
    const maxSlots = 10;
    
    // Vérifier si on peut ajouter l'objet
    if (currentItems.length >= maxSlots && !item.stackable) {
      console.warn('Inventaire plein !');
      return false;
    }
    
    // Chercher si l'objet existe déjà et est stackable
    const existingItem = currentItems.find(i => i.id === item.id && i.stackable);
    
    if (existingItem) {
      // Stacker avec l'objet existant
      state$.inventory.items.set(items =>
        items.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      );
    } else {
      // Ajouter un nouvel objet
      state$.inventory.items.push(item);
    }
    
    return true;
  },

  // Fonction pour ajouter une ressource ou un objet trouvé
  addLootItem: (itemName: string, type: 'ressource' | 'objet') => {
    // Créer un ID unique pour l'objet
    const itemId = `${type}_${itemName.toLowerCase().replace(/\s+/g, '_')}`;
    
    // Déterminer le type d'inventaire
    let itemType: ItemType = 'ressource';
    if (type === 'objet') {
      // Vérifier les effets pour déterminer le type
      const effects = getObjetEffects(itemName);
      if (effects) {
        switch (effects.type) {
          case 'nourriture':
            itemType = 'nourriture';
            break;
          case 'soin':
            itemType = 'medicament';
            break;
          case 'arme':
            itemType = 'arme';
            break;
          case 'outil':
            itemType = 'outil';
            break;
          default:
            itemType = 'autre';
        }
      }
    }
    
    const newItem: InventoryItem = {
      id: itemId,
      name: itemName,
      type: itemType,
      description: type === 'objet' ? (getObjetEffects(itemName)?.description || itemName) : `Ressource: ${itemName}`,
      quantity: 1,
      consumable: type === 'objet' && (itemType === 'nourriture' || itemType === 'medicament'),
      stackable: true,
      rarity: 'bonne qualité',
      effects: type === 'objet' ? (() => {
        const effets = getObjetEffects(itemName)?.effets;
        if (!effets) return undefined;
        
        const itemEffects: ItemEffect[] = [];
        if (effets.pv) {
          itemEffects.push({ type: 'health', value: effets.pv });
        }
        if (effets.energie) {
          itemEffects.push({ type: 'energy', value: effets.energie });
        }
        return itemEffects.length > 0 ? itemEffects : undefined;
      })() : undefined
    };
    
    return inventoryActions.addItem(newItem);
  },
  
  removeItem: (itemId: string, quantity: number = 1) => {
    state$.inventory.items.set(items => {
      const item = items.find(i => i.id === itemId);
      if (!item) return items;
      
      if (item.quantity <= quantity) {
        // Supprimer complètement l'objet
        return items.filter(i => i.id !== itemId);
      } else {
        // Réduire la quantité
        return items.map(i => 
          i.id === itemId ? { ...i, quantity: i.quantity - quantity } : i
        );
      }
    });
  },
  
  updateItemQuantity: (itemId: string, quantity: number) => {
    state$.inventory.items.set(items =>
      items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  },
  
  getInventorySpace: () => {
    const items = state$.inventory.items.get();
    return 10 - items.length;
  },
  
  isInventoryFull: () => {
    return inventoryActions.getInventorySpace() <= 0;
  },
  
  initializeInventory: () => {
    // Commencer avec une radio
    const radio: InventoryItem = {
      id: 'radio',
      name: 'Radio',
      type: 'radio',
      description: 'Permet d\'écouter les annonces du soir.',
      quantity: 1,
      consumable: false,
      stackable: false,
      rarity: 'bonne qualité'
    };
    
    state$.inventory.items.set([radio]);
  },
  
  useItem: (itemId: string) => {
    const items = state$.inventory.items.get();
    const item = items.find(i => i.id === itemId);
    
    if (!item) return false;
    
    // Appliquer les effets de l'objet
    if (item.effects) {
      item.effects.forEach(effect => {
        switch (effect.type) {
          case 'health':
            gameActions.changePV(effect.value);
            break;
          case 'energy':
            gameActions.changeEnergie(effect.value);
            break;
        }
      });
    }
    
    // Si l'objet est consommable, le retirer
    if (item.consumable) {
      inventoryActions.removeItem(itemId, 1);
    }
    
    return true;
  }
}; 