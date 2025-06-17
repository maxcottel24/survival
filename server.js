const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Servir les fichiers statiques depuis le dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Créer le dossier data s'il n'existe pas
if (!fs.existsSync('data')) {
  fs.mkdirSync('data');
}

// Créer le fichier profiles.json s'il n'existe pas
if (!fs.existsSync('data/profiles.json')) {
  fs.writeFileSync('data/profiles.json', '[]');
}

// // Routes pour les profils
// app.get('/api/profiles', (req, res) => {
//   try {
//     console.log('Lecture des profils...');
//     const profiles = JSON.parse(fs.readFileSync('data/profiles.json', 'utf8') || '[]');
//     console.log('Profils trouvés:', profiles);
//     res.json(profiles);
//   } catch (error) {
//     console.error('Erreur lors de la lecture des profils:', error);
//     res.status(500).json({ error: 'Erreur lors de la lecture des profils' });
//   }
// });

app.post('/api/profiles', (req, res) => {
  try {
    console.log('Création d\'un nouveau profil:', req.body);
    const profiles = JSON.parse(fs.readFileSync('data/profiles.json', 'utf8') || '[]');
    const newProfile = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      lastPlayed: new Date().toISOString(),
      stats: {
        gamesPlayed: 0,
        bestScore: 0,
        playTime: 0,
        survivorsMet: 0
      },
      encounteredCharacters: [] // Liste des IDs des personnages rencontrés
    };
    profiles.push(newProfile);
    fs.writeFileSync('data/profiles.json', JSON.stringify(profiles, null, 2));
    console.log('Profil créé avec succès:', newProfile);
    res.json(newProfile);
  } catch (error) {
    console.error('Erreur lors de la création du profil:', error);
    res.status(500).json({ error: 'Erreur lors de la création du profil' });
  }
});

app.get('/api/profiles/:id', (req, res) => {
  try {
    console.log('Recherche du profil:', req.params.id);
    const profiles = JSON.parse(fs.readFileSync('data/profiles.json', 'utf8') || '[]');
    const profile = profiles.find(p => p.id === req.params.id);
    if (profile) {
      console.log('Profil trouvé:', profile);
      res.json(profile);
    } else {
      console.log('Profil non trouvé');
      res.status(404).json({ error: 'Profil non trouvé' });
    }
  } catch (error) {
    console.error('Erreur lors de la lecture du profil:', error);
    res.status(500).json({ error: 'Erreur lors de la lecture du profil' });
  }
});

// Route pour mettre à jour les personnages rencontrés
app.post('/api/profiles/:id/encountered-characters', (req, res) => {
  try {
    const { characterId } = req.body;
    const profiles = JSON.parse(fs.readFileSync('data/profiles.json', 'utf8') || '[]');
    const profileIndex = profiles.findIndex(p => p.id === req.params.id);
    
    if (profileIndex === -1) {
      res.status(404).json({ error: 'Profil non trouvé' });
      return;
    }

    if (!profiles[profileIndex].encounteredCharacters.includes(characterId)) {
      profiles[profileIndex].encounteredCharacters.push(characterId);
      profiles[profileIndex].stats.survivorsMet = profiles[profileIndex].encounteredCharacters.length;
      fs.writeFileSync('data/profiles.json', JSON.stringify(profiles, null, 2));
    }

    res.json(profiles[profileIndex]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des personnages rencontrés:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des personnages rencontrés' });
  }
});

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'survival-homepage.html'));
});

// Route pour le menu du jeu
app.get('/game-menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'game-menu.html'));
});

// Route pour la bibliothèque des personnages
app.get('/character-library', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'character-library.html'));
});

// Route pour récupérer tous les comptes
app.get('/api/accounts', (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'accounts.json'), 'utf8');
    const accounts = JSON.parse(data);
    res.json(accounts);
  } catch (error) {
    console.error('Erreur lors de la lecture des comptes:', error);
    res.json([]);
  }
});

