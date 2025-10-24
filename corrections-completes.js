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

// ===== SYSTÈME DE CODES PROMO =====
function validateAndApplyPromo() {
    const input = document.getElementById('promoInput');
    const message = document.getElementById('promoMessage');
    
    if (!input || !message) {
        showNotification('❌ Système promo non disponible', 'error');
        return;
    }
    
    const code = input.value.trim().toUpperCase();
    
    if (!code) {
        message.innerHTML = '<span style="color: red;">❌ Veuillez entrer un code</span>';
        return;
    }
    
    const validCodes = {
        'BIENVENUE15': 15,
        'ANDU2025': 20,
        'SOLDE30': 30,
        'PREMIUM25': 25
    };
    
    if (validCodes[code]) {
        const discount = validCodes[code];
        applyPromoToCart(code, discount);
        message.innerHTML = '<span style="color: green;">✅ Code ' + code + ' appliqué : ' + discount + '% de réduction !</span>';
        input.value = '';
    } else {
        message.innerHTML = '<span style="color: red;">❌ Code invalide ou expiré</span>';
    }
}

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

function updateActivePromoDisplay() {
    const display = document.getElementById('active-promo-display');
    const codeElement = document.getElementById('active-promo-code');
    
    if (display && codeElement) {
        if (activePromoCode && promoDiscount > 0) {
            display.style.display = 'block';
            codeElement.textContent = activePromoCode + ' (-' + promoDiscount + '%)';
        } else {
            display.style.display = 'none';
        }
    }
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
        // Wave Sénégal
        const waveMessage = 'Bonjour ! Je souhaite payer ma commande Andu-Xara par Wave.\n\n' + message;
        window.open('https://wa.me/221762821133?text=' + encodeURIComponent(waveMessage), '_blank');
        showNotification('🌊 Wave Sénégal sélectionné');
    } else if (paymentChoice === '2') {
        // Bankily Mauritanie
        const bankilyMessage = 'Bonjour ! Je souhaite payer ma commande Andu-Xara par Bankily.\n\n' + message;
        window.open('https://wa.me/22249037697?text=' + encodeURIComponent(bankilyMessage), '_blank');
        showNotification('🏦 Bankily Mauritanie sélectionné');
    } else if (paymentChoice === '3') {
        // WhatsApp direct
        window.open('https://wa.me/22249037697?text=' + encodeURIComponent(message), '_blank');
        showNotification('📱 WhatsApp ouvert !');
    } else {
        showNotification('❌ Choix annulé', 'warning');
    }
}

