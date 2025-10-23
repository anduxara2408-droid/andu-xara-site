const fs = require('fs');

// Lire reductions.html
let reductionsContent = fs.readFileSync('reductions.html', 'utf8');

// Remplacer l'appel à copierLienParrainage() par authManager.copierLienParrainage()
if (reductionsContent.includes('onclick="copierLienParrainage()"')) {
    reductionsContent = reductionsContent.replace(
        'onclick="copierLienParrainage()"',
        'onclick="authManager.copierLienParrainage()"'
    );
    console.log('✅ Appel copierLienParrainage remplacé');
} else {
    console.log('ℹ️ Appel copierLienParrainage non trouvé');
}

// Écrire le fichier modifié
fs.writeFileSync('reductions.html', reductionsContent);
console.log('✅ reductions.html mis à jour !');
