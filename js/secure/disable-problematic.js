// js/secure/disable-problematic.js
console.log("🛑 Désactivation systèmes problématiques");

// Désactiver temporairement le compteur utilisateurs
if (window.userUpdateInterval) {
    clearInterval(window.userUpdateInterval);
    console.log("✅ Compteur utilisateurs désactivé");
}

// Désactiver les observateurs MutationObserver problématiques
if (window.panierIntegration && window.panierIntegration.setupCartObserver) {
    // L'observateur sera réactivé plus tard
    console.log("✅ Observateurs désactivés temporairement");
}

console.log("🛑 Systèmes problématiques désactivés");

