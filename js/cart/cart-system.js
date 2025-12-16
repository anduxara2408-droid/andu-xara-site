// js/cart-system.js - Système de panier externalisé
console.log('🛒 Chargement système panier...');

// Variables globales du panier
window.floatingCart = JSON.parse(localStorage.getItem('anduxara_cart')) || [];
window.activePromoCode = null;
window.promoDiscount = 0;

// Fonctions du panier
window.toggleFloatingCart = function() {
    console.log('🛒 toggleFloatingCart appelée');
    const cart = document.getElementById('floating-cart');
    if (cart) {
        cart.classList.toggle('open');
        console.log('✅ Panier ouvert/fermé');
    }
};

window.closeFloatingCart = function() {
    console.log('🛒 closeFloatingCart appelée');
    const cart = document.getElementById('floating-cart');
    if (cart) {
        cart.classList.remove('open');
        console.log('✅ Panier fermé');
    }
};

window.removeFromFloatingCart = function(index) {
    console.log('🗑️ removeFromFloatingCart appelée avec index:', index);
    
    if (index < 0 || index >= window.floatingCart.length) {
        console.error('❌ Index invalide:', index);
        return;
    }
    
    const removedProduct = window.floatingCart[index].name;
    window.floatingCart.splice(index, 1);
    localStorage.setItem('anduxara_cart', JSON.stringify(window.floatingCart));
    window.updateFloatingCart();
    window.showNotification(`🗑️ ${removedProduct} retiré du panier`);
};

