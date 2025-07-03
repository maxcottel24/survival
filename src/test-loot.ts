import { testFouille } from './data/lootData';

// Test de différentes zones
console.log('🎮 Test du système de loot');
console.log('========================\n');

// Test 1: Zone bois (forêt)
console.log('🌲 Test zone bois:');
testFouille(['bois'], 10);
console.log('\n');

// Test 2: Zone urbain (ville)
console.log('🏙️ Test zone urbain:');
testFouille(['urbain'], 10);
console.log('\n');

// Test 3: Zone plage
console.log('🏖️ Test zone plage:');
testFouille(['plage'], 10);
console.log('\n');

// Test 4: Zone avec plusieurs types (garage + urbain)
console.log('🔧 Test zone garage + urbain:');
testFouille(['garage', 'urbain'], 10);
console.log('\n');

// Test 5: Zone avec peu de loot (passage)
console.log('🛤️ Test zone passage (peu de loot):');
testFouille(['passage'], 10);
console.log('\n');

// Test 6: Beaucoup de fouilles pour voir les statistiques
console.log('📈 Test avec 50 fouilles (zone bois):');
testFouille(['bois'], 50); 