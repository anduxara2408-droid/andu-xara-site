#!/bin/bash
echo "🔧 CORRECTION DE L'ERREUR DANS panier-shared.js"
echo "=============================================="

FILE="panier-shared.js"

# Sauvegarde
cp "$FILE" "${FILE}.backup"

# Afficher la ligne problématique
echo "Ligne 127 et contexte :"
sed -n '120,135p' "$FILE"

# Corriger l'erreur de syntaxe (retirer un return mal placé)
sed -i '127s/return//' "$FILE"

echo "✅ Correction appliquée !"
echo "Nouvelle ligne 127 :"
sed -n '127p' "$FILE"
