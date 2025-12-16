// === FONCTION ADD TO CART CORRIGÉE ===
function addToCart(productName, oldPrice, promoPrice) {
    console.log('🛒 Ajout au panier:', productName, 'Prix:', promoPrice + ' MRU');
    
    // Vibration si supporté
    if (navigator.vibrate) navigator.vibrate(50);

    // Synchroniser floatingCart avec localStorage
    
    // Rechercher si le produit existe déjà

// Chercher si le produit existe déjà
    let found = false;
    for (let i = 0; i < floatingCart.length; i++) {
        if (floatingCart[i].name === productName) {
            floatingCart[i].quantity += 1;
            found = true;
            break;
        }
    }

if (!found) {
        floatingCart.push({
            name: productName,
            category: category,
            price: numericPrice,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
        
    // Sauvegarder dans le localStorage
    localStorage.setItem('anduxara_cart', JSON.stringify(floatingCart));
    
    // Afficher une notification
    showNotification('✅ ' + productName + ' ajouté au panier !');
    
    // Mettre à jour l'affichage du panier
}

// === NOTIFICATION ===
function showNotification(message) {
    // Créer la notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #25D366;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// === COMPTEUR PANIER ===
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('anduxara_cart')) || [];
    const counter = document.getElementById('cart-counter');
    
    if (counter) {
        counter.textContent = cart.length;
        counter.style.display = cart.length > 0 ? 'inline' : 'none';
    }
}

// === FONCTION POUR LE MODAL ===
function addToCartFromModal(productName, productPrice) {
    // Nettoyer le prix (enlever "MRU" et espaces)
    const cleanPrice = parseInt(productPrice.toString().replace(' MRU', '').replace(/\s/g, ''));
    
    // Utiliser la fonction addToCart
    addToCart(productName, cleanPrice, cleanPrice);
    
    // Fermer le modal
    const modal = document.querySelector('div[style*="position: fixed"]');
    if (modal) modal.remove();
}


// Initialiser les événements au chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du système de livraison...');
    
    // Événement pour la touche Entrée
    const addressInput = document.getElementById('delivery-address');
    if (addressInput) {
        addressInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkDelivery();
            }
        });
    }
    
// ===== CORRECTION DYNAMIQUE BOUTONS MOBILE =====
function fixMobileButtons() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && isPortrait) {
        console.log('📱 Mode portrait mobile détecté - Correction des boutons...');
        
        // Correction livraison
        fixDeliverySection();
        
        // Correction assistant IA
        fixAIAssistant();
        
        // Correction options livraison
        fixDeliveryOptions();
    }
}

function fixDeliverySection() {
    const locationInput = document.querySelector('.location-input');
    const deliveryButton = document.querySelector('.location-input button');
    const deliveryInput = document.getElementById('delivery-address');
    
    if (locationInput && deliveryButton && deliveryInput) {
        // Forcer l'affichage
        locationInput.style.display = 'flex';
        locationInput.style.flexDirection = 'column';
        locationInput.style.gap = '12px';
        
        deliveryButton.style.display = 'block';
        deliveryButton.style.width = '100%';
        deliveryButton.style.opacity = '1';
        deliveryButton.style.visibility = 'visible';
        deliveryButton.style.order = '2';
        
        deliveryInput.style.order = '1';
        deliveryInput.style.width = '100%';
        
        console.log('✅ Bouton livraison corrigé');
    }
}

