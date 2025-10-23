#!/bin/bash
echo "🎨 RÉAPPLICATION DU NOUVEAU DESIGN..."

# Backup de l'état actuel
cp reductions.html reductions.html.before_design_reapply

# Trouver où insérer le nouveau design
INSERT_LINE=$(grep -n "id=\"adminSection\"" reductions.html | head -1 | cut -d: -f1)

if [ -z "$INSERT_LINE" ]; then
    echo "❌ Section admin non trouvée pour l'insertion"
    exit 1
fi

echo "📍 Insertion à la ligne: $INSERT_LINE"

# Créer un nouveau fichier avec le design inséré
{
    # Lignes avant la section admin
    head -n $((INSERT_LINE - 1)) reductions.html
    
    # Nouveau design
    cat admin_section_new.html
    
    # Lignes après la section admin (supprimer l'ancienne)
    tail -n +$((INSERT_LINE + 1)) reductions.html | sed '/id="adminSection"/,/<\/div>.*<\/div>.*<\/div>/d'
} > reductions.html.new

mv reductions.html.new reductions.html

echo "✅ Nouveau design réappliqué"
