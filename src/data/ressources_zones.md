# Tableau nettoyé des ressources issues des zones

| Nom (exact ou fusionné) | Type | Description | Zones d'apparition |
|------------------------|------|-------------|-------------------|
| bâtons | Ressource | Bois de petite taille (branches, bâtons secs ou frais) | Forêt, sentiers |
| baies  | Ressource | Baies sauvages | Forêt, plaine |
| herbes | Ressource | Plantes médicinales et herbes diverses | Plaine, marécage, colline |
| pierre | Ressource | Pierres et cailloux | Falaise, colline, plaine |
| os     | Ressource | Os d'animaux | Falaise |
| plumes | Ressource | Plumes d'oiseaux | Falaise |
| tissu  | Matériel | Morceaux de tissu utilisables directement | Ville, campement, ruines |
| minéraux | Ressource | Minéraux divers | Grotte |
| argile | Ressource | Argile humide utilisable pour le craft | Plaine |
| mousse | Ressource | Mousse humide utilisable pour le craft | Marécage |
| sable | Ressource | Sable fin utilisable pour le craft | Plage |
| boue | Ressource | Boue utilisable pour le craft | Zones inondées |
| métal | Ressource | Métal et débris métalliques | Ville, ruines |
| batteries | Matériel | Sources d'énergie | Ville, décharge |
| débris électroniques | Matériel | Composants électroniques | Décharge |
| pièces mécaniques | Matériel | Pièces pour machines | Garage |
| fils | Matériel | Câbles et fils | Décharge |
| bois | Ressource | Bois flotté | Plage |
| coquillages | Ressource | Coquillages divers | Plage, récif |

---

**Note :** La faune (rats, oiseaux, chiens errants, etc.) n'est pas une ressource exploitable mais peut apparaître comme événement, danger ou loot exceptionnel selon le scénario.

**Ce tableau est régulièrement mis à jour pour refléter les changements dans le système de ressources du jeu.**

---

## Objets spéciaux et craftables

| Nom                  | Type      | Description                                 | Origine (trouvé/craft)         | Utilisation           |
|----------------------|-----------|---------------------------------------------|-------------------------------|-----------------------|
| moteur               | Objet     | Moteur intact, prêt à être utilisé          | Garage, craft avancé           | Craft, réparation     |
| kit de soin          | Objet     | Kit médical complet pour soigner des PV     | Centre médical, craft          | Soin                  |
| système de communication | Objet | Système radio ou de communication fonctionnel | Bunker, craft avancé           | Communication, quête  |
| conserves            | Nourriture| Boîtes de conserve, nourriture longue durée | Cabane, campement              | Restaure énergie      |
| poissons             | Nourriture| Poissons frais ou séchés                    | Plage, récif, pêche            | Restaure énergie      |
| champignons          | Nourriture| Champignons comestibles                     | Forêt, marécage                | Restaure énergie      |
| bouteille d'eau      | Nourriture| Bouteille d'eau fraîche                    | Plage, marécage                | Restaure énergie      |
| corde                | Matériel | Corde pour craft                        | Forêt, campement              | Craft, Escalade
                 |

**Note :** Cette section regroupe les objets finis, trouvables ou craftables, qui ne sont pas des ressources brutes mais des éléments d'inventaire ou de scénario.

---

## Objets craftables à partir des ressources

| Nom                   | Composants requis                                     | Utilisation                           |
|-----------------------|-------------------------------------------------------|---------------------------------------|
| Pansement             | 1 tissu propre                                        | Soins(+2PV)                           |
| Torche                | 1 bâton + 1 tissu propre                              | Éclairage                             |
| Arc                   | 3 bâtons + 1 corde                                    | Arme                                  |
| Flèche                | 1 bâton + 1 pierre + 1 plume                          | Munition                              |
| Couteau               | 1 pierre + 1 bois                                     | Arme, outil                           |
| Sac en tissu          | 3 tissu propre + 1 corde                              | Transport(+4 places inventaire)       |
| Panier                | 5 herbes + 2 bois                                     | Transport(+2 places inventaire)       |
| Lance                 | 1 bâton + 2 pierre + 1 corde                          | Arme                                  |
| Canne à pêche         | 1 bâton + 1 corde                                     | Pêche                                 |


**Note :** Chaque objet crafté existe en deux versions : une **version médiocre** (risque de casse rapide, effet réduit) et une **version de bonne qualité** (effets normaux ou supérieurs). Le skill **Ingénieur** permet d'obtenir systématiquement des objets de bonne qualité.

---

### Table de correspondance (proposition)

