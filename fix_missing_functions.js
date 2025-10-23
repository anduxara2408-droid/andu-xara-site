// ========================
// 🔧 CORRECTIF FONCTIONS MANQUANTES
// ========================

console.log('🔧 Application du correctif fonctions manquantes');

// 1. Fonction ouvrirDashboardAdmin manquante
if (typeof ouvrirDashboardAdmin === 'undefined') {
    window.ouvrirDashboardAdmin = function() {
        console.log('🚀 ouvrirDashboardAdmin appelée');
        
        // Vérifier si l'utilisateur est connecté
        if (typeof authManager === 'undefined' || !authManager.user) {
            alert('Veuillez vous connecter en tant qu\\'administrateur');
            return;
        }
        
        // Vérifier les droits admin
        if (typeof authManager.isAdmin === 'function') {
            authManager.isAdmin().then(isAdmin => {
                if (!isAdmin) {
                    alert('Accès réservé aux administrateurs');
                    return;
                }
                
                // Ouvrir le dashboard
                const width = 1200, height = 800;
                const left = (screen.width - width) / 2;
                const top = (screen.height - height) / 2;
                
                window.open('admin-dashboard.html', '_blank', 
                    `width=\${width},height=\${height},left=\${left},top=\${top}`);
                    
            }).catch(error => {
                console.error('Erreur vérification admin:', error);
                alert('Erreur de vérification des droits');
            });
        } else {
            // Fallback simple
            window.open('admin-dashboard.html', '_blank', 'width=1200,height=800');
        }
    };
    console.log('✅ ouvrirDashboardAdmin créée');
}

// 2. Fonction showCodeManager manquante
if (typeof showCodeManager === 'undefined') {
    window.showCodeManager = function() {
        console.log('🏷️ showCodeManager appelée');
        window.open('admin-dashboard.html#codes', '_blank', 'width=1200,height=800');
    };
    console.log('✅ showCodeManager créée');
}

// 3. Fonction showAnalytics manquante  
if (typeof showAnalytics === 'undefined') {
    window.showAnalytics = function() {
        console.log('📈 showAnalytics appelée');
        window.open('admin-dashboard.html#analytics', '_blank', 'width=1200,height=800');
    };
    console.log('✅ showAnalytics créée');
}

console.log('🎉 Toutes les fonctions manquantes ont été créées');
