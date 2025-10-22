#!/bin/bash

echo "🔧 CORRECTION AUTOMATIQUE DES BUGS"
echo "==================================="

# Backup
cp index.html index.html.backup.bugfix

echo "🎯 PROBLÈME 1: applyPromoToCart n'appelle pas updateFloatingCart"
echo "🔍 Recherche de la fonction applyPromoToCart..."

# Trouver applyPromoToCart
START_LINE=$(grep -n "function applyPromoToCart" index.html | cut -d: -f1)
echo "Ligne: $START_LINE"

echo ""
echo "📝 Code actuel de applyPromoToCart:"
sed -n "$START_LINE,$((START_LINE+15))p" index.html

echo ""
echo "🎯 PROBLÈME 2: Affichage des réductions"
echo "🔍 Vérification de l'affichage dans updateFloatingCart..."

# Vérifier l'affichage
if grep -A 20 "function updateFloatingCart" index.html | grep -q "totals.discount"; then
    echo "✅ totals.discount est utilisé"
else
    echo "❌ totals.discount n'est pas utilisé"
fi

echo ""
echo "📋 CORRECTIONS À APPLIQUER:"
echo "1. Dans applyPromoToCart, AJOUTER: updateFloatingCart();"
echo "2. Vérifier que updateFloatingCart utilise totals.discount"

