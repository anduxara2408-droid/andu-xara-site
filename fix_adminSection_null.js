// ========================
// 🔧 CORRECTIF URGENT - adminSection is null
// ========================

console.log('🔧 Correctif adminSection null chargé');

// Surcharger la fonction updateUI problématique
if (typeof updateUI !== 'undefined') {
    // Sauvegarder l'ancienne fonction
    const originalUpdateUI = updateUI;
    
    // Nouvelle version sécurisée
    window.updateUI = function(isLoggedIn) {
        console.log('🔄 updateUI sécurisée appelée, statut:', isLoggedIn);
        
        try {
            // Vérifier que adminSection existe avant de l'utiliser
            const adminSection = document.getElementById('adminSection');
            
            if (!adminSection) {
                console.log('⚠️ adminSection non trouvée, attente du chargement...');
                // Réessayer après un délai
                setTimeout(() => {
                    updateUI(isLoggedIn);
                }, 500);
                return;
            }
            
            // Logique de mise à jour sécurisée
            const elementsToUpdate = [
                { id: 'loginBtn', action: 'add', class: 'hidden', condition: isLoggedIn },
                { id: 'loginBtn', action: 'remove', class: 'hidden', condition: !isLoggedIn },
                { id: 'logoutBtn', action: 'remove', class: 'hidden', condition: isLoggedIn },
                { id: 'logoutBtn', action: 'add', class: 'hidden', condition: !isLoggedIn },
                { id: 'userInfo', action: 'remove', class: 'hidden', condition: isLoggedIn },
                { id: 'userInfo', action: 'add', class: 'hidden', condition: !isLoggedIn },
                { id: 'codesPromoSection', action: 'remove', class: 'hidden', condition: isLoggedIn },
                { id: 'codesPromoSection', action: 'add', class: 'hidden', condition: !isLoggedIn },
                { id: 'parrainageSection', action: 'remove', class: 'hidden', condition: isLoggedIn },
                { id: 'parrainageSection', action: 'add', class: 'hidden', condition: !isLoggedIn },
                { id: 'adminSection', action: 'remove', class: 'hidden', condition: isLoggedIn },
                { id: 'adminSection', action: 'add', class: 'hidden', condition: !isLoggedIn }
            ];
            
            elementsToUpdate.forEach(item => {
                if (item.condition) {
                    const element = document.getElementById(item.id);
                    if (element) {
                        element.classList[item.action](item.class);
                    }
                }
            });
            
            // Mettre à jour le texte userInfo
            const userInfo = document.getElementById('userInfo');
            if (userInfo && isLoggedIn && window.authManager && window.authManager.user) {
                userInfo.textContent = window.authManager.user.email;
            }
            
            // Charger les stats admin si connecté
            if (isLoggedIn) {
                setTimeout(() => {
                    if (typeof loadAdminStats === 'function') {
                        loadAdminStats();
                    }
                }, 1000);
            }
            
            console.log('✅ updateUI terminée sans erreur');
            
        } catch (error) {
            console.error('❌ Erreur dans updateUI:', error);
        }
    };
    
    console.log('✅ updateUI sécurisée installée');
}

// Fonction pour vérifier et attendre adminSection
window.waitForAdminSection = function(callback, maxAttempts = 10) {
    let attempts = 0;
    
    function check() {
        attempts++;
        const adminSection = document.getElementById('adminSection');
        
        if (adminSection) {
            console.log('✅ adminSection trouvée après', attempts, 'tentatives');
            if (callback) callback(adminSection);
        } else if (attempts < maxAttempts) {
            setTimeout(check, 200);
        } else {
            console.warn('⚠️ adminSection non trouvée après', maxAttempts, 'tentatives');
        }
    }
    
    check();
};

// Réparer loadAdminStats aussi
if (typeof loadAdminStats !== 'undefined') {
    const originalLoadAdminStats = loadAdminStats;
    
    window.loadAdminStats = function() {
        console.log('📊 loadAdminStats sécurisée');
        
        // Vérifier que les éléments existent
        const elements = [
            'adminActiveClients',
            'adminCodesUsed',
            'performanceClients', 
            'performanceCodes'
        ];
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = 'Chargement...';
            }
        });
        
        // Charger les vraies données
        setTimeout(() => {
            if (typeof chargerStatistiquesAdmin === 'function') {
                chargerStatistiquesAdmin();
            }
        }, 1000);
    };
    
    console.log('✅ loadAdminStats sécurisée installée');
}

console.log('🎉 Correctif adminSection null appliqué');
