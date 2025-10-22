#!/bin/bash

echo "🎯 LOCALISATION EXACTE DU PROBLÈME"

# Trouver updateFloatingCart
START_LINE=$(grep -n "function updateFloatingCart" index.html | cut -d: -f1)
echo "Ligne de updateFloatingCart: $START_LINE"

echo ""
echo "📝 Code actuel de updateFloatingCart (extrait):"
sed -n "$START_LINE,$((START_LINE+30))p" index.html | grep -n ""

echo ""
echo "🔍 Recherche de la partie calcul des totaux:"
sed -n "$START_LINE,$((START_LINE+50))p" index.html | grep -E "total|calculate|discount" | head -10

