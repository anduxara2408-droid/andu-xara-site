#!/bin/bash
echo "🔍 ANALYSE DE reductions.html"
echo "=============================="

FILE="reductions.html"

echo "1. Système panier actuel :"
echo "--------------------------"
echo "floatingCart : $(grep -c "floatingCart" "$FILE")"
echo "addToCartAndTrack : $(grep -c "addToCartAndTrack" "$FILE")"
echo "panier-unified.js : $(grep -c "panier-unified.js" "$FILE")"

echo ""
echo "2. Fonctions existantes :"
echo "-------------------------"
echo "applyPromoCode : $(grep -c "applyPromoCode" "$FILE")"
echo "validateAndApplyPromo : $(grep -c "validateAndApplyPromo" "$FILE")"

echo ""
echo "3. Structure du panier :"
echo "-----------------------"
echo "floating-cart : $(grep -c "floating-cart" "$FILE")"
echo "cart-badge-floating : $(grep -c "cart-badge-floating" "$FILE")"
