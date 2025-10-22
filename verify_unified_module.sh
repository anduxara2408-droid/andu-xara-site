#!/bin/bash
echo "🔍 VÉRIFICATION DU MODULE UNIFIÉ"
echo "================================"

FILE="panier-unified.js"

echo "1. Fonctions globales disponibles :"
echo "----------------------------------"
echo "ajouterAuPanier : $(grep -c "function ajouterAuPanier" "$FILE")"
echo "appliquerCodePromo : $(grep -c "function appliquerCodePromo" "$FILE")"
echo "retirerCodePromo : $(grep -c "function retirerCodePromo" "$FILE")"
echo "processerPaiement : $(grep -c "function processerPaiement" "$FILE")"

echo ""
echo "2. Variables globales :"
echo "----------------------"
echo "panierUnifie : $(grep -c "panierUnifie" "$FILE")"

echo ""
echo "3. Vérification des erreurs de syntaxe..."
# Vérifier les returns mal placés
if grep -n "return" "$FILE" | grep -v "function" | grep -v "//"; then
    echo "⚠️  Returns potentiellement problématiques trouvés :"
    grep -n "return" "$FILE" | grep -v "function" | grep -v "//"
else
    echo "✅ Aucun return problématique détecté"
fi
