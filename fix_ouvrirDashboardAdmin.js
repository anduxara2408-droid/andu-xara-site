// ======================================
// 🔧 CORRECTIF URGENT - ouvrirDashboardAdmin
// ======================================

console.log('🚀 Correctif ouvrirDashboardAdmin chargé');

// Définir la fonction manquante globalement
window.ouvrirDashboardAdmin = function() {
    console.log('🎯 ouvrirDashboardAdmin appelée');
    
    try {
        // Vérifier si l'utilisateur est admin
        const user = firebase.auth().currentUser;
        
        if (user === null) {
            alert('❌ Vous devez être connecté pour accéder au dashboard admin');
            return;
        }

        // Vérifier si c'est l'admin autorisé
        const ADMIN_UID = '17apXmjUgNahSdAShQHD78Fld8u2';
        
        if (user.uid !== ADMIN_UID) {
            alert('❌ Accès réservé à l\\'administrateur');
            return;
        }

        console.log('✅ Admin authentifié, ouverture du dashboard...');

        // Ouvrir le dashboard dans une nouvelle fenêtre optimisée
        const adminWindow = window.open(
            'admin-dashboard.html',
            'Dashboard Admin - Andu Xara',
            'width=1400,height=800,left=100,top=50,resizable=yes,scrollbars=yes,toolbar=yes'
        );

        if (adminWindow === null) {
            // Fallback : ouvrir dans le même onglet
            console.log('⚠️ Popup bloquée, redirection directe');
            window.location.href = 'admin-dashboard.html';
        } else {
            // Focus sur la nouvelle fenêtre
            adminWindow.focus();
        }

    } catch (error) {
        console.error('❌ Erreur ouverture dashboard:', error);
        alert('Erreur: ' + error.message);
    }
};

// Alternative : fonction pour ouvrir dans le même onglet
window.ouvrirDashboardAdminDirect = function() {
    window.location.href = 'admin-dashboard.html';
};

console.log('✅ Fonction ouvrirDashboardAdmin définie globalement');
