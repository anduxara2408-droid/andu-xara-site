#!/bin/bash

FILE="reductions.html"

# Vérifier si les fonctions existent déjà
if ! grep -q "function showLoginModal" "$FILE"; then
    echo "🔧 Ajout des fonctions modales directement..."
    
    # Ajouter les fonctions dans une nouvelle balise script
    cat >> "$FILE" << 'HTMLCODE'

<script>
// Fonctions modales pour reductions.html
function showLoginModal() {
    console.log("Ouvrir modal connexion");
    // Essayer d'ouvrir la modal directement
    const event = new CustomEvent("openLoginModal");
    document.dispatchEvent(event);
    // Fallback : redirection vers index
    setTimeout(function() {
        window.location.href = "index.html";
    }, 100);
}

function showSignupModal() {
    console.log("Ouvrir modal inscription");
    // Essayer d'ouvrir la modal directement  
    const event = new CustomEvent("openSignupModal");
    document.dispatchEvent(event);
    // Fallback : redirection vers index
    setTimeout(function() {
        window.location.href = "index.html?register=true";
    }, 100);
}
</script>
HTMLCODE

    echo "✅ Fonctions modales ajoutées directement"
else
    echo "✅ Fonctions modales déjà présentes"
fi
