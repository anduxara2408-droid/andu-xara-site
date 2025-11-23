// js/main.js - Fonctions principales
console.log('🚀 Andu-Xara - Initialisation');

// Variables globales
let floatingCart = JSON.parse(localStorage.getItem('anduxara_cart')) || [];
window.activePromoCode = null;
window.promoDiscount = 0;

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log('📦 Chargement du panier:', floatingCart.length, 'produits');
    
    initMenuMobile();
    initProductInteractions();
    updateFloatingCart();
    loadPromoState();
    
    // Initialiser les systèmes
    setTimeout(() => {
        if (typeof initPromoSystem === 'function') {
            initPromoSystem();
        }
        if (typeof initUserManager === 'function') {
            initUserManager();
        }
    }, 1000);
});

// Menu mobile
function initMenuMobile() {
    const toggleBtn = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.menu-overlay');

    if (toggleBtn && menu && overlay) {
        toggleBtn.addEventListener('click', () => {
            menu.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            menu.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
}

// Interactions produits
function initProductInteractions() {
    // Boutons catégories
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterProductsByCategory(category);
        });
    });
    
    // Recherche
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchProducts(this.value.toLowerCase());
        });
    }
}

// Filtrage produits
function filterProductsByCategory(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        if (category === 'tous') {
            product.style.display = 'block';
        } else {
            const productCategory = product.getAttribute('data-category');
            product.style.display = (productCategory === category) ? 'block' : 'none';
        }
    });
}

// Recherche produits
function searchProducts(searchTerm) {
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        const title = product.querySelector('.product-title').textContent.toLowerCase();
        const description = product.querySelector('.product-description').textContent.toLowerCase();

        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Charger l'état des promos
function loadPromoState() {
    const savedPromo = localStorage.getItem('anduxara_active_promo');
    if (savedPromo) {
        try {
            const promoData = JSON.parse(savedPromo);
            window.activePromoCode = promoData.code;
            window.promoDiscount = promoData.discount;
            console.log('🎯 Promo chargée:', window.activePromoCode);
        } catch (error) {
            console.error('❌ Erreur chargement promo:', error);
        }
    }
    updateActivePromoDisplay();
}
