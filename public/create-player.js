// Validation du formulaire
document.getElementById('playerForm').onsubmit = function() {
  const name = document.getElementById('playerName').value.trim();
  const gender = document.getElementById('playerGender').value;
  const age = document.getElementById('playerAge').value;
  if (!name || !gender || !age) return;

  // Création du profil complet
  const newProfile = {
    id: Date.now().toString(),
    name: name,
    created: new Date().toISOString(),
    lastPlayed: new Date().toISOString(),
    data: {
      stats: { pv: 20, energie: 14 },
      progression: { scene: 'plage' },
      inventaire: []
    }
  };
  // Sauvegarde dans localStorage
  const STORAGE_KEY = 'survival_profiles';
  const profiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  profiles.push(newProfile);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  localStorage.setItem('survival_current_profile', newProfile.id);

  // Faire disparaître la fenêtre de création de personnage avec un effet de transition
  const creationContainer = document.querySelector('.creation-container');
  creationContainer.style.transition = 'opacity 1.5s ease-in-out';
  creationContainer.style.opacity = '0';
  creationContainer.style.position = 'absolute';
  setTimeout(() => {
    creationContainer.style.display = 'none';
  }, 1500);
  // Afficher l'introduction avec un effet de fondu
  const introductionContainer = document.querySelector('.introduction-container');
  introductionContainer.style.display = 'block';
  introductionContainer.style.opacity = '0';
  introductionContainer.style.transition = 'opacity 0.5s';
  setTimeout(() => {
    introductionContainer.style.opacity = '1';
  }, 1250);
  return false;
};

// Désactiver le bouton tant que nom, genre ou âge non rempli
const nameInput = document.getElementById('playerName');
const genderInput = document.getElementById('playerGender');
const ageInput = document.getElementById('playerAge');
const submitBtn = document.getElementById('submitBtn');

function checkForm() {
  submitBtn.disabled = !(nameInput.value.trim() && genderInput.value && ageInput.value);
}

nameInput.addEventListener('input', checkForm);
genderInput.addEventListener('change', checkForm);
ageInput.addEventListener('input', checkForm);

// Gestion du bouton de démarrage
document.getElementById('startBtn').addEventListener('click', function() {
  const introductionContainer = document.querySelector('.introduction-container');
  introductionContainer.style.transition = 'opacity 1.5s ease-in-out';
  introductionContainer.style.opacity = '0';
  
  setTimeout(() => {
    window.location.href = 'game.html';
  }, 1500);
}); 