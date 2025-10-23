#!/bin/bash
echo "🔥 SUPPRESSION DÉFINITIVE DES DOUBLONS..."

# Faire un backup
cp reductions.html reductions.html.before_final_fix

# Méthode 1: Supprimer toutes les anciennes sections admin par pattern
echo "🗑️ Nettoyage des anciennes versions..."

# Supprimer les anciennes sections admin (version simple)
sed -i '/id="adminSection"/{n;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;N;/d}' reductions.html

# Méthode 2: Garder seulement la nouvelle section avec le design moderne
echo "🎨 Conservation de la nouvelle section uniquement..."

# Créer un fichier temporaire avec seulement la nouvelle section
grep -A 200 "bg-gradient-to-br from-purple-600" reductions.html > temp_new_section.html

# Trouver la fin de la nouvelle section
END_NEW=$(grep -n "</div>" temp_new_section.html | tail -1 | cut -d: -f1)

if [ -n "$END_NEW" ]; then
    # Extraire seulement la nouvelle section complète
    head -n $END_NEW temp_new_section.html > final_section.html
    
    # Remplacer tout le contenu entre <!-- Section Administration --> et la fin de la section
    python3 - << 'PYTHON_SCRIPT'
import re

with open('reductions.html', 'r') as f:
    content = f.read()

# Trouver le début de la section admin
start_pattern = r'<!-- Section Administration[^-]*-->'
match = re.search(start_pattern, content)

if match:
    start_index = match.start()
    
    # Trouver la fin de la section admin (prochaine section ou fin de div)
    # Chercher la prochaine section après admin
    next_sections = [
        content.find('<!-- Section Parrainage -->', start_index),
        content.find('<!-- Section Codes Promo -->', start_index),
        content.find('<!-- Section Newsletter -->', start_index),
        content.find('<footer', start_index),
        content.find('</main>', start_index)
    ]
    
    # Prendre la première occurrence valide
    end_index = None
    for pos in next_sections:
        if pos != -1:
            end_index = pos
            break
    
    if not end_index:
        # Fallback: chercher la fin de la div adminSection
        admin_div_end = content.find('</div></div></div>', start_index)
        if admin_div_end != -1:
            end_index = admin_div_end + 18  # Inclure les 3 </div>
    
    if start_index and end_index:
        # Lire la nouvelle section
        with open('final_section.html', 'r') as f:
            new_section = f.read()
        
        # Remplacer
        new_content = content[:start_index] + new_section + content[end_index:]
        
        with open('reductions.html', 'w') as f:
            f.write(new_content)
        print("✅ Remplacement réussi")
    else:
        print("❌ Impossible de trouver les limites")
else:
    print("❌ Section admin non trouvée")
PYTHON_SCRIPT
fi

# Nettoyer
rm -f temp_new_section.html final_section.html

echo "✅ Nettoyage terminé"
