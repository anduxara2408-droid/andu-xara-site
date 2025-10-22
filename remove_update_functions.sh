#!/bin/bash
echo "🧹 Suppression des fonctions updateFloatingCart restantes..."

FILE="index.html"

# Supprimer la fonction updateFloatingCart si elle existe encore
sed -i '/function updateFloatingCart()/,/^}$/d' "$FILE"

# Supprimer les appels à updateFloatingCart
sed -i '/updateFloatingCart()/d' "$FILE"

echo "✅ Fonctions updateFloatingCart supprimées !"
