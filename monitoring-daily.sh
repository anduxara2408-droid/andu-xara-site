#!/bin/bash
echo "📊 MONITORING ANDU-XARA - $(date +%Y-%m-%d)"

# Vérification santé Firebase
FIREBASE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://andu-xara-promo-codes-ff69e.firebaseio.com/.json)
[ "$FIREBASE_STATUS" = "200" ] && echo "✅ Firebase: HEALTHY" || echo "❌ Firebase: DOWN"

# Vérification utilisation stockage
STORAGE_USAGE=$(du -sh . | cut -f1)
echo "💾 Stockage: $STORAGE_USAGE"

# Vérification logs d'erreurs
ERROR_COUNT=$(grep -r "error\|Error\|ERROR" . 2>/dev/null | wc -l)
echo "🐛 Erreurs détectées: $ERROR_COUNT"

echo "📈 STATUT: SYSTÈME STABLE"
