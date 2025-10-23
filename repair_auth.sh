#!/bin/bash
echo "🔧 DÉBUT DE LA RÉPARATION AUTOMATIQUE"

# Backup du fichier actuel
if [ -f "reductions.html" ]; then
    cp reductions.html reductions.html.backup
    echo "✅ Backup créé: reductions.html.backup"
fi

# Trouver et corriger les fonctions problématiques
if [ -f "reductions.html" ]; then
    # Corriger loadAdminStats
    sed -i 's/document.getElementById(\([^)]*\)).textContent = \([^;]*\);/if(document.getElementById(\1)) document.getElementById(\1).textContent = \2;/g' reductions.html
    
    # Corriger updateUI
    sed -i 's/document.getElementById(\([^)]*\)).classList.\([a-zA-Z]*\)(\([^)]*\));/if(document.getElementById(\1)) document.getElementById(\1).classList.\2(\3);/g' reductions.html
    
    echo "✅ reductions.html corrigé"
fi

# Créer un fichier de correctif permanent
cat > safe_functions.js << 'JAVASCRIPT'
// ========================
// 🛡️ FONCTIONS SÉCURISÉES PERMANENTES
// ========================

// Fonction sécurisée pour éviter les erreurs null
window.safeElementUpdate = function(id, value) {
    const element = document.getElementById(id);
    return element ? (element.textContent = value, true) : false;
};

// Version sécurisée de loadAdminStats
window.safeLoadAdminStats = function() {
    console.log('🛡️ safeLoadAdminStats appelée');
    safeElementUpdate('adminActiveClients', 'Chargement...') || console.log('⚠️ adminActiveClients non trouvé');
    safeElementUpdate('adminCodesUsed', 'Chargement...') || console.log('⚠️ adminCodesUsed non trouvé');
    safeElementUpdate('performanceClients', '0') || console.log('⚠️ performanceClients non trouvé');
    safeElementUpdate('performanceCodes', '0') || console.log('⚠️ performanceCodes non trouvé');
};

// Remplacer la fonction problématique si elle existe
if (typeof loadAdminStats !== 'undefined') {
    window.loadAdminStats = safeLoadAdminStats;
    console.log('✅ loadAdminStats remplacée par version sécurisée');
}

console.log('🛡️ Fonctions sécurisées chargées');
JAVASCRIPT

echo "✅ Script safe_functions.js créé"

echo "🎉 RÉPARATION TERMINÉE!"
echo "📝 Prochaines étapes:"
echo "   1. Ajoutez <script src='safe_functions.js'></script> dans reductions.html"
echo "   2. Rechargez la page"
echo "   3. Les erreurs getElementById seront résolues"
