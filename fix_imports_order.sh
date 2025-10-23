#!/bin/bash
echo "🔧 Correction de l'ordre des imports dans reductions.html"

# Créer une sauvegarde
cp reductions.html reductions.html.backup.imports

# Corriger l'ordre des imports - firebase-config.js DOIT être avant auth.js
sed -i '804,805d' reductions.html
sed -i '803a\
    <script src="firebase-config.js"></script>\
    <script src="auth.js"></script>' reductions.html

echo "✅ Ordre des imports corrigé"
