// script.js

// Gestion du menu mobile
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const menuOverlay = document.querySelector('.menu-overlay');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    menuOverlay.classList.toggle('active');
});
menuOverlay.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuOverlay.classList.remove('active');
});

// Panier
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartCounter = document.getElementById('cart-counter');
const cartModal = document.getElementById('cart-modal');

function updateCartCounter() {
    cartCounter.textContent = cart.length;
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

function toggleWishlist(productName) {
    const index = wishlist.indexOf(productName);
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(productName);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    wishlistCounter.textContent = wishlist.length;
}
wishlistCounter.textContent = wishlist.length;

// Newsletter
function closeNewsletter() {
    document.getElementById('newsletterPopup').style.display = 'none';
}
function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail').value;
    if(email) {
        alert(`Merci pour votre inscription: ${email}`);
        closeNewsletter();
    } else {
        alert("Veuillez entrer un email valide.");
    }
}

// Codes promo
const codesPromo = {
    ADX1: { used: false },
    ADX2: { used: false },
    ADX3: { used: false },
    ADX4: { used: false }
};

document.getElementById('promoButton').addEventListener('click', () => {
    const code = document.getElementById('promoInput').value.toUpperCase();
    const message = document.getElementById('promoMessage');
    if(codesPromo[code] && !codesPromo[code].used) {
        codesPromo[code].used = true;
        message.style.color = 'green';
        message.innerText = "✅ Code accepté ! Vous bénéficiez de 30% de réduction 🎉";
    } else {
        message.style.color = 'red';
        message.innerText = "❌ Code invalide ou déjà utilisé.";
    }
});

// Recherche produits
const searchInput = document.getElementById('search-input');
const productsContainer = document.getElementById('products-container');
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const products = productsContainer.querySelectorAll('.product-card');
    products.forEach(p => {
        const title = p.querySelector('.product-title').textContent.toLowerCase();
        p.style.display = title.includes(query) ? 'block' : 'none';
    });
});

// Filtrage par catégorie
const categoryButtons = document.querySelectorAll('.category-btn');
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

// Bannières affichage selon catégorie
const banners = document.querySelectorAll('.category-banner');
categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const cat = btn.dataset.category;
        banners.forEach(b => {
            b.style.display = (b.dataset.category === cat || cat === 'tous') ? 'block' : 'none';
        });
    });
});

// Marquee bandeau
const marqueeContent = document.querySelector('.marquee-content');
let marqueeSpeed = 1;
function scrollMarquee() {
    marqueeContent.scrollLeft += marqueeSpeed;
    if (marqueeContent.scrollLeft >= marqueeContent.scrollWidth / 3) {
        marqueeContent.scrollLeft = 0;
    }
    requestAnimationFrame(scrollMarquee);
}
scrollMarquee();

// Gestion utilisateurs en ligne (simulation)
const userCountElem = document.getElementById('userCount');
function randomUsers() {
    userCountElem.textContent = Math.floor(Math.random() * 100 + 1);
}
setInterval(randomUsers, 3000);
randomUsers();

