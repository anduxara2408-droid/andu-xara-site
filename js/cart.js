// ===== GESTION DU PANIER =====

// Charger le panier depuis localStorage
export function loadCart() {
    try {
        return JSON.parse(localStorage.getItem('panier')) || [];
    } catch {
        return [];
    }
}

// Sauvegarder le panier
export function saveCart(cart) {
    localStorage.setItem('panier', JSON.stringify(cart));
    updateCartCount();
}

// Ajouter un article au panier
export function addToCart(product, taille, quantity = 1) {
    const user = auth?.currentUser;
    if (!user) {
        showNotification('❌ Veuillez vous connecter', 'error');
        return false;
    }

    let cart = loadCart();
    
    const existingItem = cart.find(item => 
        item.id === product.id && item.taille === taille
    );

    if (existingItem) {
        existingItem.quantite += quantity;
    } else {
        cart.push({
            id: product.id,
            nom: product.nom,
            prix: product.prix,
            taille: taille,
            quantite: quantity,
            image: product.image || product.photos?.[0]
        });
    }

    saveCart(cart);
    
    // Synchroniser avec Firebase si connecté
    if (user) {
        db.collection('paniers').doc(user.uid).set({
            items: cart,
            updatedAt: new Date()
        }, { merge: true });
    }

    showNotification(`✅ ${product.nom} ajouté au panier`);
    return true;
}

// Supprimer un article
export function removeFromCart(index) {
    let cart = loadCart();
    cart.splice(index, 1);
    saveCart(cart);
    
    const user = auth?.currentUser;
    if (user) {
        db.collection('paniers').doc(user.uid).update({
            items: cart,
            updatedAt: new Date()
        });
    }
}

// Mettre à jour la quantité
export function updateQuantity(index, quantity) {
    let cart = loadCart();
    if (quantity < 1) return;
    
    cart[index].quantite = quantity;
    saveCart(cart);
    
    const user = auth?.currentUser;
    if (user) {
        db.collection('paniers').doc(user.uid).update({
            items: cart,
            updatedAt: new Date()
        });
    }
}

// Vider le panier
export function clearCart() {
    localStorage.removeItem('panier');
    updateCartCount();
    
    const user = auth?.currentUser;
    if (user) {
        db.collection('paniers').doc(user.uid).delete();
    }
}

// Calculer le total
export function getCartTotal(cart = null) {
    const items = cart || loadCart();
    return items.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
}

// Mettre à jour l'affichage du compteur
export function updateCartCount() {
    const cart = loadCart();
    const count = cart.reduce((sum, item) => sum + item.quantite, 0);
    
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}

// Notification
function showNotification(message, type = 'success') {
    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 9999;
        animation: slideIn 0.3s;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notif);
    
    setTimeout(() => notif.remove(), 3000);
}

// Exporter les fonctions
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.getCartTotal = getCartTotal;
