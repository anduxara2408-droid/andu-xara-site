#!/bin/bash

FILE="reductions.html"

# Vérifier si les fonctions existent déjà
if ! grep -q "function showLoginModal" "$FILE"; then
    echo "🔧 Ajout des fonctions modales directement..."
    
    # Trouver la fin de la balise script existante ou ajouter une nouvelle
    SCRIPT_END=$(grep -n "</script>" "$FILE" | tail -1 | cut -d: -f1)
    
    if [ -z "$SCRIPT_END" ]; then
        # Ajouter une nouvelle balise script avant </body>
        BODY_END=$(grep -n "</body>" "$FILE" | tail -1 | cut -d: -f1)
        sed -i "${BODY_END}i <script>" "$FILE"
        sed -i "${BODY_END}i </script>" "$FILE"
        SCRIPT_END=$((BODY_END-1))
    fi
    
    # Ajouter les fonctions avant </script>
    FUNCTIONS_CODE='// Fonctions modales pour reductions.html
function showLoginModal() {
    console.log("Ouvrir modal connexion");
    // Essayer d\\'ouvrir la modal directement
    const event = new CustomEvent("openLoginModal");
    document.dispatchEvent(event);
    // Fallback : redirection vers index
    setTimeout(() => {
        window.location.href = "index.html";
    }, 100);
}

function showSignupModal() {
    console.log("Ouvrir modal inscription");
    // Essayer d\\'ouvrir la modal directement  
    const event = new CustomEvent("openSignupModal");
    document.dispatchEvent(event);
    // Fallback : redirection vers index
    setTimeout(() => {
        window.location.href = "index.html?register=true";
    }, 100);
}'
    
    # Insérer le code
    sed -i "${SCRIPT_END}i ${FUNCTIONS_CODE}" "$FILE"
    echo "✅ Fonctions modales ajoutées directement"
else
    echo "✅ Fonctions modales déjà présentes"
fi
