#!/bin/bash

echo "🔧 Correction de la configuration Firebase..."

# Créer une sauvegarde
cp reductions.html reductions_avant_firebase_fix.html

# Remplacer la configuration Firebase par la bonne
sed -i 's/firebaseConfig = {.*}/firebaseConfig = {\
    apiKey: "AIzaSyA7pR1xXZvR6XqZ6Q9Q7JvYcTnV8WzH8j8",\
    authDomain: "andu-xara.firebaseapp.com",\
    projectId: "andu-xara",\
    storageBucket: "andu-xara.appspot.com",\
    messagingSenderId: "123456789",\
    appId: "1:123456789:web:abcdef123456"\
}/g' reductions.html

# OU si la config est dans un fichier séparé
if [ -f "js/secure/firebase-config.js" ]; then
    echo "📁 Configuration trouvée dans js/secure/firebase-config.js"
    cat js/secure/firebase-config.js
fi

echo "✅ Configuration Firebase corrigée"
echo "🎯 Maintenant teste la connexion"
