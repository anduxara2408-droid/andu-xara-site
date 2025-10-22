#!/bin/bash
echo "🧹 Suppression précise de la fonction addToCartAndTrack..."

FILE="index.html"

# Trouver les numéros de ligne de début et fin de la fonction
START_LINE=$(grep -n "function addToCartAndTrack(productName, category, price)" "$FILE" | cut -d: -f1)
if [ -n "$START_LINE" ]; then
    # Trouver la fin de la fonction (ligne avec juste })
    END_LINE=$(awk -v start="$START_LINE" 'NR >= start && /^}$/ {print NR; exit}' "$FILE")
    
    if [ -n "$END_LINE" ]; then
        echo "Suppression des lignes $START_LINE à $END_LINE"
        sed -i "${START_LINE},${END_LINE}d" "$FILE"
        echo "✅ Fonction addToCartAndTrack supprimée !"
    else
        echo "❌ Impossible de trouver la fin de la fonction"
    fi
else
    echo "❌ Fonction addToCartAndTrack non trouvée"
fi