// ===== SYSTÈME DE LIVRAISON =====
function checkDelivery() {
    const addressInput = document.getElementById('delivery-address');
    const resultDiv = document.getElementById('delivery-result');
    
    if (!addressInput || !resultDiv) {
        showNotification('❌ Système livraison non disponible', 'error');
        return;
    }
    
    const address = addressInput.value.trim();
    
    if (!address || address.length < 5) {
        resultDiv.innerHTML = "Adresse trop courte (min 5 caractères)";
        return;
    }
    
    resultDiv.innerHTML = '<p style="color: #667eea; padding: 10px; background: #f0f4ff; border-radius: 5px;">🔄 Recherche de votre zone...</p>';
    
    setTimeout(() => {
        const addressLower = address.toLowerCase();
        const zonesCouvertes = ['nouakchott', 'basra', 'guidimakha',  'nouadhibou', 'rosso', 'kaédi', 'kiffa', 'atar', 'zouérat', 'tevregh', 'mina', 'ksar', 'sebkha'];
        
        let estCouvert = false;
        let message = '';
        
        for (const zone of zonesCouvertes) {
            if (addressLower.includes(zone)) {
                estCouvert = true;
                if (addressLower.includes('nouakchott') || addressLower.includes('tevregh') || addressLower.includes('mina')) {
                    message = '✅ Livraison EXPRESS disponible !';
                } else {
                    message = '✅ Livraison STANDARD disponible !';
                }
                break;
            }
        }
        
        if (!estCouvert) {
            message = '❌ Livraison non disponible dans votre zone';
        }
        
        resultDiv.innerHTML = '<div style="padding: 15px; border-radius: 10px; background: ' + (estCouvert ? '#e8f5e8' : '#ffe8e8') + '; border: 2px solid ' + (estCouvert ? '#25D366' : '#ff4757') + ';"><h4 style="margin: 0 0 10px 0; color: ' + (estCouvert ? '#25D366' : '#ff4757') + ';">' + message + '</h4><p style="margin: 0; font-weight: bold;">' + (estCouvert ? '⏱️ Livraison 24h-48h - GRATUITE' : '📞 Contactez-nous au +222 49 03 76 97') + '</p></div>';
        
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
}

// ===== INITIALISATION =====
function initAllSystems() {
    console.log('🚀 Initialisation des systèmes...');
    
    const savedCart = localStorage.getItem('anduxara_cart');
    if (savedCart) {
        floatingCart = JSON.parse(savedCart);
    }
    
    window.savedPromo = localStorage.getItem('anduxara_active_promo');
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

// ===== DÉMARRAGE AUTOMATIQUE =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM chargé, initialisation...');
    setTimeout(initAllSystems, 1000);
});

// ===== STYLES DYNAMIQUES =====
const dynamicStyles = '@keyframes slideInRight { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; visibility: hidden; } } .notification-custom { animation: slideInRight 0.3s ease; }';

const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

console.log('🔧 Corrections complètes chargées !');

// ===== FONCTION PANIER FLOTTANT =====
function toggleFloatingCart() {
    const cart = document.getElementById('floating-cart');
    if (cart) {
        cart.style.display = cart.style.display === 'none' ? 'block' : 'none';
    }
    console.log('🛒 Panier flottant togglé');
}

// ===== FONCTION AJOUTER AU PANIER =====
function updateCartCounter() {
    const counter = document.getElementById('cart-counter');
    if (counter) {
        const totalItems = window.floatingCart.reduce((sum, item) => sum + item.quantity, 0);
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    console.log('🛒 Compteur panier mis à jour:', totalItems, 'articles');
}

// ===== ASSISTANT IA COMPLET =====
// ===== ASSISTANT IA AVEC VRAIES RÉPONSES =====
function sendAIMessage() {
    const input = document.getElementById('ai-input');
    const message = input ? input.value.trim() : prompt('🤖 Posez votre question sur nos produits Andu-Xara:');
    
    if (!message) {
        showNotification('❌ Veuillez écrire votre question', 'warning');
        return;
    }
    
    showNotification('✅ Question envoyée à notre assistant IA !');
    
    // Simulation de réponses IA avec les VRAIES informations
    setTimeout(() => {
        const lowerMessage = message.toLowerCase();
        let response = '';
        
        // INFORMATIONS GÉNÉRALES
        if (this.containsAny(lowerMessage, ['bonjour', 'salut', 'hello', 'coucou'])) {
            response = `👋 Bonjour ! Ravie de vous rencontrer ! 

Je suis l'Assistant IA Intelligent d'Andu-Xara, votre expert dédié pour tout savoir sur notre marque mauritanienne de vêtements exclusifs.

Comment puis-je vous aider aujourd'hui ? 😊`;
        }
        // PRODUITS ET COLLECTIONS
        else if (this.containsAny(lowerMessage, ['produit', 'collection', 'vêtement', 'habit', 'tshirt', 't-shirt', 'ensemble', 'pull', 'capuche'])) {
            response = `🎨 NOTRE COLLECTION 2025 :

👕 T-SHIRTS (279-349 MRU) :
• T-shirt logo arabe - 349 MRU
• T-shirt Fille Noir/Blanc - 279 MRU  
• T-shirt ADX Noir - 279 MRU
• T-shirt Beige - 279 MRU

🎽 ENSEMBLES (419-1049 MRU) :
• Ensemble capuche style arabe - 419 MRU
• Babs Premium (édition limitée) - 1049 MRU
• Ensemble T-shirt + jogging - 559 MRU
• Combinaison T-shirt + capuche - 419 MRU

🧥 AUTRES :
• Pull bleu/blanc - 419-489 MRU
• Capuchon blanc - 209 MRU
• T-shirt Enfant - 279 MRU

Quel style vous intéresse ? Je peux vous conseiller !`;
        }
        // PRIX ET PROMOTIONS
        else if (this.containsAny(lowerMessage, ['prix', 'combien', 'coûte', 'coût', 'tarif', 'promotion', 'réduction', 'solde', 'offre'])) {
            response = `💰 INFORMATIONS TARIFAIRES :

🎉 PROMOTION EN COURS :
• 30% DE RÉDUCTION sur tout le catalogue 2025
• Livraison GRATUITE partout en Mauritanie
• Offre valable jusqu'au 31 Décembre 2025

💵 FOURCHETTE DE PRIX :
• Accessoires : à partir de 209 MRU
• T-shirts : 279-349 MRU
• Ensembles : 419-1049 MRU  
• Enfants : 279 MRU

📦 TOUS NOS PRIX INCLUENT :
• TVA mauritanienne
• Livraison gratuite
• Emballage premium
• Service client 7j/7

Une question sur un produit spécifique ?`;
        }
        // LIVRAISON ET COMMANDES
        else if (this.containsAny(lowerMessage, ['livraison', 'livrer', 'délai', 'commander', 'commande', 'acheter', 'paiement'])) {
            response = `🚚 SYSTÈME DE LIVRAISON INTELLIGENT :

📦 LIVRAISON EXPRESS :
• Nouakchott : 24H - GRATUITE
• Nouadhibou : 48H - GRATUITE  
• Autres villes : 3-5 jours - GRATUITE

💳 MODES DE PAIEMENT :
• Wave Sénégal (FCFA)
• Bankily Mauritanie (MRU)
• Paiement à la livraison
• Virement bancaire

🎯 ZONES COUVERTES :
Nouakchott, Guidimakha, Nouadhibou, Rosso, Kaédi, Kiffa, Atar, Zouérat + toutes les capitales régionales

📞 Pour commander : +222 49 03 76 97 (WhatsApp/Téléphone)`;
        }
        // RÉSEAUX SOCIAUX
        else if (this.containsAny(lowerMessage, ['instagram', 'facebook', 'tiktok', 'youtube', 'réseau', 'social', 'reseau', 'follow', 'suivre'])) {
            response = `📱 NOS RÉSEAUX SOCIAUX :

🔗 LIENS DIRECTS :
• 📷 Instagram : @andu_xara
• 🎵 TikTok : @andu_xara  
• 📘 Facebook : Andu-Xara Officiel
• 📺 YouTube : @andu-xaratv5737
• 🌐 Site Web : sites.google.com/view/andu-xara-marque-mauritanienne

🎯 CONTENU EXCLUSIF :
• Nouveautés produits en avant-première
• Tutoriels style et fashion tips
• Lives avec notre équipe
• Concours et cadeaux exclusifs
• Coulisses de la marque

💌 Restez connecté pour ne rien manquer !`;
        }
        // CONTACT ET SUPPORT
        else if (this.containsAny(lowerMessage, ['contact', 'téléphone', 'tel', 'whatsapp', 'email', 'mail', 'adresse', 'support'])) {
            response = `📞 CONTACT ANDU-XARA :

📱 WHATSAPP/TÉLÉPHONE :
• +222 49 03 76 97 (Service Client)
• +222 46 41 56 56 (Support Technique)

🌐 RÉSEAUX SOCIAUX :
• Instagram : @andu_xara
• TikTok : @andu_xara
• Facebook : Andu-Xara Officiel

⏰ HORAIRES :
• Lundi-Dimanche : 8h-22h
• Support 7j/7

📍 ZONES DE LIVRAISON :
Toute la Mauritanie !`;
        }
        else {
            response = '🤖 Merci pour votre intérêt pour Andu-Xara ! Pour une réponse personnalisée, contactez notre service client au +222 49 03 76 97.';
        }
        
        showNotification('🤖 IA: ' + response);
        
    }, 1500);
    
    if (input) input.value = '';
}

// Fonction utilitaire pour la détection des mots-clés
function containsAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
}
