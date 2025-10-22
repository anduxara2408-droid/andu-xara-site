#!/bin/bash

echo "🔧 CORRECTION DES VARIABLES GLOBALES"
echo "===================================="

# Backup
cp index.html index.html.backup.variables

echo "🎯 RECHERCHE DES DÉCLARATIONS DE VARIABLES GLOBALES:"

# Vérifier où sont déclarées les variables
echo "🔍 Recherche de promoDiscount:"
grep -n "promoDiscount" index.html | head -10

echo ""
echo "🔍 Recherche de activePromoCode:"
grep -n "activePromoCode" index.html | head -10

echo ""
echo "🎯 VÉRIFICATION DES DÉCLARATIONS LET:"
if grep -q "let.*promoDiscount" index.html; then
    echo "✅ promoDiscount est déclaré avec let"
    grep "let.*promoDiscount" index.html
else
    echo "❌ promoDiscount N'EST PAS DÉCLARÉ !"
fi

if grep -q "let.*activePromoCode" index.html; then
    echo "✅ activePromoCode est déclaré avec let"
    grep "let.*activePromoCode" index.html
else
    echo "❌ activePromoCode N'EST PAS DÉCLARÉ !"
fi

echo ""
echo "📋 CORRECTION À APPLIQUER:"
echo "AJOUTER ces déclarations en variables globales:"
echo "let activePromoCode = null;"
echo "let promoDiscount = 0;"

