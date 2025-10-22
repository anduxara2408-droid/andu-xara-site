#!/bin/bash
echo "🔧 MISE À JOUR DE TOUS LES APPELS"
echo "================================"

FILE="reductions.html"

echo "1. Mise à jour des appels de paiement..."
sed -i 's/processFloatingCheckout()/processerPaiement()/g' "$FILE"

echo "2. Mise à jour des appels resetPromo..."
sed -i 's/resetPromo()/retirerCodePromo()/g' "$FILE"

echo "3. Suppression des appels updateFloatingCart..."
sed -i '/updateFloatingCart()/d' "$FILE"

echo "4. Mise à jour de l'initialisation..."
# Remplacer l'initialisation du localStorage
sed -i '/localStorage.setItem.*anduxara_cart/d' "$FILE"

echo "✅ Appels mis à jour !"
