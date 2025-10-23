const fs = require('fs');
let authContent = fs.readFileSync('auth.js', 'utf8');

// Vérifier si la méthode existe déjà
if (authContent.includes('copierLienParrainage()')) {
    console.log('✅ Méthode copierLienParrainage existe déjà');
} else {
    // Trouver la fin de la classe AuthManager (avant window.authManager)
    const classEndIndex = authContent.indexOf('window.authManager = new AuthManager();');
    
    if (classEndIndex !== -1) {
        // Code de la méthode à ajouter
        const methodCode = `

    // Méthode pour copier le lien de parrainage
    copierLienParrainage() {
        console.log("📋 Début de la copie du lien");
        
        const input = document.getElementById('lienParrainage');
        if (!input) {
            console.error("❌ Input lienParrainage non trouvé");
            this.afficherMessage("Erreur: Lien non disponible", "error");
            return;
        }

        // Sélectionner le texte
        input.select();
        input.setSelectionRange(0, 99999);

        // Copier
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(input.value)
                    .then(() => {
                        this.afficherMessage("✅ Lien copié dans le presse-papier !", "success");
                        console.log("✅ Lien copié avec succès");
                    })
                    .catch(err => {
                        console.error("❌ Erreur clipboard:", err);
                        this.fallbackCopy(input);
                    });
            } else {
                this.fallbackCopy(input);
            }
        } catch (error) {
            console.error("❌ Erreur générale copie:", error);
            this.fallbackCopy(input);
        }
    }

    fallbackCopy(input) {
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.afficherMessage("✅ Lien copié dans le presse-papier !", "success");
            } else {
                this.afficherMessage("❌ Impossible de copier le lien", "error");
            }
        } catch (err) {
            console.error("❌ Erreur fallback:", err);
            this.afficherMessage("❌ Erreur lors de la copie", "error");
        }
    }`;

        // Insérer avant la déclaration de window.authManager
        const before = authContent.substring(0, classEndIndex);
        const after = authContent.substring(classEndIndex);
        
        authContent = before + methodCode + after;
        fs.writeFileSync('auth.js', authContent);
        console.log('✅ Méthode copierLienParrainage ajoutée à AuthManager');
    } else {
        console.log('❌ Impossible de trouver la fin de la classe');
    }
}
