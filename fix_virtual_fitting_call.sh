#!/bin/bash
echo "🔧 Correction de l'appel dans l'essayage virtuel..."

FILE="index.html"

# Remplacer l'appel spécifique dans la section essayage virtuel
sed -i 's/addToCartAndTrack(clothing.name, clothing.category, clothing.price);/ajouterAuPanier(clothing.name, clothing.category, clothing.price);/g' "$FILE"

echo "✅ Appel corrigé !"
