#!/bin/bash
echo "🔧 CORRECTION DU PANIER DANS reductions.html"
echo "============================================"

FILE="reductions.html"

echo "1. Vérification de la structure du panier..."
# Vérifier si le panier flottant existe
if grep -q "id=\"floating-cart\"" "$FILE"; then
    echo "✅ Structure panier présente"
else
    echo "❌ Structure panier manquante - réparation..."
    # Ajouter la structure manquante
    cat >> panier_structure.html << 'PANIER_EOF'

<!-- ===== PANIER FLOTTANT UNIFIÉ ===== -->
<div id="floating-cart" class="floating-cart">
    <div class="cart-toggle" onclick="toggleFloatingCart()">
        🛒 <span id="cart-badge-floating">0</span>
    </div>
    <div class="cart-panel">
        <div class="cart-items-container" id="cart-items-floating"></div>
        <div class="cart-summary">
            <div class="cart-total-floating">Total: <span id="cart-total-floating">0</span> MRU</div>
            <button class="buy-btn" onclick="processerPaiement()">Acheter</button>
            <button class="close-cart-btn" onclick="closeFloatingCart()">Fermer</button>
        </div>
    </div>
</div>

<style>
.floating-cart {
    position: fixed;
    bottom: 80px;
    right: 15px;
    z-index: 1000;
}

.cart-toggle {
    background: linear-gradient(135deg, #6a11cb, #2575fc);
    color: white;
    padding: 15px;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    font-size: 1.5rem;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.cart-panel {
    position: absolute;
    bottom: 70px;
    right: 0;
    width: 350px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 5px 25px rgba(0,0,0,0.2);
    display: none;
    max-height: 70vh;
    overflow: hidden;
    flex-direction: column;
}

.floating-cart.open .cart-panel {
    display: flex;
}

.cart-items-container {
    flex: 1;
    overflow-y: auto;
    max-height: calc(70vh - 150px);
    padding: 12px;
}

.cart-summary {
    padding: 12px;
    border-top: 2px solid #6a11cb;
    background: #f8f9fa;
    flex-shrink: 0;
}
</style>
PANIER_EOF
    
    # Insérer avant le footer
    awk '/<footer>/ {while(getline line < "panier_structure.html") print line} {print}' "$FILE" > "${FILE}.temp" && mv "${FILE}.temp" "$FILE"
    rm -f panier_structure.html
fi

echo "2. Vérification des fonctions JavaScript..."
# Vérifier que les fonctions existent
if grep -q "function toggleFloatingCart" "$FILE"; then
    echo "✅ Fonctions panier présentes"
else
    echo "❌ Fonctions manquantes - ajout..."
    cat >> panier_functions.js << 'FUNCTIONS_EOF'

<script>
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
});
</script>
FUNCTIONS_EOF
    
    # Insérer avant la fermeture du body
    awk '/<\/body>/ {while(getline line < "panier_functions.js") print line} {print}' "$FILE" > "${FILE}.temp" && mv "${FILE}.temp" "$FILE"
    rm -f panier_functions.js
fi

echo "✅ Correction du panier terminée !"
