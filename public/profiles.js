// Gestion des profils dans localStorage
const STORAGE_KEY = 'survival_profiles';

function getProfiles() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveProfiles(profiles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

function renderProfiles() {
  const list = document.getElementById('profilesList');
  list.innerHTML = '';
  const profiles = getProfiles();
  if (profiles.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:#aaa;">Aucun profil sauvegardé.</p>';
    return;
  }
  profiles.forEach(profile => {
    const div = document.createElement('div');
    div.className = 'profile-item';
    div.innerHTML = `
      <div class="profile-info">
        <span class="profile-name">${profile.name}</span>
        <span class="profile-date">Dernière partie : ${profile.lastPlayed ? new Date(profile.lastPlayed).toLocaleString() : 'Jamais'}</span>
      </div>
      <div class="profile-actions">
        <button class="profile-btn" data-id="${profile.id}" data-action="load">Charger</button>
        <button class="profile-btn rename" data-id="${profile.id}" data-action="rename">Renommer</button>
        <button class="profile-btn delete" data-id="${profile.id}" data-action="delete">Supprimer</button>
      </div>
    `;
    list.appendChild(div);
  });
}

document.getElementById('profilesList').addEventListener('click', (e) => {
  if (e.target.classList.contains('profile-btn')) {
    const id = e.target.getAttribute('data-id');
    const action = e.target.getAttribute('data-action');
    let profiles = getProfiles();
    const idx = profiles.findIndex(p => p.id === id);
    if (idx === -1) return;
    if (action === 'load') {
      // Sauvegarder l'ID du profil courant et rediriger vers le jeu
      localStorage.setItem('survival_current_profile', id);
      window.location.href = 'game.html';
    } else if (action === 'rename') {
      const newName = prompt('Nouveau nom du profil :', profiles[idx].name);
      if (newName && !profiles.some(p => p.name === newName)) {
        profiles[idx].name = newName;
        saveProfiles(profiles);
        renderProfiles();
      } else if (newName) {
        alert('Ce nom de profil existe déjà.');
      }
    } else if (action === 'delete') {
      if (confirm('Supprimer ce profil ?')) {
        profiles.splice(idx, 1);
        saveProfiles(profiles);
        renderProfiles();
      }
    }
  }
});

// Initialisation
renderProfiles(); 