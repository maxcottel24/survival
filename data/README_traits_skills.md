# Traits de caractère et Compétences (Skills)

## 1. Traits de caractère

Les traits de caractère influencent la personnalité, les capacités et/ou les comportements des personnages. Ils se divisent en deux catégories :

### a) Traits statistiques
- Donnent des bonus ou malus sur les caractéristiques de base (FORCE, DEXTÉRITÉ, CONSTITUTION, INTELLIGENCE, SAGESSE, CHARISME).
- Exemples :
  - **Charismatique** : +3 en Charisme
  - **Gourmand** : -2 en Constitution
  - **Tacticien** : +3 en Intelligence
  - **Froid** : +2 en Sagesse, -1 en Charisme
  - **Opportuniste** : +2 en Dextérité
  - **Justicier** : +2 en Sagesse, -1 en Charisme
  - **Mystérieux** : +2 en Sagesse, +1 en Intelligence
  - **Altruiste** : +2 en Charisme, -1 en Intelligence
  - **Paranoïaque** : +2 en Sagesse, -2 en Charisme
  - **Hermétique** : +2 en Sagesse, -2 en Charisme
  - **Empathique** : +2 en Charisme, -1 en Dextérité
  - **Rancunier** : +1 en Dextérité, -1 en Charisme
  - **Hypocrite** : +2 en Charisme, -1 en Sagesse

### b) Traits comportementaux
- Déverrouillent ou interdisent certaines actions, choix de dialogue ou réactions à des événements.
- Exemples :
  - **Loyal** : ne peut pas effectuer l'action "Trahir"
  - **Justicier** : refuse d'aider un personnage ayant déjà effectué l'action "Trahir"
  - **Paranoïaque** : refuse de partager certaines ressources
  - **Opportuniste** : peut trahir plus facilement
  - **Altruiste** : aide spontanément les autres
  - **Rancunier** : options de vengeance
  - **Hypocrite** : options de double jeu, manipulation
  - **Froid** : peu expressif, garde ses distances émotionnelles ; réduit les interactions affectives
  - **Mystérieux** : peut refuser certaines rencontres ou interactions sans conséquence ; évite les confrontations sociales ou hostiles
  - **Empathique** : options de soutien ou de négociation
  - **Hermétique** : garde des secrets, résiste à la manipulation

Un même trait peut parfois avoir un effet statistique ET comportemental.

---

## 2. Compétences (Skills)

Les compétences sont des talents ou spécialisations techniques/sociales. Elles n'influencent PAS directement les caractéristiques de base, mais permettent :
- D'accéder à certains crafts
- De réussir automatiquement certains tests
- D'avoir des options spéciales dans des événements

Exemples de skills :
- **Ingénieur** : réussit automatiquement les crafts techniques
- **Tacticien** : options de stratégie, bonus lors de tests de planification
- **Gourmand** : bonus pour trouver de la nourriture, options spéciales lors de repas
- **Charismatique** (en skill) : bonus lors de négociations, persuasion

---

**Résumé :**
- Les traits de caractère modulent la personnalité, les stats et/ou les comportements.
- Les skills sont des spécialisations techniques ou sociales, utiles pour des actions précises.

**À compléter selon l'évolution du gameplay et la liste des traits/skills !**

**Ce fichier sert de référence pour l'édition et la compréhension du fichier characters.json.**

---

## Calcul du modificateur de jet selon la caractéristique

- **10 dans une caractéristique = 0% de bonus/malus**
- **Chaque point au-dessus de 10 = +5% de chance de réussite**
- **Chaque point en dessous de 10 = -5% de chance de réussite**

Exemple de table :
| Stat | Modificateur (%) |
|------|------------------|
| 6    | -20%             |
| 8    | -10%             |
| 10   | 0%               |
| 12   | +10%             |
| 14   | +20%             |
| 16   | +30%             |
| 18   | +40%             |
| 20   | +50%             |

### Fonction JavaScript
```js
/**
 * Calcule le bonus/malus de chance (%) pour un jet selon la stat.
 * @param {number} stat - La valeur de la caractéristique (ex : 8, 12, 15...)
 * @returns {number} - Le pourcentage à ajouter au jet de base (ex : -10, +15)
 */
function getStatModifier(stat) {
  return (stat - 10) * 5;
}

// Exemples d'utilisation :
console.log(getStatModifier(10)); // 0
console.log(getStatModifier(13)); // 15
console.log(getStatModifier(8));  // -10
console.log(getStatModifier(16)); // 30
```

### Utilisation dans un test de réussite
```js
function getFinalChance(baseChance, stat) {
  return baseChance + getStatModifier(stat);
}

// Exemple :
const baseChance = 50;
const dexterite = 14;
const finalChance = getFinalChance(baseChance, dexterite); // 50 + 20 = 70
console.log(finalChance + "% de réussite"); // "70% de réussite"
```

**Ce système peut être adapté selon l'équilibrage souhaité.**