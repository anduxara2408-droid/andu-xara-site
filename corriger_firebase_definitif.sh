#!/bin/bash

echo "🔧 Correction définitive de Firebase..."

# Créer une sauvegarde
cp reductions.html reductions_avant_firebase_fix.html

# Injecter la configuration Firebase directement dans le HTML
cat > firebase_fix.html << 'FIREBASEFIX'
<script>
// Configuration Firebase directe
const firebaseConfig = {
    apiKey: "AIzaSyC-OHtqpgOZI9AIb_WotYbiUS2L-Ac5vII",
    authDomain: "andu-xara-promo-codes-ff69e.firebaseapp.com",
    projectId: "andu-xara-promo-codes-ff69e",
    storageBucket: "andu-xara-promo-codes-ff69e.firebasestorage.app",
    messagingSenderId: "653516716143",
    appId: "1:653516716143:web:08ee1425191b4a1766359a"
};

// Initialiser Firebase immédiatement
if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    console.log("✅ Firebase initialisé avec succès");
}
</script>
FIREBASEFIX

# Insérer la config Firebase après les scripts Firebase
sed -i '/firebase-app-compat.js"><\/script>/r firebase_fix.html' reductions.html

# Supprimer la référence au fichier externe qui ne marche pas
sed -i '/firebase-config.js/d' reductions.html

# Nettoyer
rm firebase_fix.html

echo "✅ Firebase corrigé - Configuration injectée directement"
echo "🎯 La connexion devrait maintenant fonctionner"
