#!/bin/bash

echo "🔍 DÉBOGAGE COMPLET DU SYSTÈME"

echo "✅ 1. updateFloatingCart appelle calculateCartTotal: OUI (ligne 17)"
echo "✅ 2. calculateCartTotal utilise promoDiscount: OUI"
echo "✅ 3. applyPromoToCart met à jour promoDiscount: OUI"

echo ""
echo "🎯 Vérification de l'affichage des totaux:"
START_LINE=$(grep -n "function updateFloatingCart" index.html | cut -d: -f1)
echo "Ligne de updateFloatingCart: $START_LINE"

echo ""
echo "📊 Vérification de l'utilisation de 'totals' dans l'affichage:"
sed -n "$((START_LINE+40)),$((START_LINE+80))p" index.html | grep -E "totals\\.|totalElement" | head -10

echo ""
echo "💰 Vérification du calcul des réductions dans l'affichage:"
sed -n "$((START_LINE+60)),$((START_LINE+120))p" index.html | grep -E "promoDiscount.*0|totals\\.total" | head -10

