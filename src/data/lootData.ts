// Types pour les effets des objets
export interface ObjetEffect {
  nom: string;
  type: 'nourriture' | 'soin' | 'outil' | 'transport' | 'arme' | 'special';
  effets: {
    pv?: number;
    energie?: number;
    inventaire?: number;
    special?: string;
  };
  description: string;
}

// Table de correspondance zone → loots disponibles
export const lootTable: Record<string, {
  ressources: string[];
  objets: string[];
}> = {
  bois: {
    ressources: ["Bâtons", "Baies"],
    objets: ["Champignons", "Corde"]
  },
  plaine: {
    ressources: ["Baies", "Herbes", "Pierre", "Argile"],
    objets: ["Bouteille d'eau"]
  },
  marécage: {
    ressources: ["Herbes", "Mousse"],
    objets: ["Champignons", "Bouteille d'eau"]
  },
  colline: {
    ressources: ["Herbes", "Pierre"],
    objets: []
  },
  falaise: {
    ressources: ["Pierre", "Os", "Plumes"],
    objets: []
  },
  ruines: {
    ressources: ["Tissu", "Métal"],
    objets: []
  },
  urbain: {
    ressources: ["Tissu", "Métal", "Batteries"],
    objets: ["Sac en tissu"]
  },
  campement: {
    ressources: ["Tissu"],
    objets: ["Conserves", "Corde"]
  },
  grotte: {
    ressources: ["Minéraux"],
    objets: []
  },
  plage: {
    ressources: ["Sable", "Bâtons", "Coquillages"],
    objets: ["Poissons", "Bouteille d'eau"]
  },
  récif: {
    ressources: ["Coquillages"],
    objets: ["Poissons"]
  },
  décharge: {
    ressources: ["Batteries", "Débris électroniques", "Fils"],
    objets: []
  },
  garage: {
    ressources: ["Pièces mécaniques"],
    objets: ["Moteur"]
  },
  inondé: {
    ressources: ["Boue"],
    objets: ["Bouteille d'eau"]
  },
  rocheux: {
    ressources: ["Pierre"],
    objets: []
  },
  espace_vert: {
    ressources: ["Herbes"],
    objets: []
  },
  hopital: {
    ressources: ["Tissu", "Métal"],
    objets: ["Kit de soin"]
  },    
  cabane: {
    ressources: ["Tissu", "Bois"],
    objets: ["Conserves", "Corde"]
  },
  bunker: {
    ressources: ["Batteries", "Débris électroniques", "Fils"],
    objets: ["Système de communication"]
  },
  passage: {
    ressources: [],
    objets: []
  },
  zone_du_crash: {
    ressources: ["Métal", "Débris électroniques"],
    objets: []
  }
};

// Table des effets des objets
export const objetsEffects: Record<string, ObjetEffect> = {
  // NOURRITURE
  "Bouteille d'eau": {
    nom: "Bouteille d'eau",
    type: "nourriture",
    effets: { energie: 1 },
    description: "Une bouteille d'eau fraîche qui restaure votre énergie."
  },
  "Conserves": {
    nom: "Conserves",
    type: "nourriture", 
    effets: { energie: 1 },
    description: "Des conserves qui restaurent votre énergie."
  },
  "Poissons": {
    nom: "Poissons",
    type: "nourriture",
    effets: { energie: 1 },
    description: "Du poisson frais qui restaure votre énergie."
  },
  "Champignons": {
    nom: "Champignons",
    type: "nourriture",
    effets: { energie: 1 },
    description: "Des champignons comestibles qui restaure votre énergie."
  },

  // SOINS
  "Pansement": {
    nom: "Pansement",
    type: "soin",
    effets: { pv: 2 },
    description: "Un pansement qui restaure 2 points de vie."
  },
  "Kit de soin": {
    nom: "Kit de soin",
    type: "soin",
    effets: { pv: 5 },
    description: "Un kit médical complet qui restaure vos points de vie."
  },

  // TRANSPORT
  "Sac en tissu": {
    nom: "Sac en tissu",
    type: "transport",
    effets: { inventaire: 4 },
    description: "Un sac en tissu qui augmente votre capacité d'inventaire de 4 places."
  },
  "Panier": {
    nom: "Panier",
    type: "transport",
    effets: { inventaire: 2 },
    description: "Un panier qui augmente votre capacité d'inventaire de 2 places."
  },

  // OUTILS
  "Torche": {
    nom: "Torche",
    type: "outil",
    effets: { special: "eclairage" },
    description: "Une torche pour éclairer les zones sombres."
  },
  "Canne à pêche": {
    nom: "Canne à pêche",
    type: "outil",
    effets: { special: "peche" },
    description: "Une canne à pêche pour attraper du poisson."
  },
    "Corde": {
    nom: "Corde",
    type: "outil",
    effets: { special: "craft" },
    description: "Une corde solide utilisable pour le craft."
  },
  "Système de communication": {
    nom: "Système de communication",
    type: "special",
    effets: { special: "radio" },
    description: "Un système radio fonctionnel pour communiquer."
  },

  // SPECIAL
  "Moteur": {
    nom: "Moteur",
    type: "special",
    effets: { special: "moteur" },
    description: "Un moteur intact"
  },

  // ARMES
  "Arc": {
    nom: "Arc",
    type: "arme",
    effets: { special: "arc" },
    description: "Un arc en bois pour chasser ou se défendre."
  },

  // RESSOURCES
  "Argile": {
    nom: "Argile",
    type: "outil",
    effets: { special: "craft" },
    description: "De l'argile humide utilisable pour le craft."
  },
  "Mousse": {
    nom: "Mousse",
    type: "outil",
    effets: { special: "craft" },
    description: "De la mousse humide utilisable pour le craft."
  },
  "Sable": {
    nom: "Sable",
    type: "outil",
    effets: { special: "craft" },
    description: "Du sable fin utilisable pour le craft."
  },
  "Boue": {
    nom: "Boue",
    type: "outil",
    effets: { special: "craft" },
    description: "De la boue utilisable pour le craft."
  },
  "Flèche": {
    nom: "Flèche",
    type: "arme",
    effets: { special: "munition" },
    description: "Une flèche pour votre arc."
  },
  "Couteau": {
    nom: "Couteau",
    type: "arme",
    effets: { special: "couteau" },
    description: "Un couteau en pierre, utile comme arme et outil."
  },
  "Lance": {
    nom: "Lance",
    type: "arme",
    effets: { special: "lance" },
    description: "Une lance solide pour la chasse et la défense."
  }
};

