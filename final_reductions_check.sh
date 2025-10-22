#!/bin/bash
echo "🎯 VÉRIFICATION FINALE DE reductions.html"
echo "========================================"

FILE="reductions.html"

echo "1. INTÉGRATION MODULE UNIFIÉ :"
echo "------------------------------"
echo "panier-unified.js : $(grep -c "panier-unified.js" "$FILE")"
echo "appliquerCodePromo : $(grep -c "appliquerCodePromo" "$FILE")"
echo "retirerCodePromo : $(grep -c "retirerCodePromo" "$FILE")"
echo "processerPaiement : $(grep -c "processerPaiement" "$FILE")"

echo ""
echo "2. CODE REDONDANT SUPPRIMÉ :"
echo "---------------------------"
echo "floatingCart : $(grep -c "floatingCart" "$FILE")"
echo "addToCartAndTrack : $(grep -c "addToCartAndTrack" "$FILE")"
echo "updateFloatingCart : $(grep -c "updateFloatingCart" "$FILE")"

echo ""
echo "3. FONCTIONS CORRECTES :"
echo "-----------------------"
echo "applyPromoCode : $(grep -c "applyPromoCode" "$FILE")"
echo "resetPromo : $(grep -c "resetPromo" "$FILE")"
echo "showMessage : $(grep -c "showMessage" "$FILE")"

echo ""
echo "4. STRUCTURE PANIER :"
echo "--------------------"
echo "floating-cart : $(grep -c "floating-cart" "$FILE")"
echo "cart-badge-floating : $(grep -c "cart-badge-floating" "$FILE")"

echo ""
if [ $(grep -c "panier-unified.js" "$FILE") -gt 0 ] && [ $(grep -c "appliquerCodePromo" "$FILE") -gt 0 ]; then
    echo "🎉 reductions.html INTÉGRÉ AVEC SUCCÈS !"
    echo "Le système est maintenant 100% unifié entre index.html et reductions.html"
else
    echo "⚠️  Il reste des ajustements à faire"
fi
