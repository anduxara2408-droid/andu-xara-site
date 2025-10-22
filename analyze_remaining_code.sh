#!/bin/bash
echo "🔍 Analyse détaillée du code restant..."

FILE="index.html"

echo "1. Fonction addToCartAndTrack complète :"
echo "----------------------------------------"
grep -n -A 20 "function addToCartAndTrack" "$FILE" | head -30

echo ""
echo "2. Contexte des appels floatingCart :"
echo "-------------------------------------"
grep -n -B 2 -A 2 "floatingCart" "$FILE" | head -20
