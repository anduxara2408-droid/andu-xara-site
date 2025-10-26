 // script.js

// Gestion du menu mobile
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const menuOverlay = document.querySelector('.menu-overlay');

if (menuToggle && mobileMenu && menuOverlay) {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        menuOverlay.classList.toggle('active');
    });
    
    menuOverlay.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuOverlay.classList.remove('active');
    });
}

// Panier
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartCounter = document.getElementById('cart-counter');
const cartModal = document.getElementById('cart-modal');

function updateCartCounter() {
    if (cartCounter) {
        cartCounter.textContent = cart.length;
    }
}
updateCartCounter();

function addToCart(name, oldPrice, promoPrice) {
    cart.push({ name, oldPrice, promoPrice, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    alert(`${name} ajouté au panier !`);
}

// Wishlist
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
const wishlistCounter = document.getElementById('wishlist-counter');

function updateWishlistCounter() {
    if (wishlistCounter) {
        wishlistCounter.textContent = wishlist.length;
    }
}

function toggleWishlist(productName) {
    const index = wishlist.indexOf(productName);
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(productName);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
updateWishlistCounter();
}
updateWishlistCounter();

// Newsletter
function closeNewsletter() {
    const newsletterPopup = document.getElementById('newsletterPopup');
    if (newsletterPopup) {
        newsletterPopup.style.display = 'none';
    }
}

function subscribeNewsletter() {
    const emailInput = document.getElementById('newsletterEmail');
    if (emailInput) {
        const email = emailInput.value;
        if (email) {
            alert(`Merci pour votre inscription: ${email}`);
            closeNewsletter();
        } else {
            alert("Veuillez entrer un email valide.");
        }
    }
}

// Codes promo
const codesPromo = {
    'ADX1': { used: false },
 'ADX2': { used: false },
    'ADX3': { used: false },
    'ADX4': { used: false }
};

const promoButton = document.getElementById('promoButton');
if (promoButton) {
    promoButton.addEventListener('click', () => {
        const promoInput = document.getElementById('promoInput');
        const message = document.getElementById('promoMessage');

        if (promoInput && message) {
            const code = promoInput.value.toUpperCase();
            if (codesPromo[code] && !codesPromo[code].used) {
                codesPromo[code].used = true;
                message.style.color = 'green';
                message.innerText = "✅ Code accepté ! Vous bénéficiez de 30% de réduction 🎉";
            } else {
                message.style.color = 'red';
                message.innerText = "❌ Code invalide ou déjà utilisé.";
            }
        }
    });
}

// Recherche produits
const searchInput = document.getElementById('search-input');
const productsContainer = document.getElementById('products-container');

if (searchInput && productsContainer) {
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const products = productsContainer.querySelectorAll('.product-card');

        products.forEach(p => {
            const titleElement = p.querySelector('.product-title');
            if (titleElement) {
                const title = titleElement.textContent.toLowerCase();
                p.style.display = title.includes(query) ? 'block' : 'none';
            }
        });
    });
}

// Filtrage par catégorie
const categoryButtons = document.querySelectorAll('.category-btn');
if (categoryButtons.length > 0 && productsContainer) {
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.category;
            const products = productsContainer.querySelectorAll('.product-card');

            products.forEach(p => {
                p.style.display = (cat === 'tous' || p.dataset.category === cat) ? 'block' : 'none';
            });
        });
    });
}

// Bannières affichage selon catégorie
const banners = document.querySelectorAll('.category-banner');
if (categoryButtons.length > 0 && banners.length > 0) {
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.category;
            banners.forEach(b => {
                b.style.display = (b.dataset.category === cat || cat === 'tous') ? 'block' : 'none';
            });
        });
    });
}

// Marquee bandeau
const marqueeContent = document.querySelector('.marquee-content');
if (marqueeContent) {
    let marqueeSpeed = 1;
    function scrollMarquee() {
        marqueeContent.scrollLeft += marqueeSpeed;
        if (marqueeContent.scrollLeft >= marqueeContent.scrollWidth / 3) {
            marqueeContent.scrollLeft = 0;
        }
        requestAnimationFrame(scrollMarquee);
    }
    scrollMarquee();
}

// Gestion utilisateurs en ligne (simulation)
const userCountElem = document.getElementById('userCount');
if (userCountElem) {
    function randomUsers() {
        userCountElem.textContent = Math.floor(Math.random() * 100 + 1);
    }
    setInterval(randomUsers, 3000);
    randomUsers();
}

// Système de recommandations IA
function generateRecommendations() {
    // Simulation de recommandations basées sur les vues récentes
    const recentViews = JSON.parse(localStorage.getItem('recentViews')) || [];
    const recommendations = [
        { name: "T-shirt Premium", category: "vetements", price: "299" },
        { name: "Sac en Cuir", category: "accessoires", price: "599" },
        { name: "Casque Audio", category: "electronique", price: "799" }
    ];
    
    return recentViews.length > 0 ? recommendations : [];
}

// Gestion de l'historique de vue
function trackProductView(productName, productCategory, productPrice) {
    let recentViews = JSON.parse(localStorage.getItem('recentViews')) || [];
    
    // Retirer le produit s'il existe déjà
    recentViews = recentViews.filter(p => p.name !== productName);
    
    // Ajouter le produit en tête
    recentViews.unshift({
        name: productName,
        category: productCategory,
        price: productPrice,
        timestamp: new Date().toISOString()
    });
    
    // Garder seulement les 10 derniers
    recentViews = recentViews.slice(0, 10);
    
    localStorage.setItem('recentViews', JSON.stringify(recentViews));
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Script initialisé avec succès');
    
    // Vérifier que tous les éléments essentiels sont présents
    const essentialElements = {
        'menuToggle': menuToggle,
        'cartCounter': cartCounter,
'wishlistCounter': wishlistCounter
    };
    
    for (const [name, element] of Object.entries(essentialElements)) {
        if (!element) {
            console.warn(`⚠️ Élément manquant: ${name}`);
        }
    }
});

// === 🔒 SÉCURITÉ DES FORMULAIRES - AJOUTEZ À LA FIN ===

// 1. VALIDATION EMAIL
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 2. VALIDATION TÉLÉPHONE MAURITANIE
function isValidPhone(phone) {
    const phoneRegex = /^(?:\+222|00222)?[0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// 3. PROTECTION CONTRE LES INJECTIONS
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#x27;')
        .replace(/"/g, '&quot;');
}

// 4. VALIDATION ADRESSE
function validateAddress(address) {
    if (!address || address.trim().length < 5) {
        return 'L\'adresse doit contenir au moins 5 caractères';
    }
    
    if (address.length > 200) {
        return 'L\'adresse est trop longue';
    }
    
    return null; // Pas d'erreur
}

console.log('✅ Sécurité formulaires activée !');

