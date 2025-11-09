// ===== SYSTÈME DE RÉDUCTIONS COMPLET =====

let activePromoCode = null;
let promoDiscount = 0;

function initialiserReductionsPanier() {
    console.log('🎯 Initialisation des réductions...');
    const savedPromo = localStorage.getItem('anduxara_active_promo');
    if (savedPromo) {
        try {
            const promoData = JSON.parse(savedPromo);
            activePromoCode = promoData.code;
            promoDiscount = promoData.discount;
            console.log("Code actif: " + activePromoCode + " (-" + promoDiscount + "%)");
            appliquerReductionPanier();
            afficherBadgeReduction();
            updateActivePromoDisplay();
        } catch (error) {
            console.error('Erreur lecture promo:', error);
        }
    }
}

function appliquerReductionPanier() {
    if (!activePromoCode || !promoDiscount) {
        console.log('Aucun code actif');
        return;
    }
    
    console.log("Application réduction " + promoDiscount + "% au panier...");
    
    if (window.floatingCart && Array.isArray(floatingCart)) {
        floatingCart.forEach(item => {
            const discountAmount = (item.price * promoDiscount) / 100;
            item.promoPrice = Math.round(item.price - discountAmount);
        });
        
        localStorage.setItem('anduxara_cart', JSON.stringify(floatingCart));
        
        if (typeof updateFloatingCart === 'function') {
            updateFloatingCart();
        }
        console.log('Réduction appliquée au panier');
    }
}
