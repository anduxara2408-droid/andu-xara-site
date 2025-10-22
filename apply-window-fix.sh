#!/bin/bash

echo "🔧 APPLICATION DE LA CORRECTION WINDOW"
echo "======================================"

# Backup
cp index.html index.html.backup.window

echo "🎯 Recherche des lignes à corriger..."
grep -n "let activePromoCode = null;\\|let promoDiscount = 0;" index.html

echo ""
echo "📝 Application de la correction..."
# Créer une version corrigée
sed -i 's/let activePromoCode = null;/window.activePromoCode = null;/g' index.html
sed -i 's/let promoDiscount = 0;/window.promoDiscount = 0;/g' index.html

echo "✅ Correction appliquée !"
echo ""
echo "🔍 Vérification:"
grep -n "window.activePromoCode\\|window.promoDiscount" index.html

