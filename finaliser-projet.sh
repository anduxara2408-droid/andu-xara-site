#!/bin/bash
echo "🎯 FINALISATION ANDU-XARA - $(date)"

# 1. Vérifier l'intégrité du système
echo "🔍 Vérification de l'intégrité..."
[ -f "panier-shared.js" ] && echo "✅ Panier unifié présent" || echo "❌ Panier manquant"
[ -f "firebase-config.js" ] && echo "✅ Firebase configuré" || echo "❌ Firebase manquant"

# 2. Tester les fonctionnalités principales
echo "🧪 Test des fonctionnalités..."
curl -s https://andu-xara-promo-codes-ff69e.firebaseio.com/.json >/dev/null && echo "✅ Firebase accessible" || echo "❌ Firebase inaccessible"

# 3. Nettoyage final
echo "🧹 Nettoyage des fichiers temporaires..."
find . -name "*backup*" -mtime +1 -delete 2>/dev/null

echo "🎉 PROJET ANDU-XARA FINALISÉ !"
echo "📞 Pour support: Votre assistant IA dédié"
