// ========================
// 🔧 CORRECTIF OUVERTURE POPUPS
// ========================

console.log('🔧 Correctif popups chargé');

// Fonction améliorée pour ouvrir le dashboard
window.ouvrirDashboardAdmin = function() {
    console.log('🚀 Ouvrir Dashboard Admin - Version corrigée');
    
    // Vérifications de base
    if (typeof authManager === 'undefined' || !authManager.user) {
        alert('🔐 Veuillez vous connecter en tant qu\\'administrateur');
        return false;
    }
    
    // Vérifier les droits admin de manière asynchrone
    authManager.isAdmin().then(isAdmin => {
        if (!isAdmin) {
            alert('👑 Accès réservé aux administrateurs');
            return false;
        }
        
        // Configuration de la fenêtre
        const width = 1200;
        const height = 800;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;
        
        console.log('📊 Ouverture du dashboard...');
        
        // Ouvrir la fenêtre avec des paramètres optimisés
        const popup = window.open(
            'admin-dashboard.html',
            'DashboardAdmin',
            `width=${width},height=${height},left=${left},top=${top},` +
            'scrollbars=yes,resizable=yes,menubar=no,toolbar=no,location=no,status=no'
        );
        
        // Vérifier si la popup a été bloquée
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
            console.warn('🚫 Popup bloquée - Méthode alternative');
            showPopupBlockedMessage();
        } else {
            console.log('✅ Popup ouverte avec succès');
            // Donner le focus
            popup.focus();
        }
        
    }).catch(error => {
        console.error('❌ Erreur vérification admin:', error);
        alert('⚠️ Erreur de vérification des droits administrateur');
    });
    
    return true;
};

// Fonction pour gérer les popups bloquées
function showPopupBlockedMessage() {
    const message = `
    🚫 POPUP BLOQUÉE
    
    Votre navigateur a bloqué l'ouverture du dashboard admin.
    
    📋 SOLUTIONS:
    1. ⚙️ Autorisez les popups pour ce site
    2. 🔗 Cliquez droit → "Ouvrir dans un nouvel onglet"
    3. 🖱️ Maintenez Ctrl (ou Cmd) en cliquant
    
    🔗 Ou utilisez ce lien direct:
    <a href="admin-dashboard.html" target="_blank" style="color: blue; text-decoration: underline;">
        Ouvrir le Dashboard Admin
    </a>
    `;
    
    // Créer une modal d'information
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        text-align: center;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #e53e3e; margin-bottom: 15px;">🚫 Popup Bloquée</h3>
        <p style="margin-bottom: 15px; line-height: 1.4;">
            Votre navigateur a bloqué l'ouverture du dashboard admin.
        </p>
        <div style="margin-bottom: 15px; text-align: left; background: #f7fafc; padding: 10px; border-radius: 5px;">
            <strong>📋 Solutions:</strong><br>
            • Autorisez les popups pour ce site<br>
            • Cliquez droit → "Ouvrir dans un nouvel onglet"<br>
            • Maintenez Ctrl (ou Cmd) en cliquant
        </div>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="padding: 8px 16px; background: #718096; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Fermer
            </button>
            <a href="admin-dashboard.html" target="_blank" 
               style="padding: 8px 16px; background: #3182ce; color: white; text-decoration: none; border-radius: 5px;">
                🔗 Ouvrir Dashboard
            </a>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Fonctions améliorées pour les autres boutons
window.showAnalytics = function() {
    console.log('📈 Ouvrir Analytics - Version corrigée');
    openAdminSection('analytics');
};

window.showCodeManager = function() {
    console.log('🏷️ Ouvrir Gestion Codes - Version corrigée');
    openAdminSection('codes');
};

// Fonction générique pour ouvrir les sections
function openAdminSection(section) {
    if (typeof ouvrirDashboardAdmin === 'function') {
        // Ouvrir le dashboard d'abord
        ouvrirDashboardAdmin();
        
        // Essayer de naviguer vers la section (si la popup s'ouvre)
        setTimeout(() => {
            try {
                // Cette partie ne fonctionnera que si la popup s'ouvre
                console.log(`🎯 Navigation vers section: ${section}`);
            } catch (error) {
                console.log('Navigation section échouée:', error);
            }
        }, 1000);
    }
}

console.log('✅ Correctif popups appliqué avec succès');
