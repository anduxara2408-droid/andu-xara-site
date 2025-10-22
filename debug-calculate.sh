#!/bin/bash

echo "🔍 Debug de calculateCartTotal complet:"
grep -n "function calculateCartTotal" index.html
LINE=$(grep -n "function calculateCartTotal" index.html | cut -d: -f1)
echo "Ligne de départ: $LINE"

# Afficher 25 lignes après la fonction
echo "📝 Contenu complet de la fonction:"
sed -n "$LINE,$((LINE+25))p" index.html

