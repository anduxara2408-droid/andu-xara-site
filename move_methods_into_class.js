const fs = require('fs');
let authContent = fs.readFileSync('auth.js', 'utf8');

// Trouver la fin de la classe AuthManager (avant la fonction showLoginModal)
const lines = authContent.split('\n');
let classEndIndex = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('function showLoginModal()')) {
        classEndIndex = i - 1;
        break;
    }
}

if (classEndIndex === -1) {
    console.error('❌ Impossible de trouver la fin de la classe AuthManager');
    process.exit(1);
}

console.log('Fin de la classe AuthManager trouvée à la ligne:', classEndIndex + 1);

// Trouver le début et la fin des méthodes de parrainage
let parrainageStart = -1;
let parrainageEnd = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('// SYSTÈME DE PARRAINAGE AUTOMATIQUE')) {
        parrainageStart = i;
        // Trouver la fin (jusqu'à la prochaine fonction ou la fin du fichier)
        for (let j = i; j < lines.length; j++) {
            if (lines[j].includes('function ') && j > i) {
                parrainageEnd = j - 1;
                break;
            }
        }
        if (parrainageEnd === -1) {
            parrainageEnd = lines.length - 1;
        }
        break;
    }
}

if (parrainageStart === -1) {
    console.error('❌ Impossible de trouver les méthodes de parrainage');
    process.exit(1);
}

console.log('Début des méthodes parrainage:', parrainageStart + 1);
console.log('Fin des méthodes parrainage:', parrainageEnd + 1);

// Extraire les méthodes de parrainage
const parrainageMethods = lines.slice(parrainageStart, parrainageEnd + 1);

// Reconstruire le contenu
const newLines = [
    ...lines.slice(0, classEndIndex),
    ...parrainageMethods,
    ...lines.slice(classEndIndex, parrainageStart),
    ...lines.slice(parrainageEnd + 1)
];

fs.writeFileSync('auth.js', newLines.join('\n'));
console.log('✅ Méthodes de parrainage déplacées dans la classe AuthManager !');
