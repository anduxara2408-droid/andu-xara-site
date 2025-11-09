// ===== SYSTÈME PROMO AMÉLIORÉ =====
console.log('🎯 Système promo amélioré chargé');

// Codes valides
const VALID_CODES = {
    'TEST15': 15,
    'WELCOME10': 10,
    'ANDU20': 20,
    'SONINKE25': 25,
    'AFRICA15': 15,
    'MODE10': 10,
    'BIENVENUE15': 15,
    'ANDU2025': 20,
    'SOLDE30': 30,
    'PREMIUM25': 25
};

// Récupérer les codes actifs au chargement
function recupererCodesActifs() {
    console.log('🔄 Récupération des codes actifs...');
    
    // Vérifier l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromURL = urlParams.get('codePromo');
    if (codeFromURL) {
        console.log('📥 Code URL détecté:', codeFromURL);
        validateAndApplyPromoWithCode(codeFromURL);
        // Nettoyer l'URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
    }
    
    // Vérifier localStorage
    const promoData = localStorage.getItem('anduxara_active_promo');
    if (promoData) {
        try {
            const promo = JSON.parse(promoData);
            console.log('📥 Code local trouvé:', promo.code);
            updateActivePromoDisplay();
            applyDiscountToCart(promo.discount);
        } catch (error) {
            console.error('❌ Erreur lecture promo:', error);
        }
    }
}

// Appliquer la réduction au panier
function applyDiscountToCart(discount) {
    if (!window.floatingCart) {
        console.log('⏳ Panier pas encore chargé');
        return;
    }
    
    window.floatingCart.forEach(item => {
        const discountAmount = (item.price * discount) / 100;
        item.promoPrice = Math.round(item.price - discountAmount);
    });
    
    localStorage.setItem('anduxara_cart', JSON.stringify(window.floatingCart));
    
    if (typeof updateFloatingCart === 'function') {
        updateFloatingCart();
    }
    
    console.log(`💰 Réduction de ${discount}% appliquée au panier`);
}

// Mettre à jour l'affichage du code actif
function updateActivePromoDisplay() {
    const display = document.getElementById('active-promo-display');
    const codeElement = document.getElementById('active-promo-code');
    
    if (!display || !codeElement) {
        console.log('⏳ Éléments promo pas encore chargés');
        return;
    }
    
    const promoData = localStorage.getItem('anduxara_active_promo');
    
    if (promoData) {
        try {
            const promo = JSON.parse(promoData);
            display.style.display = 'block';
            codeElement.textContent = `${promo.code} (-${promo.discount}%)`;
            
            // Ajouter le badge de réduction
            addDiscountBadge(promo.discount);
            
        } catch (error) {
            console.error('❌ Erreur lecture promo:', error);
        }
    } else {
        display.style.display = 'none';
        removeDiscountBadge();
    }
}

// Badge de réduction
function addDiscountBadge(discount) {
    let badge = document.getElementById('discount-badge');
    
    if (!badge) {
        badge = document.createElement('div');
        badge.id = 'discount-badge';
        badge.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #000;
            padding: 10px 15px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 2px solid #fff;
        `;
        document.body.appendChild(badge);
    }
    
    badge.innerHTML = `🎁 Réduction ${discount}% active !`;
    badge.style.display = 'block';
}

function removeDiscountBadge() {
    const badge = document.getElementById('discount-badge');
    if (badge) {
        badge.style.display = 'none';
    }
}

// Validation avec code spécifique
function validateAndApplyPromoWithCode(code) {
    console.log('🎯 Validation code:', code);
    
    const discount = VALID_CODES[code.toUpperCase()];
    
    if (discount) {
        const promoData = {
            code: code.toUpperCase(),
            discount: discount,
            appliedAt: new Date().toISOString()
        };
        
        localStorage.setItem('anduxara_active_promo', JSON.stringify(promoData));
        
        // Mettre à jour l'affichage
        updateActivePromoDisplay();
        
        // Appliquer la réduction
        applyDiscountToCart(discount);
        
        // Message de succès
        const messageElement = document.getElementById('promoMessage');
        if (messageElement) {
            messageElement.innerHTML = `<span style="color: #27ae60;">✅ Code "${code}" appliqué ! ${discount}% de réduction</span>`;
            messageElement.style.display = 'block';
        }
        
        if (typeof showNotification === 'function') {
            showNotification(`🎉 Code "${code}" appliqué ! (-${discount}%)`);
        }
        
        console.log(`🎉 Réduction de ${discount}% appliquée avec le code ${code}`);
        
    } else {
        const messageElement = document.getElementById('promoMessage');
        if (messageElement) {
            messageElement.innerHTML = `<span style="color: #e74c3c;">❌ Code invalide ou expiré</span>`;
            messageElement.style.display = 'block';
        }
    }
}

// Fonction pour le bouton
function validateAndApplyPromo() {
    const codeInput = document.getElementById('promoInput');
    
    if (!codeInput) {
        console.error('❌ Champ promo non trouvé');
        return;
    }
    
    const code = codeInput.value.trim();
    
    if (!code) {
        const messageElement = document.getElementById('promoMessage');
        if (messageElement) {
            messageElement.innerHTML = `<span style="color: #e74c3c;">❌ Veuillez entrer un code</span>`;
            messageElement.style.display = 'block';
        }
        return;
    }
    
    validateAndApplyPromoWithCode(code);
}

// Supprimer le code promo
function removePromoFromCart() {
    // Réinitialiser les prix
    if (window.floatingCart) {
        window.floatingCart.forEach(item => {
            item.promoPrice = item.price;
        });
        localStorage.setItem('anduxara_cart', JSON.stringify(window.floatingCart));
    }
    
    // Supprimer les données promo
    localStorage.removeItem('anduxara_active_promo');
    
    // Mettre à jour l'affichage
    updateActivePromoDisplay();
    
    if (typeof updateFloatingCart === 'function') {
        updateFloatingCart();
    }
    
    // Mettre à jour le message
    const messageElement = document.getElementById('promoMessage');
    if (messageElement) {
        messageElement.innerHTML = `<span style="color: #666;">🔓 Code promo retiré</span>`;
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }
    
    if (typeof showNotification === 'function') {
        showNotification('🔓 Réduction retirée');
    }
    
    console.log('🗑️ Code promo retiré');
}

// Initialisation
function initPromoSystem() {
    console.log('🚀 Initialisation système promo...');
    setTimeout(recupererCodesActifs, 1000);
    setTimeout(updateActivePromoDisplay, 500);
    setTimeout(updateActivePromoDisplay, 2000);
    console.log('✅ Système promo amélioré prêt');
}

// Démarrer
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initPromoSystem, 500);
});

// Exposer les fonctions
window.validateAndApplyPromo = validateAndApplyPromo;
window.removePromoFromCart = removePromoFromCart;
window.validateAndApplyPromoWithCode = validateAndApplyPromoWithCode;

console.log('✅ Système promo amélioré chargé avec succès');
