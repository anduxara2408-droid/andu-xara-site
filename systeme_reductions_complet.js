// ===== SYSTÈME DE RÉDUCTIONS COMPLET =====

let activePromoCode = null;
let promoDiscount = 0;

// ===== FONCTIONS PRINCIPALES =====
function initialiserReductionsPanier() {
    console.log('🎯 Initialisation des réductions...');
    const savedPromo = localStorage.getItem('anduxara_active_promo');
    if (savedPromo) {
        try {
            const promoData = JSON.parse(savedPromo);
            activePromoCode = promoData.code;
            promoDiscount = promoData.discount;
            console.log(`✅ Code actif: ${activePromoCode} (-${promoDiscount}%)`);
            appliquerReductionPanier();
            afficherBadgeReduction();
            updateActivePromoDisplay();
        } catch (error) {
            console.error('❌ Erreur lecture promo:', error);
        }
    }
}

function appliquerReductionPanier() {
    if (!activePromoCode || !promoDiscount) {
        console.log('❌ Aucun code actif à appliquer');
        return;
    }
    
    console.log(`💰 Application réduction ${promoDiscount}% au panier...`);
    
    if (window.floatingCart && Array.isArray(floatingCart)) {
        floatingCart.forEach(item => {
            const discountAmount = (item.price * promoDiscount) / 100;
            item.promoPrice = Math.round(item.price - discountAmount);
        });
        
        localStorage.setItem('anduxara_cart', JSON.stringify(floatingCart));
        
        if (typeof updateFloatingCart === 'function') {
            updateFloatingCart();
        }
        console.log('✅ Réduction appliquée au panier');
    }
}

function afficherBadgeReduction() {
    const ancienBadge = document.getElementById('badge-reduction-active');
    if (ancienBadge) ancienBadge.remove();
    
    if (!activePromoCode || !promoDiscount) return;
    
    const badge = document.createElement('div');
    badge.id = 'badge-reduction-active';
    badge.innerHTML = `
        <div style="background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; padding: 12px 20px; border-radius: 10px; margin: 15px 0; text-align: center; box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3); border: 2px solid #27ae60;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap;">
                <div style="font-size: 1.5rem;">🎉</div>
                <div style="text-align: left;">
                    <strong style="font-size: 1.1rem;">RÉDUCTION ACTIVE</strong>
                    <div style="font-size: 0.9rem; opacity: 0.9;">
                        Code: <strong>${activePromoCode}</strong> • -${promoDiscount}% 
                    </div>
                </div>
                <button onclick="retirerReduction()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">
                    ❌ Retirer
                </button>
            </div>
        </div>
    `;
    
    const header = document.querySelector('header');
    if (header) header.insertAdjacentElement('afterend', badge);
}

function retirerReduction() {
    console.log('🗑️ Retrait de la réduction...');
    activePromoCode = null;
    promoDiscount = 0;
    localStorage.removeItem('anduxara_active_promo');
    
    const badge = document.getElementById('badge-reduction-active');
    if (badge) badge.remove();
    
    if (window.floatingCart && Array.isArray(floatingCart)) {
        floatingCart.forEach(item => {
            item.promoPrice = item.price;
        });
        localStorage.setItem('anduxara_cart', JSON.stringify(floatingCart));
    }
    
    if (typeof updateFloatingCart === 'function') updateFloatingCart();
    updateActivePromoDisplay();
    
    if (typeof showNotification === 'function') {
        showNotification('🔓 Réduction retirée', 'success');
    }
}

function appliquerCodePromo() {
    const codeInput = document.getElementById('promoInput');
    const messageElement = document.getElementById('promoMessage');
    
    if (!codeInput || !messageElement) {
        console.error('❌ Éléments promo non trouvés');
        return;
    }
    
    const code = codeInput.value.trim().toUpperCase();
    
    if (!code) {
        messageElement.innerHTML = `<span style="color: #e74c3c;">❌ Veuillez entrer un code</span>`;
        messageElement.style.display = 'block';
        return;
    }
    
    const validCodes = {
        'TEST15': 15, 'WELCOME10': 10, 'ANDU20': 20, 'SONINKE25': 25,
        'AFRICA15': 15, 'MODE10': 10, 'BIENVENUE15': 15, 'ANDU2025': 20,
        'SOLDE30': 30, 'PREMIUM25': 25
    };
    
    if (validCodes[code]) {
        const discount = validCodes[code];
        activePromoCode = code;
        promoDiscount = discount;
        
        localStorage.setItem('anduxara_active_promo', JSON.stringify({
            code: code,
            discount: discount,
            appliedAt: new Date().toISOString()
        }));
        
        appliquerReductionPanier();
        afficherBadgeReduction();
        updateActivePromoDisplay();
        
        messageElement.innerHTML = `<span style="color: #27ae60;">✅ Code "${code}" appliqué ! ${discount}% de réduction</span>`;
        messageElement.style.display = 'block';
        codeInput.value = '';
        
        console.log(`🎉 Réduction de ${discount}% appliquée avec le code ${code}`);
        
    } else {
        messageElement.innerHTML = `<span style="color: #e74c3c;">❌ Code invalide ou expiré</span>`;
        messageElement.style.display = 'block';
    }
}

function updateActivePromoDisplay() {
    const display = document.getElementById('active-promo-display');
    const codeElement = document.getElementById('active-promo-code');
    
    if (!display || !codeElement) return;
    
    if (activePromoCode && promoDiscount) {
        display.style.display = 'block';
        codeElement.textContent = `${activePromoCode} (-${promoDiscount}%)`;
    } else {
        display.style.display = 'none';
    }
}

// ===== INITIALISATION AUTOMATIQUE =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Démarrage système réductions...');
    setTimeout(() => initialiserReductionsPanier(), 1000);
});

// Export global
window.initialiserReductionsPanier = initialiserReductionsPanier;
window.appliquerReductionPanier = appliquerReductionPanier;
window.afficherBadgeReduction = afficherBadgeReduction;
window.retirerReduction = retirerReduction;
window.appliquerCodePromo = appliquerCodePromo;
window.updateActivePromoDisplay = updateActivePromoDisplay;

console.log('✅ Système réductions chargé');
