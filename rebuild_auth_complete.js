const fs = require('fs');

// Lire le fichier original
const authContent = fs.readFileSync('auth.js', 'utf8');
const lines = authContent.split('\n');

// Trouver les différentes sections
let classStart = -1;
let classEnd = -1;
let parrainageSectionStart = -1;
let parrainageSectionEnd = -1;
let globalFunctionsStart = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('class AuthManager')) {
        classStart = i;
    }
    if (lines[i].includes('// SYSTÈME DE PARRAINAGE AUTOMATIQUE')) {
        parrainageSectionStart = i;
    }
    if (lines[i].includes('function showLoginModal()')) {
        globalFunctionsStart = i;
        if (classEnd === -1) {
            classEnd = i - 1;
        }
    }
}

// Trouver la fin réelle de la classe par comptage d'accolades
if (classStart !== -1) {
    let braceCount = 0;
    for (let i = classStart; i < lines.length; i++) {
        for (const char of lines[i]) {
            if (char === '{') braceCount++;
            if (char === '}') braceCount--;
        }
        if (braceCount === 0 && i > classStart) {
            classEnd = i;
            break;
        }
    }
}

console.log('Class start:', classStart);
console.log('Class end:', classEnd);
console.log('Parrainage section:', parrainageSectionStart);
console.log('Global functions:', globalFunctionsStart);

// Reconstruire le fichier de manière structurée
let newContent = '';

// 1. Partie avant la classe
if (classStart > 0) {
    newContent += lines.slice(0, classStart).join('\n') + '\n';
}

// 2. Début de la classe
newContent += lines[classStart] + '\n';

// 3. Méthodes originales de la classe (avant parrainage)
for (let i = classStart + 1; i <= classEnd; i++) {
    if (!lines[i].includes('// SYSTÈME DE PARRAINAGE AUTOMATIQUE') && 
        !lines[i].includes('genererLienParrainage') &&
        !lines[i].includes('detecterParrainage') &&
        !lines[i].includes('attribuerRecompenses') &&
        !lines[i].includes('mettreAJourInterfaceParrainage') &&
        !lines[i].includes('copierLienParrainage') &&
        !lines[i].includes('afficherMessage')) {
        newContent += lines[i] + '\n';
    }
}

// 4. Méthodes de parrainage (si elles existent dans la classe)
if (parrainageSectionStart > classStart && parrainageSectionStart < classEnd) {
    for (let i = parrainageSectionStart; i <= classEnd; i++) {
        if (lines[i].includes('// SYSTÈME DE PARRAINAGE AUTOMATIQUE') || 
            lines[i].includes('genererLienParrainage') ||
            lines[i].includes('detecterParrainage') ||
            lines[i].includes('attribuerRecompenses') ||
            lines[i].includes('mettreAJourInterfaceParrainage') ||
            lines[i].includes('copierLienParrainage') ||
            lines[i].includes('afficherMessage')) {
            newContent += lines[i] + '\n';
        }
    }
}

// 5. Fermeture de la classe
newContent += '}\n\n';

// 6. Fonctions globales
if (globalFunctionsStart !== -1) {
    newContent += lines.slice(globalFunctionsStart).join('\n');
}

// Écrire le nouveau fichier
fs.writeFileSync('auth.js', newContent);
console.log('✅ Fichier auth.js reconstruit avec une structure propre');

// Vérification
const { execSync } = require('child_process');
try {
    execSync('node -c auth.js', { stdio: 'inherit' });
    console.log('✅ Syntaxe valide après reconstruction');
} catch (error) {
    console.log('❌ Erreur de syntaxe persistante');
    
    // Afficher les premières erreurs
    console.log('Premières erreurs:');
    try {
        execSync('node -c auth.js 2>&1 | head -10', { stdio: 'inherit' });
    } catch (e) {
        // Ignorer l'erreur d'exécution
    }
}
