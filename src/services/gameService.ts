import zonesData from '../../data/zones.json'
import charactersData from '../../data/characters.json'

export interface Zone {
  id: string
  name: string
  description: string
  types: string[]
  ressources?: string[]
  danger: any
  connexions: string[]
  effets?: any[]
}

export interface Character {
  name: string
  gender: string
  age: number | null
  traits: string[]
  skills: string[]
  description: string
  stats: {
    pv: number
    energie: number
    force: number
    dexterite: number
    constitution: number
    intelligence: number
    sagesse: number
    charisme: number
  }
}

export interface Scenario {
  id: string
  title: string
  description: string
  conditions: {
    zoneTypes?: string[]
    actions?: string[]
    traits?: string[]
    timeOfDay?: string
    chance?: number
  }
  outcomes: {
    success?: {
      message: string
      effects: {
        pv?: number
        energie?: number
        items?: string[]
      }
    }
    failure?: {
      message: string
      effects: {
        pv?: number
        energie?: number
        items?: string[]
      }
    }
  }
}

class GameService {
  private zones: Zone[] = []
  private characters: Character[] = []
  private scenarios: Scenario[] = []

  constructor() {
    this.loadZones()
    this.loadCharacters()
    this.loadScenarios()
  }

  private loadZones() {
    this.zones = []
    Object.values(zonesData.regions).forEach((region: any) => {
      this.zones.push(...region.zones)
    })
  }

  private loadCharacters() {
    this.characters = charactersData
  }

  private loadScenarios() {
    // Scénarios de base pour commencer
    this.scenarios = [
      {
        id: 'gourmand_food_find',
        title: 'Nourriture trouvée !',
        description: 'Votre trait gourmand vous a guidé vers une cachette de nourriture.',
        conditions: {
          traits: ['Gourmand'],
          actions: ['explorer'],
          chance: 30
        },
        outcomes: {
          success: {
            message: 'Vous avez trouvé des conserves cachées ! Votre instinct gourmand était juste.',
            effects: {
              energie: 2,
              items: ['conserves']
            }
          }
        }
      },
      {
        id: 'charismatic_npc_encounter',
        title: 'Rencontre amicale',
        description: 'Votre charisme naturel facilite la communication.',
        conditions: {
          traits: ['Charismatique'],
          actions: ['explorer'],
          chance: 25
        },
        outcomes: {
          success: {
            message: 'Un survivant vous approche avec confiance grâce à votre aura charismatique.',
            effects: {
              energie: 1
            }
          }
        }
      },
      {
        id: 'tactician_ambush_avoid',
        title: 'Embuscade évitée',
        description: 'Vos compétences tactiques vous ont sauvé.',
        conditions: {
          traits: ['Tacticien'],
          actions: ['explorer'],
          chance: 20
        },
        outcomes: {
          success: {
            message: 'Vous avez repéré l\'embuscade à temps grâce à votre esprit tactique.',
            effects: {
              energie: 1
            }
          },
          failure: {
            message: 'Même avec vos compétences tactiques, vous n\'avez pas pu éviter l\'attaque.',
            effects: {
              pv: -3,
              energie: -1
            }
          }
        }
      },
      {
        id: 'forest_animal_encounter',
        title: 'Rencontre avec un animal',
        description: 'Un animal sauvage rôde dans la forêt.',
        conditions: {
          zoneTypes: ['forêt'],
          actions: ['explorer'],
          chance: 40
        },
        outcomes: {
          success: {
            message: 'L\'animal s\'enfuit, laissant derrière lui de la nourriture.',
            effects: {
              energie: 1,
              items: ['viande']
            }
          },
          failure: {
            message: 'L\'animal vous attaque !',
            effects: {
              pv: -5,
              energie: -2
            }
          }
        }
      },
      {
        id: 'ruins_collapse',
        title: 'Effondrement des ruines',
        description: 'Les ruines instables s\'effondrent partiellement.',
        conditions: {
          zoneTypes: ['ruines'],
          actions: ['explorer'],
          chance: 35
        },
        outcomes: {
          success: {
            message: 'Vous avez réussi à éviter l\'effondrement et trouvé des objets précieux.',
            effects: {
              items: ['métal', 'objets rares']
            }
          },
          failure: {
            message: 'Vous êtes pris dans l\'effondrement !',
            effects: {
              pv: -8,
              energie: -3
            }
          }
        }
      }
    ]
  }

