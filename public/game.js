// Styles pour le menu de chargement
const style = document.createElement('style');
style.textContent = `
  .load-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .load-menu-content {
    background: rgba(30, 30, 30, 0.95);
    padding: 2em;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
  }
  .load-menu h2 {
    color: #f2f2f2;
    margin-bottom: 1.5em;
    text-align: center;
    font-size: 1.5em;
  }
  .load-menu .profiles-list {
    margin-bottom: 1.5em;
  }
  .load-menu .profile-item {
    background: rgba(40, 40, 40, 0.95);
    border-radius: 8px;
    padding: 1em;
    margin-bottom: 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .load-menu .profile-info {
    flex: 1;
  }
  .load-menu .profile-name {
    font-size: 1.1em;
    font-weight: bold;
    color: #f2f2f2;
    margin-bottom: 0.2em;
  }
  .load-menu .profile-date {
    font-size: 0.9em;
    color: #aaa;
  }
  .load-menu .profile-btn {
    padding: 0.5em 1.2em;
    background: #4caf50;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.2s;
  }
  .load-menu .profile-btn:hover {
    background: #45a049;
  }
  .load-menu .cancel-btn {
    width: 100%;
    padding: 0.8em;
    background: #666;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.2s;
  }
  .load-menu .cancel-btn:hover {
    background: #555;
  }
`;
document.head.appendChild(style);

// Gestion du menu
const menuBtn = document.querySelector('.menu-btn');
const menuOverlay = document.querySelector('.menu-overlay');
const menuContent = document.querySelector('.menu-content');

function toggleMenu() {
  menuBtn.classList.toggle('active');
  menuOverlay.classList.toggle('active');
  menuContent.classList.toggle('active');
}

menuBtn.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', toggleMenu);

// Gestion des actions du menu
document.getElementById('saveBtn').addEventListener('click', function(e) {
  e.preventDefault();
  // Sauvegarde du profil courant
  const profileId = localStorage.getItem('survival_current_profile');
  if (!profileId) {
    alert('Aucun profil courant à sauvegarder.');
    toggleMenu();
    return;
  }
  const STORAGE_KEY = 'survival_profiles';
  const profiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) {
    alert('Profil non trouvé.');
    toggleMenu();
    return;
  }
  // Sauvegarde des stats actuelles
  profiles[idx].lastPlayed = new Date().toISOString();
  profiles[idx].data.stats = { 
    pv: currentHealth, 
    energie: currentEnergy 
  };
  profiles[idx].data.progression = { scene: 'plage' }; // À remplacer par la vraie progression
  profiles[idx].data.inventaire = [
    { name: "Radio", type: "outil", description: "Permet d'écouter les annonces du soir." },
    { name: "Boussole", type: "outil", description: "Indique le nord." }
  ]; // À remplacer par l'inventaire réel
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  alert('Sauvegarde effectuée !');
  toggleMenu();
});

document.getElementById('loadBtn').addEventListener('click', async function(e) {
  e.preventDefault();
  const STORAGE_KEY = 'survival_profiles';
  const profiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  
  if (profiles.length === 0) {
    alert('Aucune sauvegarde disponible.');
    toggleMenu();
    return;
  }

  // Créer une liste de profils à charger
  const loadMenu = document.createElement('div');
  loadMenu.className = 'load-menu';
  loadMenu.innerHTML = `
    <div class="load-menu-content">
      <h2>Charger une partie</h2>
      <div class="profiles-list">
        ${profiles.map(profile => `
          <div class="profile-item">
            <div class="profile-info">
              <div class="profile-name">${profile.name}</div>
              <div class="profile-date">Dernière sauvegarde: ${new Date(profile.lastPlayed).toLocaleString()}</div>
            </div>
            <button class="profile-btn load" data-id="${profile.id}">Charger</button>
          </div>
        `).join('')}
      </div>
      <button class="cancel-btn">Annuler</button>
    </div>
  `;

  // Ajouter le menu de chargement au DOM
  document.body.appendChild(loadMenu);

  // Gérer le chargement d'un profil
  loadMenu.querySelectorAll('.profile-btn.load').forEach(btn => {
    btn.addEventListener('click', function() {
      const profileId = this.dataset.id;
      const profile = profiles.find(p => p.id === profileId);
      if (profile) {
        localStorage.setItem('survival_current_profile', profileId);
        // Restauration des stats
        if (profile.data.stats) {
          updateHealth(profile.data.stats.pv);
          updateEnergy(profile.data.stats.energie);
        }
        alert('Partie chargée avec succès !');
        document.body.removeChild(loadMenu);
        toggleMenu();
      }
    });
  });

  // Gérer l'annulation
  loadMenu.querySelector('.cancel-btn').addEventListener('click', () => {
    document.body.removeChild(loadMenu);
  });

  // Fermer le menu de chargement si on clique en dehors
  loadMenu.addEventListener('click', (e) => {
    if (e.target === loadMenu) {
      document.body.removeChild(loadMenu);
    }
  });
});

