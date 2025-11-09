function afficherBadgeReduction() {
    const ancienBadge = document.getElementById('badge-reduction-active');
    if (ancienBadge) ancienBadge.remove();
    
    if (!activePromoCode || !promoDiscount) return;
    
    const badge = document.createElement('div');
    badge.id = 'badge-reduction-active';
    badge.innerHTML = '<div style="background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; padding: 12px 20px; border-radius: 10px; margin: 15px 0; text-align: center; box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3); border: 2px solid #27ae60;"><div style="display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap;"><div style="font-size: 1.5rem;">🎉</div><div style="text-align: left;"><strong style="font-size: 1.1rem;">RÉDUCTION ACTIVE</strong><div style="font-size: 0.9rem; opacity: 0.9;">Code: <strong>' + activePromoCode + '</strong> • -' + promoDiscount + '% </div></div><button onclick="retirerReduction()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">❌ Retirer</button></div></div>';
    
    const header = document.querySelector('header');
    if (header) header.insertAdjacentElement('afterend', badge);
}

function retirerReduction() {
    console.log('Retrait de la réduction...');
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
        showNotification('Réduction retirée', 'success');
    }
}
