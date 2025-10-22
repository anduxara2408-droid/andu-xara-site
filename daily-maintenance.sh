#!/bin/bash
echo "🔧 MAINTENANCE QUOTIDIENNE ANDU-XARA - $(date)"

# 1. Vérifier l'état de Firebase
echo "🔥 Vérification Firebase..."
if curl -s https://andu-xara-promo-codes-ff69e.firebaseio.com/.json | grep -q "error"; then
    echo "❌ Problème Firebase détecté"
else
    echo "✅ Firebase opérationnel"
fi

# 2. Vérifier les données
echo "📊 Vérification des données..."
if [ -f "panier-shared.js" ]; then
    echo "✅ Système panier opérationnel"
else
    echo "❌ Panier nécessite attention"
fi

# 3. Nettoyage des logs
echo "🧹 Nettoyage des logs..."
find . -name "*.log" -mtime +7 -delete

echo "✅ Maintenance terminée"
