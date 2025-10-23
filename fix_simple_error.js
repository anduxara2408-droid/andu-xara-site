const fs = require('fs');
let authContent = fs.readFileSync('auth.js', 'utf8');

// Le problème est une accolade fermante en trop. Supprimons-la.
const lines = authContent.split('\n');

// Vérifier la ligne 121
if (lines[120] && lines[120].trim() === '}') {
    console.log('Ligne 121 contient une accolade fermante isolée, suppression...');
    // Supprimer cette ligne
    lines.splice(120, 1);
    fs.writeFileSync('auth.js', lines.join('\n'));
    console.log('✅ Accolade fermante en trop supprimée');
} else {
    console.log('✅ Aucune accolade fermante en trop détectée à la ligne 121');
    console.log('Ligne 121 actuelle:', lines[120]);
}
