#!/bin/bash

echo "🔍 INVESTIGATION APPROFONDIE"
echo "============================="

echo "🎯 Vérification de l'utilisation réelle de totals.discount:"
grep -n "totals.discount" index.html

echo ""
echo "📊 Vérification du contexte d'utilisation:"
grep -B 5 -A 5 "totals.discount" index.html

echo ""
echo "🔧 Vérification de la condition d'affichage:"
START_LINE=$(grep -n "function updateFloatingCart" index.html | cut -d: -f1)
echo "Ligne: $START_LINE"

echo ""
echo "📝 Code autour de totals.discount:"
sed -n "$((START_LINE+60)),$((START_LINE+90))p" index.html

echo ""
echo "🎯 TEST CRITIQUE: La condition promoDiscount > 0 est-elle vraie ?"
grep -B 10 -A 10 "promoDiscount > 0 && floatingCart.length > 0" index.html

