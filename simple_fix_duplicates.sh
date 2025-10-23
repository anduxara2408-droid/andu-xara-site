#!/bin/bash
echo "🔧 CORRECTION SIMPLIFIÉE DES DOUBLONS..."

# Backup
cp reductions.html reductions.html.backup_simple_fix

# Compter les occurrences avant
echo "📊 AVANT correction:"
for id in adminActiveClients adminCodesUsed performanceClients performanceCodes; do
    count=$(grep -c "id=\"$id\"" reductions.html)
    echo "   $id: $count"
done

# Méthode: Garder seulement la PREMIÈRE occurrence de chaque ID
echo "🎯 Garder seulement les premières occurrences..."

# Créer un fichier temporaire
cp reductions.html reductions.temp

# Pour chaque ID problématique, supprimer les doublons
for id in adminActiveClients adminCodesUsed performanceClients performanceCodes; do
    echo "🔧 Traitement de $id..."
    
    # Compter le nombre d'occurrences
    count=$(grep -c "id=\"$id\"" reductions.temp)
    
    if [ "$count" -gt 1 ]; then
        echo "   🗑️ Suppression des $((count - 1)) doublons de $id"
        
        # Garder seulement la première occurrence
        awk -v id="$id" '
        /id="'$id'"/ {
            if (!found[id]) {
                found[id] = 1
                print
            } else {
                # Remplacer le doublon par un commentaire
                print "<!-- DOUBLON SUPPRIMÉ: " id " -->"
            }
            next
        }
        { print }
        ' reductions.temp > reductions.temp2
        
        mv reductions.temp2 reductions.temp
    fi
done

# Remplacer le fichier original
mv reductions.temp reductions.html

echo "✅ Correction simplifiée appliquée"
