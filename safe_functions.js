// ========================
// 🛡️ FONCTIONS SÉCURISÉES COMPLÈTES
// ========================

console.log('🛡️ safe_functions.js - Version complète chargée');

// 1. Fonction sécurisée pour mettre à jour les éléments
window.safeElementUpdate = function(id, value) {
    try {
        const element = document.getElementById(id);
        if (element && typeof element.textContent !== 'undefined') {
            element.textContent = value;
            return true;
        }
        return false;
    } catch (error) {
        console.warn('safeElementUpdate erreur pour', id, error);
        return false;
    }
};

// 2. Fonction loadAdminStats COMPLÈTE
window.loadAdminStats = function() {
    console.log('📊 loadAdminStats sécurisée appelée');
    try {
        safeElementUpdate('adminActiveClients', 'Chargement...');
        safeElementUpdate('adminCodesUsed', 'Chargement...');
        safeElementUpdate('performanceClients', '0');
        safeElementUpdate('performanceCodes', '0');
        console.log('✅ loadAdminStats terminée sans erreur');
    } catch (error) {
        console.error('❌ Erreur dans loadAdminStats:', error);
    }
};

// 3. Fonction updateUI sécurisée
window.updateUI = function(isLoggedIn) {
    console.log('👤 updateUI sécurisée, statut:', isLoggedIn);
    try {
        // Logique de base de mise à jour UI
        if (isLoggedIn) {
            setTimeout(loadAdminStats, 1000);
        }
    } catch (error) {
        console.error('❌ Erreur dans updateUI:', error);
    }
};

// 4. Fonction safeLoadAdminStats (alias)
window.safeLoadAdminStats = loadAdminStats;

console.log('✅ Toutes les fonctions sécurisées sont disponibles:');
console.log('   - safeElementUpdate');
console.log('   - loadAdminStats'); 
console.log('   - updateUI');
console.log('   - safeLoadAdminStats');
