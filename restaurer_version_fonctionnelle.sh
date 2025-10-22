#!/bin/bash

echo "🎯 RESTAURATION DE LA VERSION FONCTIONNELLE"

# URLs des versions potentielles
VERSION_FONCTIONNELLE="https://raw.githubusercontent.com/ton-repo/andu-xara/main/reductions.html"

# Télécharger la version fonctionnelle
echo "📥 Téléchargement de la version fonctionnelle..."
curl -s -o reductions_fonctionnelle.html "$VERSION_FONCTIONNELLE"

if [ -f "reductions_fonctionnelle.html" ]; then
    # Sauvegarder l'actuelle
    cp reductions.html reductions_backup_avant_restauration.html
    
    # Remplacer par la fonctionnelle
    cp reductions_fonctionnelle.html reductions.html
    
    echo "✅ Version fonctionnelle restaurée !"
    echo "📁 Backup créé: reductions_backup_avant_restauration.html"
else
    echo "❌ Impossible de télécharger la version fonctionnelle"
    echo "🔧 Tentative de réparation automatique..."
    
    # Réparer le fichier actuel
    sed -i 's/firebase-app-compat.js/firebase-app-compat.js"/g' reductions.html 2>/dev/null
    sed -i 's/firebase-firestore-compat.js/firebase-firestore-compat.js"/g' reductions.html 2>/dev/null
    
    echo "🔄 Réparations appliquées, vérifiez le fichier"
fi
