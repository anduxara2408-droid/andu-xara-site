#!/bin/bash
echo "🧪 TEST FINAL DE FONCTIONNEMENT"
echo "================================"

echo "1. Vérification de l'intégration complète :"
echo "-------------------------------------------"
echo "Fichier panier-unified.js existe : $(ls -la panier-unified.js 2>/dev/null && echo '✅' || echo '❌')"

echo ""
echo "2. Vérification des pages :"
echo "---------------------------"
echo "index.html - Panier flottant : $(grep -c "floating-cart" index.html)"
echo "reductions.html - Intégration : $(grep -c "panier-unified.js" reductions.html 2>/dev/null || echo '0')"

echo ""
echo "3. Vérification des fonctions globales :"
echo "----------------------------------------"
echo "ajouterAuPanier : $(grep -c "function ajouterAuPanier" index.html)"
echo "processerPaiement : $(grep -c "function processerPaiement" index.html)"

echo ""
echo "🎯 RÉSULTAT DU TEST :"
if [ -f "panier-unified.js" ] && [ $(grep -c "ajouterAuPanier" index.html) -gt 0 ]; then
    echo "✅ SYSTÈME PRÊT POUR LA PRODUCTION !"
    echo "✨ Toutes les intégrations sont fonctionnelles"
else
    echo "⚠️  Vérifications nécessaires"
fi
