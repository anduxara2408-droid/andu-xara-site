#!/bin/bash
echo "🔧 APPLICATION DES CORRECTIONS AUTOMATIQUES"

# 1. Créer une sauvegarde
cp reductions.html reductions-backup-$(date +%H%M%S).html

# 2. Appliquer les corrections avec sed
echo "📝 Correction des chemins dans reductions.html..."

# Remplacer les anciens chemins par les nouveaux
sed -i 's|src="firebase-config.js"|src="js/secure/firebase-config.js"|g' reductions.html
sed -i 's|src="panier-shared.js"|src="js/secure/panier-shared.js"|g' reductions.html
sed -i 's|src="panier-unified.js"|src="js/secure/panier-unified.js"|g' reductions.html
sed -i 's|src="firebase-referral-system.js"|src="js/secure/firebase-referral-system.js"|g' reductions.html

# Supprimer les références aux fichiers de correctifs obsolètes
sed -i '/fix-firebase-complete.js/d' reductions.html
sed -i '/fix-panier-simple.js/d' reductions.html

# 3. Ajouter les nouveaux systèmes sécurisés
echo "🚀 Ajout des nouveaux systèmes sécurisés..."

# Vérifier si la balise </body> existe
if grep -q "</body>" reductions.html; then
    # Ajouter avant </body>
    sed -i '/<\/body>/i\
<!-- SYSTÈMES SÉCURISÉS -->\
<script src="js/secure/user-manager.js"></script>\
<script src="js/secure/promo-system-secure.js"></script>\
<script src="js/secure/panier-secure.js"></script>' reductions.html
else
    # Ajouter à la fin du fichier
    echo '' >> reductions.html
    echo '<!-- SYSTÈMES SÉCURISÉS -->' >> reductions.html
    echo '<script src="js/secure/user-manager.js"></script>' >> reductions.html
    echo '<script src="js/secure/promo-system-secure.js"></script>' >> reductions.html
    echo '<script src="js/secure/panier-secure.js"></script>' >> reductions.html
fi

echo "✅ Corrections appliquées avec succès"
echo "📋 Vérification des modifications..."
grep -n "js/secure" reductions.html | head -10
