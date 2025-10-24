// ===== CORRECTIONS URGENTES - FONCTIONS MANQUANTES =====

// Initialisation des variables globales
window.floatingCart = JSON.parse(localStorage.getItem('anduxara_cart')) || [];
window.activePromoCode = null;
window.promoDiscount = 0;

// ===== FONCTION AJOUTER AU PANIER =====
function ajouterAuPanier(nom, categorie, prix) {
    console.log('🛒 Ajout au panier:', nom, prix + ' MRU');
    
    const existingItem = floatingCart.find(item => item.name === nom);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        floatingCart.push({
            name: nom,
            category: categorie,
            price: prix,
            promoPrice: prix,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('anduxara_cart', JSON.stringify(floatingCart));
    updateCartCounter();
    updateFloatingCart();
    showNotification('✅ ' + nom + ' ajouté au panier !');
}

// ===== MISE À JOUR COMPTEUR PANIER =====
function updateCartCounter() {
    const totalItems = floatingCart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-badge-floating');
    if (badge) badge.textContent = totalItems;
}

// ===== MISE À JOUR PANIER FLOTTANT =====
function updateFloatingCart() {
    const container = document.getElementById('cart-items-floating');
    const totalElement = document.getElementById('cart-total-floating');
    
    if (!container || !totalElement) return;
    
    if (floatingCart.length === 0) {
        container.innerHTML = '<div class="empty-cart-floating">Votre panier est vide</div>';
        totalElement.textContent = '0';
        return;
    }
    
    let total = 0;
    container.innerHTML = floatingCart.map((item, index) => {
        const itemTotal = (item.promoPrice || item.price) * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item-floating">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Quantité: ${item.quantity} × ${item.promoPrice || item.price} MRU</p>
                    <button class="remove-item" onclick="removeFromFloatingCart(${index})">Retirer</button>
                </div>
                <div class="cart-item-price">${itemTotal} MRU</div>
            </div>
        `;
    }).join('');
    totalElement.textContent = total;
}

// ===== RETIRER DU PANIER =====
function removeFromFloatingCart(index) {
    floatingCart.splice(index, 1);
    localStorage.setItem('anduxara_cart', JSON.stringify(floatingCart));
    updateFloatingCart();
    updateCartCounter();
    showNotification('🗑️ Produit retiré du panier');
}

// ===== VALIDATION CODE PROMO =====
function validateAndApplyPromo() {
    const input = document.getElementById('promoInput');
    const message = document.getElementById('promoMessage');
    const code = input.value.trim().toUpperCase();
    
    if (!code) {
        message.innerHTML = '<span style="color: red;">❌ Veuillez entrer un code</span>';
        return;
    }
    
    const validPromos = {
        'BIENVENUE15': 15,
        'ANDU2025': 20,
        'SOLDE30': 30,
        'PREMIUM25': 25
    };
    
    if (validPromos[code]) {
        const discount = validPromos[code];
        applyPromoToCart(code, discount);
        message.innerHTML = `<span style="color: green;">✅ Code ${code} appliqué : ${discount}% de réduction !</span>`;
    } else {
        message.innerHTML = '<span style="color: red;">❌ Code promo invalide</span>';
    }
}

// ===== APPLIQUER PROMO AU PANIER =====
function applyPromoToCart(promoCode, discountPercentage) {
    activePromoCode = promoCode;
    promoDiscount = discountPercentage;
    
    floatingCart.forEach(item => {
        item.promoPrice = Math.round(item.price * (1 - discountPercentage / 100));
    });
    
    localStorage.setItem('anduxara_cart', JSON.stringify(floatingCart));
    localStorage.setItem('anduxara_active_promo', JSON.stringify({
        code: promoCode,
        discount: discountPercentage,
        appliedAt: new Date().toISOString()
    }));
    
    updateFloatingCart();
    updateActivePromoDisplay();
    showNotification('✅ Code ' + promoCode + ' appliqué : ' + discountPercentage + '% de réduction !');
}

// ===== METTRE À JOUR AFFICHAGE PROMO ACTIF =====
function updateActivePromoDisplay() {
    const display = document.getElementById('active-promo-display');
    const codeElement = document.getElementById('active-promo-code');
    
    if (display && codeElement) {
        if (activePromoCode && promoDiscount > 0) {
            display.style.display = 'block';
            codeElement.textContent = `${activePromoCode} (-${promoDiscount}%)`;
        } else {
            display.style.display = 'none';
        }
    }
}

// ===== RETIRER PROMO =====
function removePromoFromCart() {
    activePromoCode = null;
    promoDiscount = 0;
    
    floatingCart.forEach(item => {
        item.promoPrice = item.price;
    });
    
    localStorage.setItem('anduxara_cart', JSON.stringify(floatingCart));
    localStorage.removeItem('anduxara_active_promo');
    
    updateFloatingCart();
    updateActivePromoDisplay();
    showNotification('🗑️ Code promo retiré');
}

// ===== TOGGLE PANIER =====
function toggleFloatingCart() {
    const cart = document.getElementById('floating-cart');
    if (cart) {
        cart.classList.toggle('open');
        if (cart.classList.contains('open')) {
            updateFloatingCart();
        }
    }
}

function closeFloatingCart() {
    const cart = document.getElementById('floating-cart');
    if (cart) {
        cart.classList.remove('open');
    }
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation des fonctions manquantes...');
    
    // Charger le panier
    floatingCart = JSON.parse(localStorage.getItem('anduxara_cart')) || [];
    
    // Charger le code promo actif
    const savedPromo = localStorage.getItem('anduxara_active_promo');
    if (savedPromo) {
        try {
            const promoData = JSON.parse(savedPromo);
            activePromoCode = promoData.code;
            promoDiscount = promoData.discount;
            updateActivePromoDisplay();
        } catch (e) {
            console.error('Erreur chargement promo:', e);
        }
    }
    
    // Mettre à jour l'affichage initial
    updateCartCounter();
    updateFloatingCart();
    
    console.log('✅ Fonctions manquantes initialisées !');
});
