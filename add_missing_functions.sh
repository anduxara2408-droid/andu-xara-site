#!/bin/bash
echo "🔧 AJOUT DES FONCTIONS MANQUANTES"
echo "================================"

FILE="reductions.html"

# Créer un fichier avec les fonctions manquantes
cat > missing_functions.js << 'FUNCTIONS_EOF'

// ===== FONCTIONS PANIER FLOTTANT MANQUANTES =====
function toggleFloatingCart() {
    if (window.panierUnifie) {
        const cart = document.getElementById('floating-cart');
        if (cart) {
            cart.classList.toggle('open');
            if (cart.classList.contains('open')) {
                window.panierUnifie.mettreAJourAffichagePanier();
            }
        }
    }
}

function closeFloatingCart() {
    const cart = document.getElementById('floating-cart');
    if (cart) {
        cart.classList.remove('open');
    }
}

// Fermer le panier en cliquant à l'extérieur
document.addEventListener('click', function(event) {
    const cart = document.getElementById('floating-cart');
    const toggle = document.querySelector('.cart-toggle');

    if (cart && cart.classList.contains('open') &&
        !cart.contains(event.target) &&
        !toggle.contains(event.target)) {
        closeFloatingCart();
    }
});
FUNCTIONS_EOF

# Insérer les fonctions avant la fermeture du script principal
awk '
/\/\/ Initialisation au chargement/ {print; while(getline line < "missing_functions.js") print line; next}
{print}
' "$FILE" > "${FILE}.temp" && mv "${FILE}.temp" "$FILE"

rm -f missing_functions.js

echo "✅ Fonctions manquantes ajoutées !"