document.getElementById('optionsBtn').addEventListener('click', function(e) {
  e.preventDefault();
  // TODO: Implémenter les options
  console.log('Options...');
  toggleMenu();
});

document.getElementById('continueBtn').addEventListener('click', function(e) {
  e.preventDefault();
  toggleMenu();
});

// Chargement du profil du joueur
async function loadPlayerProfile() {
  try {
    const response = await fetch('/api/profiles');
    const profiles = await response.json();
    return profiles[0] || null;
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error);
    return null;
  }
}

// Gestion des points de vie et de l'énergie
let currentHealth = 20;
const maxHealth = 20;
let currentEnergy = 14;
const maxEnergy = 14;

const healthFill = document.getElementById('healthFill');
const healthText = document.getElementById('healthText');
const energyFill = document.getElementById('energyFill');
const energyText = document.getElementById('energyText');
const healthIcon = document.querySelector('.health-icon');
const energyIcon = document.querySelector('.energy-icon');

function updatePulseAnimation(element, current, max) {
  const percentage = (current / max) * 100;
  let duration;
  
  if (percentage <= 25) {
    duration = '0.5s'; // Très rapide quand très bas
  } else if (percentage <= 50) {
    duration = '0.8s'; // Rapide quand bas
  } else if (percentage <= 75) {
    duration = '1s'; // Moyen quand moyen
  } else {
    duration = '1.5s'; // Normal quand haut
  }
  
  element.style.animation = `pulse ${duration} infinite`;
}

function updateHealth(newHealth) {
  currentHealth = Math.max(0, Math.min(maxHealth, newHealth));
  const percentage = (currentHealth / maxHealth) * 100;
  healthFill.style.width = `${percentage}%`;
  healthText.textContent = `${currentHealth}/${maxHealth}`;
  
  // Mise à jour de l'animation de pulsation
  updatePulseAnimation(healthIcon, currentHealth, maxHealth);
  
  // Animation de dégâts
  if (newHealth < currentHealth) {
    healthFill.style.background = '#ff0000';
    setTimeout(() => {
      healthFill.style.background = 'linear-gradient(90deg, #ff4444, #ff6b6b)';
    }, 300);
  }
}

function updateEnergy(newEnergy) {
  currentEnergy = Math.max(0, Math.min(maxEnergy, newEnergy));
  const percentage = (currentEnergy / maxEnergy) * 100;
  energyFill.style.width = `${percentage}%`;
  energyText.textContent = `${currentEnergy}/${maxEnergy}`;
  
  // Mise à jour de l'animation de pulsation
  updatePulseAnimation(energyIcon, currentEnergy, maxEnergy);
  
  // Animation de perte d'énergie
  if (newEnergy < currentEnergy) {
    energyFill.style.background = '#ffa000';
    setTimeout(() => {
      energyFill.style.background = 'linear-gradient(90deg, #ffd700, #ffeb3b)';
    }, 300);
  }
}

// Fonction pour prendre des dégâts (à utiliser dans le jeu)
function takeDamage(amount) {
  updateHealth(currentHealth - amount);
}

// Fonction pour se soigner (à utiliser dans le jeu)
function heal(amount) {
  updateHealth(currentHealth + amount);
}

// Fonction pour perdre de l'énergie (à utiliser dans le jeu)
function loseEnergy(amount) {
  updateEnergy(currentEnergy - amount);
}

// Fonction pour récupérer de l'énergie (à utiliser dans le jeu)
function gainEnergy(amount) {
  updateEnergy(currentEnergy + amount);
}

// Initialisation des stats
updateHealth(currentHealth);
updateEnergy(currentEnergy);

// Gestion de l'inventaire
const INVENTORY_SIZE = 10;
let inventory = [];
const inventoryOverlay = document.getElementById('inventoryOverlay');
const inventoryGrid = document.getElementById('inventoryGrid');
const inventoryInfo = document.getElementById('inventoryInfo');

// Icônes pour les différents types d'objets
const ITEM_ICONS = {
  outil: '🔧',
  nourriture: '🍎',
  boisson: '🥤',
  medicament: '💊',
  arme: '🔫',
  radio: '📻',
  boussole: '🧭',
  default: '📦'
};

