const fs = require('fs');

// Lire le fichier auth.js actuel
const authContent = fs.readFileSync('auth.js', 'utf8');

// Vérifier si le patch a déjà été appliqué
if (authContent.includes('genererLienParrainage')) {
    console.log('✅ Le système de parrainage est déjà intégré');
    process.exit(0);
}

// Trouver la fin de la classe AuthManager (avant la création de l'instance)
const classEndIndex = authContent.indexOf('const authManager = new AuthManager();');
if (classEndIndex === -1) {
    console.error('❌ Impossible de trouver la fin de la classe AuthManager');
    process.exit(1);
}

// Code à ajouter à l'intérieur de la classe
const parrainageCode = `

    // =============================================
    // SYSTÈME DE PARRAINAGE AUTOMATIQUE
    // =============================================

    /**
     * Génère automatiquement un lien de parrainage pour un nouvel utilisateur
     */
    async genererLienParrainage(userId, email) {
        console.log("🔄 Génération du lien de parrainage pour:", email);
        
        try {
            const codeParrainage = 'ANDU-' + Math.random().toString(36).substr(2, 8).toUpperCase();
            
            await db.collection('parrainage').doc(userId).set({
                code: codeParrainage,
                userId: userId,
                email: email,
                dateCreation: firebase.firestore.FieldValue.serverTimestamp(),
                utilisations: 0,
                maxUtilisations: 5,
                actif: true,
                filleuls: [],
                recompensesTotal: 0
            });
            
            console.log("✅ Lien de parrainage généré:", codeParrainage);
            return codeParrainage;
            
        } catch (error) {
            console.error("❌ Erreur génération lien parrainage:", error);
            throw error;
        }
    }

    /**
     * Détecte et traite le parrainage lors de l'inscription
     */
    async detecterParrainage(userId, email) {
        console.log("🔍 Détection de parrainage pour:", email);
        
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const codeParrainage = urlParams.get('ref');
            
            if (!codeParrainage) {
                console.log("ℹ️ Aucun code de parrainage détecté");
                return null;
            }
            
            console.log("🎯 Code de parrainage détecté:", codeParrainage);
            
            const parrainQuery = await db.collection('parrainage')
                .where('code', '==', codeParrainage)
                .where('actif', '==', true)
                .get();

            if (!parrainQuery.empty) {
                const parrainDoc = parrainQuery.docs[0];
                const parrainData = parrainDoc.data();
                
                console.log("👤 Parrain trouvé:", parrainData.email);
                
                if (parrainData.utilisations < parrainData.maxUtilisations) {
                    if (parrainData.email !== email) {
                        await db.collection('parrainage').doc(parrainDoc.id).update({
                            utilisations: firebase.firestore.FieldValue.increment(1),
                            filleuls: firebase.firestore.FieldValue.arrayUnion(email),
                            recompensesTotal: firebase.firestore.FieldValue.increment(100)
                        });
                        
                        await this.attribuerRecompenses(parrainDoc.id, email, userId);
                        console.log("✅ Parrainage réussi !");
                        return parrainData;
                    }
                }
            }
            return null;
            
        } catch (error) {
            console.error("❌ Erreur détection parrainage:", error);
            return null;
        }
    }

    async attribuerRecompenses(parrainId, emailFilleul, filleulId) {
        try {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            
            await db.collection('recompenses').doc().set({
                userId: parrainId,
                type: "parrainage_reussi",
                montant: 150,
                description: \`Parrainage réussi - \${emailFilleul}\`,
                dateAttribution: timestamp,
                statut: "actif",
                expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
            
            await db.collection('recompenses').doc().set({
                userId: filleulId,
                type: "bienvenue_parrainage", 
                montant: 100,
                description: "Réduction bienvenue - Parrainage",
                dateAttribution: timestamp,
                statut: "actif",
                expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
            
        } catch (error) {
            console.error("❌ Erreur attribution récompenses:", error);
        }
    }

    mettreAJourInterfaceParrainage(userId) {
        if (!userId) return;
        
        return db.collection('parrainage').doc(userId).onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                
                const parrainsCount = document.getElementById('parrainsCount');
                const gainsTotal = document.getElementById('gainsTotal');
                const lienParrainage = document.getElementById('lienParrainage');
                
                if (parrainsCount) parrainsCount.textContent = data.utilisations || 0;
                if (gainsTotal) gainsTotal.textContent = (data.recompensesTotal || 0) + ' MRU';
                if (lienParrainage) {
                    lienParrainage.value = window.location.origin + '/reductions.html?ref=' + data.code;
                }
            }
        });
    }

    copierLienParrainage() {
        const lienInput = document.getElementById('lienParrainage');
        if (lienInput) {
            lienInput.select();
            lienInput.setSelectionRange(0, 99999);
            try {
                navigator.clipboard.writeText(lienInput.value).then(() => {
                    this.afficherMessage('✅ Lien copié dans le presse-papier !', 'success');
                });
            } catch (error) {
                document.execCommand('copy');
                this.afficherMessage('✅ Lien copié dans le presse-papier !', 'success');
            }
        }
    }

    afficherMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = \`
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: \${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        \`;
        document.body.appendChild(messageEl);
        setTimeout(() => {
            if (messageEl.parentNode) messageEl.parentNode.removeChild(messageEl);
        }, 3000);
    }
`;

// Construire le nouveau contenu
const newContent = authContent.slice(0, classEndIndex) + parrainageCode + '\\n}' + authContent.slice(classEndIndex);

// Écrire le nouveau fichier
fs.writeFileSync('auth.js', newContent);
console.log('✅ Système de parrainage intégré avec succès !');
