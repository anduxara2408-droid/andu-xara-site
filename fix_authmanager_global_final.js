const fs = require('fs');
let authContent = fs.readFileSync('auth.js', 'utf8');

// Remplacer la déclaration actuelle par window.authManager
if (authContent.includes('const authManager = new AuthManager();')) {
    authContent = authContent.replace(
        'const authManager = new AuthManager();',
        'window.authManager = new AuthManager();'
    );
    console.log('✅ authManager rendu global avec window');
} else {
    console.log('❌ Déclaration authManager non trouvée');
}

fs.writeFileSync('auth.js', authContent);
console.log('✅ Correction appliquée');
