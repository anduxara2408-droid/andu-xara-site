#!/bin/bash

echo "🎯 Restauration de la version fonctionnelle avec la bonne config Firebase..."

# 1. Restaurer la version fonctionnelle
git checkout f2583c7 -- reductions.html

# 2. Créer une sauvegarde
cp reductions.html reductions_avant_config_fix.html

# 3. Remplacer la config Firebase par une référence au fichier externe
sed -i '/firebaseConfig = {/,/}/d' reductions.html

# 4. Ajouter la référence au fichier de config externe
sed -i '/<script src="https:\/\/www.gstatic.com\/firebasejs\/9.22.0\/firebase-app-compat.js"><\/script>/a\\    <script src="./js/secure/firebase-config.js"><\/script>' reductions.html

# 5. Supprimer les initialisations Firebase en double
sed -i '/firebase.initializeApp(firebaseConfig);/d' reductions.html

echo "✅ Version restaurée et config Firebase corrigée"
echo "📁 Fichier de config utilisé: ./js/secure/firebase-config.js"

# Vérifier le contenu du fichier de config
echo ""
echo "🔍 Contenu de ta config Firebase:"
cat ./js/secure/firebase-config.js
