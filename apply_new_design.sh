#!/bin/bash
echo "🎨 APPLICATION DU NOUVEAU DESIGN ADMIN..."

# Backup de reductions.html
cp reductions.html reductions.html.before_design

# Trouver le début et la fin de l'ancienne section admin
START_LINE=$(grep -n "id=\"adminSection\"" reductions.html | head -1 | cut -d: -f1)
if [ -z "$START_LINE" ]; then
    echo "❌ Section admin non trouvée"
    exit 1
fi

# Trouver la fin de la section admin (prochaine section ou fin de div)
END_LINE=$(sed -n "$START_LINE,\$p" reductions.html | grep -n -m 1 "</div>" | head -1 | cut -d: -f1)
END_LINE=$((START_LINE + END_LINE - 1))

echo "📍 Ancienne section admin: lignes $START_LINE à $END_LINE"

# Créer un fichier temporaire avec le nouveau contenu
{
    # Lignes avant la section admin
    head -n $((START_LINE - 1)) reductions.html
    
    # Nouvelle section admin
    cat admin_section_new.html
    
    # Lignes après la section admin  
    tail -n +$((END_LINE + 1)) reductions.html
} > reductions.html.new

# Remplacer l'ancien fichier
mv reductions.html.new reductions.html

echo "✅ Nouveau design appliqué avec succès!"
echo "📁 Backup créé: reductions.html.before_design"
