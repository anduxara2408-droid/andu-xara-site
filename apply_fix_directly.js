// Coller ce code dans la console navigateur
(function() {
    console.log('🔧 Application du correctif direct...');
    
    // Fonction sécurisée
    function safeUpdateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            console.log('✅ ' + id + ' → ' + value);
            return true;
        }
        console.log('⚠️ ' + id + ' non trouvé');
        return false;
    }
    
    // Corriger loadAdminStats
    if (typeof loadAdminStats === 'function') {
        const originalLoadAdminStats = loadAdminStats;
        window.loadAdminStats = function() {
            console.log('🔧 loadAdminStats sécurisée');
            try {
                safeUpdateElement('adminActiveClients', 'Chargement...');
                safeUpdateElement('adminCodesUsed', 'Chargement...');
                safeUpdateElement('performanceClients', '0');
                safeUpdateElement('performanceCodes', '0');
            } catch (e) {
                console.error('Erreur capturée:', e);
            }
        };
        console.log('✅ loadAdminStats corrigée');
    }
    
    // Corriger updateUI
    if (typeof updateUI === 'function') {
        const originalUpdateUI = updateUI;
        window.updateUI = function(isLoggedIn) {
            console.log('🔧 updateUI sécurisée, statut:', isLoggedIn);
            try {
                return originalUpdateUI(isLoggedIn);
            } catch (e) {
                console.error('Erreur updateUI capturée:', e);
            }
        };
        console.log('✅ updateUI corrigée');
    }
    
    console.log('🎉 Correctif direct appliqué!');
})();
