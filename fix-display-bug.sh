#!/bin/bash

echo "🔧 CORRECTION AFFICHAGE RÉDUCTIONS"
echo "==================================="

echo "🔍 Recherche de l'utilisation de totals.discount..."

# Trouver updateFloatingCart
START_LINE=$(grep -n "function updateFloatingCart" index.html | cut -d: -f1)
echo "Ligne de updateFloatingCart: $START_LINE"

echo ""
echo "📝 Analyse de l'affichage des totaux:"
sed -n "$START_LINE,$((START_LINE+100))p" index.html | grep -E "totals\\.|totalElement" | head -15

echo ""
echo "🎯 Vérification spécifique de totals.discount:"
if grep -A 50 "function updateFloatingCart" index.html | grep -q "totals.discount"; then
    echo "✅ totals.discount est utilisé"
    echo "📋 Utilisations trouvées:"
    grep -A 50 "function updateFloatingCart" index.html | grep "totals.discount"
else
    echo "❌ totals.discount N'EST PAS UTILISÉ - Problème critique !"
fi

echo ""
echo "🔍 Vérification de l'affichage HTML des réductions:"
grep -A 10 "Réduction:" index.html

