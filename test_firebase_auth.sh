#!/bin/bash
echo "🧪 TEST COMPLET FIREBASE AUTHENTIFICATION"

echo "=== Configuration actuelle ==="
echo "Projet Firebase:" $(grep "projectId" firebase-config.js | cut -d'"' -f4)
echo "Auth Domain:" $(grep "authDomain" firebase-config.js | cut -d'"' -f4)

echo "=== Vérification structure ==="
echo "Initialisations Firebase:" $(grep -c "firebase.initializeApp" reductions.html)
echo "Import firebase-config.js:" $(grep -c "firebase-config.js" reductions.html)

echo "=== Instructions de test ==="
cat << 'TESTINSTRUCTIONS'
🎯 POUR TESTER :

1. Ouvrez reductions.html dans votre navigateur
2. Ouvrez la Console (F12 > Console)
3. Vérifiez ces messages :
   - ✅ "Firebase initialisé pour Andu Xara"
   - ❌ AUCUNE erreur "api-key-not-valid"

4. Testez la connexion :
   - Cliquez sur "Se connecter"
   - Entrez un email et mot de passe
   - Ça devrait fonctionner sans erreur

5. Si erreur persistante :
   - Vérifiez que le projet Firebase est le BON :
     andu-xara-online-counter
   - Activez Authentication dans Firebase Console
TESTINSTRUCTIONS

echo ""
echo "🔗 URL Firebase Console: https://console.firebase.google.com/project/andu-xara-online-counter/authentication"