function fixAIAssistant() {
    const aiInput = document.getElementById('ai-input');
    let aiButton = document.querySelector('#ai-send-button') || 
                   document.querySelector('#ai-input + button') ||
                   document.querySelector('button[onclick*="sendAIMessage"]');
    
    console.log('🔍 Recherche bouton IA:', {
        input: !!aiInput,
        button: !!aiButton,
        buttonText: aiButton?.textContent
    });
    
    if (aiInput && aiButton) {
        // Donner un ID spécifique au bouton
        if (!aiButton.id) {
            aiButton.id = 'ai-send-button';
        }
        
        // Créer le conteneur principal si nécessaire
        let aiContainer = document.getElementById('ai-input-container');
        if (!aiContainer) {
            aiContainer = document.createElement('div');
            aiContainer.id = 'ai-input-container';
            aiContainer.style.display = 'flex';
            aiContainer.style.flexDirection = 'column';
            aiContainer.style.gap = '12px';
            aiContainer.style.width = '100%';
            
            // Insérer le conteneur
            aiInput.parentNode.insertBefore(aiContainer, aiInput);
        }
        
        // Créer le groupe input + bouton
        let aiGroup = document.getElementById('ai-input-group');
        if (!aiGroup) {
            aiGroup = document.createElement('div');
            aiGroup.id = 'ai-input-group';
            aiGroup.style.display = 'flex';
            aiGroup.style.gap = '10px';
            aiGroup.style.alignItems = 'center';
            aiGroup.style.width = '100%';
            
            // Ajouter au conteneur
            aiContainer.appendChild(aiGroup);
        }
        
        // Réorganiser les éléments dans le groupe
        if (!aiGroup.contains(aiInput)) {
            aiGroup.appendChild(aiInput);
        }
        if (!aiGroup.contains(aiButton)) {
            aiGroup.appendChild(aiButton);
        }
        
        // Styles forcés pour le bouton
        aiButton.style.display = 'flex';
        aiButton.style.alignItems = 'center';
        aiButton.style.justifyContent = 'center';
        aiButton.style.padding = '15px 25px';
        aiButton.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        aiButton.style.color = 'white';
        aiButton.style.border = 'none';
        aiButton.style.borderRadius = '25px';
        aiButton.style.cursor = 'pointer';
        aiButton.style.fontWeight = '600';
        aiButton.style.fontSize = '1rem';
        aiButton.style.minWidth = '120px';
        aiButton.style.minHeight = '50px';
        aiButton.style.opacity = '1';
        aiButton.style.visibility = 'visible';
        aiButton.style.whiteSpace = 'nowrap';
        aiButton.style.flexShrink = '0';
        
        // Styles pour l'input
        aiInput.style.flex = '1';
        aiInput.style.minHeight = '50px';
        aiInput.style.padding = '15px 20px';
        aiInput.style.fontSize = '1rem';
        aiInput.style.borderRadius = '25px';
        aiInput.style.border = '2px solid #e2e8f0';
        
        console.log('✅ Bouton IA corrigé avec succès');
        
    } else if (aiInput && !aiButton) {
        // Créer le bouton s'il n'existe pas
        console.log('⚠️ Bouton IA non trouvé, création...');
        createAISendButton();
    } else {
        console.log('❌ Éléments IA non trouvés');
    }
}

