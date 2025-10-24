#!/usr/bin/env python3
# Script pour créer les corrections essentielles

# Créer le fichier de corrections
corrections_content = '''// ===== CORRECTIONS ESSENTIELLES POUR ANDU-XARA =====

console.log('🎯 Chargement des corrections essentielles...');

// 1. VARIABLES GLOBALES MANQUANTES
let floatingCart = JSON.parse(localStorage.getItem('anduxara_cart')) || [];
let activePromoCode = null;
let promoDiscount = 0;

// 2. FONCTION AJOUTER AU PANIER
function ajouterAuPanier(nom, categorie, prix) {
    console.log('🛒 Ajout au panier:', nom, prix + ' MRU');
    
    const produitExistant = floatingCart.find(item => item.name === nom);
    
    if (produitExistant) {
        produitExistant.quantity += 1;
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
    updateFloatingCart();
    showNotification('✅ ' + nom + ' ajouté au panier !');
}

// 3. FONCTION MISE À JOUR PANIER
function updateFloatingCart() {
    const cartItems = document.getElementById('cart-items-floating');
    const cartTotal = document.getElementById('cart-total-floating');
    const cartBadge = document.getElementById('cart-badge-floating');
    
    if (!cartItems || !cartTotal || !cartBadge) {
        console.log('❌ Éléments panier non trouvés');
        return;
    }
    
    // Mettre à jour le badge
    const totalItems = floatingCart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'inline' : 'none';
    
    // Mettre à jour les articles
    if (floatingCart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart-floating">🛒 Votre panier est vide</div>';
        cartTotal.textContent = '0';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = floatingCart.map((item, index) => {
        const prixUnitaire = item.promoPrice || item.price;
        const itemTotal = prixUnitaire * item.quantity;
        total += itemTotal;
        
        return `
            <div class="cart-item-floating">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Quantité: ${item.quantity} × ${prixUnitaire} MRU</p>
                    <button class="remove-item" onclick="removeFromFloatingCart(${index})">❌ Retirer</button>
                </div>
                <div class="cart-item-price">${itemTotal} MRU</div>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = total;
}

// 4. FONCTION RETIRER DU PANIER
function removeFromFloatingCart(index) {
    if (index >= 0 && index < floatingCart.length) {
        floatingCart.splice(index, 1);
        localStorage.setItem('anduxara_cart', JSON.stringify(floatingCart));
        updateFloatingCart();
        showNotification('🗑️ Produit retiré du panier');
    }
}

// 5. FONCTIONS PANIER MANQUANTES
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

// 6. FONCTION NOTIFICATION
function showNotification(message, type = 'success') {
    // Créer une notification simple
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
}

// 7. FONCTION PAIEMENT SIMPLIFIÉE
function processFloatingCheckout() {
    if (floatingCart.length === 0) {
        showNotification('🛒 Votre panier est vide !', 'error');
        return;
    }
    
    const totalMRU = floatingCart.reduce((sum, item) => {
        return sum + (item.promoPrice || item.price) * item.quantity;
    }, 0);
    
    const productList = floatingCart.map(item => 
        `${item.name} (x${item.quantity}) - ${(item.promoPrice || item.price) * item.quantity} MRU`
    ).join('\\n');
    
    const message = `Bonjour Andu-Xara ! 👋\\n\\nJe souhaite commander :\\n\\n${productList}\\n\\n💰 Total : ${totalMRU} MRU\\n\\nMerci de me contacter pour finaliser la commande !`;
    
    // Ouvrir WhatsApp
    window.open(`https://wa.me/22249037697?text=${encodeURIComponent(message)}`, '_blank');
    showNotification('📱 WhatsApp ouvert ! Contactez-nous pour finaliser.');
}

// 8. INITIALISATION AU CHARGEMENT
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation Andu-Xara...');
    
    // Initialiser le panier
    updateFloatingCart();
    
    // Fermer le panier en cliquant à l'extérieur
    document.addEventListener('click', function(event) {
        const cart = document.getElementById('floating-cart');
        const toggle = document.querySelector('.cart-toggle');
        
        if (cart && cart.classList.contains('open') &&
            !cart.contains(event.target) && 
            !toggle.contains(event.target)) {
            closeFloatingCart();
        }
    });
    
    console.log('✅ Andu-Xara initialisé avec succès !');
});

console.log('🎯 Correctives essentielles chargées !');
'''

# Écrire le fichier
with open('corrections-essentielles.js', 'w') as f:
    f.write(corrections_content)

print("✅ Fichier corrections-essentielles.js créé avec succès !")

# Créer un fichier HTML simple de test
html_content = '''<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Andu-Xara - Test Panier</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .product { border: 1px solid #ddd; padding: 15px; margin: 10px; border-radius: 5px; }
        button { background: #6a11cb; color: white; border: none; padding: 10px; cursor: pointer; }
        #floating-cart { position: fixed; bottom: 20px; right: 20px; background: white; border: 1px solid #ccc; padding: 15px; }
    </style>
</head>
<body>
    <h1>🛍️ Test Panier Andu-Xara</h1>
    
    <div class="product">
        <h3>T-shirt Logo Arabe</h3>
        <p>Prix: 349 MRU</p>
        <button onclick="ajouterAuPanier('T-shirt Logo Arabe', 't-shirts', 349)">Ajouter au panier</button>
    </div>
    
    <div class="product">
        <h3>Ensemble Capuche</h3>
        <p>Prix: 419 MRU</p>
        <button onclick="ajouterAuPanier('Ensemble Capuche', 'ensembles', 419)">Ajouter au panier</button>
    </div>
    
    <div id="floating-cart">
        <h3>🛒 Votre Panier</h3>
        <div id="cart-items-floating"></div>
        <p>Total: <span id="cart-total-floating">0</span> MRU</p>
        <button onclick="toggleFloatingCart()">Ouvrir/Fermer</button>
        <button onclick="processFloatingCheckout()">Commander</button>
    </div>
    
    <script src="corrections-essentielles.js"></script>
</body>
</html>
'''

with open('test-panier.html', 'w') as f:
    f.write(html_content)

print("✅ Fichier test-panier.html créé avec succès !")
