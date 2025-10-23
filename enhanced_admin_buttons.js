// ========================
// 🎨 BOUTONS ADMIN AMÉLIORÉS
// ========================

console.log('🎨 Boutons admin améliorés chargés');

// Améliorer l'expérience utilisateur des boutons admin
document.addEventListener('DOMContentLoaded', function() {
    // Attendre que la section admin soit chargée
    setTimeout(() => {
        const adminSection = document.getElementById('adminSection');
        if (!adminSection) return;
        
        // Ajouter des écouteurs d'événements améliorés
        const buttons = adminSection.querySelectorAll('button');
        buttons.forEach(button => {
            const originalOnClick = button.getAttribute('onclick');
            
            if (originalOnClick) {
                // Remplacer par une version améliorée
                button.removeAttribute('onclick');
                button.addEventListener('click', function(e) {
                    console.log(`🖱️ Clic sur: ${button.textContent.trim()}`);
                    
                    // Feedback visuel
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        button.style.transform = '';
                    }, 150);
                    
                    // Exécuter la fonction originale
                    try {
                        const funcName = originalOnClick.replace('(', '').replace(')', '');
                        if (typeof window[funcName] === 'function') {
                            window[funcName]();
                        }
                    } catch (error) {
                        console.error('Erreur bouton:', error);
                    }
                });
            }
        });
        
        console.log('✅ Boutons admin améliorés');
    }, 1000);
});

// Fonction utilitaire pour les liens directs
window.openAdminDirect = function(section = '') {
    const url = section ? `admin-dashboard.html#${section}` : 'admin-dashboard.html';
    console.log(`🔗 Ouverture directe: ${url}`);
    
    // Essayer d'abord dans un nouvel onglet
    const newTab = window.open(url, '_blank');
    
    if (!newTab) {
        // Fallback: ouvrir dans la même fenêtre
        window.location.href = url;
    }
};