function createAISendButton() {
    const aiInput = document.getElementById('ai-input');
    if (!aiInput) return;
    
    // Créer le bouton
    const aiButton = document.createElement('button');
    aiButton.id = 'ai-send-button';
    aiButton.innerHTML = 'Envoyer 🚀';
    aiButton.onclick = sendAIMessage;
    
    // Styles du bouton
    aiButton.style.cssText = `
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 15px 25px;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        font-size: 1rem;
        min-width: 120px;
        min-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 1;
        visibility: visible;
        white-space: nowrap;
        flex-shrink: 0;
    `;
    
    // Créer la structure
    const aiContainer = document.createElement('div');
    aiContainer.id = 'ai-input-container';
    aiContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
    `;
    
    const aiGroup = document.createElement('div');
    aiGroup.id = 'ai-input-group';
    aiGroup.style.cssText = `
        display: flex;
        gap: 10px;
        align-items: center;
        width: 100%;
    `;
    
    // Réorganiser
    aiInput.parentNode.insertBefore(aiContainer, aiInput);
    aiGroup.appendChild(aiInput);
    aiGroup.appendChild(aiButton);
    aiContainer.appendChild(aiGroup);
    
    console.log('✅ Bouton IA créé avec succès');
}

function fixDeliveryOptions() {
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => {
        option.style.display = 'flex';
        option.style.flexDirection = 'column';
        option.style.alignItems = 'center';
        option.style.textAlign = 'center';
        option.style.gap = '8px';
        option.style.opacity = '1';
        option.style.visibility = 'visible';
    });
    
    console.log(`✅ ${options.length} options livraison corrigées`);
}

// Surveiller les changements d'orientation et de taille
function initMobileButtonObserver() {
    // Corriger au chargement
    setTimeout(fixMobileButtons, 100);
    
    // Corriger lors du redimensionnement
    window.addEventListener('resize', fixMobileButtons);
    
    // Corriger lors du changement d'orientation
    window.addEventListener('orientationchange', function() {
        setTimeout(fixMobileButtons, 300);
    });
    
    // Observer les mutations du DOM au cas où des éléments seraient ajoutés dynamiquement
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                setTimeout(fixMobileButtons, 100);
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du panier et fidélité...');
    
    // Charger le panier depuis le localStorage
    floatingCart = JSON.parse(localStorage.getItem('anduxara_cart')) || [];
    
    // Charger le code promo actif
    const savedPromo = localStorage.getItem('anduxara_active_promo');
    if (savedPromo) {
        const promoData = JSON.parse(savedPromo);
        activePromoCode = promoData.code;
        promoDiscount = promoData.discount;
        updateActivePromoDisplay();
    }

// ===== CORRECTION BOUTONS MOBILE =====
    console.log('📱 Initialisation correcteur boutons mobile...');
    initMobileButtonObserver();
    console.log('✅ Correcteur boutons mobile activé');    
    // Mettre à jour l'affichage initial du panier
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
    
    // Initialiser le système de recommandations
    window.styleAdvisor = new StyleAdvisor();
    
    // Mettre à jour les recommandations après le chargement
    setTimeout(() => {
        if (window.styleAdvisor && typeof window.styleAdvisor.updateRecommendations === 'function') {
            window.styleAdvisor.updateRecommendations();
            console.log('✅ Système de recommandations IA activé !');
        }
    }, 1500);
    
    // ===== VÉRIFICATION SYSTÈME DE PAIEMENT =====
    console.log('✅ Vérification du système de paiement...');
    
    // Vérifier que toutes les fonctions sont disponibles
    if (typeof processFloatingCheckout === 'function') {
        console.log('✅ processFloatingCheckout prêt');
    } else {
        console.error('❌ processFloatingCheckout NON DÉFINI');
    }
    
    if (typeof processWavePayment === 'function') {
        console.log('✅ processWavePayment prêt');
    } else {
        console.error('❌ processWavePayment NON DÉFINI');
    }
    
    if (typeof processBankilyPayment === 'function') {
        console.log('✅ processBankilyPayment prêt');
    } else {
        console.error('❌ processBankilyPayment NON DÉFINI');
    }
    
    if (typeof processWhatsAppPayment === 'function') {
        console.log('✅ processWhatsAppPayment prêt');
    } else {
        console.error('❌ processWhatsAppPayment NON DÉFINI');
    }
    
    console.log('🎯 Panier chargé avec', floatingCart.length, 'produits');
    
});

    // Événements pour les options de livraison
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            selectDeliveryOption(this.dataset.type);
        });
    });
    
    // Initialiser la vue rapide
    setupQuickView();
    updateCartCounter();
    
    console.log('✅ Panier, vue rapide et livraison initialisés');
});

document.head.appendChild(assistantStyle);
// ===== TABLEAU DE BORD CLIENT INTELLIGENT =====
class ClientDashboard {
    constructor() {
        this.userData = this.loadUserData();
        this.initializeDashboard();
    }

    loadUserData() {
        return JSON.parse(localStorage.getItem('anduxara_user_dashboard')) || {
            viewedProducts: [],
            favoriteProducts: [],
            purchaseHistory: [],
            preferences: {
                favoriteCategories: [],
                priceRange: { min: 0, max: 2000 },
                preferredSizes: []
            },
            stats: {
                totalViews: 0,
                totalFavorites: 0,
                lastVisit: null
            }
        };
    }

    saveUserData() {
        localStorage.setItem('anduxara_user_dashboard', JSON.stringify(this.userData));
    }

    initializeDashboard() {
        this.updateDashboardDisplay();
        // Mettre à jour les stats de visite
        this.userData.stats.lastVisit = new Date().toISOString();
        this.saveUserData();
    }

// Track quand un produit est consulté
    trackProductView(productName, category, price) {
existingView.viewCount += 1;
existingView.lastViewed = new Date().toISOString();
} else {

{

        name: productName,
        price: promoPrice,
        quantity: 1,
        addedAt: new Date().toISOString()
    }
});

        this.userData.stats.totalViews += 1;
        this.updatePreferences(category, price);
        this.saveUserData();
        this.updateDashboardDisplay();
    }

    // Ajouter aux favoris
    addToFavorites(productName, category, price) {
        const existingFavorite = this.userData.favoriteProducts.find(
            item => item.name === productName
        );

        if (!existingFavorite) {
            this.userData.favoriteProducts.push({
                name: productName,
                category: category,
                price: price,
                addedAt: new Date().toISOString()
            });

            this.userData.stats.totalFavorites += 1;
            this.saveUserData();
            this.updateDashboardDisplay();
            this.showNotification('❤️ Ajouté aux favoris !');
        }
    }

    // Retirer des favoris
    removeFromFavorites(productName) {
        this.userData.favoriteProducts = this.userData.favoriteProducts.filter(
            item => item.name !== productName
        );
        this.userData.stats.totalFavorites = Math.max(0, this.userData.stats.totalFavorites - 1);
        this.saveUserData();
        this.updateDashboardDisplay();
        this.showNotification('🗑️ Retiré des favoris');
    }

    // Mettre à jour les préférences
    updatePreferences(category, price) {
        // Mettre à jour les catégories préférées
        const categoryIndex = this.userData.preferences.favoriteCategories.findIndex(
            item => item.name === category
        );

        if (categoryIndex > -1) {
            this.userData.preferences.favoriteCategories[categoryIndex].count += 1;
        } else {
            this.userData.preferences.favoriteCategories.push({
                name: category,
                count: 1
            });
        }

        // Mettre à jour la fourchette de prix
        if (price < this.userData.preferences.priceRange.min) {
            this.userData.preferences.priceRange.min = price;
        }
        if (price > this.userData.preferences.priceRange.max) {
            this.userData.preferences.priceRange.max = price;
        }
    }

    // Générer des recommandations personnalisées
    generateRecommendations() {
        const recommendations = [];
        const favoriteCategories = this.userData.preferences.favoriteCategories
            .sort((a, b) => b.count - a.count)
            .slice(0, 2)
            .map(item => item.name);

        // Basé sur les catégories préférées
        favoriteCategories.forEach(category => {
            const productsInCategory = this.getAllProducts().filter(
                product => product.category === category
            );
            recommendations.push(...productsInCategory.slice(0, 2));
        });

        // Mélanger et limiter
        return this.shuffleArray(recommendations).slice(0, 4);
    }

    // Mettre à jour l'affichage du dashboard
    updateDashboardDisplay() {
        this.updateViewHistory();
        this.updateFavorites();
        this.updateRecommendations();
        this.updateStats();
    }

updateViewHistory() {
        const container = document.getElementById('view-history');
        if (!container) return;

        const recentViews = this.userData.viewedProducts
            .sort((a, b) => new Date(b.lastViewed) - new Date(a.lastViewed))
            .slice(0, 5);

        if (recentViews.length === 0) {
            container.innerHTML = '<p style="color: #999; text-align: center; font-style: italic;">Aucun produit consulté</p>';
            return;
        }

        container.innerHTML = recentViews.map(product => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                <div style="flex: 1;">
                    <div style="font-weight: 500; font-size: 0.9rem;">${product.name}</div>
                    <div style="font-size: 0.8rem; color: #666;">Vu ${product.viewCount} fois</div>
                </div>
                <div style="font-weight: bold; color: #667eea; font-size: 0.9rem;">${product.price} MRU</div>
            </div>
        `).join('');
    }

    updateFavorites() {

        const container = document.getElementById('saved-products');
        if (!container) return;

        const favorites = this.userData.favoriteProducts
            .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
            .slice(0, 5);

        if (favorites.length === 0) {
            container.innerHTML = '<p style="color: #999; text-align: center; font-style: italic;">Aucun favori</p>';
            return;
        }

container.innerHTML = favorites.map(product => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
        <div style="flex: 1;">
            <div style="font-weight: 500; font-size: 0.9rem;">${product.name}</div>
            <div style="font-size: 0.8rem; color: #666;">${product.category}</div>
        </div>
        <div>
            <button onclick="clientDashboard.removeFromFavorites('${product.name}')"
                    style="background: #e74c3c; color: white; border: none; padding: 4px 8px; border-radius: 12px; cursor: pointer; font-size: 0.7rem;">
                Retirer
            </button>
        </div>
    </div>
`).join('');
}
    updateRecommendations() {
        const container = document.getElementById('personal-recommendations');
        if (!container) return;

        const recommendations = this.generateRecommendations();

        if (recommendations.length === 0) {
            container.innerHTML = '<p style="color: #999; text-align: center; font-style: italic;">Consultez des produits pour avoir des recommandations</p>';
            return;
        }

        container.innerHTML = recommendations.map(product => `
            <div style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                <div style="font-weight: 500; font-size: 0.9rem;">${product.name}</div>
                <div style="font-size: 0.8rem; color: #27ae60; font-weight: bold;">${product.price} MRU</div>
                <button onclick="ajouterAuPanier('${product.name}', '${product.category}', ${product.price})" 
                        style="background: #27ae60; color: white; border: none; padding: 4px 8px; border-radius: 12px; cursor: pointer; font-size: 0.7rem; margin-top: 4px;">
                    🛒 Ajouter
                </button>
            </div>
        `).join('');
    }

    updateStats() {
        document.getElementById('total-views').textContent = this.userData.stats.totalViews;
        document.getElementById('total-favorites').textContent = this.userData.stats.totalFavorites;
    }

    getAllProducts() {
        return [
            { name: 'T-shirt logo arabe', category: 't-shirts', price: 349 },
            { name: 'Ensemble capuche style arabe', category: 'ensembles', price: 419 },
            { name: 'Combinaison T-shirt et Capuche', category: 'ensembles', price: 419 },
            { name: 'T-shirt Enfant', category: 'enfants', price: 279 },
            { name: 'Ensemble T-shirt et jogging', category: 'ensembles', price: 559 },
            { name: 'Pull bleu', category: 't-shirts', price: 489 },
            { name: 'Capuchon blanc', category: 'accessoires', price: 209 },
            { name: 'Babs Premium', category: 'ensembles', price: 1049 },
            { name: 'T-shirt Fille Noir', category: 't-shirts', price: 279 },
            { name: 'T-shirt Fille Blanc', category: 't-shirts', price: 419 },
            { name: 'Pull Blanc', category: 'pulls', price: 419 },
            { name: 'T-shirt Beige', category: 't-shirts', price: 279 },
            { name: 'T-shirt Blanc', category: 't-shirts', price: 279 },
            { name: 'T-shirt ADX Noir', category: 't-shirts', price: 279 }
        ];
    }

    shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    showNotification(message) {
        if (typeof showNotification === 'function') {
            showNotification(message);
        } else {
            alert(message);
        }
    }
}

// Fonction pour réinitialiser le dashboard
function resetDashboard() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser votre tableau de bord ? Toutes vos données seront effacées.')) {
        localStorage.removeItem('anduxara_user_dashboard');
        clientDashboard = new ClientDashboard();
        showNotification('✅ Tableau de bord réinitialisé !');
    }
}

// Initialiser le dashboard
let clientDashboard;

// Intégration avec les fonctions existantes
document.addEventListener('DOMContentLoaded', function() {
    clientDashboard = new ClientDashboard();
    
    // Surcharger la fonction trackProductView existante
    const originalTrackProductView = window.trackProductView;
    window.trackProductView = function(productName, category, price) {
        if (clientDashboard) {
            clientDashboard.trackProductView(productName, category, price);
        }
        if (originalTrackProductView) {
            originalTrackProductView(productName, category, price);
        }
    };

    // Ajouter des boutons favoris aux produits
    addFavoriteButtonsToProducts();
});

function addFavoriteButtonsToProducts() {
    // Ajouter des boutons favoris à chaque produit
    document.querySelectorAll('.product-card').forEach(card => {
        const productName = card.querySelector('.product-title').textContent;
        const productCategory = card.getAttribute('data-category');
        const productPrice = parseInt(card.querySelector('.promo-price').textContent);
        
        const favoriteBtn = document.createElement('button');
        favoriteBtn.innerHTML = '❤️';
        favoriteBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255,255,255,0.9);
            border: none;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            cursor: pointer;
            font-size: 1rem;
            z-index: 10;
            transition: transform 0.2s;
        `;
        
        favoriteBtn.onclick = function(e) {
            e.stopPropagation();
            clientDashboard.addToFavorites(productName, productCategory, productPrice);
            this.style.transform = 'scale(1.2)';
            setTimeout(() => this.style.transform = 'scale(1)', 200);
        };
        
        card.querySelector('.product-image-container').appendChild(favoriteBtn);
    });
}
// ===== REDIMENSIONNEMENT AUTOMATIQUE POUR MOBILE =====
function initMobileFitting() {
    const cameraContainer = document.getElementById('camera-container');
    const virtualFittingSection = document.getElementById('virtual-fitting');
    
    if (!cameraContainer || !virtualFittingSection) return;
    
    function adjustFittingLayout() {
        const isMobile = window.innerWidth <= 768;
        const isPortrait = window.innerHeight > window.innerWidth;
        
        if (isMobile) {
            // Mode mobile
            virtualFittingSection.style.padding = "20px 10px";
            
            if (isPortrait) {
                // Mode portrait - layout vertical
                const fittingContainer = document.querySelector('.fitting-container');
                if (fittingContainer) {
                    fittingContainer.style.gridTemplateColumns = "1fr";
                }
                cameraContainer.style.height = "200px";
            } else {
                // Mode paysage - layout horizontal
                const fittingContainer = document.querySelector('.fitting-container');
                if (fittingContainer) {
                    fittingContainer.style.gridTemplateColumns = "1fr 1fr";
                }
                cameraContainer.style.height = "250px";
            }
        } else {
            // Mode desktop
            const fittingContainer = document.querySelector('.fitting-container');
            if (fittingContainer) {
                fittingContainer.style.gridTemplateColumns = "1fr 1fr";
            }
            cameraContainer.style.height = "400px";
        }
    }
    
    // Écouter les changements d'orientation et de taille
    window.addEventListener('resize', adjustFittingLayout);
    window.addEventListener('orientationchange', adjustFittingLayout);
    
    // Appliquer au chargement
    adjustFittingLayout();
}

// Ajoutez cet appel dans DOMContentLoaded existant
// Cherchez cette section :
document.addEventListener('DOMContentLoaded', function() {
    // ... code existant ...
    
    // AJOUTEZ CETTE LIGNE à la fin du DOMContentLoaded existant :
    initMobileFitting();
});
