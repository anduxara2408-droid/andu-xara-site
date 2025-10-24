// ===== CORRECTIONS COMPLÈTES ANDU-XARA =====
console.log('🚀 Chargement des corrections complètes...');

// ===== VARIABLES GLOBALES =====
window.floatingCart = JSON.parse(localStorage.getItem('anduxara_cart')) || [];
window.activePromoCode = null;
window.promoDiscount = 0;

// ===== FONCTION AJOUTER AU PANIER =====
function ajouterAuPanier(nom, categorie, prix) {
    console.log('🛒 Ajout au panier:', nom, prix + ' MRU');
    
    const produitExistant = floatingCart.find(item => item.name === nom && item.price === prix);
    
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
    showNotification('✅ ' + nom + ' ajouté au panier !');
    
    if (typeof updateFloatingCart === 'function') updateFloatingCart();
}

// ===== FONCTION PANIER FLOTTANT =====
function toggleFloatingCart() {
    const cart = document.getElementById('floating-cart');
    if (cart) {
        cart.classList.toggle('open');
        if (cart.classList.contains('open') && typeof updateFloatingCart === 'function') {
            updateFloatingCart();
        }
    }
}

function closeFloatingCart() {
    const cart = document.getElementById('floating-cart');
    if (cart) cart.classList.remove('open');
}

function updateFloatingCart() {
    const itemsContainer = document.getElementById('cart-items-floating');
    const totalElement = document.getElementById('cart-total-floating');
    const badgeElement = document.getElementById('cart-badge-floating');
    
    if (!itemsContainer) {
        console.error('❌ Container cart-items-floating non trouvé');
        return;
    }
    
    if (badgeElement) {
        const totalItems = floatingCart.reduce((sum, item) => sum + item.quantity, 0);
        badgeElement.textContent = totalItems;
        badgeElement.style.display = totalItems > 0 ? 'inline' : 'none';
    }
    
    itemsContainer.innerHTML = '';
    
    if (floatingCart.length === 0) {
        itemsContainer.innerHTML = '<div class="empty-cart-floating">🛒 Votre panier est vide</div>';
        if (totalElement) totalElement.textContent = '0 MRU';
        return;
    }
    
    let total = 0;
    floatingCart.forEach((item, index) => {
        const itemTotal = (item.promoPrice || item.price) * item.quantity;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item-floating';
        itemElement.innerHTML = '<div class="cart-item-info"><h4>' + item.name + '</h4><p>Quantité: ' + item.quantity + ' × ' + (item.promoPrice || item.price) + ' MRU</p><button class="remove-item" onclick="removeFromFloatingCart(' + index + ')">🗑️ Retirer</button></div><div class="cart-item-price">' + itemTotal + ' MRU</div>';
        itemsContainer.appendChild(itemElement);
    });
    
    if (totalElement) totalElement.textContent = total + ' MRU';
}

function removeFromFloatingCart(index) {
    if (index >= 0 && index < floatingCart.length) {
        const nomProduit = floatingCart[index].name;
        floatingCart.splice(index, 1);
        localStorage.setItem('anduxara_cart', JSON.stringify(floatingCart));
        updateFloatingCart();
        showNotification('🗑️ ' + nomProduit + ' retiré du panier');
    }
}

