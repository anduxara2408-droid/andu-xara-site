const fs = require('fs');
let authContent = fs.readFileSync('auth.js', 'utf8');

// Vérifier si authManager existe déjà
if (authContent.includes('const authManager = new AuthManager()')) {
    console.log('✅ authManager existe déjà');
} else {
    // Ajouter à la fin du fichier, juste avant les fonctions globales
    const lastFunctionIndex = authContent.indexOf('function showLoginModal');
    if (lastFunctionIndex !== -1) {
        const before = authContent.substring(0, lastFunctionIndex);
        const after = authContent.substring(lastFunctionIndex);
        
        authContent = before + '\n// Initialisation globale d\\'AuthManager\nconst authManager = new AuthManager();\n\n' + after;
        fs.writeFileSync('auth.js', authContent);
        console.log('✅ authManager ajouté avant les fonctions globales');
    } else {
        // Ajouter à la fin
        authContent += '\n\n// Initialisation globale d\\'AuthManager\nconst authManager = new AuthManager();';
        fs.writeFileSync('auth.js', authContent);
        console.log('✅ authManager ajouté à la fin du fichier');
    }
}
