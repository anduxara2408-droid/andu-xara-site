#!/bin/bash
echo "🔍 Vérification des modifications..."

FILE="index.html"

echo "1. Vérification des boutons Ajouter au panier :"
echo "----------------------------------------------"
grep -c "ajouterAuPanier" "$FILE"
grep "onclick.*ajouterAuPanier" "$FILE" | head -5

echo ""
echo "2. Vérification des fonctions supprimées :"
echo "------------------------------------------"
echo "Fonction updateFloatingCart : $(grep -c "function updateFloatingCart" "$FILE")"
echo "Fonction addToCartAndTrack : $(grep -c "addToCartAndTrack" "$FILE")"
echo "Variables floatingCart : $(grep -c "floatingCart = JSON.parse" "$FILE")"

echo ""
echo "3. Vérification de l'intégration du module unifié :"
echo "--------------------------------------------------"
grep -c "panier-unified.js" "$FILE"

echo ""
echo "✅ Vérification terminée !"
