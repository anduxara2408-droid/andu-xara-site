#!/bin/bash

echo "🎯 ÉTAPE 1: TEST DU SYSTÈME ACTUEL"
echo "==================================="

# Backup automatique
BACKUP="backup_etape1_$(date +%H%M%S).html"
cp index.html $BACKUP
echo "✅ Backup créé: $BACKUP"

# Test automatique des fonctions
echo "🧪 TEST AUTOMATIQUE DES FONCTIONS:"

FONCTIONS=("calculateCartTotal" "updateFloatingCart" "applyPromoToCart" "validateAndApplyPromo")
for fonction in "${FONCTIONS[@]}"; do
    if grep -q "function $fonction" index.html; then
        echo "✅ $fonction : PRÉSENTE"
    else
        echo "❌ $fonction : MANQUANTE"
    fi
done

echo ""
echo "🎯 TEST MANUEL À EFFECTUER MAINTENANT:"
echo "1. Ouvrir index.html"
echo "2. Ajouter un produit au panier"
echo "3. Tester le code: BIENVENUE15"
echo "4. Vérifier si la réduction s'affiche"
echo ""
echo "📝 RÉSULTAT DU TEST:"
echo "Si ça marche → Tapez 'OK' pour passer à l'étape 2"
echo "Si ça ne marche pas → Tapez 'BUG' pour debugger"