// ===== SYSTÈME DE NOTIFICATIONS =====
function showNotification(message, type = 'success') {
    document.querySelectorAll('.notification-custom').forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification-custom ' + type;
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: ' + (type === 'error' ? '#ff4757' : type === 'warning' ? '#ffa502' : '#25D366') + '; color: white; padding: 15px 20px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); z-index: 10000; animation: slideInRight 0.3s ease; display: flex; align-items: center; gap: 10px; max-width: 350px;';
    
    notification.innerHTML = '<span>' + (type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅') + '</span><span>' + message + '</span>';

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

// ===== SYSTÈME DE COMMANDE AMÉLIORÉ =====
function processFloatingCheckout() {
    if (floatingCart.length === 0) {
        showNotification('🛒 Votre panier est vide !', 'error');
        return;
    }
    
    const totalMRU = floatingCart.reduce((sum, item) => {
        return sum + ((item.promoPrice || item.price) * item.quantity);
    }, 0);
    
    const totalFCFA = Math.round(totalMRU * 2.5);
    
    const productList = floatingCart.map(item => 
        item.name + ' (x' + item.quantity + ') - ' + ((item.promoPrice || item.price) * item.quantity) + ' MRU'
    ).join('\n');
    
    const message = 'Bonjour Andu-Xara ! 👋\n\nJe souhaite commander :\n\n' + productList + '\n\n💰 Total : ' + totalMRU + ' MRU\n\nMerci de me guider pour la suite !';
    
    // Menu de choix de paiement
    const paymentChoice = prompt(
        '💳 CHOISISSEZ VOTRE MÉTHODE DE PAIEMENT\n\n' +
        '💰 Montant : ' + totalMRU + ' MRU (' + totalFCFA + ' FCFA)\n\n' +
        'Tapez 1, 2 ou 3 :\n\n' +
        '1️⃣ → Wave Sénégal (' + totalFCFA + ' FCFA)\n' +
        '2️⃣ → Bankily Mauritanie (' + totalMRU + ' MRU)\n' +
        '3️⃣ → WhatsApp (Discuter)\n\n' +
        'Votre choix (1/2/3) :'
    );

    if (paymentChoice === '1') {
        const waveMessage = 'Bonjour ! Je souhaite payer ma commande Andu-Xara par Wave.\n\n' + message;
        window.open('https://wa.me/221762821133?text=' + encodeURIComponent(waveMessage), '_blank');
        showNotification('🌊 Wave Sénégal sélectionné');
    } else if (paymentChoice === '2') {
        const bankilyMessage = 'Bonjour ! Je souhaite payer ma commande Andu-Xara par Bankily.\n\n' + message;
        window.open('https://wa.me/22249037697?text=' + encodeURIComponent(bankilyMessage), '_blank');
        showNotification('🏦 Bankily Mauritanie sélectionné');
    } else if (paymentChoice === '3') {
        window.open('https://wa.me/22249037697?text=' + encodeURIComponent(message), '_blank');
        showNotification('📱 WhatsApp ouvert !');
    } else {
        showNotification('❌ Choix annulé', 'warning');
    }
}

// ===== SYSTÈME DE LIVRAISON =====
function checkDelivery() {
    showNotification('🚚 Vérification de la livraison...', 'info');
}

function selectDeliveryOption(type) {
    showNotification('✅ Option ' + type + ' sélectionnée !');
}

// ===== ASSISTANT IA =====
function sendAIMessage() {
    showNotification('🤖 Assistant IA en développement...', 'info');
}

// ===== FONCTIONS DE DÉBUG =====
function debugParrainages() {
    showNotification('🔍 Debug dans la console');
}

function resetDashboard() {
    showNotification('✅ Tableau de bord réinitialisé !');
}

// ===== ESSAYAGE VIRTUEL =====
function startVirtualFitting() {
    showNotification('🪞 Essayage virtuel en développement...', 'info');
}

function selectClothing(productId) {
    showNotification('👕 Sélection: ' + productId, 'info');
}

function captureVirtualFitting() {
    showNotification('📸 Capture en développement...', 'info');
}

function shareVirtualFitting() {
    showNotification('📤 Partage en développement...', 'info');
}

// ===== INITIALISATION =====
function initAllSystems() {
    console.log('🚀 Initialisation des systèmes...');
    
    const savedCart = localStorage.getItem('anduxara_cart');
    if (savedCart) {
        floatingCart = JSON.parse(savedCart);
    }
    
    updateFloatingCart();
    
    console.log('✅ Systèmes initialisés !');
}

// ===== DÉMARRAGE AUTOMATIQUE =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM chargé, initialisation...');
    setTimeout(initAllSystems, 1000);
});

console.log('🔧 Corrections chargées !');

