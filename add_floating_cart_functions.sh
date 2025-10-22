#!/bin/bash
echo "🔧 AJOUT DES FONCTIONS PANIER FLOTTANT"
echo "======================================"

FILE="reductions.html"

# Créer le fichier avec les fonctions exactement au bon format
cat > floating_cart_functions.js << 'FUNCTIONS_EOF'

// ===== FONCTIONS PANIER FLOTTANT =====
function toggleFloatingCart() {
    console.log("🛒 toggleFloatingCart appelé");
    const cart = document.getElementById('floating-cart');
    if (cart) {
        cart.classList.toggle('open');
        console.log("Panier état:", cart.classList.contains('open') ? "ouvert" : "fermé");
        if (cart.classList.contains('open') && window.panierUnifie) {
            window.panierUnifie.mettreAJourAffichagePanier();
        }
    }
}

function closeFloatingCart() {
    const cart = document.getElementById('floating-cart');
    if (cart) {
        cart.classList.remove('open');
    }
}

function processerPaiement() {
    console.log("💳 Processus de paiement démarré");
    if (window.panierUnifie) {
        window.panierUnifie.processerPaiement();
    } else {
        alert("Système de paiement non disponible");
    }
}

// Gestion des clics en dehors du panier
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
        const cart = document.getElementById('floating-cart');
        const toggle = document.querySelector('.cart-toggle');
        
        if (cart && cart.classList.contains('open') &&
            !cart.contains(event.target) &&
            !toggle.contains(event.target)) {
            closeFloatingCart();
        }
    });
    
    console.log("✅ Fonctions panier flottant initialisées");
});
FUNCTIONS_EOF

# Insérer les fonctions après l'initialisation du module unifié
awk '
/console.log.*reductions.html initialisé/ {print; while(getline line < "floating_cart_functions.js") print line; next}
{print}
' "$FILE" > "${FILE}.temp" && mv "${FILE}.temp" "$FILE"

rm -f floating_cart_functions.js

echo "✅ Fonctions panier flottant ajoutées !"
