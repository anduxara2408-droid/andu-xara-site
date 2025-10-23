const fs = require('fs');
let authContent = fs.readFileSync('auth.js', 'utf8');

// Vérifier si authManager est déjà déclaré globalement
if (authContent.includes('const authManager = new AuthManager();')) {
    // Remplacer par une déclaration globale
    authContent = authContent.replace(
        'const authManager = new AuthManager();',
        'window.authManager = new AuthManager();'
    );
    console.log('✅ authManager rendu global avec window.authManager');
} else if (authContent.includes('let authManager = new AuthManager();')) {
    authContent = authContent.replace(
        'let authManager = new AuthManager();',
        'window.authManager = new AuthManager();'
    );
    console.log('✅ authManager rendu global avec window.authManager');
} else if (authContent.includes('var authManager = new AuthManager();')) {
    authContent = authContent.replace(
        'var authManager = new AuthManager();',
        'window.authManager = new AuthManager();'
    );
    console.log('✅ authManager rendu global avec window.authManager');
} else {
    // Chercher la déclaration d'authManager
    const authManagerMatch = authContent.match(/(const|let|var)\\s+authManager\\s*=\\s*new AuthManager\\(\\);/);
    if (authManagerMatch) {
        authContent = authContent.replace(
            authManagerMatch[0],
            'window.authManager = new AuthManager();'
        );
        console.log('✅ authManager trouvé et rendu global');
    } else {
        console.log('❌ Déclaration authManager non trouvée, ajout manuel...');
        // Ajouter à la fin du fichier
        authContent += '\\n// Initialisation globale d\\'authManager\\nwindow.authManager = new AuthManager();';
    }
}

fs.writeFileSync('auth.js', authContent);
console.log('✅ Correction appliquée !');
