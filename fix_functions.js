// RÉPARATION URGENTE DES FONCTIONS MANQUANTES

// 1. Fonction ajouterAuPanier
window.ajouterAuPanier = function(productName, category, price) {
    console.log('🛒 FORCED: Ajout au panier:', productName);
    
    // Initialiser le panier si pas fait
    if (!window.floatingCart) {
        window.floatingCart = JSON.parse(localStorage.getItem('anduxara_cart')) || [];
    }
    
    const numericPrice = typeof price === 'string' ? 
        parseInt(price.replace(' MRU', '').replace(/\s/g, '')) : 
        Number(price);
    
    // Rechercher si le produit existe déjà
    const existingItem = window.floatingCart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        window.floatingCart.push({
            name: productName,
            category: category,
            price: numericPrice,
            promoPrice: numericPrice,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    // Sauvegarder
    localStorage.setItem('anduxara_cart', JSON.stringify(window.floatingCart));
    
    // Mettre à jour l'affichage
    if (typeof window.updateFloatingCart === 'function') {
        window.updateFloatingCart();
    }
    
    alert('✅ ' + productName + ' ajouté au panier !');
};

// 2. Fonction toggleFloatingCart  
window.toggleFloatingCart = function() {
    console.log('🛒 FORCED: Toggle panier');
    const cart = document.getElementById('floating-cart');
    if (cart) {
        cart.classList.toggle('open');
        console.log('✅ Panier ouvert/fermé');
    }
};

// 3. Initialiser le panier au chargement
document.addEventListener('DOMContentLoaded', function() {
    if (!window.floatingCart) {
        window.floatingCart = JSON.parse(localStorage.getItem('anduxara_cart')) || [];
    }
    console.log('🛒 Panier initialisé:', window.floatingCart.length + ' produits');
});

console.log('🔧 Fonctions de panier réparées !');
