#!/bin/bash
echo "🧹 NETTOYAGE PROFESSIONNEL DU SYSTÈME"

# Sauvegarde avant modifications
echo "📦 Création backup..."
tar -czf backup-pre-securisation-$(date +%Y%m%d_%H%M%S).tar.gz *.html *.js *.css 2>/dev/null

# Suppression des fichiers de correction obsolètes
echo "🗑️ Nettoyage des fichiers temporaires..."
rm -f backup_*.html fix-*.js *-simple.js *-safe.js

# Réorganisation des fichiers essentiels
echo "📁 Réorganisation structure..."
mkdir -p js/secure css/secure backup/old

# Déplacement des fichiers organisés
mv firebase-*.js js/secure/ 2>/dev/null || true
mv panier-*.js js/secure/ 2>/dev/null || true

echo "✅ Système nettoyé et organisé"
ls -la js/secure/
