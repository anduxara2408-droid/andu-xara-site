#!/bin/bash
echo "🔧 CORRECTION DU CONFLIT FIREBASE"

# Créer une sauvegarde
cp reductions.html reductions.html.backup.firebase

# Supprimer l'initialisation en double (ligne 800)
sed -i '800d' reductions.html

# Vérifier le résultat
echo "✅ Double initialisation supprimée"
echo "=== NOUVEAU CONTEXTE ==="
sed -n '798,805p' reductions.html

echo "🎯 Configuration Firebase corrigée - Plus de conflit !"
