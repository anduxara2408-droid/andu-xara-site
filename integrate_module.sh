#!/bin/bash
echo "🔧 INTÉGRATION DU MODULE UNIFIÉ"
echo "================================"

FILE="reductions.html"

# Sauvegarde
cp "$FILE" "${FILE}.backup"

# Ajouter l'import après firebase-config.js
if ! grep -q "panier-unified.js" "$FILE"; then
    sed -i '/firebase-config.js/a\\    <script src="panier-unified.js"></script>' "$FILE"
    echo "✅ Import de panier-unified.js ajouté"
else
    echo "✅ Import déjà présent"
fi

# Vérification
echo "🔍 Vérification :"
grep -n "panier-unified.js" "$FILE"
