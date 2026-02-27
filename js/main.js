// ===== DONNÉES STATIQUES =====

// Les valeurs de la philosophie
const values = [
    {
        icon: '🌱',
        title: 'Racines',
        text: 'Chaque création puise son inspiration dans les traditions, les motifs et les histoires de l\'Afrique.'
    },
    {
        icon: '✨',
        title: 'Authenticité',
        text: 'Des pièces uniques, fabriquées avec passion, qui racontent une histoire et transmettent un héritage.'
    },
    {
        icon: '🤝',
        title: 'Communauté',
        text: '206 familles nous ont déjà rejoints. Une communauté qui grandit et partage les mêmes valeurs.'
    }
];

// Produits par défaut
const defaultProducts = [
    { category: 'T-shirt', name: 'Logo arabe', price: 349 },
    { category: 'Ensemble', name: 'Capuche style', price: 419 },
    { category: 'Premium', name: 'Babs', price: 1049 },
    { category: 'Pull', name: 'Bleu hiver', price: 489 }
];

// ===== CHARGEMENT DES DONNÉES =====

// Charger les valeurs
function loadValues() {
    const container = document.getElementById('valuesContainer');
    if (!container) return;
    
    container.innerHTML = values.map(value => `
        <div class="value-card">
            <div class="value-icon">${value.icon}</div>
            <h3 class="value-title">${value.title}</h3>
            <p class="value-text">${value.text}</p>
        </div>
    `).join('');
}

// Charger les produits
async function loadProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    try {
        // Essayer de charger depuis Firebase
        const productsSnapshot = await db.collection('products').get();
        
        if (!productsSnapshot.empty) {
            const products = [];
            productsSnapshot.forEach(doc => {
                products.push({ id: doc.id, ...doc.data() });
            });
            displayProducts(products);
        } else {
            // Utiliser les produits par défaut
            displayProducts(defaultProducts);
        }
    } catch (error) {
        console.log('Utilisation des produits par défaut');
        displayProducts(defaultProducts);
    }
}

// Afficher les produits
function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '📸 Image'}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category || 'Collection'}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price} MRU</div>
            </div>
        </div>
    `).join('');
}

// Mettre à jour le compteur d'utilisateurs
async function updateUserCount() {
    try {
        const usersSnapshot = await db.collection('users').get();
        const count = usersSnapshot.size;
        
        // Mettre à jour tous les endroits où le nombre apparaît
        document.getElementById('userCount').textContent = count;
        document.getElementById('statUsers').textContent = count + '+';
        document.getElementById('storyUserCount').textContent = count;
    } catch (error) {
        console.log('Utilisation du nombre par défaut');
    }
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadValues();
    loadProducts();
    updateUserCount();
});
