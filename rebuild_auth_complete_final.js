const fs = require('fs');

// Lire le fichier original
const authContent = fs.readFileSync('auth.js', 'utf8');
const lines = authContent.split('\n');

// Trouver le début et la fin réelle de la classe AuthManager
let classStart = -1;
let classEnd = -1;
let braceCount = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('class AuthManager')) {
        classStart = i;
        braceCount = 1;
        // Trouver la fin de la classe par comptage d'accolades
        for (let j = i + 1; j < lines.length; j++) {
            for (const char of lines[j]) {
                if (char === '{') braceCount++;
                if (char === '}') braceCount--;
            }
            if (braceCount === 0) {
                classEnd = j;
                break;
            }
        }
        break;
    }
}

console.log('Classe trouvée de la ligne', classStart + 1, 'à', classEnd + 1);

if (classStart === -1 || classEnd === -1) {
    console.error('❌ Impossible de trouver la classe AuthManager');
    process.exit(1);
}

// Reconstruire le fichier avec une structure propre
let newContent = '';

// 1. Partie avant la classe
for (let i = 0; i < classStart; i++) {
    newContent += lines[i] + '\n';
}

// 2. Début de la classe
newContent += lines[classStart] + '\n';

// 3. Méthodes originales de la classe (sans les doublons)
const methodNames = new Set();
for (let i = classStart + 1; i < classEnd; i++) {
    const line = lines[i].trim();
    
    // Identifier les méthodes
    if (line.startsWith('async') || (line.includes('(') && line.includes('{') && !line.includes('class'))) {
        const methodName = line.split('(')[0].split('async ')[1] || line.split('(')[0].trim();
        if (!methodNames.has(methodName)) {
            methodNames.add(methodName);
            newContent += lines[i] + '\n';
        } else {
            console.log('⚠️ Méthode dupliquée ignorée:', methodName);
        }
    } else {
        newContent += lines[i] + '\n';
    }
}

// 4. Ajouter la méthode copierLienParrainage si elle n'existe pas
if (!methodNames.has('copierLienParrainage')) {
    newContent += `
    // Méthode pour copier le lien de parrainage
    copierLienParrainage() {
        const input = document.getElementById('lienParrainage');
        if (!input) {
            alert('Erreur: Lien non disponible');
            return;
        }
        input.select();
        input.setSelectionRange(0, 99999);
        try {
            navigator.clipboard.writeText(input.value);
            alert('✅ Lien copié dans le presse-papier !');
        } catch (err) {
            document.execCommand('copy');
            alert('✅ Lien copié dans le presse-papier !');
        }
    }
`;
}

// 5. Fermeture de la classe
newContent += '}\n\n';

// 6. Ajouter authManager après la classe
newContent += '// Initialisation globale d\\'AuthManager\n';
newContent += 'window.authManager = new AuthManager();\n\n';

// 7. Ajouter le reste du fichier (fonctions globales)
for (let i = classEnd + 1; i < lines.length; i++) {
    if (!lines[i].includes('window.authManager = new AuthManager();')) {
        newContent += lines[i] + '\n';
    }
}

// Écrire le nouveau fichier
fs.writeFileSync('auth.js', newContent);
console.log('✅ auth.js reconstruit avec une structure propre');

// Vérification syntaxe
try {
    require('child_process').execSync('node -c auth.js', { stdio: 'inherit' });
    console.log('✅ Syntaxe valide après reconstruction');
} catch (error) {
    console.log('❌ Erreur de syntaxe persistante');
    
    // Afficher les lignes autour de l'erreur
    const errorLine = 410;
    console.log('Contexte autour de la ligne', errorLine, ':');
    for (let i = Math.max(0, errorLine - 5); i < Math.min(lines.length, errorLine + 5); i++) {
        console.log(i + 1 + ':', lines[i]);
    }
}
