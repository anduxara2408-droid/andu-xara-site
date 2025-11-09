// ===== CORRECTIONS URGENTES SIMPLES =====
console.log('🔧 Correctifs urgents chargés');

// Fonction sendAIMessage
if (typeof sendAIMessage === 'undefined') {
    window.sendAIMessage = function() { alert('🤖 IA en développement'); };
}

// Fonction toggleFloatingCart
if (typeof toggleFloatingCart === 'undefined') {
    window.toggleFloatingCart = function() {
        const cart = document.getElementById('floating-cart');
        if (cart) cart.classList.toggle('open');
    };
}

// Fonction ajouterAuPanier
if (typeof ajouterAuPanier === 'undefined') {
    window.ajouterAuPanier = function(nom, cat, prix) {
        console.log('🛒 Ajout:', nom, prix + ' MRU');
        const existant = window.floatingCart.find(item => item.name === nom);
        if (existant) {
            existant.quantity += 1;
        } else {
            window.floatingCart.push({
                name: nom, category: cat, price: prix, 
                promoPrice: prix, quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        localStorage.setItem('anduxara_cart', JSON.stringify(window.floatingCart));
        if (typeof updateFloatingCart === 'function') updateFloatingCart();
    };
}
