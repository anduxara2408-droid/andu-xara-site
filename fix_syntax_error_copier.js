const fs = require('fs');
let authContent = fs.readFileSync('auth.js', 'utf8');

// Afficher le contexte problématique
console.log("=== CONTEXTE AUTOUR DE L'ERREUR ===");
const lines = authContent.split('\n');
for (let i = 374; i <= 382 && i < lines.length; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
}

// Le problème est probablement une structure incorrecte
// Réparons en supprimant la méthode mal formée et en la réajoutant proprement

// Trouver et supprimer la méthode mal formée
if (authContent.includes('copierLienParrainage()')) {
    // Supprimer depuis la ligne de la méthode jusqu'à la prochaine méthode ou la fin de la classe
    const startIndex = authContent.indexOf('    copierLienParrainage()');
    if (startIndex !== -1) {
        // Trouver la fin de cette méthode (prochaine méthode ou accolade fermante)
        const nextMethodIndex = authContent.indexOf('    ', startIndex + 10);
        const classEndIndex = authContent.indexOf('window.authManager');
        
        let endIndex = nextMethodIndex;
        if (nextMethodIndex === -1 || nextMethodIndex > classEndIndex) {
            endIndex = classEndIndex;
        }
        
        if (endIndex !== -1) {
            authContent = authContent.substring(0, startIndex) + authContent.substring(endIndex);
            console.log('✅ Méthode mal formée supprimée');
        }
    }
}

// Maintenant ajouter la méthode correctement
const classEndIndex = authContent.indexOf('window.authManager = new AuthManager();');
if (classEndIndex !== -1) {
    const methodCode = `

    // Méthode pour copier le lien de parrainage
    copierLienParrainage() {
        console.log("📋 Début de la copie du lien");
        const input = document.getElementById('lienParrainage');
        if (!input) {
            console.error("❌ Input lienParrainage non trouvé");
            return;
        }
        input.select();
        input.setSelectionRange(0, 99999);
        try {
            navigator.clipboard.writeText(input.value)
                .then(() => alert('✅ Lien copié dans le presse-papier !'))
                .catch(() => {
                    document.execCommand('copy');
                    alert('✅ Lien copié dans le presse-papier !');
                });
        } catch (error) {
            document.execCommand('copy');
            alert('✅ Lien copié dans le presse-papier !');
        }
    }`;

    const before = authContent.substring(0, classEndIndex);
    const after = authContent.substring(classEndIndex);
    authContent = before + methodCode + after;
    
    fs.writeFileSync('auth.js', authContent);
    console.log('✅ Méthode copierLienParrainage ajoutée correctement');
}

