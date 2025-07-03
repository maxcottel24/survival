// Types de base pour les items
export type ItemType = 
  | 'outil'
  | 'nourriture'
  | 'boisson'
  | 'medicament'
  | 'arme'
  | 'radio'
  | 'boussole'
  | 'ressource'
  | 'vêtement'
  | 'autre';

export type ItemRarity = 
  | 'basse qualité'
  | 'bonne qualité'

// Types pour l'inventaire
export interface InventoryItem {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  quantity: number;
  consumable: boolean;
  stackable: boolean;
  rarity: ItemRarity;
  icon?: string;
  effects?: ItemEffect[];
  weight?: number;
  value?: number;
}

export interface ItemEffect {
  type: 'health' | 'energy' | 'buff' | 'debuff';
  value: number;
  duration?: number; // en minutes, undefined = effet instantané
}

// Types pour les stats du joueur
export interface PlayerStats {
  pv: number;
  energie: number;
}

// Types pour la progression
export interface GameProgression {
  scene: string;
  day: number;
  time: 'matin' | 'midi' | 'soir' | 'nuit';
  discoveredZones: string[];
  completedQuests: string[];
  unlockedSkills: string[];
}

// Types pour les zones
export type DangerLevel = 'faible' | 'moyen' | 'élevé';

export interface Zone {
  id: string;
  name: string;
  description: string;
  type: string;
  ressources?: string[];
  danger: any;
  connexions: string[];
  effets?: any[];
}

export interface ZoneEffect {
  type: 'météo' | 'terrain' | 'événement';
  name: string;
  description: string;
  impact: {
    type: 'health' | 'energy' | 'vision' | 'mouvement';
    value: number;
  };
}

// Types pour les PNJ
export interface NPC {
  id: string;
  name: string;
  type: 'survivant' | 'zombie' | 'animal';
  status: 'hostile' | 'neutre' | 'amical';
  photo: string; // URL de la photo
  traits: string[]; // Traits de caractère
  isDiscovered: boolean; // Si le joueur a rencontré ce PNJ
  stats: {
    health: number;
    damage: number;
    speed: number;
  };
  inventory: InventoryItem[];
  dialogue?: NPCDialogue[];
}

export interface NPCDialogue {
  id: string;
  text: string;
  conditions?: {
    playerStats?: Partial<PlayerStats>;
    items?: string[];
    quests?: string[];
  };
  responses: DialogueResponse[];
}

export interface DialogueResponse {
  text: string;
  nextDialogueId?: string;
  effects?: {
    playerStats?: Partial<PlayerStats>;
    items?: InventoryItem[];
    quests?: string[];
  };
}

// Types pour les quêtes
export interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  rewards: QuestReward[];
  isCompleted: boolean;
  isActive: boolean;
}

export interface QuestObjective {
  type: 'collect' | 'kill' | 'explore' | 'talk';
  target: string;
  quantity: number;
  current: number;
}

export interface QuestReward {
  type: 'item' | 'experience' | 'reputation';
  value: InventoryItem | number;
}

// Types pour le profil de joueur
export interface Profile {
  id: string;
  name: string;
  created: string;
  lastPlayed: string;
  data: {
    gender: string;
    age: number;
    stats: {
      pv: number;
      energie: number;
    };
    inventory: any[];
    skills: any[];
    traits: any[];
    currentZone: string;
    gamePhase: number;
  };
}

// Types pour l'état du jeu
export interface GameState {
  currentProfile: Profile | null;
  pv: number;
  energie: number;
  currentZone: string;
  hasStarted: boolean;
  gamePhase: number;
  day: number;
  actionsRemaining: number;
  hasConsumed: boolean;
  hasSlept: boolean;
  discoveredZones: string[];
  npcLocations: Record<string, string>;
  gameEvents: GameEvent[];
}

// Types pour les événements
export interface GameEvent {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  message: string;
  timestamp: number;
}

// Types pour les compétences
export interface Skill {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  requirements: {
    level: number;
    items?: string[];
    quests?: string[];
  };
  effects: {
    type: 'craft' | 'combat' | 'survie' | 'social';
    value: number;
  };
}

// Types pour le craft
export interface CraftingRecipe {
  id: string;
  name: string;
  description: string;
  requiredItems: {
    itemId: string;
    quantity: number;
  }[];
  result: {
    item: InventoryItem;
    quantity: number;
  };
  requiredSkills?: {
    skillId: string;
    level: number;
  }[];
  craftingTime: number; // en secondes
}

export interface Character {
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
} 