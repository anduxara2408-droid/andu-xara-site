#!/bin/bash
echo "🗑️ SUPPRESSION DE L'ANCIENNE SECTION ADMIN..."

# Trouver le début de l'ancienne section (version simple)
OLD_START=$(grep -n "Administration" reductions.html | grep -v "bg-gradient" | head -1 | cut -d: -f1)
if [ -z "$OLD_START" ]; then
    echo "❌ Ancienne section non trouvée"
    exit 1
fi

# Trouver la fin de l'ancienne section (recherche de la div fermante)
OLD_END=$(sed -n "$OLD_START,\$p" reductions.html | grep -n -m 1 "</div></div></div>" | head -1 | cut -d: -f1)
if [ -n "$OLD_END" ]; then
    OLD_END=$((OLD_START + OLD_END - 1 + 2)) # +2 pour inclure les 3 div fermantes
else
    # Fallback: chercher une séquence de div fermantes
    OLD_END=$(sed -n "$OLD_START,\$p" reductions.html | grep -n -m 3 "</div>" | tail -1 | cut -d: -f1)
    OLD_END=$((OLD_START + OLD_END - 1))
fi

echo "📍 Ancienne section: lignes $OLD_START à $OLD_END"

if [ -n "$OLD_START" ] && [ -n "$OLD_END" ] && [ "$OLD_START" -lt "$OLD_END" ]; then
    # Créer un nouveau fichier sans l'ancienne section
    {
        head -n $((OLD_START - 1)) reductions.html
        tail -n +$((OLD_END + 1)) reductions.html
    } > reductions.html.fixed
    
    mv reductions.html.fixed reductions.html
    echo "✅ Ancienne section supprimée"
else
    echo "⚠️ Impossible de déterminer les limites de l'ancienne section"
fi
