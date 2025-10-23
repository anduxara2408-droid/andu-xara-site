#!/bin/bash

FILE="reductions.html"

# Remplacer les appels aux fonctions manquantes par des redirections simples
sed -i 's/onclick="showLoginModal()"/onclick="window.location.href='"'"'index.html'"'"'"/g' "$FILE"
sed -i 's/onclick="showSignupModal()"/onclick="window.location.href='"'"'index.html?register=true'"'"'"/g' "$FILE"

echo "✅ Boutons de connexion corrigés"
