const fs = require('fs');
let authContent = fs.readFileSync('auth.js', 'utf8');

// Vérifier si la fonction signUp globale existe déjà
if (authContent.includes('async function signUp(') && authContent.includes('authManager.signUp')) {
    console.log('✅ Fonction signUp globale existe déjà et utilise authManager');
    process.exit(0);
}

// Ajouter une fonction signUp globale simple à la fin
const globalSignUp = `

// Fonction signUp globale
async function signUp(email, password, name) {
    if (!authManager) {
        return { success: false, error: "Système non disponible" };
    }
    
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    return await authManager.signUp(email, password, firstName, lastName);
}`;

// Ajouter à la fin du fichier
fs.writeFileSync('auth.js', authContent + globalSignUp);
console.log('✅ Fonction signUp globale créée !');
