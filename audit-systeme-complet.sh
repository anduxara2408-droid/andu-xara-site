#!/bin/bash
echo "🔍 AUDIT PROFESSIONNEL ANDU-XARA - $(date)"

echo "📁 STRUCTURE DES FICHIERS:"
find . -name "*.html" -o -name "*.js" -o -name "*.css" | grep -v node_modules | sort

echo ""
echo "🔥 CONFIGURATION FIREBASE:"
[ -f "firebase-config.js" ] && echo "✅ firebase-config.js présent" || echo "❌ firebase-config.js manquant"
[ -f "panier-shared.js" ] && echo "✅ panier-shared.js présent" || echo "❌ panier-shared.js manquant"

echo ""
echo "🎫 SYSTÈME CODES PROMO:"
grep -r "promoCode\|promocode" *.js *.html 2>/dev/null | wc -l | xargs echo "Références codes promo:"

echo ""
echo "👤 GESTION UTILISATEURS:"
grep -r "auth\|user\|utilisateur" *.js *.html 2>/dev/null | wc -l | xargs echo "Références utilisateurs:"

echo "📊 AUDIT TERMINÉ"
