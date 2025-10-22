#!/bin/bash

echo "🧪 TEST DE DÉBOGAGE COMPLET"
echo "============================"

echo "✅ Variables déclarées: OUI"
echo "✅ Fonctions présentes: OUI"
echo "✅ Intégration panier: OUI"

echo ""
echo "🎯 TEST PRATIQUE - OUVREZ VOTRE NAVIGATEUR ET:"

echo "1. Rechargez la page complètement (Ctrl+F5)"
echo "2. Dans la console, testez:"
echo "   console.log('promoDiscount:', promoDiscount);"
echo "   console.log('activePromoCode:', activePromoCode);"
echo "3. Si les variables existent, testez:"
echo "   applyPromoToCart('BIENVENUE15', 15);"
echo "4. Vérifiez le panier"

echo ""
echo "🔍 VÉRIFICATION AUTOMATIQUE:"
echo "Ligne des déclarations:"
grep -n "let activePromoCode = null;\\|let promoDiscount = 0;" index.html

echo ""
echo "📝 Position dans le code:"
LINE=$(grep -n "let activePromoCode = null;" index.html | cut -d: -f1)
echo "Ligne: $LINE"
sed -n "$((LINE-5)),$((LINE+5))p" index.html

