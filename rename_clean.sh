#!/bin/bash

# Dossiers à nettoyer
for dir in images photos; do
  echo "Nettoyage dans $dir ..."
  cd "$dir" || exit 1

  for file in *; do
    # Nouveau nom : minuscules, espaces -> -, enlever parenthèses
    newname=$(echo "$file" | tr '[:upper:]' '[:lower:]' | sed -e 's/ /-/g' -e 's/(//g' -e 's/)//g')

    # Si le nom change
    if [ "$file" != "$newname" ]; then
      echo "Renommage : $file -> $newname"
      mv -i "$file" "$newname"
    fi
  done

  cd ..
done

echo "✅ Nettoyage terminé."