// Fonction pour obtenir les loots disponibles dans une zone
export function getLootsForZone(zoneTypes: string[]) {
  const ressources = new Set<string>();
  const objets = new Set<string>();
  
  zoneTypes.forEach(type => {
    const loots = lootTable[type];
    if (loots) {
      loots.ressources?.forEach(r => ressources.add(r));
      loots.objets?.forEach(o => objets.add(o));
    }
  });
  
  return {
    ressources: Array.from(ressources),
    objets: Array.from(objets)
  };
}

// Fonction pour obtenir un loot random dans une zone
export function fouillerZone(zoneTypes: string[]) {
  const random = Math.random() * 100; // 0-100
  
  if (random < 80) {
    // 80% de chance → Ressource random
    return getRandomRessourceFromZone(zoneTypes);
  } else {
    // 20% de chance → Objet random
    return getRandomObjetFromZone(zoneTypes);
  }
}

function getRandomRessourceFromZone(zoneTypes: string[]) {
  const ressources = new Set<string>();
  zoneTypes.forEach(type => {
    const loots = lootTable[type];
    if (loots?.ressources) {
      loots.ressources.forEach(r => ressources.add(r));
    }
  });
  
  const ressourcesArray = Array.from(ressources);
  if (ressourcesArray.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * ressourcesArray.length);
  return { type: 'ressource' as const, item: ressourcesArray[randomIndex] };
}

function getRandomObjetFromZone(zoneTypes: string[]) {
  const objets = new Set<string>();
  zoneTypes.forEach(type => {
    const loots = lootTable[type];
    if (loots?.objets) {
      loots.objets.forEach(o => objets.add(o));
    }
  });
  
  const objetsArray = Array.from(objets);
  if (objetsArray.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * objetsArray.length);
  return { type: 'objet' as const, item: objetsArray[randomIndex] };
}

// Fonction pour obtenir les effets d'un objet
export function getObjetEffects(objetName: string): ObjetEffect | null {
  return objetsEffects[objetName] || null;
}

// Fonction de test pour fouiller plusieurs fois
export function testFouille(zoneTypes: string[], nombreFouilles: number = 10) {
  console.log(`🧪 Test de fouille : ${nombreFouilles} fouilles dans une zone de type(s) : ${zoneTypes.join(', ')}`);
  console.log('📋 Loots disponibles :', getLootsForZone(zoneTypes));
  console.log('---');
  
  const resultats = {
    ressources: 0,
    objets: 0,
    rien: 0,
    details: [] as Array<{ type: string; item: string | null; message?: string }>
  };
  
  for (let i = 1; i <= nombreFouilles; i++) {
    const resultat = fouillerZone(zoneTypes);
    
    if (resultat) {
      if (resultat.type === 'ressource') {
        resultats.ressources++;
        resultats.details.push({ type: 'ressource', item: resultat.item });
        console.log(`🔍 Fouille ${i}: Trouvé ressource "${resultat.item}"`);
      } else if (resultat.type === 'objet') {
        resultats.objets++;
        resultats.details.push({ type: 'objet', item: resultat.item });
        console.log(`🔍 Fouille ${i}: Trouvé objet "${resultat.item}"`);
      }
    } else {
      resultats.rien++;
      resultats.details.push({ type: 'rien', item: null, message: "Malgré vos fouilles, vous ne trouvez rien." });
      console.log(`🔍 Fouille ${i}: Rien trouvé`);
    }
  }
  
  console.log('---');
  console.log('📊 Statistiques :');
  console.log(`   Ressources: ${resultats.ressources} (${((resultats.ressources/nombreFouilles)*100).toFixed(1)}%)`);
  console.log(`   Objets: ${resultats.objets} (${((resultats.objets/nombreFouilles)*100).toFixed(1)}%)`);
  console.log(`   Rien: ${resultats.rien} (${((resultats.rien/nombreFouilles)*100).toFixed(1)}%)`);
  
  return resultats;
} 