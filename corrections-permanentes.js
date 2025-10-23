// ===== CORRECTIONS PERMANENTES ANDU-XARA =====
// Ce fichier résout tous les problèmes manquants

console.log('🚀 Chargement des corrections permanentes...');

// ===== VARIABLES GLOBALES =====
window.floatingCart = JSON.parse(localStorage.getItem('anduxara_cart')) || [];
window.activePromoCode = null;
window.promoDiscount = 0;

// ===== FONCTIONS PANIER =====
window.toggleFloatingCart = function() {
    const cart = document.getElementById('floating-cart');
    if (cart) {
        cart.classList.toggle('open');
        if (cart.classList.contains('open')) {
            window.updateFloatingCart();
        }
    }
};

window.closeFloatingCart = function() {
    const cart = document.getElementById('floating-cart');
    if (cart) {
        cart.classList.remove('open');
    }
};

window.updateFloatingCart = function() {
    const container = document.getElementById('cart-items-floating');
    const totalElement = document.getElementById('cart-total-floating');
    const badge = document.getElementById('cart-badge-floating');
    
    if (!container || !totalElement || !badge) return;
    
    const total = window.floatingCart.reduce((sum, item) => sum + (item.promoPrice * item.quantity), 0);
    const totalItems = window.floatingCart.reduce((sum, item) => sum + item.quantity, 0);
    
    badge.textContent = totalItems;
    totalElement.textContent = total;
    
    if (window.floatingCart.length === 0) {
        container.innerHTML = '<div class="empty-cart-floating">Votre panier est vide</div>';
    } else {
        container.innerHTML = window.floatingCart.map((item, index) => `
            <div class="cart-item-floating">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.quantity} x ${item.promoPrice} MRU</p>
                    <button class="remove-item" onclick="window.removeFromFloatingCart(${index})">🗑️</button>
                </div>
                <div class="cart-item-price">
                    ${item.promoPrice * item.quantity} MRU
                </div>
            </div>
        `).join('');
    }
};

window.removeFromFloatingCart = function(index) {
    if (window.floatingCart[index]) {
        const productName = window.floatingCart[index].name;
        window.floatingCart.splice(index, 1);
        localStorage.setItem('anduxara_cart', JSON.stringify(window.floatingCart));
        window.updateFloatingCart();
        window.showNotification('🗑️ ' + productName + ' retiré du panier');
    }
};

window.ajouterAuPanier = function(productName, category, price) {
    const existingItem = window.floatingCart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        window.floatingCart.push({
            name: productName,
            category: category,
            price: price,
            promoPrice: price,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('anduxara_cart', JSON.stringify(window.floatingCart));
    window.updateFloatingCart();
    window.showNotification('✅ ' + productName + ' ajouté au panier !');
};

// ===== FONCTION LIVRAISON =====
window.checkDelivery = function() {
    const addressInput = document.getElementById('delivery-address');
    const resultDiv = document.getElementById('delivery-result');

    if (!addressInput || !resultDiv) return;

    const address = addressInput.value.trim();
    if (!address || address.length < 5) {
        resultDiv.innerHTML = '<p style="color: red;">❌ Adresse trop courte</p>';
        return;
    }

    resultDiv.innerHTML = '<p style="color: blue;">🔄 Recherche...</p>';

    setTimeout(() => {
        const addressLower = address.toLowerCase();
        const zonesCouvertes = ['nouakchott', 'nouadhibou', 'rosso', 'kaédi', 'tevregh', 'dar naim'];
        
        const estCouvert = zonesCouvertes.some(zone => addressLower.includes(zone));
        
        if (estCouvert) {
            resultDiv.innerHTML = '<p style="color: green;">✅ Livraison disponible !</p>';
        } else {
            resultDiv.innerHTML = '<p style="color: red;">❌ Zone non couverte</p>';
        }
    }, 1000);
};

// ===== FONCTION ASSISTANT IA =====
window.sendAIMessage = function() {
    const inputField = document.getElementById('ai-input');
    const messagesDiv = document.getElementById('ai-messages');
    
    if (!inputField || !messagesDiv) return;
    
    const question = inputField.value.trim();
    if (!question) return;
    
    // Afficher question utilisateur
    const userMsg = document.createElement('div');
    userMsg.style.cssText = 'display: flex; justify-content: flex-end; margin-bottom: 15px;';
    userMsg.innerHTML = `<div style="background: #667eea; color: white; padding: 15px 20px; border-radius: 20px; max-width: 70%;">${question}</div>`;
    messagesDiv.appendChild(userMsg);
    
    inputField.value = '';
    
    // Réponse automatique
    setTimeout(() => {
        let response = "🤖 Bonjour ! Je suis l'assistant Andu-Xara. ";
        
        if (question.toLowerCase().includes('produit')) {
            response = "🎨 Nous avons T-shirts, ensembles, pulls et vêtements enfants !";
        } else if (question.toLowerCase().includes('prix')) {
            response = "💰 Promotion 30% ! T-shirts à partir de 279 MRU";
        } else if (question.toLowerCase().includes('livraison')) {
            response = "🚚 Livraison gratuite partout en Mauritanie !";
        }
        
        const botMsg = document.createElement('div');
        botMsg.style.cssText = 'display: flex; justify-content: flex-start; margin-bottom: 15px;';
        botMsg.innerHTML = `<div style="background: white; padding: 15px 20px; border-radius: 20px; border: 1px solid #e2e8f0; max-width: 70%;">${response}</div>`;
        messagesDiv.appendChild(botMsg);
        
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 1000);
};

// ===== NOTIFICATIONS =====
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
        z-index: 10000;
    `;
    notification.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
};

// ===== PROCESSUS COMMANDE =====
window.processFloatingCheckout = function() {
    if (window.floatingCart.length === 0) {
        window.showNotification('Panier vide !', 'error');
        return;
    }
    
    const totalMRU = window.floatingCart.reduce((sum, item) => sum + (item.promoPrice * item.quantity), 0);
    const productList = window.floatingCart.map(item => 
        `${item.name} (x${item.quantity}) - ${item.promoPrice * item.quantity} MRU`
    ).join('\n');
    
    const message = `Bonjour ! Je souhaite commander :\n\n${productList}\n\n💰 Total : ${totalMRU} MRU`;
    
    const choice = prompt(`💳 PAIEMENT : ${totalMRU} MRU\n\n1️⃣ Wave\n2️⃣ Bankily\n3️⃣ WhatsApp\n\nVotre choix :`);
    
    if (choice === '3') {
        window.open(`https://wa.me/22249037697?text=${encodeURIComponent(message)}`, '_blank');
    }
};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Corrections permanentes chargées !');
    
    // Configurer les événements
    const addressInput = document.getElementById('delivery-address');
    if (addressInput) {
        addressInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') window.checkDelivery();
        });
    }
    
    const aiInput = document.getElementById('ai-input');
    if (aiInput) {
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') window.sendAIMessage();
        });
    }
});

console.log('🎉 Toutes les corrections sont maintenant permanentes !');
