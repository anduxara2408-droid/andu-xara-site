// ===== GESTION DU PANIER PARTAGÉ =====
let panier = JSON.parse(localStorage.getItem('panier')) || [];

function updateFloatingCart() {
    const cartItemsElement = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const cartCountElement = document.getElementById('cartCount');
    
    if (!cartItemsElement || !cartTotalElement) return;
    
    // Calculer le total original
    let total = panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    let discountAmount = 0;
    let finalTotal = total;
    
    // Appliquer la réduction si elle existe
    if (typeof getCurrentDiscount === 'function') {
        const discount = getCurrentDiscount();
        if (discount) {
            if (discount.type === 'percentage') {
                discountAmount = total * (discount.value / 100);
            } else {
                discountAmount = discount.value;
            }
            finalTotal = Math.max(0, total - discountAmount);
        }
    }
    
    // Mettre à jour l'affichage des items
    cartItemsElement.innerHTML = '';
    panier.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <span>${item.nom} x${item.quantite}</span>
            <span>${(item.prix * item.quantite).toFixed(2)}€</span>
        `;
        cartItemsElement.appendChild(itemElement);
    });
    
    // Afficher le total avec réduction
    if (discountAmount > 0) {
        cartTotalElement.innerHTML = `
            <div style="text-decoration: line-through; color: #999; font-size: 14px;">${total.toFixed(2)}€</div>
            <div style="color: #e74c3c; font-weight: bold; font-size: 18px;">${finalTotal.toFixed(2)}€</div>
            <div style="font-size: 12px; color: #27ae60;">Économie: ${discountAmount.toFixed(2)}€</div>
        `;
    } else {
        cartTotalElement.textContent = `${total.toFixed(2)}€`;
    }
    
    // Mettre à jour le compteur
    if (cartCountElement) {
        const totalItems = panier.reduce((sum, item) => sum + item.quantite, 0);
        cartCountElement.textContent = totalItems;
    }
    
    // Mettre à jour l'affichage du code promo actif
    if (typeof updateActivePromoDisplay === 'function') {
        updateActivePromoDisplay();
    }
}

function updateActivePromoDisplay() {
    const activePromoDisplay = document.getElementById('active-promo-display');
    if (!activePromoDisplay) return;
    
    if (typeof getCurrentDiscount === 'function' && typeof getAppliedPromoCode === 'function') {
        const discount = getCurrentDiscount();
        const promoCode = getAppliedPromoCode();
        
        if (discount && promoCode) {
            activePromoDisplay.innerHTML = `
                <div style="background: #e8f5e8; padding: 10px; border-radius: 5px; border-left: 4px solid #27ae60;">
                    <strong>✅ Code appliqué: ${promoCode}</strong>
                    <div>Réduction: ${discount.value}${discount.type === 'percentage' ? '%' : '€'}</div>
                    <button onclick="resetPromo()" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 5px; font-size: 12px;">
                        Retirer
                    </button>
                </div>
            `;
            activePromoDisplay.style.display = 'block';
        } else {
            activePromoDisplay.style.display = 'none';
        }
    }
}

// Fonctions pour le panier
function addToCart(nom, prix, quantite = 1) {
    const existingItem = panier.find(item => item.nom === nom);
    
    if (existingItem) {
        existingItem.quantite += quantite;
    } else {
        panier.push({ nom, prix, quantite });
    }
    
    localStorage.setItem('panier', JSON.stringify(panier));
    updateFloatingCart();
    
    // Notification
    if (typeof showNotification === 'function') {
        showNotification(`${nom} ajouté au panier!`, 'success');
    }
}

function removeFromCart(nom) {
    panier = panier.filter(item => item.nom !== nom);
    localStorage.setItem('panier', JSON.stringify(panier));
    updateFloatingCart();
}

function clearCart() {
    panier = [];
    localStorage.setItem('panier', JSON.stringify(panier));
    updateFloatingCart();
}

// Exposer les fonctions globalement
window.updateFloatingCart = updateFloatingCart;
window.updateActivePromoDisplay = updateActivePromoDisplay;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;

console.log("✅ panier-shared.js chargé avec succès - Version corrigée");
