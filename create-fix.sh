#!/bin/bash
cat > js/secure/fix-missing-function.js << 'EOF'
// 🔧 CORRECTIF IMMÉDIAT - FONCTION validateAndApplyPromo
function validateAndApplyPromo() {
    console.log("🎯 Fonction validateAndApplyPromo appelée");
    const codeInput = document.getElementById("code-promo-input");
    const applyButton = document.getElementById("appliquer-promo-btn");
    if (!codeInput || !applyButton) {
        alert("❌ Éléments manquants. Rechargez la page.");
        return;
    }
    const code = codeInput.value.trim();
    if (!code) {
        alert("❌ Veuillez entrer un code promo");
        return;
    }
    if (typeof panierSecurise === "undefined") {
        alert("❌ Système panier non chargé. Attendez quelques secondes.");
        return;
    }
    if (!userManager.isLoggedIn) {
        alert("🔐 Connectez-vous pour utiliser un code promo");
        userManager.showAuthModal();
        return;
    }
    applyButton.disabled = true;
    applyButton.textContent = "Validation...";
    panierSecurise.appliquerCodePromo(code).finally(() => {
        applyButton.disabled = false;
        applyButton.textContent = "Appliquer";
    });
}
window.validateAndApplyPromo = validateAndApplyPromo;
console.log("✅ Correctif appliqué: validateAndApplyPromo disponible");
EOF
echo "✅ Fichier correctif créé avec succès"
