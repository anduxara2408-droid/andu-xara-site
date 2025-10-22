#!/bin/bash

echo "🔧 Diagnostic de la connexion panier-codes promo..."

# Vérifier la fonction calculateCartTotal
echo "📊 Analyse de calculateCartTotal:"
grep -A 15 "function calculateCartTotal" index.html

# Vérifier l'utilisation de promoDiscount
echo "🎯 Vérification promoDiscount:"
grep -n "promoDiscount" index.html | head -10

# Vérifier la mise à jour du panier
echo "🔄 Vérification updateFloatingCart:"
grep -A 10 "function updateFloatingCart" index.html | grep -E "promoDiscount|activePromoCode"

