// ===== TOUTES LES FONCTIONS MANQUANTES POUR ANDU-XARA =====

console.log('🎯 Chargement de toutes les corrections...');

// ===== VARIABLES GLOBALES =====
let floatingCart = JSON.parse(localStorage.getItem('anduxara_cart')) || [];
let activePromoCode = null;
let promoDiscount = 0;

// ===== FONCTIONS PANIER =====
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

function removeFromFloatingCart(index) {
    if (index >= 0 && index < floatingCart.length) {
        floatingCart.splice(index, 1);
        localStorage.setItem('anduxara_cart', JSON.stringify(floatingCart));
        updateFloatingCart();
        showNotification('🗑️ Produit retiré du panier');
    }
}

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

// ===== FONCTIONS LIVRAISON =====
function checkDelivery() {
    console.log('📍 Vérification de la livraison...');

    const addressInput = document.getElementById('delivery-address');
    const resultDiv = document.getElementById('delivery-result');

    if (!addressInput || !resultDiv) {
        console.error('❌ Éléments livraison non trouvés');
        return;
    }

    const address = addressInput.value.trim();

    if (!address || address.length < 5) {
        resultDiv.innerHTML = '<p style="color: red; padding: 10px; background: #ffe8e8; border-radius: 5px;">❌ L\\'adresse doit contenir au moins 5 caractères</p>';
        return;
    }

    resultDiv.innerHTML = '<p style="color: #667eea; padding: 10px; background: #f0f4ff; border-radius: 5px;">🔄 Recherche de votre zone...</p>';

    setTimeout(() => {
        const addressLower = address.toLowerCase();
        const zonesCouvertes = [
            'nouakchott', 'nouadhibou', 'rosso', 'kaédi', 'kiffa', 'atar', 'zouérat',
            'tévregh zeina', 'el mina', 'ksar', 'sebkha', 'dar naim', 'toujounine',
            'arafat', 'ryad', 'socogim bagdad', 'socogim k', 'cité plage', 'socogim k',
            'tevregh', 'guidimakha', 'ksar', 'sebkha', 'couva', 'cinquiéme', 'basra'
        ];

        let estCouvert = false;
        let message = '';
        let delai = '';

        for (const zone of zonesCouvertes) {
            if (addressLower.includes(zone)) {
                estCouvert = true;
                if (addressLower.includes('nouakchott') || addressLower.includes('tevregh') || 
                    addressLower.includes('mina') || addressLower.includes('ksar') || 
                    addressLower.includes('sebkha') || addressLower.includes('dar naim') || 
                    addressLower.includes('toujounine') || addressLower.includes('arafat') || 
                    addressLower.includes('ryad')) {
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

        resultDiv.innerHTML = `
            <div style="padding: 15px; border-radius: 10px; background: ${estCouvert ? '#e8f5e8' : '#ffe8e8'}; border: 2px solid ${estCouvert ? '#25D366' : '#ff4757'};">
                <h4 style="margin: 0 0 10px 0; color: ${estCouvert ? '#25D366' : '#ff4757'};">${message}</h4>
                <p style="margin: 0; font-weight: bold;">${delai}</p>
                ${estCouvert ? `
                    <div style="margin-top: 15px;">
                        <p style="margin: 5px 0; font-size: 14px;">📦 Livraison à domicile incluse</p>
                        <p style="margin: 5px 0; font-size: 14px;">💰 Paiement à la livraison possible</p>
                    </div>
                ` : `
                    <div style="margin-top: 15px;">
                        <p style="margin: 5px 0; font-size: 14px;">💡 Conseil : Vérifiez l\\'orthographe de votre ville</p>
                        <p style="margin: 5px 0; font-size: 14px;">📞 Appelez-nous pour les commandes spéciales</p>
                    </div>
                `}
            </div>
        `;
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
    showNotification(\`✅ Option \${type === 'express' ? 'Express (24h)' : 'Standard (3-5 jours)'} sélectionnée !\`);
}

// ===== FONCTIONS PAIEMENT =====
function processFloatingCheckout() {
    if (floatingCart.length === 0) {
        showNotification('🛒 Votre panier est vide !', 'error');
        return;
    }
    
    const totalMRU = floatingCart.reduce((sum, item) => {
        return sum + (item.promoPrice || item.price) * item.quantity;
    }, 0);
    
    const totalFCFA = Math.round(totalMRU * 2.5);
    
    integrerFideliteAchat(totalMRU);
    
    const productList = floatingCart.map(item => 
        \`\${item.name} (x\${item.quantity}) - \${(item.promoPrice || item.price) * item.quantity} MRU\`
    ).join('\\n');
    
    const message = \`Bonjour ! Je souhaite commander :\\n\\n\${productList}\\n\\n💰 Total : \${totalMRU} MRU\`;
    
    const paymentChoice = prompt(
        \`💳 CHOISISSEZ VOTRE MÉTHODE DE PAIEMENT\\n\\n\` +
        \`💰 Montant : \${totalMRU} MRU (\${totalFCFA} FCFA)\\n\\n\` +
        \`Tapez 1, 2 ou 3 :\\n\\n\` +
        \`1️⃣ → Wave Sénégal (\${totalFCFA} FCFA)\\n\` +
        \`2️⃣ → Bankily Mauritanie (\${totalMRU} MRU)\\n\` +
        \`3️⃣ → WhatsApp (Discuter)\\n\\n\` +
        \`Votre choix (1/2/3) :\`
    );

    if (paymentChoice === '1') {
        processWavePayment(totalFCFA, totalMRU, message);
    } else if (paymentChoice === '2') {
        processBankilyPayment(totalMRU, message);
    } else if (paymentChoice === '3') {
        processWhatsAppPayment(message);
    } else {
        showNotification('Choix annulé', 'warning');
    }
}

function processWavePayment(totalFCFA, totalMRU, message) {
    if (confirm(\`🌊 WAVE SÉNÉGAL\\n\\n💸 Montant : \${totalFCFA} FCFA\\n📱 Votre Wave : +221 76 282 11 33\\n\\n⚠️ L'application Wave va s'ouvrir automatiquement...\\n\\n✅ OK → Ouvrir Wave maintenant\`)) {
        const waveDeepLink = \`wave://send?phone=762821133&amount=\${totalFCFA}&message=Commande Andu-Xara\`;
        window.location.href = waveDeepLink;
        
        setTimeout(() => {
            if (confirm("Wave ne s'est pas ouvert ?\\n\\nSouhaitez-vous :\\n✅ Installer Wave (Play Store)\\n❌ Voir les instructions manuelles")) {
                window.open('https://play.google.com/store/apps/details?id=com.wave.money', '_blank');
            } else {
                showManualWaveInstructions(totalFCFA, totalMRU, message);
            }
        }, 2000);
    } else {
        showNotification('Ouverture Wave annulée', 'info');
    }
}

function processBankilyPayment(totalMRU, message) {
    if (confirm(\`🏦 BANKILY MAURITANIE\\n\\n💸 Montant : \${totalMRU} MRU\\n📱 Votre Bankily : +222 49 03 76 97\\n\\n⚠️ L'application Bankily va s'ouvrir...\\n\\n✅ OK → Ouvrir Bankily maintenant\`)) {
        const bankilyDeepLink = \`bankily://transfer?phone=49037697&amount=\${totalMRU}\`;
        window.location.href = bankilyDeepLink;
        
        setTimeout(() => {
            showManualBankilyInstructions(totalMRU, message);
        }, 2000);
    } else {
        showNotification('Ouverture Bankily annulée', 'info');
    }
}

function processWhatsAppPayment(message) {
    if (confirm(\`💬 WHATSAPP\\n\\n📱 Nous allons ouvrir WhatsApp pour discuter de votre commande...\\n\\n✅ OK → Ouvrir WhatsApp maintenant\`)) {
        const whatsappMessage = \`Bonjour Andu-Xara ! 👋\\n\\nJe souhaite commander :\\n\\n\${message}\\n\\nPouvez-vous m'aider pour la suite ?\`;
        window.open(\`https://wa.me/22249037697?text=\${encodeURIComponent(whatsappMessage)}\`, '_blank');
        showNotification('✅ WhatsApp ouvert ! Notre équipe vous contactera.', 'success');
    } else {
        showNotification('Ouverture WhatsApp annulée', 'info');
    }
}

function integrerFideliteAchat(totalMRU) {
    try {
        console.log('🎯 Intégration fidélité pour achat:', totalMRU + ' MRU');
        const pointsGagnes = Math.floor(totalMRU / 10);
        if (pointsGagnes > 0) {
            console.log(\`🎯 \${pointsGagnes} points gagnés pour achat de \${totalMRU} MRU\`);
        }
        return pointsGagnes;
    } catch (error) {
        console.error('Erreur intégration fidélité:', error);
        return 0;
    }
}

// ===== FONCTION NOTIFICATION =====
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        background: \${type === 'error' ? '#ff4757' : '#25D366'};
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
    \`;
    notification.innerHTML = \`
        <span>\${type === 'error' ? '❌' : '✅'}</span>
        <span>\${message}</span>
    \`;

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

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation Andu-Xara...');
    
    updateFloatingCart();
    
    // Livraison
    const addressInput = document.getElementById('delivery-address');
    if (addressInput) {
        addressInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') checkDelivery();
        });
    }
    
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            selectDeliveryOption(this.dataset.type);
        });
    });
    
    // Panier
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

console.log('🎯 Toutes les corrections chargées !');
