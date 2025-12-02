// sync-simple.js - Version simple de test
console.log('📋 Vérification des dépendances...');

// Vérifier si dotenv est disponible
try {
  require('dotenv').config();
  console.log('✅ dotenv chargé');
} catch (error) {
  console.log('❌ dotenv non trouvé, installation: npm install dotenv');
  process.exit(1);
}

// Vérifier les variables
console.log('\n🔍 Variables d\'environnement chargées:');
console.log('- EMAIL_USER:', process.env.EMAIL_USER ? '✅ Défini' : '❌ Non défini');
console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Défini' : '❌ Non défini');
console.log('- SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Défini' : '❌ Non défini');

console.log('\n🎯 Étape suivante: Créer le script complet');
