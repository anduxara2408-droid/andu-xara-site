// panier-integration-stable.js - VERSION CORRIGÉE
class PanierManager {
    constructor() {
        this.panier = { items: [], total: 0 };
        this.userId = null;
        this.initialized = false;
        this.init();
    }

    async init() {
        console.log('🛒 Initialisation du gestionnaire de panier...');
        
        // Attendre que Firebase soit prêt
        window.addEventListener('firebaseReady', () => {
            this.initializePanier();
        });

        // Si Firebase est déjà prêt
        if (window.firebaseManager && window.firebaseManager.initialized) {
            this.initializePanier();
        }
    }

    async initializePanier() {
        try {
            // Obtenir l'utilisateur actuel
            const user = firebase.auth().currentUser;
            if (user) {
                this.userId = user.uid;
                await this.loadPanierFromFirebase();
            } else {
                // Utiliser le panier local en attendant
                this.loadPanierFromLocalStorage();
            }

            this.initialized = true;
            console.log('✅ Panier initialisé');

            // Déclencher l'événement de panier prêt
            window.dispatchEvent(new CustomEvent('panierReady'));

        } catch (error) {
            console.error('❌ Erreur initialisation panier:', error);
            this.loadPanierFromLocalStorage();
        }
    }

    async loadPanierFromFirebase() {
        console.log('📥 Chargement panier depuis Firebase...');
        
        try {
            const panierData = await window.firebaseManager.getPanier(this.userId);
            this.panier = panierData;
            this.savePanierToLocalStorage();
            console.log('✅ Panier chargé depuis Firebase:', this.panier);
        } catch (error) {
            console.error('❌ Erreur chargement Firebase, utilisation du cache local');
            this.loadPanierFromLocalStorage();
        }
    }

    loadPanierFromLocalStorage() {
        const savedPanier = localStorage.getItem('anduxara_panier');
        if (savedPanier) {
            try {
                this.panier = JSON.parse(savedPanier);
                console.log('📥 Panier chargé depuis localStorage:', this.panier);
            } catch (error) {
                console.error('❌ Erreur parsing panier local');
                this.panier = { items: [], total: 0 };
            }
        }
    }

    savePanierToLocalStorage() {
        localStorage.setItem('anduxara_panier', JSON.stringify(this.panier));
    }

    async addToPanier(product, quantity = 1) {
        console.log('➕ Ajout au panier:', product);

        if (!this.initialized) {
            console.log('⏳ Panier non initialisé, initialisation...');
            await this.initializePanier();
        }

        const existingItemIndex = this.panier.items.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            // Produit déjà dans le panier, mettre à jour la quantité
            this.panier.items[existingItemIndex].quantity += quantity;
        } else {
            // Nouveau produit
            this.panier.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        // Recalculer le total
        this.calculateTotal();

        // Sauvegarder
        await this.savePanier();

        // Mettre à jour l'interface
        this.updateUI();

        console.log('✅ Produit ajouté au panier:', this.panier);
    }

    calculateTotal() {
        this.panier.total = this.panier.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    async savePanier() {
        // Sauvegarder localement
        this.savePanierToLocalStorage();

        // Sauvegarder dans Firebase si utilisateur connecté
        if (this.userId && window.firebaseManager.initialized) {
            await window.firebaseManager.savePanier(this.userId, this.panier);
        }
    }

    updateUI() {
        // Mettre à jour le compteur du panier
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = this.panier.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        // Mettre à jour le popup du panier s'il est ouvert
        this.updatePanierPopup();
    }

    updatePanierPopup() {
        const panierContent = document.getElementById('panier-content');
        if (panierContent && panierContent.style.display === 'block') {
            this.openPanier();
        }
    }

    openPanier() {
        console.log('🛒 Ouverture du panier...');
        
        const panierContent = document.getElementById('panier-content');
        if (!panierContent) {
            console.error('❌ Élément panier-content non trouvé');
            return;
        }

        try {
            let html = '';
            
            if (this.panier.items.length === 0) {
                html = `
                    <div class="panier-vide">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Votre panier est vide</p>
                    </div>
                `;
            } else {
                html = `
                    <div class="panier-items">
                        ${this.panier.items.map(item => `
                            <div class="panier-item">
                                <img src="${item.image}" alt="${item.name}">
                                <div class="item-details">
                                    <h4>${item.name}</h4>
                                    <p>${item.price} MRU</p>
                                    <div class="quantity-controls">
                                        <button onclick="panierManager.updateQuantity('${item.id}', -1)">-</button>
                                        <span>${item.quantity}</span>
                                        <button onclick="panierManager.updateQuantity('${item.id}', 1)">+</button>
                                    </div>
                                </div>
                                <button class="remove-item" onclick="panierManager.removeFromPanier('${item.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <div class="panier-total">
                        <strong>Total: ${this.panier.total} MRU</strong>
                    </div>
                    <div class="panier-actions">
                        <button class="btn-commander" onclick="commander()">
                            <i class="fas fa-shopping-bag"></i> Commander
                        </button>
                        <button class="btn-vider" onclick="panierManager.viderPanier()">
                            <i class="fas fa-trash"></i> Vider
                        </button>
                    </div>
                `;
            }

            panierContent.innerHTML = html;
            panierContent.style.display = 'block';
            
            console.log('✅ Panier ouvert avec succès');

        } catch (error) {
            console.error('❌ Erreur ouverture panier:', error);
        }
    }

    async updateQuantity(productId, change) {
        const item = this.panier.items.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                this.removeFromPanier(productId);
            } else {
                this.calculateTotal();
                await this.savePanier();
                this.updateUI();
            }
        }
    }

    async removeFromPanier(productId) {
        this.panier.items = this.panier.items.filter(item => item.id !== productId);
        this.calculateTotal();
        await this.savePanier();
        this.updateUI();
    }

    async viderPanier() {
        this.panier = { items: [], total: 0 };
        await this.savePanier();
        this.updateUI();
        
        // Fermer le popup
        const panierContent = document.getElementById('panier-content');
        if (panierContent) {
            panierContent.style.display = 'none';
        }
    }

    getPanier() {
        return this.panier;
    }
}

// Initialiser le gestionnaire de panier
window.panierManager = new PanierManager();

// Gestionnaire d'événements pour les boutons "Ajouter au panier"
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Configuration des boutons panier...');
    
    // Délégation d'événements pour les boutons dynamiques
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart')) {
            const button = e.target.closest('.add-to-cart');
            const product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image
            };
            
            window.panierManager.addToPanier(product, 1);
        }
        
        // Bouton ouvrir panier
        if (e.target.closest('.cart-icon')) {
            window.panierManager.openPanier();
        }
    });

    // Fermer le panier en cliquant à l'extérieur
    document.addEventListener('click', function(e) {
        const panierContent = document.getElementById('panier-content');
        if (panierContent && panierContent.style.display === 'block' && 
            !e.target.closest('#panier-content') && 
            !e.target.closest('.cart-icon')) {
            panierContent.style.display = 'none';
        }
    });
});

// Fonction de commande
function commander() {
    const panier = window.panierManager.getPanier();
    if (panier.items.length === 0) {
        alert('Votre panier est vide');
        return;
    }
    
    // Rediriger vers la page de commande
    window.location.href = 'commande.html';
}

console.log('🛒 Gestionnaire de panier chargé');
