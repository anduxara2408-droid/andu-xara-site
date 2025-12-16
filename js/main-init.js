// js/main-init.js - Initialisation principale (86 lignes)
console.log('🚀 Andu-Xara - Initialisation optimisée');

// Variables globales ESSENTIELLES seulement
window.floatingCart = JSON.parse(localStorage.getItem('anduxara_cart')) || [];
window.activePromoCode = null;
window.promoDiscount = 0;

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log('📦 DOM chargé');
    
    // 1. Initialiser le panier
    if (typeof updateFloatingCart === 'function') {
        updateFloatingCart();
    }
    
    // 2. Initialiser le compte à rebours
    if (typeof initializePromoCountdown === 'function') {
        setTimeout(initializePromoCountdown, 500);
    }
    
    // 3. Initialiser l'authentification
    if (typeof updateAuthStatus === 'function') {
        setTimeout(updateAuthStatus, 1000);
    }
    
    // 4. Fermer le panier en cliquant à l'extérieur
    document.addEventListener('click', function(event) {
        const cart = document.getElementById('floating-cart');
        const toggle = document.querySelector('.cart-toggle');
        
        if (cart && cart.classList.contains('open') &&
            !cart.contains(event.target) &&
            toggle && !toggle.contains(event.target)) {
            closeFloatingCart();
        }
    });
    
    // 5. Optimisation mobile
    optimizeForMobile();
    
    console.log('✅ Initialisation terminée');
});

// Optimisation mobile
function optimizeForMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        console.log('📱 Optimisation mobile');
        
        // Forcer le scroll sur Android
        if (/Android/.test(navigator.userAgent)) {
            document.body.style.overflowY = 'auto';
            document.body.style.webkitOverflowScrolling = 'touch';
        }
    }
}

// Fonction notification SIMPLIFIÉE
function showNotification(message, type = 'success') {
    console.log('📢', message);
    
    // Version ultra simple
    const colors = {
        success: '#25D366',
        error: '#ff4757',
        warning: '#ffa502'
    };
    
    const div = document.createElement('div');
    div.textContent = message;
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.success};
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        z-index: 10000;
    `;
    
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}
