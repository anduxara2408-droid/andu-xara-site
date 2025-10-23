const fs = require('fs');

// Lire le fichier auth.js actuel
const authContent = fs.readFileSync('auth.js', 'utf8');

// Vérifier si le patch a déjà été appliqué
if (authContent.includes('genererLienParrainage')) {
    console.log('✅ Le système de parrainage est déjà intégré');
    process.exit(0);
}

// Séparer le contenu en lignes
const lines = authContent.split('\n');

// Trouver la ligne 107 (fin de la classe AuthManager)
let newLines = [];
let classClosed = false;

for (let i = 0; i < lines.length; i++) {
    newLines.push(lines[i]);
    
    // Ajouter le code de parrainage juste avant la fermeture de la classe (ligne 107)
    if (i === 106) { // Avant la ligne 107 (index 106)
        newLines.push('');
        newLines.push('    // =============================================');
        newLines.push('    // SYSTÈME DE PARRAINAGE AUTOMATIQUE');
        newLines.push('    // =============================================');
        newLines.push('');
        newLines.push('    async genererLienParrainage(userId, email) {');
        newLines.push('        console.log("🔄 Génération du lien de parrainage pour:", email);');
        newLines.push('        try {');
        newLines.push('            const codeParrainage = "ANDU-" + Math.random().toString(36).substr(2, 8).toUpperCase();');
        newLines.push('            await db.collection("parrainage").doc(userId).set({');
        newLines.push('                code: codeParrainage,');
        newLines.push('                userId: userId,');
        newLines.push('                email: email,');
        newLines.push('                dateCreation: firebase.firestore.FieldValue.serverTimestamp(),');
        newLines.push('                utilisations: 0,');
        newLines.push('                maxUtilisations: 5,');
        newLines.push('                actif: true,');
        newLines.push('                filleuls: [],');
        newLines.push('                recompensesTotal: 0');
        newLines.push('            });');
        newLines.push('            console.log("✅ Lien de parrainage généré:", codeParrainage);');
        newLines.push('            return codeParrainage;');
        newLines.push('        } catch (error) {');
        newLines.push('            console.error("❌ Erreur génération lien parrainage:", error);');
        newLines.push('            throw error;');
        newLines.push('        }');
        newLines.push('    }');
        newLines.push('');
        newLines.push('    async detecterParrainage(userId, email) {');
        newLines.push('        console.log("🔍 Détection de parrainage pour:", email);');
        newLines.push('        try {');
        newLines.push('            const urlParams = new URLSearchParams(window.location.search);');
        newLines.push('            const codeParrainage = urlParams.get("ref");');
        newLines.push('            if (!codeParrainage) {');
        newLines.push('                console.log("ℹ️ Aucun code de parrainage détecté");');
        newLines.push('                return null;');
        newLines.push('            }');
        newLines.push('            console.log("🎯 Code de parrainage détecté:", codeParrainage);');
        newLines.push('            const parrainQuery = await db.collection("parrainage")');
        newLines.push('                .where("code", "==", codeParrainage)');
        newLines.push('                .where("actif", "==", true)');
        newLines.push('                .get();');
        newLines.push('            if (!parrainQuery.empty) {');
        newLines.push('                const parrainDoc = parrainQuery.docs[0];');
        newLines.push('                const parrainData = parrainDoc.data();');
        newLines.push('                console.log("👤 Parrain trouvé:", parrainData.email);');
        newLines.push('                if (parrainData.utilisations < parrainData.maxUtilisations && parrainData.email !== email) {');
        newLines.push('                    await db.collection("parrainage").doc(parrainDoc.id).update({');
        newLines.push('                        utilisations: firebase.firestore.FieldValue.increment(1),');
        newLines.push('                        filleuls: firebase.firestore.FieldValue.arrayUnion(email),');
        newLines.push('                        recompensesTotal: firebase.firestore.FieldValue.increment(100)');
        newLines.push('                    });');
        newLines.push('                    await this.attribuerRecompenses(parrainDoc.id, email, userId);');
        newLines.push('                    console.log("✅ Parrainage réussi !");');
        newLines.push('                    return parrainData;');
        newLines.push('                }');
        newLines.push('            }');
        newLines.push('            return null;');
        newLines.push('        } catch (error) {');
        newLines.push('            console.error("❌ Erreur détection parrainage:", error);');
        newLines.push('            return null;');
        newLines.push('        }');
        newLines.push('    }');
        newLines.push('');
        newLines.push('    async attribuerRecompenses(parrainId, emailFilleul, filleulId) {');
        newLines.push('        try {');
        newLines.push('            const timestamp = firebase.firestore.FieldValue.serverTimestamp();');
        newLines.push('            await db.collection("recompenses").doc().set({');
        newLines.push('                userId: parrainId,');
        newLines.push('                type: "parrainage_reussi",');
        newLines.push('                montant: 150,');
        newLines.push('                description: "Parrainage réussi - " + emailFilleul,');
        newLines.push('                dateAttribution: timestamp,');
        newLines.push('                statut: "actif",');
        newLines.push('                expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)');
        newLines.push('            });');
        newLines.push('            await db.collection("recompenses").doc().set({');
        newLines.push('                userId: filleulId,');
        newLines.push('                type: "bienvenue_parrainage",');
        newLines.push('                montant: 100,');
        newLines.push('                description: "Réduction bienvenue - Parrainage",');
        newLines.push('                dateAttribution: timestamp,');
        newLines.push('                statut: "actif",');
        newLines.push('                expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)');
        newLines.push('            });');
        newLines.push('            console.log("✅ Récompenses attribuées avec succès");');
        newLines.push('        } catch (error) {');
        newLines.push('            console.error("❌ Erreur attribution récompenses:", error);');
        newLines.push('        }');
        newLines.push('    }');
        newLines.push('');
        newLines.push('    mettreAJourInterfaceParrainage(userId) {');
        newLines.push('        if (!userId) return;');
        newLines.push('        return db.collection("parrainage").doc(userId).onSnapshot((doc) => {');
        newLines.push('            if (doc.exists) {');
        newLines.push('                const data = doc.data();');
        newLines.push('                const parrainsCount = document.getElementById("parrainsCount");');
        newLines.push('                const gainsTotal = document.getElementById("gainsTotal");');
        newLines.push('                const lienParrainage = document.getElementById("lienParrainage");');
        newLines.push('                if (parrainsCount) parrainsCount.textContent = data.utilisations || 0;');
        newLines.push('                if (gainsTotal) gainsTotal.textContent = (data.recompensesTotal || 0) + " MRU";');
        newLines.push('                if (lienParrainage) {');
        newLines.push('                    lienParrainage.value = window.location.origin + "/reductions.html?ref=" + data.code;');
        newLines.push('                }');
        newLines.push('            }');
        newLines.push('        });');
        newLines.push('    }');
        newLines.push('');
        newLines.push('    copierLienParrainage() {');
        newLines.push('        const lienInput = document.getElementById("lienParrainage");');
        newLines.push('        if (lienInput) {');
        newLines.push('            lienInput.select();');
        newLines.push('            lienInput.setSelectionRange(0, 99999);');
        newLines.push('            try {');
        newLines.push('                navigator.clipboard.writeText(lienInput.value).then(() => {');
        newLines.push('                    this.afficherMessage("✅ Lien copié dans le presse-papier !", "success");');
        newLines.push('                });');
        newLines.push('            } catch (error) {');
        newLines.push('                document.execCommand("copy");');
        newLines.push('                this.afficherMessage("✅ Lien copié dans le presse-papier !", "success");');
        newLines.push('            }');
        newLines.push('        }');
        newLines.push('    }');
        newLines.push('');
        newLines.push('    afficherMessage(message, type = "info") {');
        newLines.push('        const messageEl = document.createElement("div");');
        newLines.push('        messageEl.textContent = message;');
        newLines.push('        messageEl.style.cssText = "position: fixed; top: 20px; right: 20px; padding: 15px 20px; background: " + (type === "success" ? "#4CAF50" : "#2196F3") + "; color: white; border-radius: 5px; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);";');
        newLines.push('        document.body.appendChild(messageEl);');
        newLines.push('        setTimeout(() => {');
        newLines.push('            if (messageEl.parentNode) messageEl.parentNode.removeChild(messageEl);');
        newLines.push('        }, 3000);');
        newLines.push('    }');
    }
}

// Réécrire le fichier
fs.writeFileSync('auth.js', newLines.join('\n'));
console.log('✅ Système de parrainage intégré avec succès !');
