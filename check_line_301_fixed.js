const fs = require('fs');
const authContent = fs.readFileSync('auth.js', 'utf8');

const lines = authContent.split('\n');
console.log('=== ANALYSE LIGNE 301 ===');

// Vérifier la ligne 301 (index 300)
if (lines[300]) {
    console.log('Ligne 301 actuelle:');
    console.log('301:', lines[300]);
    
    // Vérifier si c'est un appel à authManager.signUp
    if (lines[300].includes('authManager.signUp')) {
        console.log('✅ Ligne 301 appelle déjà authManager.signUp');
    } else if (lines[300].includes('signUp')) {
        console.log('ℹ️ Ligne 301 appelle signUp mais pas authManager.signUp');
        console.log('🔄 Correction nécessaire...');
        
        // Corriger la ligne
        lines[300] = '            const result = await authManager.signUp(email, password, name, "");';
        fs.writeFileSync('auth.js', lines.join('\n'));
        console.log('✅ Ligne 301 corrigée !');
    } else {
        console.log('❌ Ligne 301 ne contient pas d appel à signUp');
    }
} else {
    console.log('❌ Ligne 301 non trouvée');
}