  // Obtenir une zone aléatoire pour le démarrage
  getRandomStartingZone(): Zone {
    // Fonction helper pour vérifier si une zone est sûre
    const isSafeZone = (zone: Zone) => {
      if (typeof zone.danger === 'string') {
        return zone.danger === 'faible'
      }
      // Si c'est un objet, vérifier que tous les types de danger sont faibles
      return Object.values(zone.danger).every(level => level === 'faible')
    }

    // Filtrer les zones sûres pour le départ
    const availableZones = this.zones.filter(zone => 
      // Éviter les zones dangereuses ou difficiles d'accès
      isSafeZone(zone) &&
      !zone.id.includes('centre_') && // Éviter le centre-ville
      !zone.types.some(type => type.includes('structures')) && // Éviter les bâtiments
      !zone.types.some(type => type.includes('ruines')) && // Éviter les ruines
      !zone.types.some(type => type.includes('grotte')) // Éviter les grottes
    )
    
    console.log('Zones disponibles pour le départ:', availableZones.map(z => z.name))
    
    // Si aucune zone sûre n'est trouvée, utiliser les zones avec un danger modéré
    if (availableZones.length === 0) {
      const moderateZones = this.zones.filter(zone => 
        !zone.id.includes('centre_') && // Toujours éviter le centre
        (
          (typeof zone.danger === 'string' && zone.danger === 'moyen') ||
          (typeof zone.danger === 'object' && Object.values(zone.danger).every(level => level === 'faible' || level === 'moyen'))
        )
      )
      console.log('Aucune zone sûre trouvée, utilisation des zones modérées:', moderateZones.map(z => z.name))
      return moderateZones[Math.floor(Math.random() * moderateZones.length)]
    }
    
    return availableZones[Math.floor(Math.random() * availableZones.length)]
  }

  // Obtenir les zones connectées
  getConnectedZones(zoneId: string): Zone[] {
    const currentZone = this.zones.find(z => z.id === zoneId)
    if (!currentZone) return []
    
    return this.zones.filter(zone => 
      currentZone.connexions.includes(zone.id)
    )
  }

  // Obtenir une zone par ID
  getZoneById(zoneId: string): Zone | undefined {
    return this.zones.find(z => z.id === zoneId)
  }

  // Obtenir tous les personnages
  getCharacters(): Character[] {
    return this.characters
  }

  // Obtenir un personnage par nom
  getCharacterByName(name: string): Character | undefined {
    return this.characters.find(c => c.name === name)
  }

  // Assigner des zones aléatoires aux NPCs
  assignRandomZonesToNPCs(): Record<string, string> {
    const npcLocations: Record<string, string> = {}
    const availableZones = [...this.zones]
    
    this.characters.forEach(character => {
      if (availableZones.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableZones.length)
        npcLocations[character.name] = availableZones[randomIndex].id
        availableZones.splice(randomIndex, 1) // Éviter les doublons
      }
    })
    
    return npcLocations
  }

  // Vérifier si un scénario peut se déclencher
  canTriggerScenario(scenario: Scenario, currentZone: Zone, action: string, characterTraits: string[]): boolean {
    const conditions = scenario.conditions
    
    // Vérifier le type de zone
    if (conditions.zoneTypes && !currentZone.types.some(type => conditions.zoneTypes!.includes(type))) {
      return false
    }
    
    // Vérifier l'action
    if (conditions.actions && !conditions.actions.includes(action)) {
      return false
    }
    
    // Vérifier les traits
    if (conditions.traits && !conditions.traits.some(trait => characterTraits.includes(trait))) {
      return false
    }
    
    // Vérifier la chance
    if (conditions.chance) {
      const random = Math.random() * 100
      if (random > conditions.chance) {
        return false
      }
    }
    
    return true
  }

  // Obtenir les scénarios possibles pour une situation donnée
  getPossibleScenarios(currentZone: Zone, action: string, characterTraits: string[]): Scenario[] {
    return this.scenarios.filter(scenario => 
      this.canTriggerScenario(scenario, currentZone, action, characterTraits)
    )
  }

  // Exécuter une action et obtenir les résultats
  executeAction(action: string, currentZone: Zone, characterTraits: string[]): {
    success: boolean
    message: string
    effects: {
      pv?: number
      energie?: number
      items?: string[]
    }
    scenario?: Scenario
  } {
    // Vérifier si un scénario se déclenche
    const possibleScenarios = this.getPossibleScenarios(currentZone, action, characterTraits)
    
    if (possibleScenarios.length > 0) {
      const scenario = possibleScenarios[Math.floor(Math.random() * possibleScenarios.length)]
      const success = Math.random() > 0.3 // 70% de chance de succès
      
      if (success && scenario.outcomes.success) {
        return {
          success: true,
          message: scenario.outcomes.success.message,
          effects: scenario.outcomes.success.effects,
          scenario
        }
      } else if (scenario.outcomes.failure) {
        return {
          success: false,
          message: scenario.outcomes.failure.message,
          effects: scenario.outcomes.failure.effects,
          scenario
        }
      }
    }
    
    // Action de base si aucun scénario
    const baseEffects = this.getBaseActionEffects(action, currentZone)
    return {
      success: true,
      message: `Vous avez ${action} dans ${currentZone.name}.`,
      effects: baseEffects
    }
  }

  // Obtenir les effets de base d'une action
  private getBaseActionEffects(action: string, zone: Zone): {
    pv?: number
    energie?: number
    items?: string[]
  } {
    const effects: any = {}
    
    switch (action) {
      case 'explorer':
        effects.energie = -1
        if (zone.ressources && zone.ressources.length > 0) {
          effects.items = [zone.ressources[Math.floor(Math.random() * zone.ressources.length)]]
        }
        break
      case 'se_deplacer':
        effects.energie = -1
        break
      case 'se_reposer':
        effects.energie = 2
        break
      case 'fouiller':
        effects.energie = -2
        if (zone.ressources && zone.ressources.length > 0) {
          effects.items = zone.ressources.slice(0, 2)
        }
        break
    }
    
    return effects
  }
}

const gameService = new GameService();
export default gameService; 