// ===== SYSTÈME DE LIVRAISON COMPLET =====
function checkDelivery() {
    const addressInput = document.getElementById('delivery-address');
    const resultDiv = document.getElementById('delivery-result');
    
    if (!addressInput || !resultDiv) {
        showNotification('❌ Système livraison non disponible', 'error');
        return;
    }
    
    const address = addressInput.value.trim();
    
    if (!address || address.length < 5) {
        resultDiv.innerHTML = \"<p style=\"color: red; padding: 10px; background: #ffe8e8; border-radius: 5px;\">❌ L'adresse doit contenir au moins 5 caractères</p>\";
        return;
    }
    
    resultDiv.innerHTML = '<p style="color: #667eea; padding: 10px; background: #f0f4ff; border-radius: 5px;">🔄 Recherche de votre zone...</p>';
    
    setTimeout(() => {
        const addressLower = address.toLowerCase();
        const zonesCouvertes = ['nouakchott', 'nouadhibou', 'rosso', 'kaédi', 'kiffa', 'atar', 'zouérat', 'tevregh', 'mina', 'ksar', 'sebkha', 'dar naim', 'toujounine', 'arafat', 'ryad'];
        
        let estCouvert = false;
        let message = '';
        let delai = '';
        
        for (const zone of zonesCouvertes) {
            if (addressLower.includes(zone)) {
                estCouvert = true;
                if (addressLower.includes('nouakchott') || addressLower.includes('tevregh') || addressLower.includes('mina') || addressLower.includes('ksar') || addressLower.includes('sebkha')) {
                    message = '✅ Livraison EXPRESS disponible !';
                    delai = '⏱️ Livraison en 24h - GRATUITE';
                } else {
                    message = '✅ Livraison STANDARD disponible !';
                    delai = '⏱️ Livraison en 3-5 jours - GRATUITE';
                }
                break;
            }
        }
        
        if (!estCouvert) {
            message = '❌ Livraison non disponible dans votre zone';
            delai = '📞 Contactez-nous au +222 49 03 76 97';
        }
        
        resultDiv.innerHTML = '<div style="padding: 15px; border-radius: 10px; background: ' + (estCouvert ? '#e8f5e8' : '#ffe8e8') + '; border: 2px solid ' + (estCouvert ? '#25D366' : '#ff4757') + ';"><h4 style="margin: 0 0 10px 0; color: ' + (estCouvert ? '#25D366' : '#ff4757') + ';">' + message + '</h4><p style="margin: 0; font-weight: bold;">' + delai + '</p></div>';
        
    }, 1000);
}

function selectDeliveryOption(type) {
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.type === type) {
            option.classList.add('selected');
        }
    });
    
    showNotification('✅ Option ' + (type === 'express' ? 'Express (24h)' : 'Standard (3-5 jours)') + ' sélectionnée !');
}

// ===== ASSISTANT IA INTELLIGENT =====
function sendAIMessage() {
    const input = document.getElementById('ai-input');
    const messagesContainer = document.getElementById('ai-messages');
    
    if (!input || !messagesContainer) {
        showNotification('❌ Assistant IA non disponible', 'error');
        return;
    }
    
    const message = input.value.trim();
    
    if (!message) {
        showNotification('📝 Veuillez écrire votre question', 'info');
        return;
    }
    
    // Ajouter le message utilisateur
    const userMessageDiv = document.createElement('div');
    userMessageDiv.style.cssText = 'display: flex; justify-content: flex-end; margin-bottom: 15px;';
    userMessageDiv.innerHTML = '<div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 20px; border-radius: 20px; border-bottom-right-radius: 5px; max-width: 70%;">' + message + '</div>';
    messagesContainer.appendChild(userMessageDiv);
    
    input.value = '';
    
    // Réponse automatique basée sur le contenu
    setTimeout(() => {
        const botMessageDiv = document.createElement('div');
        botMessageDiv.style.cssText = 'display: flex; justify-content: flex-start; margin-bottom: 15px;';
        
        let response = '';
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
            response = '👋 Bonjour ! Je suis l\\'Assistant IA Andu-Xara. Je peux vous aider avec nos produits, prix, livraison, et plus encore !';
        } else if (lowerMessage.includes('produit') || lowerMessage.includes('vêtement') || lowerMessage.includes('tshirt') || lowerMessage.includes('ensemble')) {
            response = '🎨 Nous avons une large gamme de produits : T-shirts (279-349 MRU), Ensembles (419-1049 MRU), Accessoires. Quel style vous intéresse ?';
        } else if (lowerMessage.includes('prix') || lowerMessage.includes('combien') || lowerMessage.includes('coût')) {
            response = '💰 Nos prix vont de 209 MRU (accessoires) à 1049 MRU (ensembles premium). Promotion en cours : 30% de réduction sur tout le catalogue !';
        } else if (lowerMessage.includes('livraison') || lowerMessage.includes('livrer') || lowerMessage.includes('délai')) {
            response = '🚚 Livraison GRATUITE partout en Mauritanie ! Nouakchott : 24h, Autres villes : 3-5 jours. Vérifiez votre zone dans notre section livraison.';
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('téléphone') || lowerMessage.includes('whatsapp')) {
            response = '📞 Contactez-nous : WhatsApp +222 49 03 76 97, Email: anduxara2408@gmail.com. Service client 7j/7 !';
        } else if (lowerMessage.includes('code promo') || lowerMessage.includes('réduction') || lowerMessage.includes('promo')) {
            response = '🎁 Codes promo disponibles : BIENVENUE15 (-15%), ANDU2025 (-20%), SOLDE30 (-30%). Utilisez-les dans la section codes promo !';
        } else {
            response = '🤖 Je suis l\\'Assistant IA Andu-Xara. Je peux vous aider avec :\\n• 📦 Nos produits et collections\\n• 💰 Prix et promotions\\n• 🚚 Livraison et commandes\\n• 📱 Contacts et support\\n\\nPosez-moi votre question !';
        }
        
        botMessageDiv.innerHTML = '<div style="background: white; color: #2c3e50; padding: 15px 20px; border-radius: 20px; border-bottom-left-radius: 5px; border: 1px solid #e2e8f0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 70%; white-space: pre-line;">' + response + '</div>';
        messagesContainer.appendChild(botMessageDiv);
        
        // Scroll vers le bas
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
    }, 1000);
}

