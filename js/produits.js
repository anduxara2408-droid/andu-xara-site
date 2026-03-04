// ===== PRODUITS AVEC NOMS COMMERCIAUX =====
const produits = [
    {
        id: 'azawad-bleu',
        nom: 'Azawad Bleu',
        description: 'Ensemble premium en coton peigné',
        prix: 600,
        categorie: 'ensembles',
        photos: [
            'images/produits/pull-bleu-01.jpg',
            'images/produits/pull-bleu-02.jpg',
            'images/produits/pull-bleu-03.jpg'
        ],
        tailles: ['S', 'M', 'L', 'XL']
    },
    {
        id: 'sahel-beige',
        nom: 'Sahel Beige',
        description: 'Ensemble Sahel, élégance et confort',
        prix: 600,
        categorie: 'ensembles',
        photos: [
            'images/produits/pull-beige-01.jpg',
            'images/produits/pull-beige-02.jpg'
        ],
        tailles: ['S', 'M', 'L', 'XL']
    },
    {
        id: 'tagant-gris',
        nom: 'Tagant Gris',
        description: 'Ensemble Tagant, inspiration désertique',
        prix: 600,
        categorie: 'ensembles',
        photos: [
            'images/produits/pull-gris-01.jpg',
            'images/produits/pull-gris-02.jpg'
        ],
        tailles: ['S', 'M', 'L', 'XL']
    },
    {
        id: 'tichitt-noir',
        nom: 'Tichitt Noir',
        description: 'Ensemble Tichitt, noir intemporel',
        prix: 600,
        categorie: 'ensembles',
        photos: [
            'images/produits/pull-noir-01.jpg',
            'images/produits/pull-noir-02.jpg'
        ],
        tailles: ['S', 'M', 'L', 'XL']
    },
    {
        id: 'ouadane-noir',
        nom: 'Ouadane Noir',
        description: 'T-shirt Ouadane, basique premium',
        prix: 400,
        categorie: 'tshirts',
        photos: [
            'images/produits/tshirt-noir-01.png',
            'images/produits/tshirt-noir-02.png'
        ],
        tailles: ['S', 'M', 'L', 'XL']
    }
];

// ===== GESTION DES CARROUSELS =====
function initCarousels() {
    document.querySelectorAll('.product-card').forEach(card => {
        const track = card.querySelector('.carousel-track');
        const leftArrow = card.querySelector('.carousel-arrow.left');
        const rightArrow = card.querySelector('.carousel-arrow.right');
        const indicators = card.querySelectorAll('.carousel-indicators span');
        
        if (!track) return;
        
        let currentIndex = 0;
        const totalImages = track.children.length;
        
        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            indicators.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
        
        if (leftArrow) {
            leftArrow.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + totalImages) % totalImages;
                updateCarousel();
            });
        }
        
        if (rightArrow) {
            rightArrow.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % totalImages;
                updateCarousel();
            });
        }
    });
}

// ===== ANIMATION ACCUEIL =====
function initHeroAnimation() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.animation-indicators span');
    
    if (!slides.length) return;
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(dot => dot.classList.remove('active'));
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
    }
    
    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    }, 3000);
    
    indicators.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            showSlide(currentIndex);
        });
    });
}

// ===== CHARGEMENT DES PRODUITS =====
function loadProducts(containerId, categorie = 'tous') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const filtres = categorie === 'tous' 
        ? produits 
        : produits.filter(p => p.categorie === categorie);
    
    container.innerHTML = filtres.map(p => `
        <div class="product-card" data-id="${p.id}">
            <div class="product-carousel">
                <div class="carousel-container">
                    <div class="carousel-track">
                        ${p.photos.map(photo => `<img src="${photo}" alt="${p.nom}">`).join('')}
                    </div>
                </div>
                ${p.photos.length > 1 ? `
                    <div class="carousel-arrow left">←</div>
                    <div class="carousel-arrow right">→</div>
                ` : ''}
                <div class="carousel-indicators">
                    ${p.photos.map((_, i) => `<span class="${i === 0 ? 'active' : ''}"></span>`).join('')}
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${p.nom}</h3>
                <p class="product-description">${p.description}</p>
                <div class="product-price">${p.prix} MRU</div>
                <button class="add-to-cart" onclick="alert('Fonction d\'achat à venir')">Ajouter au panier</button>
            </div>
        </div>
    `).join('');
    
    setTimeout(initCarousels, 100);
}

// ===== FILTRES =====
window.filterProducts = function(categorie) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    loadProducts('products-container', categorie);
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('products-container')) {
        loadProducts('products-container', 'tous');
    }
    initHeroAnimation();
});
