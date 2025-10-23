// ========================
// 🔧 CORRECTIF COMPLET - ERREUR getElementById NULL
// ========================

console.log('🚀 Application du correctif complet...');

// 1. Fonction sécurisée pour getElementById
function safeGetElement(id) {
    try {
        const element = document.getElementById(id);
        if (element && typeof element.textContent !== 'undefined') {
            return element;
        }
        console.warn(`⚠️ Élément ${id} non trouvé ou invalide`);
        return null;
    } catch (error) {
        console.error(`❌ Erreur avec ${id}:`, error);
        return null;
    }
}

// 2. Fonction sécurisée pour mettre à jour les éléments
function safeUpdateElement(id, value) {
    const element = safeGetElement(id);
    if (element) {
        element.textContent = value;
        console.log(`✅ ${id} → ${value}`);
        return true;
    }
    return false;
}

// 3. Remplacer la fonction loadAdminStats problématique
function loadAdminStats() {
    console.log('📊 loadAdminStats sécurisée appelée');
    
    try {
        // Mettre à jour uniquement les éléments qui existent
        safeUpdateElement('adminActiveClients', 'Chargement...');
        safeUpdateElement('adminCodesUsed', 'Chargement...');
        safeUpdateElement('performanceClients', '0');
        safeUpdateElement('performanceCodes', '0');
        
        console.log('✅ loadAdminStats terminée sans erreur');
        
    } catch (error) {
        console.error('❌ Erreur dans loadAdminStats:', error);
    }
}

// 4. Remplacer la fonction updateUI problématique
function updateUI(isLoggedIn) {
    console.log('👤 updateUI sécurisée appelée, statut:', isLoggedIn);
    
    try {
        // Mettre à jour uniquement les éléments qui existent
        const elements = {
            'loginBtn': { action: 'classList', method: 'add', value: 'hidden', condition: isLoggedIn },
            'loginBtn2': { action: 'classList', method: 'remove', value: 'hidden', condition: !isLoggedIn },
            'logoutBtn': { action: 'classList', method: 'remove', value: 'hidden', condition: isLoggedIn },
            'logoutBtn': { action: 'classList', method: 'add', value: 'hidden', condition: !isLoggedIn },
            'userInfo': { action: 'classList', method: 'remove', value: 'hidden', condition: isLoggedIn },
            'userInfo': { action: 'classList', method: 'add', value: 'hidden', condition: !isLoggedIn },
            'codesPromoSection': { action: 'classList', method: 'remove', value: 'hidden', condition: isLoggedIn },
            'codesPromoSection': { action: 'classList', method: 'add', value: 'hidden', condition: !isLoggedIn },
            'parrainageSection': { action: 'classList', method: 'remove', value: 'hidden', condition: isLoggedIn },
            'parrainageSection': { action: 'classList', method: 'add', value: 'hidden', condition: !isLoggedIn }
        };

        Object.keys(elements).forEach(id => {
            const element = safeGetElement(id);
            if (element) {
                const config = elements[id];
                if (config.condition) {
                    element[config.action][config.method](config.value);
                }
            }
        });

        // Mettre à jour le texte userInfo si connecté
        const userInfo = safeGetElement('userInfo');
        if (userInfo && isLoggedIn && authManager && authManager.user) {
            userInfo.textContent = authManager.user.email;
        }

        // Charger les stats admin si connecté
        if (isLoggedIn) {
            setTimeout(loadAdminStats, 1000);
        }
        
        console.log('✅ updateUI terminée sans erreur');
        
    } catch (error) {
        console.error('❌ Erreur dans updateUI:', error);
    }
}

// 5. Surcharger les fonctions problématiques
window.loadAdminStats = loadAdminStats;
window.updateUI = updateUI;
window.safeGetElement = safeGetElement;
window.safeUpdateElement = safeUpdateElement;

console.log('🎉 Correctif complet appliqué!');
console.log('📝 Fonctions disponibles: loadAdminStats, updateUI, safeGetElement, safeUpdateElement');
