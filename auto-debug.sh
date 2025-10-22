#!/bin/bash
echo "🐛 DIAGNOSTIC AUTOMATIQUE ANDU-XARA"

# 1. Vérifier les erreurs courantes
echo "🔍 Recherche des erreurs connues..."
grep -r "Uncaught ReferenceError" . 2>/dev/null || echo "✅ Aucune ReferenceError"
grep -r "Uncaught SyntaxError" . 2>/dev/null || echo "✅ Aucune SyntaxError"
grep -r "firebase is not defined" . 2>/dev/null || echo "✅ Firebase correctement défini"

# 2. Vérifier la structure des fichiers
echo "📁 Vérification structure..."
[ -f "firebase-config.js" ] && echo "✅ firebase-config.js présent" || echo "❌ firebase-config.js manquant"
[ -f "panier-shared.js" ] && echo "✅ panier-shared.js présent" || echo "❌ panier-shared.js manquant"
[ -f "fix-panier-simple.js" ] && echo "✅ Correctif panier présent" || echo "❌ Correctif panier manquant"

# 3. Vérifier l'intégration HTML
echo "🌐 Vérification intégration..."
grep -q "fix-panier-simple.js" reductions.html && echo "✅ Correctif intégré" || echo "❌ Correctif non intégré"
grep -q "firebase-config.js" reductions.html && echo "✅ Firebase intégré" || echo "❌ Firebase non intégré"

echo "🎯 RECOMMANDATIONS:"
echo "📋 Exécutez ./apply-final-fixes.sh pour les corrections restantes"
