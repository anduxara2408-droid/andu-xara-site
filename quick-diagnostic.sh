#!/bin/bash
echo "🔧 DIAGNOSTIC RAPIDE ANDU-XARA"

# Vérifications critiques
echo "1. Vérifications critiques:"
[ -f "firebase-config.js" ] && echo "✅ Firebase config présent" || echo "❌ Firebase config manquant"
[ -f "panier-shared.js" ] && echo "✅ Panier présent" || echo "❌ Panier manquant"

# Test connexion
echo "2. Test connexions:"
curl -s https://andu-xara-promo-codes-ff69e.firebaseio.com/.json >/dev/null && echo "✅ Firebase accessible" || echo "❌ Firebase inaccessible"

# Vérification données
echo "3. Vérification données:"
ls -la *.js | wc -l | xargs echo "✅ Fichiers JS:"
ls -la *.html | wc -l | xargs echo "✅ Pages HTML:"

echo "🎯 RECOMMANDATION:"
echo "📋 Exécutez ./finaliser-projet.sh si problèmes détectés"
