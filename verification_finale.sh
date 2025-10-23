#!/bin/bash
echo "🎯 VÉRIFICATION FINALE DU SYSTÈME"

echo "=== Vérification des méthodes dans AuthManager ==="
grep -n "async.*{" auth.js | grep -A1 -B1 "signUp\|genererLienParrainage\|detecterParrainage"

echo "=== Vérification de l'ordre des imports ==="
grep -n "firebase-config.js\|auth.js" reductions.html | head -5

echo "=== Vérification de la syntaxe ==="
node -c auth.js && echo "✅ Syntaxe auth.js OK" || echo "❌ Erreur syntaxe auth.js"

echo "=== Structure finale ==="
echo "Méthodes dans AuthManager:"
grep "async" auth.js | grep -v "//" | head -10

echo "🎯 VÉRIFICATION TERMINÉE - Système prêt !"
