#!/bin/bash
echo "🔧 CORRECTION DES RÉFÉRENCES DE FICHIERS"

# Vérifier que les fichiers existent dans le nouveau chemin
echo "📁 Vérification des fichiers dans js/secure/"
ls -la js/secure/

# Créer un fichier de corrections pour reductions.html
cat > fix-reductions-references.html << 'HTMLFIX'
<!-- CORRECTIONS POUR REDUCTIONS.HTML -->
<!-- REMPLACER CES LIGNES : -->
<script src="firebase-config.js"></script>
<script src="fix-firebase-complete.js"></script>
<script src="panier-unified.js"></script>
<script src="firebase-referral-system.js"></script>
<script src="panier-shared.js"></script>
<script src="fix-panier-simple.js"></script>

<!-- PAR CES LIGNES : -->
<script src="js/secure/firebase-config.js"></script>
<script src="js/secure/panier-shared.js"></script>
<!-- Les autres fichiers seront créés -->
HTMLFIX

echo "✅ Instructions de correction créées"
echo "📋 Ouvrez reductions.html et remplacez les balises script"
