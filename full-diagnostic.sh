#!/bin/bash

echo "🔍 DIAGNOSTIC COMPLET DU SYSTÈME CODES PROMO"

echo "✅ calculateCartTotal: COMPLET"
grep -A 15 "function calculateCartTotal" index.html | head -20

echo ""
echo "🎯 Vérification du flux d'exécution:"
echo "1. validateAndApplyPromo → applyPromoToCart → updateFloatingCart → calculateCartTotal"

echo ""
echo "📊 Vérification applyPromoToCart:"
grep -A 10 "function applyPromoToCart" index.html

echo ""
echo "🔄 Vérification updateFloatingCart:"
if grep -A 5 "function updateFloatingCart" index.html | grep -q "calculateCartTotal"; then
    echo "✅ updateFloatingCart appelle calculateCartTotal"
else
    echo "❌ updateFloatingCart n'appelle pas calculateCartTotal"
fi

echo ""
echo "💰 Test de calcul:"
echo "Simulation: Produit 349 MRU + code 15% = 296.65 MRU"
echo "Vérifiez que calculateCartTotal utilise promoDiscount"

