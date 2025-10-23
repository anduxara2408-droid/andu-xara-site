const fs = require('fs');
let authContent = fs.readFileSync('auth.js', 'utf8');

// Vérifier s'il y a un problème de structure autour de la méthode genererLienParrainage
const lines = authContent.split('\n');
let inClass = false;
let braceCount = 0;
let problemLine = -1;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.includes('class AuthManager')) {
        inClass = true;
        braceCount = 1;
        continue;
    }
    
    if (inClass) {
        // Compter les accolades pour suivre la structure de la classe
        for (const char of line) {
            if (char === '{') braceCount++;
            if (char === '}') braceCount--;
        }
        
        // Vérifier si on a une méthode sans async ou mal formée
        if (line.includes('genererLienParrainage') && !line.includes('async')) {
            problemLine = i;
            console.log('Problème détecté à la ligne', i + 1, ':', line);
            break;
        }
    }
}

if (problemLine !== -1) {
    console.log('Correction de la ligne', problemLine + 1);
    
    // Réparer la ligne problématique
    if (lines[problemLine].includes('genererLienParrainage(userId, email)')) {
        lines[problemLine] = '    async genererLienParrainage(userId, email) {';
    }
    
    fs.writeFileSync('auth.js', lines.join('\n'));
    console.log('✅ Erreur de syntaxe corrigée !');
} else {
    console.log('✅ Aucune erreur de structure détectée');
    
    // Vérifier le contexte autour de la ligne 157
    console.log('Contexte ligne 157:');
    for (let i = 154; i <= 160; i++) {
        if (lines[i]) console.log(i + 1 + ':', lines[i]);
    }
}