// Route pour créer un nouveau compte
app.post('/api/accounts', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Validation basique
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username et mot de passe requis' });
    }

    // Vérifier le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Format d\'email invalide' });
    }

    // Vérifier la longueur du mot de passe
    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    // Lire les comptes existants
    let accounts = [];
    try {
      const data = fs.readFileSync(path.join(__dirname, 'data', 'accounts.json'), 'utf8');
      accounts = JSON.parse(data);
    } catch (error) {
      // Si le fichier n'existe pas, on continue avec un tableau vide
    }

    // Vérifier si l'email ou le username existe déjà
    if (accounts.some(account => account.email === email)) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }
    if (accounts.some(account => account.username === username)) {
      return res.status(400).json({ error: 'Ce nom d\'utilisateur est déjà pris' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer le nouveau compte
    const newAccount = {
      id: Date.now().toString(),
      email,
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      stats: {
        gamesPlayed: 0,
        bestScore: 0,
        playTime: 0,
        survivorsMet: 0
      },
      encounteredCharacters: []
    };

    accounts.push(newAccount);

    // Sauvegarder les comptes
    fs.writeFileSync(path.join(__dirname, 'data', 'accounts.json'), JSON.stringify(accounts, null, 2));

    // Ne pas renvoyer le mot de passe
    const { password: _, ...accountWithoutPassword } = newAccount;
    res.json(accountWithoutPassword);
  } catch (error) {
    console.error('Erreur lors de la création du compte:', error);
    res.status(500).json({ error: 'Erreur lors de la création du compte' });
  }
});

// Route pour se connecter
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Lire les comptes
    const data = fs.readFileSync(path.join(__dirname, 'data', 'accounts.json'), 'utf8');
    const accounts = JSON.parse(data);
    
    // Trouver le compte
    const account = accounts.find(a => a.email === email);
    if (!account) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, account.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Mettre à jour la dernière connexion
    account.lastLogin = new Date().toISOString();
    fs.writeFileSync(path.join(__dirname, 'data', 'accounts.json'), JSON.stringify(accounts, null, 2));

    // Ne pas renvoyer le mot de passe
    const { password: _, ...accountWithoutPassword } = account;
    res.json(accountWithoutPassword);
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

// Route pour récupérer un compte spécifique
app.get('/api/accounts/:id', (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'accounts.json'), 'utf8');
    const accounts = JSON.parse(data);
    const account = accounts.find(a => a.id === req.params.id);
    
    if (!account) {
      return res.status(404).json({ error: 'Compte non trouvé' });
    }
    
    // Ne pas renvoyer le mot de passe
    const { password: _, ...accountWithoutPassword } = account;
    res.json(accountWithoutPassword);
  } catch (error) {
    console.error('Erreur lors de la lecture du compte:', error);
    res.status(500).json({ error: 'Erreur lors de la lecture du compte' });
  }
});

// Route pour mettre à jour les personnages rencontrés
app.put('/api/accounts/:id/encountered-characters', (req, res) => {
  try {
    const { characterId } = req.body;
    const data = fs.readFileSync(path.join(__dirname, 'data', 'accounts.json'), 'utf8');
    let accounts = JSON.parse(data);
    const accountIndex = accounts.findIndex(a => a.id === req.params.id);
    
    if (accountIndex === -1) {
      return res.status(404).json({ error: 'Compte non trouvé' });
    }

    if (!accounts[accountIndex].encounteredCharacters) {
      accounts[accountIndex].encounteredCharacters = [];
    }

    if (!accounts[accountIndex].encounteredCharacters.includes(characterId)) {
      accounts[accountIndex].encounteredCharacters.push(characterId);
      fs.writeFileSync(path.join(__dirname, 'data', 'accounts.json'), JSON.stringify(accounts, null, 2));
    }

    // Ne pas renvoyer le mot de passe
    const { password: _, ...accountWithoutPassword } = accounts[accountIndex];
    res.json(accountWithoutPassword);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des personnages rencontrés:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des personnages rencontrés' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
}); 