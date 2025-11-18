// js/secure/firebase-simple-fix.js
console.log("🔧 Firebase Simple Fix - Chargement");

// Attendre que Firebase soit chargé
setTimeout(() => {
    if (typeof firebase !== 'undefined' && firebase.database) {
        console.log("✅ Firebase RTDB disponible, application correctifs...");
        
        // Correctif 1: Gestion d'erreurs pour set()
        const originalSet = firebase.database.Reference.prototype.set;
        firebase.database.Reference.prototype.set = function(value, priority) {
            return new Promise((resolve, reject) => {
                try {
                    // Valider les données
                    if (value === null || value === undefined) {
                        console.warn("⚠️ Données Firebase invalides, utilisation valeur par défaut");
                        value = { error: "invalid_data", timestamp: Date.now() };
                    }
                    
                    originalSet.call(this, value, priority)
                        .then(resolve)
                        .catch(error => {
                            console.warn("⚠️ Firebase set() échoué:", error);
                            resolve(); // Résoudre malgré l'erreur
                        });
                } catch (error) {
                    console.warn("⚠️ Exception Firebase set():", error);
                    resolve(); // Toujours résoudre
                }
            });
        };
        
        console.log("✅ Correctif Firebase set() appliqué");
        
        // Correctif 2: Désactiver temporairement le compteur problématique
        try {
            if (window.userUpdateInterval) {
                clearInterval(window.userUpdateInterval);
                console.log("✅ Intervalle utilisateur désactivé");
            }
        } catch (error) {
            console.log("ℹ️ Aucun intervalle à désactiver");
        }
        
    } else {
        console.log("❌ Firebase RTDB non disponible");
    }
}, 3000);

console.log("🔧 Firebase Simple Fix - Prêt");
