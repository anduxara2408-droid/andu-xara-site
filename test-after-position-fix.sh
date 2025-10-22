#!/bin/bash

echo "🧪 TEST APRÈS CORRECTION POSITION"
echo "================================"

echo "✅ Vérification nouvelle position:"
if grep -B 2 "let activePromoCode = null;" index.html | grep -q "let floatingCart"; then
    echo "🎉 VARIABLES AU BON ENDROIT !"
    echo "Nouvelle position:"
    grep -B 2 -A 2 "let activePromoCode = null;" index.html
else
    echo "❌ Variables pas au bon endroit"
    echo "Position actuelle:"
    grep -B 5 -A 2 "let activePromoCode = null;" index.html
fi

echo ""
echo "🎯 TEST MANUEL:"
echo "1. Rechargez COMPLÈTEMENT la page (Ctrl+F5)"
echo "2. Dans la console, testez:"
echo "   console.log('promoDiscount:', promoDiscount);"
echo "3. Ça devrait maintenant afficher: promoDiscount: 0"
echo "4. Testez: applyPromoToCart('BIENVENUE15', 15);"
echo "5. Vérifiez le panier"