window.ajouterAuPanier = function(productName, category, price) {
    console.log('🛒 Ajout au panier:', productName, 'Prix:', price);
    
    const numericPrice = typeof price === 'string' ? parseInt(price.replace(/[^\d]/g, '')) : Number(price);
    
    if (isNaN(numericPrice) || numericPrice <= 0) {
        console.error('❌ Prix invalide:', price);
        window.showNotification('❌ Erreur: Prix invalide', 'error');
        return;
    }

    if (navigator.vibrate) navigator.vibrate(50);

    // Chercher si le produit existe déjà
    let found = false;
    for (let i = 0; i < window.floatingCart.length; i++) {
        if (window.floatingCart[i].name === productName) {
            window.floatingCart[i].quantity += 1;
            found = true;
            break;
        }
    }

    if (!found) {
        window.floatingCart.push({
            name: productName,
            category: category,
            price: numericPrice,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('anduxara_cart', JSON.stringify(window.floatingCart));
    window.showNotification('✅ ' + productName + ' ajouté au panier !');
    window.updateFloatingCart();
};

window.updateFloatingCart = function() {
    const cartItemsContainer = document.getElementById('cart-items-floating');
    const cartTotalElement = document.getElementById('cart-total-floating');
    const cartBadge = document.getElementById('cart-badge-floating');

    if (!cartItemsContainer || !cartTotalElement || !cartBadge) return;

    let subtotalOriginal = 0;
    let subtotalFinal = 0;
    let totalItems = 0;

    cartItemsContainer.innerHTML = '';

    if (window.floatingCart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-floating">Votre panier est vide</div>';
        cartTotalElement.textContent = '0';
        cartBadge.textContent = '0';
        return;
    }

    // Détection du code promo actif
    const activePromoData = window.detectActivePromo ? window.detectActivePromo() : null;
    
    if (activePromoData) {
        const promoHeader = document.createElement('div');
        promoHeader.style.cssText = 'background: linear-gradient(135deg, #e8f5e8, #d4edda); padding: 12px; border-radius: 8px; margin-bottom: 15px; text-align: center; border: 2px solid #27ae60;';
        promoHeader.innerHTML = '<div style="font-weight: bold; color: #27ae60; font-size: 0.9rem;">🎁 CODE: ' + activePromoData.code + ' (-' + activePromoData.discount + '%)</div>';
        cartItemsContainer.appendChild(promoHeader);
    }

    for (let i = 0; i < window.floatingCart.length; i++) {
        const item = window.floatingCart[i];
        totalItems += item.quantity;
        
        const originalPrice = item.price;
        const originalTotal = Math.round(originalPrice * item.quantity);
        let finalTotal = originalTotal;
        
        if (activePromoData) {
            finalTotal = Math.round(originalTotal * (1 - activePromoData.discount / 100));
        }
        
        const economy = originalTotal - finalTotal;
        subtotalOriginal += originalTotal;
        subtotalFinal += finalTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item-floating';
        
        if (activePromoData) {
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p style="margin: 3px 0; font-size: 0.75rem; color: #666;">Quantité: ${item.quantity} × ${originalPrice} MRU</p>
                    <div style="margin-top: 8px;">
                        <div style="text-decoration: line-through; color: #888; font-size: 0.75rem;">${originalTotal} MRU</div>
                        <div style="color: #27ae60; font-weight: bold; font-size: 0.85rem;">${finalTotal} MRU (économie: ${economy} MRU)</div>
                    </div>
                </div>
                <div class="cart-item-price">
                    <button class="remove-item" onclick="removeFromFloatingCart(${i})">❌</button>
                </div>
            `;
        } else {
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p style="margin: 3px 0; font-size: 0.75rem; color: #666;">Quantité: ${item.quantity} × ${originalPrice} MRU</p>
                    <div style="color: #2c3e50; font-weight: bold; font-size: 0.85rem; margin-top: 8px;">Total: ${originalTotal} MRU</div>
                </div>
                <div class="cart-item-price">
                    <button class="remove-item" onclick="removeFromFloatingCart(${i})">❌</button>
                </div>
            `;
        }
        
        cartItemsContainer.appendChild(itemElement);
    }

    const totalEconomy = subtotalOriginal - subtotalFinal;
    let totalHTML = '<div style="text-align: left;">';
    
    if (activePromoData) {
        totalHTML += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.85rem;">
                <span>Sous-total:</span><span>${subtotalOriginal} MRU</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.85rem; color: #27ae60;">
                <span>Code ${activePromoData.code} (-${activePromoData.discount}%):</span><span>-${totalEconomy} MRU</span>
            </div>
        `;
    }
    
    totalHTML += `
        <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 8px; font-size: 1rem; border-top: 2px solid #ddd; padding-top: 8px;">
            <span>TOTAL:</span><span style="color: #e74c3c;">${subtotalFinal} MRU</span>
        </div>
    </div>`;
    
    cartTotalElement.innerHTML = totalHTML;
    cartBadge.textContent = totalItems;
};

// Fonction de détection des promos
window.detectActivePromo = function() {
    if (window.activePromoCode && window.promoDiscount > 0) {
        return {
            code: window.activePromoCode,
            discount: window.promoDiscount
        };
    }
    
    const savedCode = localStorage.getItem('anduxara_active_promo_code');
    const savedDiscount = localStorage.getItem('anduxara_promo_discount');
    if (savedCode && savedDiscount) {
        window.activePromoCode = savedCode;
        window.promoDiscount = parseInt(savedDiscount);
        return {
            code: savedCode,
            discount: parseInt(savedDiscount)
        };
    }
    
    const savedPromo = localStorage.getItem('anduxara_active_promo');
    if (savedPromo) {
        try {
            const promoData = JSON.parse(savedPromo);
            window.activePromoCode = promoData.code;
            window.promoDiscount = promoData.discount;
            return {
                code: promoData.code,
                discount: promoData.discount
            };
        } catch (e) {
            console.error('Erreur parsing promo:', e);
        }
    }
    
    return null;
};

// Fonction de notification
window.showNotification = function(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff4757' : '#25D366'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 350px;
    `;
    notification.innerHTML = `
        <span>${type === 'error' ? '❌' : '✅'}</span>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 Système panier initialisé');
    window.updateFloatingCart();
});

