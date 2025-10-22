#!/bin/bash

echo "🐛 DEBUG AUTOMATIQUE DU BUG CODES PROMO"
echo "========================================"

echo "🔍 Recherche des problèmes potentiels..."

# 1. Vérifier si applyPromoToCart est bien appelé
echo ""
echo "✅ Vérification applyPromoToCart:"
if grep -A 5 "function applyPromoToCart" index.html | grep -q "updateFloatingCart"; then
    echo "✅ applyPromoToCart appelle updateFloatingCart"
else
    echo "❌ applyPromoToCart n'appelle pas updateFloatingCart"
fi

# 2. Vérifier la validation des codes
echo ""
echo "✅ Vérification validateAndApplyPromo:"
grep -A 10 "async function validateAndApplyPromo" index.html | head -12

# 3. Vérifier les codes valides
echo ""
echo "✅ Codes promo valides configurés:"
grep -A 10 "simulatePromoValidation" index.html | grep -E "BIENVENUE15|ANDU2025|SOLDE30"

# 4. Vérifier l'affichage des réductions
echo ""
echo "✅ Vérification affichage réductions:"
if grep -A 5 "promoDiscount > 0" index.html | grep -q "totals.discount"; then
    echo "✅ L'affichage des réductions est configuré"
else
    echo "❌ Problème d'affichage des réductions"
fi

