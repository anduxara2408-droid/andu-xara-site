// Fonctions panier unifiées
console.log("🛒 panier-unified.js chargé");

function ajouterAuPanier(nom, prix, image) {
    console.log(\`🛒 Ajout au panier: \${nom} - \${prix}€\`);
    
    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    const existingItem = panier.find(item => item.nom === nom);
    
    if (existingItem) {
        existingItem.quantite++;
    } else {
        panier.push({ nom, prix, image, quantite: 1 });
    }
    
    localStorage.setItem('panier', JSON.stringify(panier));
    openFloatingCart();
    updateCartDisplay();
    showNotification(\`\${nom} ajouté au panier!\`);
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    
    if (cartItems) {
        if (panier.length === 0) {
            cartItems.innerHTML = '<p>Votre panier est vide</p>';
        } else {
            cartItems.innerHTML = panier.map(item => \`
                <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                    <img src="\${item.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 15px;">
                    <div style="flex-grow: 1;">
                        <strong style="display: block; margin-bottom: 5px;">\${item.nom}</strong>
                        <span style="color: #666;">\${item.prix}€ x \${item.quantite}</span>
                    </div>
                    <button onclick="removeFromCart('\${item.nom}')" style="background: #ff4444; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">×</button>
                </div>
            \`).join('');
        }
    }
    
    if (cartTotal) {
        const total = panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
        const count = panier.reduce((sum, item) => sum + item.quantite, 0);
        cartTotal.innerHTML = \`
            <div style="border-top: 2px solid #007bff; padding-top: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Articles: \${count}</span>
                    <span>Total: <strong>\${total}€</strong></span>
                </div>
                <button onclick="clearCart()" style="background: #ff4444; color: white; border: none; padding: 10px; border-radius: 5px; width: 100%; cursor: pointer;">Vider le panier</button>
            </div>
        \`;
    }
    
    // Mettre à jour le compteur du bouton panier
    const cartButton = document.querySelector('.floating-cart');
    if (cartButton && count > 0) {
        cartButton.innerHTML = \`🛒 <span style="position: absolute; top: -5px; right: -5px; background: red; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; display: flex; align-items: center; justify-content: center;">\${count}</span>\`;
    }
}

function removeFromCart(nom) {
    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    panier = panier.filter(item => item.nom !== nom);
    localStorage.setItem('panier', JSON.stringify(panier));
    updateCartDisplay();
    showNotification('Article retiré du panier');
}

function clearCart() {
    localStorage.setItem('panier', JSON.stringify([]));
    updateCartDisplay();
    showNotification('Panier vidé');
}

function toggleFloatingCart() {
    const panel = document.getElementById('cartPanel');
    const overlay = document.querySelector('.cart-overlay');
    
    if (panel.classList.contains('open')) {
        panel.classList.remove('open');
        overlay.style.display = 'none';
        console.log('📦 Panier FERMÉ');
    } else {
        panel.classList.add('open');
        overlay.style.display = 'block';
        console.log('📦 Panier OUVERT');
        updateCartDisplay();
    }
}

function openFloatingCart() {
    const panel = document.getElementById('cartPanel');
    const overlay = document.querySelector('.cart-overlay');
    panel.classList.add('open');
    overlay.style.display = 'block';
    console.log('📦 Panier OUVERT (automatique)');
    updateCartDisplay();
}

function showNotification(message) {
    // Créer une notification toast
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #28a745; color: white; padding: 12px 24px; border-radius: 5px; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 Initialisation du panier...');
    updateCartDisplay();
});
