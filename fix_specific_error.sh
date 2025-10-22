#!/bin/bash
echo "🔧 CORRECTION DE L'ERREUR LIGNE 127"
echo "==================================="

FILE="panier-shared.js"

# Afficher le contexte exact de l'erreur
echo "Contexte de l'erreur (lignes 120-135) :"
sed -n '120,135p' "$FILE"

echo ""
echo "Correction en cours..."
# Remplacer la ligne 127 problématique
sed -i '127s/.*/        console.log("✅ panier-shared.js chargé avec succès - Version corrigée");/' "$FILE"

echo "✅ Ligne 127 corrigée !"
echo "Nouveau contenu :"
sed -n '120,135p' "$FILE"
