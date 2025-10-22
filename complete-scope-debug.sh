#!/bin/bash

echo "🔧 DEBUG COMPLET DE LA PORTÉE DES VARIABLES"
echo "==========================================="

echo "🎯 ANALYSE DE LA STRUCTURE DU SCRIPT:"

# Vérifier s'il y a plusieurs blocs script
echo "🔍 Nombre de blocs <script>:"
grep -c "<script>" index.html

echo ""
echo "🔍 Contenu du premier bloc script:"
grep -A 20 "<script>" index.html | head -25

echo ""
echo "🔍 Position exacte des variables dans le HTML:"
LINE=$(grep -n "let activePromoCode = null;" index.html | cut -d: -f1)
echo "Ligne HTML: $LINE"

echo ""
echo "🎯 VÉRIFICATION DES FERMETURES DE BLOCS:"
# Vérifier s'il y a des fonctions immédiatement invoquées
if grep -q "(function()" index.html || grep -q "function(){" index.html; then
    echo "⚠️  Il y a des fonctions auto-exécutées qui pourraient isoler les variables"
else
    echo "✅ Pas de fonctions auto-exécutées détectées"
fi

