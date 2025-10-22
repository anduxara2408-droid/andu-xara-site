#!/bin/bash

echo "🔧 Application de la correction panier..."

# Créer un backup
cp index.html index_backup_panier_fix.html

# Afficher la section à corriger
echo "📝 Section à corriger:"
grep -n "function calculateCartTotal" index.html

# Vérifier la structure actuelle
echo "🔍 Structure actuelle de calculateCartTotal:"
sed -n '/function calculateCartTotal() {/,/^    }/p' index.html

