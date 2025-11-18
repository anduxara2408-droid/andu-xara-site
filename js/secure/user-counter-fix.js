// js/secure/user-counter-fix.js
console.log("🔧 User Counter Fix - Chargement");

function fixUserCounter() {
    console.log("🎯 Application correctif compteur utilisateurs...");
    
    // Désactiver temporairement le compteur problématique
    if (window.userUpdateInterval) {
        clearInterval(window.userUpdateInterval);
        console.log("✅ Intervalle compteur désactivé");
    }
    
    // Réactiver avec gestion d'erreurs après délai
    setTimeout(() => {
        try {
            if (typeof set !== 'undefined') {
                const userRef = ref(db, 'users/' + generateUserId());
                
                // Connexion initiale sécurisée
                set(userRef, {
                    online: true,
                    lastSeen: serverTimestamp()
                }).catch(error => {
                    console.warn("⚠️ Connexion utilisateur échouée:", error);
                });
                
                // Déconnexion automatique sécurisée
                onDisconnect(userRef).set({
                    online: false,
                    lastSeen: serverTimestamp()
                }).catch(error => {
                    console.warn("⚠️ Déconnexion automatique échouée:", error);
                });
                
                // Mise à jour périodique sécurisée
                window.userUpdateInterval = setInterval(() => {
                    try {
                        set(userRef, {
                            lastSeen: Date.now(),
                            active: true
                        }).catch(error => {
                            console.warn("⚠️ Mise à jour connexion échouée:", error);
                        });
                    } catch (error) {
                        console.warn("⚠️ Erreur mise à jour connexion:", error);
                    }
                }, 30000);
                
                console.log("✅ Compteur utilisateurs réactivé avec gestion d'erreurs");
            }
        } catch (error) {
            console.error("❌ Impossible de réactiver le compteur:", error);
        }
    }, 5000);
}

function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Attendre que les imports Firebase soient chargés
if (typeof set !== 'undefined') {
    fixUserCounter();
} else {
    // Réessayer après chargement
    setTimeout(fixUserCounter, 3000);
}

console.log("🔧 User Counter Fix - Prêt");
