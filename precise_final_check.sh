#!/bin/bash
echo "🎯 VÉRIFICATION FINALE PRÉCISE"
echo "=============================="

FILE="index.html"

echo "1. RECHERCHE DES ÉLÉMENTS SUPPRIMÉS :"
echo "-------------------------------------"
echo "addToCartAndTrack (fonction) : $(grep -c "function addToCartAndTrack" "$FILE")"
echo "addToCartAndTrack (appel) : $(grep -c "addToCartAndTrack(" "$FILE")"
echo "floatingCart. : $(grep -c "floatingCart\." "$FILE")"
echo "floatingCart = : $(grep -c "floatingCart =" "$FILE")"
echo "let floatingCart : $(grep -c "let floatingCart" "$FILE")"
echo "updateFloatingCart : $(grep -c "updateFloatingCart" "$FILE")"

echo ""
echo "2. VÉRIFICATION DES ÉLÉMENTS CORRECTS :"
echo "--------------------------------------"
echo "ajouterAuPanier : $(grep -c "ajouterAuPanier" "$FILE")"
echo "panier-unified.js : $(grep -c "panier-unified.js" "$FILE")"

echo ""
echo "3. RAPPORT DÉTAILLÉ :"
echo "--------------------"
if [ $(grep -c "addToCartAndTrack" "$FILE") -eq 0 ] && [ $(grep -c "floatingCart\." "$FILE") -eq 0 ]; then
    echo "🎉 SUCCÈS TOTAL !"
    echo "Tout le code redondant a été supprimé."
    echo "Le système utilise maintenant exclusivement le module unifié."
else
    echo "⚠️  Il reste des éléments :"
    grep -n "addToCartAndTrack" "$FILE" 2>/dev/null || echo "Aucun addToCartAndTrack trouvé"
    grep -n "floatingCart" "$FILE" 2>/dev/null | head -5
fi
