#!/bin/bash
echo "🎯 VÉRIFICATION FINALE COMPLÈTE"
echo "================================"

FILE="index.html"

echo "1. ✅ Boutons Ajouter au panier (devrait être 17) :"
echo "--------------------------------------------------"
grep -c "ajouterAuPanier" "$FILE"

echo ""
echo "2. ❌ Occurrences restantes à supprimer (devrait être 0) :"
echo "--------------------------------------------------------"
echo "addToCartAndTrack : $(grep -c "addToCartAndTrack" "$FILE")"
echo "floatingCart = JSON.parse : $(grep -c "floatingCart = JSON.parse" "$FILE")"
echo "trackProductView : $(grep -c "trackProductView" "$FILE")"

echo ""
echo "3. 🔧 Intégration module unifié :"
echo "---------------------------------"
echo "panier-unified.js : $(grep -c "panier-unified.js" "$FILE")"

echo ""
echo "4. 📋 Dernières vérifications :"
echo "-------------------------------"
echo "Fonction ajouterAuPanier appelée : $(grep -c "ajouterAuPanier" "$FILE")"
echo "Fonction processerPaiement : $(grep -c "processerPaiement" "$FILE")"

echo ""
if [ $(grep -c "addToCartAndTrack" "$FILE") -eq 0 ] && [ $(grep -c "floatingCart = JSON.parse" "$FILE") -eq 0 ]; then
    echo "🎉 SUCCÈS TOTAL ! Toutes les modifications sont appliquées."
else
    echo "⚠️  Il reste quelques éléments à nettoyer."
    echo "Occurrences restantes de addToCartAndTrack :"
    grep -n "addToCartAndTrack" "$FILE"
    echo ""
    echo "Occurrences restantes de floatingCart :"
    grep -n "floatingCart" "$FILE"
fi
