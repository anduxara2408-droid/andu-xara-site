#!/bin/bash
echo "🧹 NETTOYAGE DU CODE REDONDANT"
echo "=============================="

FILE="reductions.html"

echo "1. Suppression des fonctions panier dupliquées..."
# Supprimer les fonctions qui existent dans le module unifié
sed -i '/function toggleFloatingCart()/,/^}$/d' "$FILE"
sed -i '/function closeFloatingCart()/,/^}$/d' "$FILE"
sed -i '/function processFloatingCheckout()/,/^}$/d' "$FILE"

echo "2. Suppression du système codes promo dupliqué..."
sed -i '/let currentDiscount = null/,/^}$/d' "$FILE"
sed -i '/function applyPromoToCart(discount, promoCode)/,/^}$/d' "$FILE"
sed -i '/function resetPromo()/,/^}$/d' "$FILE"
sed -i '/function loadSavedPromo()/,/^}$/d' "$FILE"
sed -i '/function simulatePromoValidation/,/^}$/d' "$FILE"

echo "3. Suppression des variables floatingCart..."
sed -i '/floatingCart/d' "$FILE"

echo "✅ Nettoyage terminé !"
