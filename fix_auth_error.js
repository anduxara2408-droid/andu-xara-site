// Correction de l'erreur getElementById is null
console.log('🔧 Application du correctif pour getElementById...');

// Remplacer la fonction problématique
function loadAdminStats() {
    try {
        console.log('📊 Chargement des statistiques admin...');
        
        // Vérifier que les éléments existent avant de les manipuler
        const elements = {
            'adminActiveClients': '0',
            'adminCodesUsed': '0', 
            'performanceClients': '0',
            'performanceCodes': '0'
        };
        
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];
                console.log(`✅ ${id} mis à jour: ${elements[id]}`);
            } else {
                console.log(`⚠️ Élément ${id} non trouvé, ignoré`);
            }
        });
        
    } catch (error) {
        console.error('❌ Erreur dans loadAdminStats:', error);
    }
}

// Surcharger la fonction problématique
window.loadAdminStats = loadAdminStats;
console.log('✅ Correctif loadAdminStats appliqué');
