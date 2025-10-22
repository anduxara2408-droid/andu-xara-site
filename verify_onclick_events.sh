#!/bin/bash
echo "🔍 VÉRIFICATION DES ÉVÉNEMENTS ONCLICK"
echo "======================================"

FILE="reductions.html"

echo "1. Vérification du bouton panier :"
if grep -q 'class="cart-toggle".*onclick="toggleFloatingCart()"' "$FILE"; then
    echo "✅ Bouton panier a le bon onclick"
else
    echo "❌ Correction du bouton panier..."
    sed -i 's/<div class="cart-toggle">/<div class="cart-toggle" onclick="toggleFloatingCart()">/' "$FILE"
fi

echo ""
echo "2. Vérification du bouton acheter :"
if grep -q 'onclick="processerPaiement()"' "$FILE"; then
    echo "✅ Bouton acheter a le bon onclick"
else
    echo "❌ Correction du bouton acheter..."
    sed -i 's/onclick="processFloatingCheckout()"/onclick="processerPaiement()"/' "$FILE"
fi

echo ""
echo "3. Vérification du bouton fermer :"
if grep -q 'onclick="closeFloatingCart()"' "$FILE"; then
    echo "✅ Bouton fermer a le bon onclick"
else
    echo "❌ Correction du bouton fermer..."
    sed -i 's/onclick="closeFloatingCart"/onclick="closeFloatingCart()"/' "$FILE"
fi

echo ""
echo "✅ Vérification des événements terminée !"
