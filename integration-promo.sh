#!/bin/bash

echo "🔄 Début de l'intégration automatique des codes promo..."

# Vérifier la structure des fichiers
if [ ! -f "index.html" ]; then
    echo "❌ index.html non trouvé"
    exit 1
fi

# Sauvegarde automatique
BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S).html"
cp index.html $BACKUP_NAME
echo "✅ Backup créé: $BACKUP_NAME"

# Extraction automatique des fonctions existantes
echo "📋 Extraction des fonctions codes promo..."
grep -n "validateAndApplyPromo\\|applyPromoToCart\\|removePromoFromCart" index.html | head -10

echo "🎯 Vérification de l'intégration panier..."
if grep -q "activePromoCode.*promoDiscount" index.html; then
    echo "✅ Système codes promo détecté"
else
    echo "❌ Problème d'intégration détecté"
fi

echo "📊 Test de la connexion panier..."
if grep -q "calculateCartTotal.*promoDiscount" index.html; then
    echo "✅ Connexion panier OK"
else
    echo "⚠️  Vérifier la connexion panier"
fi

echo "🎉 Intégration analysée avec succès!"
echo "📝 Prochaines étapes:"
echo "1. Tester l'application d'un code promo"
echo "2. Vérifier le calcul des réductions"
echo "3. Confirmer la persistance entre pages"