// ===== FONCTIONS DE DÉBUG COMPLÈTES =====
function debugParrainages() {
    console.log('🔍 DEBUG PARRAINAGES:', {
        panier: floatingCart,
        codePromoActif: activePromoCode,
        reduction: promoDiscount + '%',
        localStorage: {
            panier: localStorage.getItem('anduxara_cart'),
            promo: localStorage.getItem('anduxara_active_promo'),
            userData: localStorage.getItem('anduxara_user_dashboard')
        }
    });
    
    // Afficher un rapport détaillé
    const debugInfo = `
🔍 RAPPORT DE DÉBUG :

🛒 PANIER: ${floatingCart.length} article(s)
💰 TOTAL: ${floatingCart.reduce((sum, item) => sum + ((item.promoPrice || item.price) * item.quantity), 0)} MRU
🎁 CODE PROMO: ${activePromoCode || 'Aucun'} ${promoDiscount ? '(' + promoDiscount + '%)' : ''}

📦 ARTICLES:
${floatingCart.map(item => `• ${item.name} (x${item.quantity}) - ${(item.promoPrice || item.price) * item.quantity} MRU`).join('\\n')}

✅ Données complètes dans la console (F12)
    `;
    
    alert(debugInfo);
    showNotification('🔍 Rapport de debug affiché !');
}

function resetDashboard() {
    if (confirm('ÊTES-VOUS SÛR DE VOULOIR RÉINITIALISER VOTRE TABLEAU DE BORD ?\\n\\nCette action supprimera :\\n• Votre historique de consultation\\n• Vos produits favoris\\n• Vos statistiques personnelles\\n\\nCette action est irréversible.')) {
        localStorage.removeItem('anduxara_user_dashboard');
        localStorage.removeItem('anduxara_user_behavior');
        showNotification('✅ Tableau de bord réinitialisé avec succès !');
        
        // Recharger la page pour voir les changements
        setTimeout(() => {
            location.reload();
        }, 2000);
    }
}

// ===== INITIALISATION DES ÉVÉNEMENTS =====
function initEventListeners() {
    // Livraison - Entrée
    const addressInput = document.getElementById('delivery-address');
    if (addressInput) {
        addressInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkDelivery();
            }
        });
    }
    
    // Options de livraison
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            selectDeliveryOption(this.dataset.type);
        });
    });
    
    // Assistant IA - Entrée
    const aiInput = document.getElementById('ai-input');
    if (aiInput) {
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendAIMessage();
            }
        });
    }
    
    // Codes promo - Entrée
    const promoInput = document.getElementById('promoInput');
    if (promoInput) {
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                validateAndApplyPromo();
            }
        });
    }
    
    console.log('✅ Événements initialisés');
}

// Mettre à jour l'initialisation
function initAllSystems() {
    console.log('🚀 Initialisation des systèmes...');
    
    const savedCart = localStorage.getItem('anduxara_cart');
    if (savedCart) {
        floatingCart = JSON.parse(savedCart);
    }
    
    const savedPromo = localStorage.getItem('anduxara_active_promo');
    if (savedPromo) {
        try {
            const promoData = JSON.parse(savedPromo);
            activePromoCode = promoData.code;
            promoDiscount = promoData.discount;
            
            floatingCart.forEach(item => {
                item.promoPrice = Math.round(item.price * (1 - promoDiscount / 100));
            });
        } catch (e) {
            console.error('Erreur chargement promo:', e);
        }
    }
    
    updateFloatingCart();
    updateActivePromoDisplay();
    initEventListeners();
    
    console.log('✅ Systèmes initialisés !');
}