// Initialisation de l'inventaire
function initInventory() {
  // Créer les slots d'inventaire
  inventoryGrid.innerHTML = '';
  for (let i = 0; i < INVENTORY_SIZE; i++) {
    const slot = document.createElement('div');
    slot.className = 'inventory-slot empty';
    slot.dataset.index = i;
    slot.addEventListener('click', () => selectItem(i));
    inventoryGrid.appendChild(slot);
  }
  updateInventoryDisplay();
}

// Mise à jour de l'affichage de l'inventaire
function updateInventoryDisplay() {
  const slots = inventoryGrid.children;
  for (let i = 0; i < INVENTORY_SIZE; i++) {
    const slot = slots[i];
    const item = inventory[i];
    
    if (item) {
      slot.className = 'inventory-slot';
      slot.innerHTML = `
        <div class="item-icon">${ITEM_ICONS[item.type] || ITEM_ICONS.default}</div>
        <div class="item-name">${item.name}</div>
        ${item.quantity > 1 ? `<div class="item-quantity">${item.quantity}</div>` : ''}
      `;
    } else {
      slot.className = 'inventory-slot empty';
      slot.innerHTML = '';
    }
  }
}

// Sélection d'un objet
function selectItem(index) {
  const item = inventory[index];
  if (item) {
    inventoryInfo.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <p>Type: ${item.type}</p>
      ${item.quantity > 1 ? `<p>Quantité: ${item.quantity}</p>` : ''}
      <button onclick="useItem(${index})">Utiliser</button>
      <button onclick="dropItem(${index})">Jeter</button>
    `;
  } else {
    inventoryInfo.innerHTML = `
      <h3>Slot vide</h3>
      <p>Ce slot d'inventaire est vide.</p>
    `;
  }
}

// Utilisation d'un objet
function useItem(index) {
  const item = inventory[index];
  if (!item) return;

  // Logique d'utilisation selon le type d'objet
  switch (item.type) {
    case 'nourriture':
      gainEnergy(1);
      break;
    case 'medicament':
      heal(5);
      break;
    // Ajouter d'autres cas selon les besoins
  }

  // Si l'objet est consommable, réduire la quantité ou le supprimer
  if (item.consumable) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      inventory[index] = null;
    }
    updateInventoryDisplay();
  }
}

// Jeter un objet
function dropItem(index) {
  if (confirm('Voulez-vous vraiment jeter cet objet ?')) {
    inventory[index] = null;
    updateInventoryDisplay();
    inventoryInfo.innerHTML = `
      <h3>Objet jeté</h3>
      <p>L'objet a été retiré de votre inventaire.</p>
    `;
  }
}

// Ajouter un objet à l'inventaire
function addItem(item) {
  // Vérifier si l'objet peut être empilé
  if (item.stackable) {
    const existingItem = inventory.find(i => i && i.name === item.name);
    if (existingItem) {
      existingItem.quantity += item.quantity;
      updateInventoryDisplay();
      return true;
    }
  }

  // Trouver un slot vide
  const emptySlot = inventory.findIndex(slot => slot === null);
  if (emptySlot !== -1) {
    inventory[emptySlot] = item;
    updateInventoryDisplay();
    return true;
  }
  return false;
}

// Gestionnaire d'événements pour le bouton d'inventaire
document.getElementById('inventoryBtn').addEventListener('click', function(e) {
  e.preventDefault();
  inventoryOverlay.style.display = 'flex';
  toggleMenu();
});

// Gestionnaire d'événements pour le bouton de fermeture
document.getElementById('inventoryClose').addEventListener('click', function() {
  inventoryOverlay.style.display = 'none';
});

// Initialisation de l'inventaire au chargement
window.onload = async function() {
  document.body.classList.add('visible');
  
  // Chargement des stats du profil courant
  const profileId = localStorage.getItem('survival_current_profile');
  if (profileId) {
    const STORAGE_KEY = 'survival_profiles';
    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      if (profile.data.stats) {
        updateHealth(profile.data.stats.pv);
        updateEnergy(profile.data.stats.energie);
      }
      // Charger l'inventaire
      inventory = profile.data.inventaire || [];
    }
  }
  
  // Initialiser l'inventaire
  initInventory();
  
  // Ajouter les event listeners aux boutons de choix
  const choiceButtons = document.querySelectorAll('.choice-btn');
  choiceButtons.forEach(button => {
    button.addEventListener('click', function() {
      // TODO: Implémenter la logique des choix
      console.log('Choix:', this.textContent);
    });
  });
}; 