```typescript
const lootTable: Record<string, {
  ressources: string[],
  objets: string[]
}> = {
  bois: {
    ressources: ["bâtons", "baies"],
    objets: ["champignons", "corde"]
  },
  plaine: {
    ressources: ["baies", "herbes", "pierre", "argile"],
    objets: ["bouteille d'eau"]
  },
  marécage: {
    ressources: ["herbes", "mousse"],
    objets: ["champignons", "bouteille d'eau"]
  },
  colline: {
    ressources: ["herbes", "pierre"],
    objets: []
  },
  falaise: {
    ressources: ["pierre", "os", "plumes"],
    objets: []
  },
  ruines: {
    ressources: ["tissu", "métal"],
    objets: []
  },
  urbain: {
    ressources: ["tissu", "métal", "batteries"],
    objets: ["sac en tissu"]
  },
  campement: {
    ressources: ["tissu"],
    objets: ["conserves", "corde"]
  },
  grotte: {
    ressources: ["minéraux"],
    objets: []
  },
  plage: {
    ressources: ["sable", "bois", "coquillages"],
    objets: ["poissons", "bouteille d'eau"]
  },
  récif: {
    ressources: ["coquillages"],
    objets: ["poissons"]
  },
  décharge: {
    ressources: ["batteries", "débris électroniques", "fils"],
    objets: []
  },
  garage: {
    ressources: ["pièces mécaniques"],
    objets: ["moteur"]
  },
  inondé: {
    ressources: ["boue"],
    objets: ["bouteille d'eau"]
  },
  rocheux: {
    ressources: ["pierre"],
    objets: []
  },
  espace_vert: {
    ressources: ["herbes"],
    objets: []
  },
  hopital: {
    ressources: ["tissu", "métal"],
    objets: ["kit de soin"]
  },
  cabane: {
    ressources: ["tissu", "bois"],
    objets: ["conserves", "corde"]
  },
  bunker: {
    ressources: ["batteries", "débris électroniques", "fils"],
    objets: ["système de communication"]
  },
  passage: {
    ressources: [],
    objets: []
  },
  zone_du_crash: {
    ressources: ["métal", "débris électroniques"],
    objets: []
  }
};
```

## Règles de loot

- 80% → Ressource random parmi celles disponibles dans la zone
- 20% → Objet random parmi ceux disponibles dans la zone
- Si rien disponible → Message "Malgré vos fouilles, vous ne trouvez rien."

## Table des effets des objets

```typescript
const objetsEffects: Record<string, {
  nom: string,
  type: 'nourriture' | 'soin' | 'outil' | 'transport' | 'arme' | 'special',
  effets: {
    pv?: number,
    energie?: number,
    inventaire?: number,
    special?: string
  },
  description: string
}> = {
  // NOURRITURE
  "bouteille d'eau": {
    nom: "Bouteille d'eau",
    type: "nourriture",
    effets: { energie: 1 },
    description: "Une bouteille d'eau fraîche qui restaure votre énergie."
  },
  "conserves": {
    nom: "Conserves",
    type: "nourriture", 
    effets: { energie: 1 },
    description: "Des conserves qui restaurent votre énergie."
  },
  "poissons": {
    nom: "Poissons",
    type: "nourriture",
    effets: { energie: 1 },
    description: "Du poisson frais qui restaure votre énergie."
  },
  "champignons": {
    nom: "Champignons",
    type: "nourriture",
    effets: { energie: 1 },
    description: "Des champignons comestibles qui restaurent votre énergie."
  },

  // SOINS
  "pansement": {
    nom: "Pansement",
    type: "soin",
    effets: { pv: 2 },
    description: "Un pansement qui restaure 2 points de vie."
  },
  "kit de soin": {
    nom: "Kit de soin",
    type: "soin",
    effets: { pv: 5 },
    description: "Un kit médical complet qui restaure vos points de vie."
  },

  // TRANSPORT
  "sac en tissu": {
    nom: "Sac en tissu",
    type: "transport",
    effets: { inventaire: 4 },
    description: "Un sac en tissu qui augmente votre capacité d'inventaire de 4 places."
  },
  "panier": {
    nom: "Panier",
    type: "transport",
    effets: { inventaire: 2 },
    description: "Un panier qui augmente votre capacité d'inventaire de 2 places."
  },

  // OUTILS
   "torche": {
    nom: "Torche",
    type: "outil",
    effets: { special: "eclairage" },
    description: "Une torche pour éclairer les zones sombres."
  },
  "canne à pêche": {
    nom: "Canne à pêche",
    type: "outil",
    effets: { special: "peche" },
    description: "Une canne à pêche pour attraper du poisson."
  },
  "corde": {
    nom: "Corde",
    type: "outil",
    effets: { special: "craft" },
    description: "Une corde solide utilisable pour le craft."
  },
  "système de communication": {
    nom: "Système de communication",
    type: "special",
    effets: { special: "radio" },
    description: "Un système radio fonctionnel pour communiquer."
  },

  // SPECIAL
  "moteur": {
    nom: "Moteur",
    type: "special",
    effets: { special: "moteur" },
    description: "Un moteur intact"
  },

  // ARMES
  "arc": {
    nom: "Arc",
    type: "arme",
    effets: { special: "arc" },
    description: "Un arc en bois pour chasser ou se défendre."
  },
  "flèche": {
    nom: "Flèche",
    type: "arme",
    effets: { special: "munition" },
    description: "Une flèche pour votre arc."
  },
  "couteau": {
    nom: "Couteau",
    type: "arme",
    effets: { special: "couteau" },
    description: "Un couteau en pierre, utile comme arme et outil."
  },
  "lance": {
    nom: "Lance",
    type: "arme",
    effets: { special: "lance" },
    description: "Une lance solide pour la chasse et la défense."
  },
};
```