#!/bin/bash

echo "🔍 Vérification de la configuration Firebase..."

# Vérifier que la config est bien dans le HTML
if grep -q "AIzaSyC-OHtqpgOZI9AIb_WotYbiUS2L-Ac5vII" reductions.html; then
    echo "✅ Configuration Firebase trouvée dans le HTML"
else
    echo "❌ Configuration Firebase NON trouvée"
fi

# Vérifier l'initialisation
if grep -q "firebase.initializeApp" reductions.html; then
    echo "✅ Initialisation Firebase trouvée"
else
    echo "❌ Initialisation Firebase NON trouvée"
fi

echo ""
echo "📊 Résumé de la configuration:"
grep -A 5 "firebaseConfig" reductions.html | head -10
