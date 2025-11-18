// SOLUTION TEMPORAIRE - Exécutez ceci dans la console du navigateur

// 1. Définir les fonctions immédiatement dans window
window.toggleFloatingCart = function() {
    console.log('🛒 toggleFloatingCart appelée');
    const cart = document.getElementById('floating-cart');
    if (cart) {
        cart.classList.toggle('open');
        console.log('✅ Panier ouvert/fermé');
    } else {
        console.error('❌ Élément floating-cart non trouvé');
    }
};

window.ajouterAuPanier = function(productName, category, price) {
    console.log('🛒 Ajout au panier:', productName);
    
    // Initialiser le panier
    if (!window.floatingCart) {
        window.floatingCart = JSON.parse(localStorage.getItem('anduxara_cart')) || [];
    }
    
    const numericPrice = typeof price === 'string' ? 
        parseInt(price.replace(' MRU', '').replace(/\s/g, '')) : 
        Number(price);
    
    if (isNaN(numericPrice)) {
        console.error('❌ Prix invalide:', price);
        alert('❌ Erreur: Prix invalide');
        return;
    }

    // Rechercher si le produit existe
    const existingItem = window.floatingCart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += 1;
        console.log('📈 Quantité augmentée:', existingItem.quantity);
    } else {
        window.floatingCart.push({
            name: productName,
            category: category,
            price: numericPrice,
            promoPrice: numericPrice,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
        console.log('🆕 Nouveau produit ajouté');
    }
    
    // Sauvegarder
    localStorage.setItem('anduxara_cart', JSON.stringify(window.floatingCart));
    
    // Mettre à jour l'affichage
    if (typeof window.updateFloatingCart === 'function') {
        window.updateFloatingCart();
    }
    
    alert('✅ ' + productName + ' ajouté au panier !');
};

console.log('🔧 Fonctions panier réparées ! Testez maintenant.');
