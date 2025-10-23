const fs = require('fs');
let authContent = fs.readFileSync('auth.js', 'utf8');

const lines = authContent.split('\n');
let modifications = 0;

// Correction 1: Ligne 345 - ajouter le paramètre manquant
if (lines[344] && lines[344].includes('const result = await authManager.signUp(email, password, name);')) {
    lines[344] = '            const result = await authManager.signUp(email, password, name, "");';
    modifications++;
    console.log('✅ Ligne 345 corrigée');
}

// Correction 2: Vérifier la fonction globale signUp
const globalSignUpStart = lines.findIndex(line => line.includes('async function signUp('));
if (globalSignUpStart !== -1) {
    // Vérifier que la fonction globale appelle avec 4 paramètres
    const callLine = lines.findIndex((line, idx) => idx > globalSignUpStart && line.includes('authManager.signUp('));
    if (callLine !== -1 && lines[callLine].includes('authManager.signUp(email, password, firstName, lastName)')) {
        console.log('✅ Fonction globale signUp correcte');
    } else {
        console.log('ℹ️ Vérification fonction globale signUp');
    }
}

if (modifications > 0) {
    fs.writeFileSync('auth.js', lines.join('\n'));
    console.log('✅ Modifications appliquées avec succès !');
} else {
    console.log('✅ Aucune correction nécessaire');
}
